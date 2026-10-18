---
title: "Agent SDK 的 diff 注入怎麼繞過：逆向 C26 函數與 JSONL 預處理"
description: "Agent SDK 每次 `submitMessage()` 都重建 `readFileState`，因此重複注入 diff。本文逆向 C26 函數找到原因，示範如何在 resume 前用 JSONL 預處理避開注入，並附 TypeScript 實作。"
publishDate: 2026-03-10T14:00:00+08:00
updatedDate: 2026-04-04
category: 技術觀點
tags: [Agent SDK, Claude Code, system-reminder, token 消耗, JSONL]
readingTime: 8
draft: false
excerpt: "逆向 C26 函數找出 Agent SDK 每次重送 diff 的原因，在 resume 前預處理 JSONL 繞開注入，附 TypeScript 實作。"
ogImage: "/images/articles/agent-sdk-system-reminder-diff-fix.webp"
problemTag: "SDK 每輪對話都重建狀態並重送檔案 diff"
ogHighlight:
  label: "C26 File Tracking on Resume"
  before: "每輪重建並重送完整 diff"
  after: "JSONL 預處理後 0 筆觸發"
---

[前篇](/articles/claude-code-token-drain-system-reminder/)寫了我逆向 Claude Code v2.1.71、找出 system-reminder 重複注入 diff 的過程。

結論是 Agent SDK 用戶幾乎無解。官方 GitHub issue 開了半年沒動靜。

所以我自己動手修了。這篇說的是我怎麼做的。

以下分析基於 Claude Code **v2.1.71**，不同版本行為可能已有不同。

## Agent SDK 的 readFileState 為什麼跟 CLI 不一樣

在 CLI 裡，Edit 之後做一次 Read，下一輪就不會再注入，因為 Read 更新了 readFileState 的 Offset 狀態，後續對話就會視為已同步。

在 Agent SDK 裡，這個方法完全沒用。

**因為 readFileState 在這裡是區域變數，每次都會重新建立，沒有存成 class property。**

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

知道為什麼修不了之後，下一步是看 C26 建表時到底從 JSONL 裡收集什麼。

C26 從 tool_use 裡收集兩種東西：

| 來源 | 收集條件 |
|------|---------|
| Read tool | `input.offset === undefined && input.limit === undefined` |
| Write tool | `input.file_path && input.content` |

Edit tool 不在收集範圍內，C26 不處理 Edit。

這裡有個反直覺的發現：**Read 工具預設傳 `offset=1`，所以它幾乎永遠不會被 C26 收進追蹤表。**

實際會進入追蹤表的只有兩種情況：

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

### 第二步：sanitizeJsonl（破壞 C26 的收集條件）

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

備份是有的，改壞了可以還原。不過這個做法建立在「C26 收集邏輯不變」的前提上；如果 Anthropic 哪天改了 C26 的實作，它就會失效，而且不會噴 error，只會悄悄恢復注入。

這不是優雅的解法。這是在[用 Claude Code 建構自動化系統](/articles/claude-code-workflow/)的過程中，官方沒在動、但問題實際影響開發效率，所以自己能做的事。

官方 issue 還開著。有進展的話另篇再說。
