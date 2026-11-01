---
title: "寫在 CLAUDE.md 也攔不住？為甚麼你叫子代理用便宜模型，帳單還是扣在最貴的 Opus 上"
seoTitle: "Claude Code 子代理模型守門：用 PreToolUse Hook 攔截誤用 Opus 與時段分流"
description: "在 CLAUDE.md 規定子代理用便宜模型，為何還是燒光 Opus 額度？拆解漏帶 model、fork 複製主模型、Explore 被覆蓋與巢狀派工四種破功原因，附可直接複製的 PreToolUse Hook 攔截與離尖峰分流腳本。"
publishDate: 2026-11-01T18:30:00+08:00
category: AI工具實戰
tags: [Claude Code, Subagent, Hooks, model-relay, Agent Engineering]
readingTime: 6
draft: false
excerpt: "明明在 CLAUDE.md 寫了「子代理請用便宜模型」，或自己寫了派工腳本，AI 忙起來還是常漏帶參數或繞過腳本燒光 Opus 額度。用 PreToolUse Hook 在呼叫 Agent 工具那一秒直接攔截退件或改寫參數，附上完整腳本範本。"
problemTag: "子代理不照規則選模型、偷燒主線額度"
---
**你在 `CLAUDE.md` 寫得清清楚楚：「派子代理時請改用便宜模型，不要用 Opus。」結果月底一看帳單，或是才跑一個下午，最貴的主線額度還是被燒光了。**

前幾天我發了一篇用 `model-relay`（我們自己做的多模型分流外掛）在 Claude Code 混用 GPT、Gemini、GLM 與 DeepSeek 的貼文，留言區有位讀者問了一個很實際的問題：他想讓 AI 在離峰時段優先派 DeepSeek、尖峰時段改派 Codex，自己還做了一支派工腳本給 AI 呼叫，但規則一變多，不知道怎麼讓它穩定照做。

這件事我也踩過一模一樣的坑，所以我當時直接回他：

> 這個可能自己來會比較好，你可以請 claude 幫你針對 subagent tool call 設定 hook，這樣如果離峰時段 call 到非 deepseek、或是尖峰時段 call 到 deepseek，可以直接擋下來要求用正確的 model。

規則寫在提示詞、Skill 或 `CLAUDE.md` 裡，都是在賭 AI 每次派工（開一個獨立小視窗交辦子任務，也就是子代理 Subagent）都記得住。想讓它照規矩選模型，得在它呼叫子代理工具的那一刻，用 `PreToolUse` Hook 直接把錯的模型攔下來。

## 為甚麼寫進 `CLAUDE.md` 或自己包派工腳本，子代理還是常常用錯模型？

**因為「叫哪個工具、帶甚麼參數」是由主對話模型每次當場決定的；只要漏填一個欄位或用錯子代理型別，系統就會退回主對話正在跑的高價模型。**

很多人一開始都以為，只要在 `CLAUDE.md` 加一條「子代理一律用 Sonnet 或 Haiku」，或者設定環境變數，就能管住額度。但在我們實際跑多模型分流的紀錄裡，靠文字規則管派工，最常在四種地方破功：

| 常見的破功場景 | AI 實際送出的工具呼叫 | 為甚麼會燒到主線額度 |
|---|---|---|
| **漏帶 `model` 參數** | 呼叫內建子代理（例如 `general-purpose`）時忘了填 `model` | 內建子代理沒有固定模型的設定檔，一旦漏填就會沿用主對話的 Opus，連 `CLAUDE_CODE_SUBAGENT_MODEL` 環境變數也擋不住 |
| **誤用 `fork` 複製對話模式** | 傳了 `subagent_type: "fork"`，就算同時帶上 `model: "sonnet"` | `fork` 會把整個主對話連同主模型一起複製一份，`model` 參數在這時候完全無效 |
| **手滑蓋掉原本設好的便宜模型** | 子代理設定檔（如 `Explore.md`）明明已經固定用 `haiku`（走外部便宜額度），主對話卻順手帶了 `model: "sonnet"` | 呼叫時的參數優先權高於設定檔，結果原本極便宜的搜尋工作又被蓋回 Claude 額度 |
| **子代理自己再派子代理** | 派出去的實作子代理遇到大任務，自己在裡面又呼叫兩次 `Agent` 工具 | 你在主對話看不到它又派了誰，額度與上下文會在背景悄悄加倍 |

就算你像那位讀者一樣，自己寫一支派工腳本叫 AI 去執行，AI 忙起來還是會繞過你的腳本，直接呼叫內建的 `Agent` 工具。只要內建工具沒上鎖，文字規則就只是道德勸說。

## 怎麼用 `PreToolUse` Hook 在派出去那一秒把錯的模型攔下來？

**不要把派工規則寫給 AI 讀，而是寫成 `PreToolUse` Hook（工具執行前的自動檢查腳本），掛在 `Agent` 工具前面，在請求送出前做「檢查、退件、改寫」。**

Claude Code 的 `PreToolUse` Hook 會在模型決定呼叫某個工具、但工具還沒真正執行之前觸發。系統會把這次呼叫的完整資料（包含工具名稱 `tool_name` 與參數 `tool_input`）傳給你的腳本，讓你做兩件文字規則做不到的事：

