---
title: "不用再切視窗換工具：用 model-relay 接上 magpie，在 Claude Code 派各家子代理"
seoTitle: "Claude Code 混用多家模型：model-relay 搭配 magpie 單視窗切換與子代理設定指南"
description: "想在 Claude Code 同時調用 ChatGPT 訂閱、Gemini、GLM 與 DeepSeek？完整拆解 magpie 萬用格式閘道器與 model-relay 子代理分流運作原理，附直接複製給 AI 自動配到好的設定提示詞。"
publishDate: 2026-10-20T15:00:00+08:00
category: AI工具實戰
tags: [Claude Code, model-relay, magpie, Subagent, Multi-Model, Agent Engineering]
readingTime: 7
draft: false
excerpt: "以前同時訂好幾家模型，換模型就得切視窗換工具。用開源專案 magpie 把各家 API 與 ChatGPT 訂閱翻成 Anthropic 格式，再接上 model-relay 自動註冊成 Claude Code 子代理；文末附一段複製給 AI 就能自動設定到好的提示詞。"
problemTag: "多家模型額度分散、切換工具斷工作流"
---
**同時訂了好幾家模型，最煩的就是切來切去。每家都付了錢，想換個模型檢查程式碼或潤稿，就得換工具、切視窗，把同一包背景脈絡重貼一遍。**

為了解決這件事，我寫了開源外掛 **`model-relay`**，把各家模型直接註冊成 Claude Code 的子代理；底層再接上另一個開源專案 **`magpie`**，把 OpenAI、Gemini、GLM、DeepSeek 的格式全部翻成 Claude Code 吃得懂的語言，連電腦裡已經登入的 ChatGPT（Codex）訂閱都能直接拿進來用。

現在不管叫哪家模型，全都在同一個 Claude Code 視窗裡完成。我要發文章時，跟主線的 Claude 說一句「給 Gemini 潤一次」，它當場就派出 `model-relay:gemini` 子代理去改稿；寫完功能想找盲點，就叫它同時派 GPT、Gemini、GLM 平行交叉審查。Claude 本家的 Fable、Opus、Sonnet、Haiku 照常運作；就算哪天停訂 Claude，也能改接其他模型，繼續沿用你養了好幾個月的 Claude Code Harness（規則檔、Skills 與自動守門工作環境）。

這篇把 **`magpie` 省下多少轉接工夫**、**`model-relay` 怎麼分工與防呆**一次講清楚；文末還附了一段**「直接複製貼給 Claude Code，讓 AI 自動把兩邊裝好、設好並測通」**的提示詞。

---

## 為甚麼要 `magpie` 搭配 `model-relay`？單靠改設定檔差在哪？

**把別家模型接進 Claude Code 要解決兩件事：先把各家 API 與訂閱翻成 Anthropic 格式，再按視窗與子代理精準分流。`magpie` 負責翻譯與收攏訂閱，`model-relay` 負責分流與派工。**

很多人一開始都直接去改 `~/.claude/settings.json` 裡的 `ANTHROPIC_BASE_URL`，一改馬上撞到三個痛點：第一，這是全域設定，一改就把所有開著的終端機視窗全換掉；第二，OpenAI 或 Gemini 的 API 格式跟 Anthropic 不同，以前還得自己用 Python 架一套肥重的 `LiteLLM` 轉格式；第三，你沒辦法在主線跑 Claude Opus，同時只派一個 Gemini 或 GPT 子代理去跑分支任務。

