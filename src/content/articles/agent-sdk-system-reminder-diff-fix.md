---
title: "Agent SDK diff 注入修復：逆向 C26 函數用 JSONL 預處理解決"
description: "Agent SDK 每次 submitMessage() 都重建 readFileState 導致 diff 重複注入。逆向 C26 函數找到根因，用 JSONL 預處理破壞追蹤條件，附完整 TypeScript 實作。"
publishDate: 2026-03-10T14:00:00+08:00
updatedDate: 2026-04-04
category: 技術觀點
tags: [Agent SDK, Claude Code, system-reminder, token 消耗, JSONL]
featured: false
readingTime: 8
draft: false
excerpt: "Agent SDK 每次都注入 diff 的問題，我找到解法了——逆向 C26 函數找到根因，用 JSONL 預處理在 resume 前修掉它，附完整 TypeScript 實作。"
ogImage: "/images/articles/agent-sdk-system-reminder-diff-fix.webp"
faq:
  - question: "為什麼 Agent SDK 每輪都會注入 diff，跟 CLI 不一樣？"
    answer: "因為 Agent SDK 的 readFileState 不是 class property，而是每次 submitMessage() 都從 JSONL 重建的區域變數（C26 函數）。每次重建的 entry 都沒有 offset 狀態，必然觸發注入。"
  - question: "什麼樣的檔案操作會被 readFileState 追蹤？"
    answer: "Edit 和 Write 操作（offset=undefined）會被追蹤。Read 工具預設傳 offset=1，反而不會被 C26 收進追蹤表。CLAUDE.md 和 MEMORY.md 是預設載入，也是永遠追蹤的對象。"
  - question: "JSONL 預處理的修復原理是什麼？"
    answer: "C26 收集 Read（無 offset）和 Write（有 file_path + content）的 tool_use。預處理時對所有 Read 加上 offset=1，對所有 Write 移除 content，讓 C26 建不出有效的追蹤 entry，就不會觸發注入。"
  - question: "這個修復方法有什麼代價？"
    answer: "需要在每次 resume 前修改 JSONL 檔案（有備份）。方法依賴對 C26 邏輯的逆向假設，若 Anthropic 修改 C26 的實作，這個 fix 可能失效。"
  - question: "如何找到 Agent SDK 對應的 JSONL 檔案路徑？"
    answer: "JSONL 路徑是 ~/.claude/projects/{project-hash}/{session-id}.jsonl，project-hash 是把工作目錄路徑的所有非英數字元替換成 -（超過 200 字元則截斷加 hash）。"
---

[前篇](/articles/claude-code-token-drain-system-reminder)說的是：我逆向了 Claude Code v2.1.71，找到 system-reminder 瘋狂注入 diff 的根因。

結論是 Agent SDK 用戶幾乎無解。官方 GitHub issue 開了半年沒動靜。

所以我自己動手修了。這篇說的是我怎麼做的。

以下分析基於 Claude Code **v2.1.71**，不同版本行為可能已有不同。

## Agent SDK 的 readFileState 為什麼跟 CLI 不一樣

在 CLI 裡，Edit 之後做一次 Read，下一輪就不會再注入——因為 Read 更新了 readFileState 的 Offset 狀態，讓後續對話認為已同步。

在 Agent SDK 裡，這個方法完全沒用。

原因是：**readFileState 不是 class property，是區域變數。**

每次 `submitMessage()` 被呼叫，Claude Code 就會跑一個叫 C26 的函數，從 JSONL 重建整張 readFileState 表：

```
submitMessage()
  → readFileState = C26(mutableMessages)  ← 從 JSONL 全量重建
  → stale check → diff 注入
  → 主迴圈跑完，Edit/Write 更新了記憶體中的 readFileState
  → 下一次 submitMessage()
  → readFileState = C26(mutableMessages)  ← 又從頭重建，之前的更新全丟
  → 永遠注入
```

你在對話過程中做了幾百次 Read，全都是在一個每輪都會被丟棄的記憶體結構上操作。下一輪，C26 拿 JSONL 重新建表，一切歸零。

CLI 用戶的 readFileState 活在 process 的生命週期裡，修一次就好。Agent SDK 每次 API call 都重建，在對話中怎麼修都沒用。

## C26 實際上只收集哪些檔案

搞清楚為什麼修不了之後，下一步是搞清楚 C26 建表時的邏輯——它到底從 JSONL 裡收集什麼。

C26 從 tool_use 裡收集兩種東西：

| 來源 | 收集條件 |
|------|---------|
| Read tool | `input.offset === undefined && input.limit === undefined` |
| Write tool | `input.file_path && input.content` |

Edit tool 不在收集範圍——C26 不處理 Edit。

這裡有個反直覺的發現：**Read 工具預設傳 `offset=1`，所以它幾乎永遠不會被 C26 收進追蹤表。**