1. **退件重叫（`permissionDecision: "deny"`）**：當它指定了 `opus`、用了 `fork`、漏填 `model`，或在不對的時段叫錯模型時，當場拒絕執行，並在 `permissionDecisionReason` 寫明：「子代理不得使用 opus，請改帶 `subagent_type: "model-relay:deepseek"` 與 `model: "sonnet"` 重新呼叫。」AI 收到這行退件理由後，就會照提示換成對的參數重新呼叫。
2. **當場幫它改對放行（`updatedInput`）**：如果像 `Explore` 這類子代理在設定檔裡已經固定用 `haiku`，主對話卻多手傳了 `model: "sonnet"`，Hook 不必退件重來，直接回傳 `updatedInput` 把 `model` 改回 `"haiku"` 放行。

我們自己長期掛在 `~/.claude/hooks/subagent-model-guard/` 的守門腳本，再加上那位讀者問的「離峰優先派 DeepSeek、尖峰改派其他模型」，核心邏輯只要幾十行 Node.js 就夠了：

```js
#!/usr/bin/env node
// .claude/hooks/subagent-model-guard.mjs
import fs from 'node:fs';

const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
const tool = input.tool_name || '';
const ti = input.tool_input || {};

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

// 1. 禁止子代理自己再派子代理（payload 帶有 agent_id 代表目前在子代理內）
if (input.agent_id && /^(Agent|Task|Workflow)$/.test(tool)) {
  deny('子代理不能再派子代理：請自己完成這部分，需要增援請在回報裡寫明，由主對話決定。');
}

if (tool === 'Agent' || tool === 'Task') {
  const type = String(ti.subagent_type || '');
  const model = String(ti.model || '').trim();

  // 2. 擋下 fork 與未填 model、或直接填 opus / fable
  if (type === 'fork') {
    deny('fork 一定沿用主對話模型，model 參數無效。請改用一般子代理並明確指定非 opus 模型。');
  }
  if (!model || /\b(opus|fable|best|opusplan)\b/i.test(model)) {
    deny('子代理模型守門：請明確指定 model: "sonnet" 或 "haiku"，或改派 model-relay 外部模型。');
  }

  // 3. 範例：離峰（01:00–09:00）優先走 deepseek，尖峰擋下 deepseek 改派 gpt-luna
  const hour = new Date().getHours();
  const isOffPeak = hour >= 1 && hour < 9;
  if (isOffPeak && !/^model-relay:deepseek$/i.test(type)) {
    deny('目前為離峰時段（01:00–09:00），子代理請改用 subagent_type: "model-relay:deepseek" 並帶 model: "sonnet"。');
  }
  if (!isOffPeak && /^model-relay:deepseek$/i.test(type)) {
    deny('目前為尖峰時段，請勿呼叫 deepseek，改用 subagent_type: "model-relay:gpt-luna" 並帶 model: "sonnet"。');
  }

  // 4. 若 Explore 已固定用 haiku 卻被帶了 sonnet，直接用 updatedInput 改回 haiku
  if (type === 'Explore' && !/^haiku$/i.test(model)) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        updatedInput: { ...ti, model: 'haiku' },
        additionalContext: 'Explore 已固定使用 haiku，本次參數已自動改回 haiku。',
      },
    }));
    process.exit(0);
  }
}
```

接著在 `~/.claude/settings.json` 把這支腳本掛到 `PreToolUse` 的 `Agent|Task|Workflow` 上：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Agent|Task|Workflow",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/subagent-model-guard.mjs"
          }
        ]
      }
    ]
  }
}
```

這樣設好之後，你在 `CLAUDE.md` 只需要留一句簡單的派工原則給 AI 參考；真正負責看守帳單與時段規則的，是每次工具送出前自動執行的檢查腳本。

## 甚麼時候不用自己寫這道 Hook？

**如果你只訂了一家模型、平常很少開子代理，或只是單純想把搜尋雜活分給便宜模型，先用內建設定或別名分流就夠了。**

遇到下面兩種情況，不用急著寫腳本：

1. **只想把日常讀檔、搜尋雜活交給便宜模型**：如果你有用 [`model-relay`](/articles/claude-code-multi-model-routing-and-subagent-relay/)，直接打一行 `/provider alias haiku glm`（把預設呼叫 `haiku` 的輕量工作自動轉給 `glm` 或 `deepseek`），就不必手寫條件判斷。
2. **任務本身不該派子代理**：如果兩三個子代理都要重複讀同一批檔案，就算換成便宜模型，來回傳遞跟重讀的 token 還是比主對話自己做完更貴。怎麼判斷哪時候該派、哪時候留在主對話，可以先看[〈派子代理之前，先想清楚要換回甚麼〉](/articles/subagent-what-to-get-back/)。

下次當你發現寫在 `CLAUDE.md` 的模型分流規則又被 AI 忘記時，別再把提示詞越寫越長，直接掛一道 `PreToolUse` Hook，讓錯的參數連送都送不出去。