把 `magpie` 跟 `model-relay` 串起來，這三個痛點就能分工處理：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="relayCompareTitle">
      <title id="relayCompareTitle">傳統修改全域 settings.json 與使用 model-relay 搭配 magpie 雙核心工作流的同屏對照</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">同樣想在 Claude Code 混用多家模型：全域硬改 vs model-relay ＋ magpie 雙核心分工</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">❌ 傳統做法：手改全域 settings.json ＋ 自己架 LiteLLM ＋ 手寫 .claude/agents/*.md</text>
      <rect x="24" y="70" width="210" height="62" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="129" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">改全域 settings.json</text>
      <text x="129" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">所有開著的視窗一起被換掉</text>
      <path d="M234 101 H266" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="266,96 274,101 266,106" fill="#b4352f"/>
      <rect x="274" y="70" width="220" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="384" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">各家 API 格式不相容</text>
      <text x="384" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">得自己維護 Python LiteLLM 轉接</text>
      <path d="M494 101 H526" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="526,96 534,101 526,106" fill="#b4352f"/>
      <rect x="534" y="70" width="202" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="635" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">第三方易失憶、掉工具</text>
      <text x="635" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">ToolSearch 與 MCP 重連常失效</text>
      <line x1="24" y1="154" x2="736" y2="154" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="180" font-size="12.5" font-weight="700" fill="#26734f">✅ 現在做法：Claude Code → model-relay（:8950 分流與子代理）→ magpie（:3425 萬用格式翻譯）</text>
      <rect x="24" y="192" width="210" height="72" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="129" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">① Claude Code 主視窗</text>
      <text x="129" y="236" text-anchor="middle" font-size="11.5" fill="#253047">/provider 單視窗熱切</text>
      <text x="129" y="252" text-anchor="middle" font-size="11.5" fill="#5f687a">一句話點名派各家子代理</text>
      <path d="M234 228 H266" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="266,223 274,228 266,233" fill="#6248c8"/>
      <rect x="274" y="192" width="228" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="388" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">② model-relay（127.0.0.1:8950）</text>
      <text x="388" y="236" text-anchor="middle" font-size="11.5" fill="#253047">自動註冊子代理、429 當場備援</text>
      <text x="388" y="252" text-anchor="middle" font-size="11.5" fill="#26734f">修補失憶與工具、自動拉起 magpie</text>
      <path d="M502 228 H534" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="534,223 542,228 534,233" fill="#26734f"/>
      <rect x="542" y="192" width="194" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="639" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">③ magpie（127.0.0.1:3425）</text>
      <text x="639" y="236" text-anchor="middle" font-size="11.5" fill="#253047">翻成 Anthropic 訊息格式</text>
      <text x="639" y="252" text-anchor="middle" font-size="11.5" fill="#26734f">收攏 ChatGPT 訂閱與各家 API</text>
      <text x="24" y="294" font-size="12" fill="#5f687a">💡 本機 magpie 連接埠若還沒開，model-relay 會在背景透過 launch 設定自動幫你拉起，開終端機直接能用。</text>
    </svg>
  </div>
  <figcaption>上方是手改全域設定與自架 LiteLLM 的痛點；下方由 model-relay（:8950）負責視窗與子代理調度、再交給 magpie（:3425）統一翻譯各家格式與訂閱。</figcaption>
</figure>

| 角色 | 跑在哪裡 | 它幫你解決甚麼事 |
|---|---|---|
| **`magpie`**（[`yetone/magpie`](https://github.com/yetone/magpie)） | 本機 `127.0.0.1:3425` | **萬用模型閘道器與翻譯官**：把你已付費的 ChatGPT（Codex）訂閱與 Gemini、GLM、DeepSeek、Kimi API 全翻成 Anthropic `/v1/messages` 格式 |
| **`model-relay`**（[`cablate/model-relay`](https://github.com/cablate/model-relay)） | 本機 `127.0.0.1:8950` | **Claude Code 專屬調度台**：認得每個視窗的對話識別碼（`session-id`），自動把 `magpie` 模型註冊成 `model-relay:<名稱>` 子代理，支援單視窗熱切、`haiku` 別名分流與 429 備援，並保住 MCP（外部工具連接器）與手機遙控 |

看懂兩邊的分工後，你可能會問：轉格式以前也能用 `LiteLLM`，為甚麼現在改用 `magpie`？

---

## `magpie` 到底強在哪裡？為甚麼不用再自己架 LiteLLM？

**`magpie` 用一個約 15～30 MB 的單一本機執行檔，把「跨廠牌格式翻譯、共用已付費的 ChatGPT 訂閱、多帳號額度輪替、本機金鑰遮罩」四件事收進同一個選單列。**

以前想在 Claude Code 接 Gemini 或 GPT，問 AI 常被建議去裝 Python 的 `LiteLLM`，光配環境跟寫 YAML 就先卡半小時。我在 Threads 留言區都建議改裝 [`magpie`](https://usemagpie.ai)，差別在四個地方：

1. **四種主流 API 格式雙向即時翻譯（含串流、工具呼叫與思考鏈）**：`magpie` 在本機 `127.0.0.1:3425` 同時聽得懂 OpenAI Chat、OpenAI Responses、Anthropic Messages 與 Google Gemini。不管上游模型原本長甚麼樣，出來就是標準的 Anthropic `/v1/messages` 格式，連串流輸出、Tool Calls 跟 Reasoning 思考過程都一併轉好。
2. **直接共用電腦裡已登入的 ChatGPT（Codex）訂閱與數十種內建供應商設定（Preset）**：同時訂了 Claude 又訂 ChatGPT（或公司有配額度）的人，這點能省下額外 API 開銷。`magpie` 會讀取你電腦裡已登入的 Codex（ChatGPT 方案）或 GitHub Copilot，在官方支援範圍內直接把 `codex/gpt-6.1-sol`、`codex/gpt-6.1-terra`、`codex/gpt-6-luna` 轉成給 Claude Code 呼叫的模型。DeepSeek、Zhipu GLM、Kimi、MiniMax、官方 Google AI Studio（Gemini）、OpenRouter 等 API 供應商也都有內建範本，挑名稱、貼金鑰就設完了。
3. **多帳號自動輪替（Routing Groups）與餘額查詢**：手上有兩組以上帳號，或想把幾家模型編成一組（例如 `group/daily-coding`），`magpie` 支援 `smart`（先耗最快重置的額度，減少到期浪費）、`order`（主帳號用完自動換下一組）等路由策略，同一段對話還會黏著同一個帳號以保住 Prompt Cache（提示詞快取，省時省費用）。打一行 `magpie quota` 或點開桌面選單列，就能查看每家方案剩多少額度。
4. **本機隱私遮罩（Privacy Masking）**：派外部模型讀專案，最怕它讀了 `.env` 或 log 就把 API 金鑰、私鑰、密碼或 Email 傳出去。去 `magpie` 的 `Settings → Privacy` 打開 Masking，請求離開電腦前會先在本機把已識別的敏感值換成 `{{API_KEY_k3v9x2mq}}` 代號，等模型回覆或送回工具參數時再當場換回真值，降低金鑰外流風險，且不影響 Agent 執行指令與快取。

---

## `model-relay` 在 Claude Code 裡怎麼運作？我最常用的三種分工

**`magpie` 在 `:3425` 備好模型後，`model-relay`（`:8950`）負責把模型接進 Claude Code，支援「點名派子代理、雜活自動分流、單視窗熱切與 429 額度滿自動備援」三種日常分工。**

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 280" role="img" aria-labelledby="subagentDispatchTitle">
      <title id="subagentDispatchTitle">用 model-relay 混搭主線、各家子代理、haiku 別名分流與 429 備援的調度圖</title>
      <rect x="0" y="0" width="760" height="280" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">把各家模型額度榨乾的調度台：主線控場 ＋ 點名派子代理 ＋ 雜活自動分流 ＋ 429 自動備援</text>
      <rect x="24" y="56" width="190" height="146" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="119" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="#6248c8">① 當前對話主線</text>
      <text x="119" y="110" text-anchor="middle" font-size="12" fill="#253047">打 /provider 按 1~9 熱切</text>
      <text x="119" y="132" text-anchor="middle" font-size="11.5" fill="#5f687a">只切當前視窗（Session ID）</text>
      <text x="119" y="152" text-anchor="middle" font-size="11.5" fill="#5f687a">隔壁終端機照跑原本模型</text>
      <text x="119" y="178" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8" style="font-family:var(--font-mono)">Opus / GPT / Gemini / GLM</text>
      <path d="M214 96 H292" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="292,91 300,96 292,101" fill="#6248c8"/>
      <text x="256" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">點名派工</text>
      <rect x="300" y="56" width="436" height="68" rx="8" fill="#f1edff" stroke="#b8afc9" stroke-width="1.5"/>
      <text x="318" y="82" font-size="13" font-weight="700" fill="#6248c8">② 自動註冊子代理：model-relay:gpt-sol / gemini / glm</text>
      <text x="318" y="106" font-size="12" fill="#253047">免手寫 .claude/agents/*.md，一句話派 Gemini 潤稿或平行審查</text>
      <path d="M214 166 H292" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="292,161 300,166 292,171" fill="#26734f"/>
      <text x="256" y="156" text-anchor="middle" font-size="11.5" font-weight="700" fill="#26734f">自動轉彎</text>
      <rect x="300" y="134" width="436" height="68" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="318" y="160" font-size="13" font-weight="700" fill="#26734f">③ 別名分流與 429 備援：alias haiku glm ＋ failover.chain</text>
      <text x="318" y="184" font-size="12" fill="#253047">讀檔搜尋雜活自動走便宜模型；Claude 額度撞牆（429）當場接手</text>
      <rect x="24" y="220" width="712" height="42" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="380" y="246" text-anchor="middle" font-size="11.5" font-weight="700" fill="#253047">🛡️ 啟動與結束雙重核對真實模型（防 availableModels 偷換），保住 MCP、Artifact、Chrome 與手機遙控</text>
    </svg>
  </div>
  <figcaption>主線可隨時用 `/provider` 單視窗切換，底下同時支援點名派出 `model-relay:<名稱>` 子代理、用 `alias` 把 `haiku` 雜活導給便宜模型，以及在 429 額度滿時當場接手。</figcaption>
</figure>

我每天在 Claude Code 最常用這三種分工：

1. **主對話直接點名派子代理**：只要加進 `~/.claude/model-relay.json` 的供應商，啟動時就會自動註冊成 `model-relay:gpt-sol`、`model-relay:gemini`、`model-relay:glm`、`model-relay:deepseek` 子代理，免手寫 `.claude/agents/*.md`，也不用重開對話。主線留給 Claude Opus 控場，寫完文章喊一句「給 Gemini 潤一次」，寫完架構喊一句「派 GPT、Gemini、GLM 平行做獨立審查」，都在同一個視窗完成。設定檔還能預設 `subagents.priority`（派工優先序）與 `subagents.reviewPanel`（多模型審查名單）。
2. **雜活導給便宜模型，主線額度留給難題**：日常讀檔、搜尋與 `WebFetch` 摘要不必燒最貴的模型。打一行 `/provider alias haiku glm`（或 `deepseek`），`model-relay` 就會同步更新 `settings.json` 與轉發規則，把原本走 `haiku` 的輕量任務全導向便宜模型。想看這週外部模型幫你扛了多少工作，打 `/provider stats` 就能看本機統計表。
3. **單一視窗熱切換＋額度撞牆自動備援**：輸入 `/provider` 會跳出控制面板，按 `1–9` 只會把「眼前這個視窗」切到你選的模型（按 `p` 可送 1-token 實測首字反應毫秒數），隔壁終端機照舊。當 Claude 撞上 5 小時額度上限（HTTP 429），設定好的 `failover.chain`（自動備援鏈）會當場換備援模型接手回覆；就算某個月停訂 Claude，也能切去別家模型，繼續沿用原本設好的 `CLAUDE.md`、Skills 與 Hooks。

## 為甚麼自己改設定常讓第三方模型「失憶、掉工具」，用 `model-relay` 卻不會？

Claude Code 的通訊協定有很多自家伺服器的專屬細節，直接拿別家模型硬頂很容易水土不服。`model-relay`（v0.7.5+）在轉發層把這四個坑填平了：

| 直接改設定常踩到的坑 | 為甚麼會壞 | `model-relay` 怎麼在底層修好它 |
|---|---|---|
| **聊到第二輪突然「失憶」或掉工具** | 部分模式只送差量片段（`message-threads`），且中途重連的 MCP 工具只寫在系統訊息（`tool_addition`），外廠模型看不懂 | 送出前自動展開完整對話歷史，並把中途加入的 MCP 工具合併進正式工具清單 |
| **按需載入工具（`WebFetch`、MCP）消失或報 HTTP 400** | 外廠端點不認得 Claude Code 的 `ToolSearch` 工具與 `cache_control` 欄位 | 自動轉譯 `ToolSearch` 讓已載入工具可直接呼叫，並依供應商設定剝除 `cache_control` |
| **子代理表面叫 Gemini，實際偷跑回 Claude** | `settings.json` 若設了 `availableModels` 白名單卻漏列外廠模型 ID，Claude Code 會靜默換回預設模型 | 子代理啟動前與結束時雙重核對轉發站實際收到的請求，不一致立刻跳警告並引導跑 `/provider doctor` |
| **手機 Remote Control 拒開、狀態列模型名不準** | 改動 `ANTHROPIC_BASE_URL` 會讓官方鎖死手機遙控；內建狀態列也只顯示轉發前的模型名 | 打 `/provider rc on` 啟用僅簽發 `api.anthropic.com` 且即毀私鑰的本機 HTTPS 代理；同時將真實模型寫入 `~/.claude/model-relay-status/<session id>` 供狀態列顯示 |

---

## 怎麼從零裝起來？（附「複製給 AI 自動配到好」的完整提示詞）

**先裝好 `magpie` 並登入或填好金鑰，接著在 Claude Code 裝上 `model-relay`，最後把下方的提示詞貼給 Claude Code，讓 AI 協助把兩邊串起來並測通。**

## 第一步：安裝 `magpie` 並加入你的模型或訂閱

到 **[usemagpie.ai](https://usemagpie.ai)** 下載桌面版（支援 macOS、Windows、Linux），或在終端機執行安裝指令（執行前建議先檢視腳本內容）：

```bash
# macOS / Linux 安裝（Windows 可直接從 usemagpie.ai 下載安裝檔或用 scoop / go install）
curl -fsSL https://usemagpie.ai/install.sh | sh
```

打開 `magpie` 後（或用終端機 `magpie tui`）：
1. 電腦裡若已登入 **Codex（ChatGPT 訂閱）** 或 **GitHub Copilot**，`magpie` 會自動偵測並變成可用的模型來源。
2. 想加 API 金鑰（DeepSeek、Zhipu GLM、Kimi、OpenRouter 或官方 Google AI Studio 的 Gemini API Key），點 **`Providers → Add provider`** 選對應 Preset 貼上金鑰，或在終端機打一行 `magpie provider add deepseek sk-...`。

## 第二步：在 Claude Code 安裝 `model-relay` 外掛

在終端機執行這兩行安裝外掛（若已開著 Claude Code，裝完在對話裡打 `/reload-plugins`）：

```bash
claude plugin marketplace add cablate/model-relay
claude plugin install model-relay@model-relay
```

## 第三步：複製這段提示詞貼給 Claude Code，讓 AI 幫你一次設定到好

不用自己翻文件手寫 JSON。把下面這段提示詞**整段複製貼進 Claude Code 對話框**（記得把最後一行改成你實際在 `magpie` 開通的模型；提示詞已要求 AI 修改 `~/.claude/settings.json` 前先給你看 diff 預覽確認）：

```text
請幫我把 model-relay 跟本機的 magpie（http://127.0.0.1:3425）串接起來，完成以下設定與驗證（改動 ~/.claude/settings.json 前請先給我看預覽）：

1. 先執行 `/provider init` 建立 format 2 的 `~/.claude/model-relay.json`，並檢查本機 `127.0.0.1:3425`（magpie gateway）是否有回應，以及可用模型有哪些。
2. 透過 model-relay 的 `setup.mjs`（或 `/provider setup`），把我在 magpie 裡開通的模型加進 `~/.claude/model-relay.json` 的 `providers`：
   - `baseUrl` 指向 `http://127.0.0.1:3425`
   - `stripCacheControl` 設為 `true`
   - 加上 `launch: { "command": "magpie", "args": ["serve"] }`，讓連接埠沒開時自動在背景拉起 magpie
   - 為每個供應商填寫清楚的 `agent.description`（說明什麼任務適合派給這個 `model-relay:<名稱>` 子代理）
3. 若我的 `~/.claude/settings.json` 有設定 `availableModels`，請把這些外部模型的 `model` ID 一併補進去，避免子代理被靜默換回主線模型。
4. 設定完成後，請執行 `/provider restart` 與 `/provider doctor --ping`，確認每個供應商都顯示 `✓ answers` 與首字反應毫秒數，最後跟我說我現在可以用哪些 `/provider` 指令與 `model-relay:<名稱>` 子代理。

我目前在 magpie 裡想接進來的模型有：GPT（Codex）、Gemini、GLM、DeepSeek。
```

跑完看到 `/provider doctor --ping` 全亮綠燈 `✓`，就能打 `/provider` 單視窗切換模型，或直接開口叫 Claude「派 Gemini 幫我潤稿」「派 GPT 幫我檢查這段邏輯」了！

---

## 常見問題 FAQ

## 1. 「給 Gemini 潤一次」這種分工，怎麼限制子代理讀到整個客戶專案？

**看那件事需不需要自己翻檔案。** 10/29 貼文底下有讀者問，用在客戶專案時怎麼控制子代理的資料邊界？實務上有兩種切法：

| 分工方式 | 怎麼做 | 甚麼時候用 |
|---|---|---|
| **主代理挑內容轉交（只給文字）** | 主代理先把要潤的段落、去識別化片段或指定 diff 放進 `prompt`（或寫進獨立暫存檔），並交代「只處理這段文字，不要搜尋或讀取其他目錄」 | 單篇潤稿、文案檢查、小段邏輯審查，或專案含客戶機敏目錄時 |
| **限制子代理工具與目錄邊界 + 開啟 `magpie` Masking** | 在 `model-relay.json` 的 `providers.<name>.agent` 設定 `tools`／`disallowedTools` 只開放必要唯讀工具、配 `PreToolUse` Hook（工具呼叫前的守門腳本）鎖資料夾邊界，並開 `magpie` 的 Privacy Masking 遮罩 `.env` 金鑰 | 需要子代理自己跨幾個指定檔案比對，但仍要守住資料夾與金鑰邊界時 |

至於派子代理前怎麼決定工作包與回傳格式，可接著看〈[派子代理之前，先想清楚要換回甚麼](/articles/subagent-what-to-get-back/)〉。

## 2. 想設定「離峰時段優先派 DeepSeek、尖峰時段改派 Codex」這類條件，做得到嗎？

**做得到，別寫在 `CLAUDE.md` 賭 AI 自己記得，直接掛一道 `PreToolUse` Hook（工具呼叫前的自動守門腳本）在 `Agent` 工具前面最穩。** 當 AI 呼叫子代理時，Hook 腳本先看現在幾點：離峰時段沒叫 `model-relay:deepseek` 就當場退件重叫（`deny`），尖峰時段叫了 `deepseek` 也一樣擋下來要求改派 Codex。完整腳本與設定方式寫在〈[寫在 CLAUDE.md 也攔不住？為甚麼你叫子代理用便宜模型，帳單還是扣在最貴的 Opus 上](/articles/subagent-model-hook-guard/)〉。

## 3. 接 Google Gemini 建議走訂閱反代還是 API？可以在 Claude 裡叫 GPT 生圖嗎？

- **Google Gemini 建議直接走官方 Google AI Studio API Key**：市面上雖有工具能拿 Google 訂閱封包做反代，但很容易觸發 Google 風控（403 或封鎖帳號）。我自己接 Gemini 全走官方 API 帳單；OpenAI 的 Codex 則是官方本來就開放第三方工具登入使用。
- **生圖功能**：`model-relay` 轉發的是文字與工具對話；想用 GPT 生圖，可在 Claude Code 裡透過 Bash 直接呼叫 `codex` CLI 或 `magpie tool generate_image` 指令產圖。

---

相關問題可接著看〈[寫在 CLAUDE.md 也攔不住？為甚麼你叫子代理用便宜模型，帳單還是扣在最貴的 Opus 上](/articles/subagent-model-hook-guard/)〉、〈[帶著 AI 把 2012 年的無原始碼老遊戲從零救活：多模型逆向除錯與本機 v1.0.0 優化實錄](/articles/legacy-2012-mmorpg-reverse-engineering-with-multi-model-ai/)〉與〈[寫了 Skill 卻死都不觸發？拆解 CLAUDE.md、Skill 與 MCP 的分工](/articles/claude-code-skill-vs-claude-md-and-mcp/)〉；若要把這套多模型調度與 Harness 落實在團隊工作流，可參考[AI 工作流健檢](/expertise/)的適用範圍。