真正會被追蹤的是：

| 來源 | offset | limit | 是否被追蹤 |
|------|--------|-------|-----------|
| CLAUDE.md / MEMORY.md（預設載入） | undefined | undefined | 永遠 |
| Write tool | undefined | undefined | 永遠 |
| C26 從 JSONL 重建的所有 entry | undefined | undefined | 永遠 |
| Read tool（offset=1 預設值） | 1 | undefined | 不追蹤 |

C26 重建所有 entry 時，timestamp 用的是 JSONL 裡記錄的過去時間。檔案的 mtime 幾乎必然比那個時間新，所以每次重建完，stale check 一跑就觸發注入。

## 解法：在 resume 前預處理 JSONL

修不了 C26 的邏輯，但可以在它執行前動它的輸入。

C26 有兩個收集條件：

- **Read 的條件**：`offset === undefined && limit === undefined`
- **Write 的條件**：`file_path && content`

只要在 resume 前把 JSONL 改掉，讓這兩個條件都不成立，C26 就建不出有效的追蹤 entry，注入就不會發生。

具體做法：
- Read 的 tool_use → 加上 `offset: 1`，讓 C26 的收集條件不成立
- Write 的 tool_use → 移除 `content`，讓 C26 的收集條件不成立

這個改法不影響對話內容或 Claude 的理解，只影響 C26 的建表邏輯。

## 實作

### 第一步：找到 JSONL 路徑

JSONL 放在 `~/.claude/projects/{project-hash}/{session-id}.jsonl`。

project-hash 的算法是把工作目錄路徑的所有非英數字元替換成 `-`（超過 200 字元則截斷後加 charCode hash）：

```typescript
import { homedir } from 'os';
import { join } from 'path';

function projectHash(cwd: string): string {
  const result = cwd.replace(/[^a-zA-Z0-9]/g, '-');
  if (result.length <= 200) return result;

  let h = 0;
  for (let i = 0; i < cwd.length; i++) {
    h = (h << 5) - h + cwd.charCodeAt(i);
    h |= 0;
  }
  return result.slice(0, 200) + '-' + Math.abs(h).toString(36);
}

function getJsonlPath(cwd: string, sessionId: string): string {
  return join(homedir(), '.claude', 'projects', projectHash(cwd), `${sessionId}.jsonl`);
}
```

### 第二步：sanitizeJsonl — 破壞 C26 的收集條件

```typescript
import { readFileSync, writeFileSync, copyFileSync } from 'fs';

function sanitizeJsonl(jsonlPath: string): { reads: number; writes: number } {
  const stats = { reads: 0, writes: 0 };

  // 備份，改壞了還能救
  copyFileSync(jsonlPath, jsonlPath + '.bak');

  const content = readFileSync(jsonlPath, 'utf-8');
  const lines = content.split('\n').map(line => {
    if (!line.trim()) return line;

    const msg = JSON.parse(line);
    if (msg.type !== 'assistant' || !Array.isArray(msg.message?.content)) {
      return line;
    }

    for (const block of msg.message.content) {
      if (block.type !== 'tool_use') continue;

      // Read without offset → 加 offset=1，讓 C26 的收集條件不成立
      if (block.name === 'Read' && block.input?.offset == null) {
        block.input.offset = 1;
        stats.reads++;
      }

      // Write with content → 移除 content，讓 C26 的收集條件不成立
      if (block.name === 'Write' && 'content' in (block.input ?? {})) {
        delete block.input.content;
        stats.writes++;
      }
    }

    return JSON.stringify(msg);
  });

  writeFileSync(jsonlPath, lines.join('\n'), 'utf-8');
  return stats;
}

export { projectHash, getJsonlPath, sanitizeJsonl };
```

### 第三步：整合到 Agent SDK

在每次 resume 前呼叫：

```typescript
import { sanitizeJsonl, getJsonlPath } from './sanitize-jsonl';

const jsonlPath = getJsonlPath(process.cwd(), sessionId);
const { reads, writes } = sanitizeJsonl(jsonlPath);
console.log(`Patched ${reads} Read + ${writes} Write entries`);

const result = query({
  prompt: 'continue',
  options: { cwd: process.cwd(), resume: true, sessionId }
});
```

## 這個修法的代價

說清楚：這是在動 JSONL 原始檔案。

備份是有的，改壞了可以還原。但這個 fix 的根本假設是「C26 的收集邏輯不變」——如果 Anthropic 哪天改了 C26 的實作，這個 fix 就失效了，而且不一定會立刻發現（還是會注入，不會噴 error）。

這不是優雅的解法。這是在[用 Claude Code 建構自動化系統](/articles/claude-code-workflow/)的過程中，官方沒在動、但問題實際影響開發效率，所以自己能做的事。

官方 issue 還開著。有進展的話另篇再說。
