---
title: "不用再切視窗換工具：用 model-relay 接上 magpie，在 Claude Code 派各家子代理"
seoTitle: "Claude Code 混用多家模型：model-relay 搭配 magpie 單視窗切換與子代理設定指南"
description: "想在 Claude Code 同時調用 ChatGPT 訂閱、Gemini、GLM 與 DeepSeek？拆解 model-relay 子代理分流與 magpie 跨格式閘道器怎麼配合，附複製給 AI 自動設定到好的提示詞。"
publishDate: 2026-10-20T15:00:00+08:00
category: AI工具實戰
tags: [Claude Code, model-relay, magpie, Subagent, Multi-Model, Agent Engineering]
readingTime: 7
draft: false
excerpt: "同時訂了好幾家模型，換模型就得切視窗換工具。這篇拆解我如何用 model-relay 管理單視窗切換與子代理分流，再搭配 magpie 轉換 OpenAI／Gemini API 格式並共用已登入的 ChatGPT 訂閱；文末附一段複製給 AI 自動設定到好的提示詞。"
problemTag: "多家模型額度分散、切換工具斷工作流"
---
**同時訂了好幾家模型，最煩的就是切來切去。每家都付了錢，想換個模型檢查程式碼或潤稿，就得換工具、切視窗，把同一包背景脈絡重貼一遍。**

為了解決這件事，我寫了開源外掛 **`model-relay`**，把各家模型直接註冊成 Claude Code 的子代理；再搭配另一個開源本機閘道器 **`magpie`**，把 OpenAI、Gemini 等不同規格的 API 統一轉成 Claude Code 採用的 Anthropic 訊息格式（`/v1/messages`），連電腦裡已經登入的 ChatGPT（Codex）訂閱都能直接拿進來用。

現在不管叫哪家模型，全都在同一個 Claude Code 視窗裡完成。我要發文章時，跟主線的 Claude 說一句「給 Gemini 潤一次」，它當場就派出 `model-relay:gemini` 子代理去改稿；寫完功能想找盲點，就叫它同時派 GPT、Gemini、GLM 平行交叉審查。Claude 本家的 Fable、Opus、Sonnet、Haiku 照常運作；就算哪天停訂 Claude，也能改接其他模型，繼續沿用你養了好幾個月的 Claude Code Harness（規則檔、Skills 與自動守門工作環境）。

這篇把 **`model-relay` 與 `magpie` 各自解決甚麼問題**、**甚麼情況單裝 `model-relay` 就夠、甚麼情況加上 `magpie` 更好用**一次講清楚；文末還附了一段**「直接複製貼給 Claude Code，讓 AI 自動幫你把兩邊設好並測通」**的提示詞。

---

## 為甚麼要分 `model-relay` 與 `magpie` 兩層？單靠改設定檔差在哪？

**在 Claude Code 混用別家模型有兩個不同層次的問題：第一是「怎麼按視窗與子代理分流，不把全域設定弄亂」，這由 `model-relay` 負責；第二是「當上游只支援 OpenAI 或 Gemini 格式、或你想共用已登入的 ChatGPT 訂閱時，怎麼轉成 Anthropic API 格式」，這由 `magpie` 負責。**

很多人一開始都直接去改 `~/.claude/settings.json` 裡的 `ANTHROPIC_BASE_URL`，馬上會遇到三個限制：第一，這是全域設定，一改就把所有開著的終端機視窗全換掉；第二，你沒辦法讓主對話跑 Claude Opus，同時只派一個 Gemini 或 GPT 子代理去跑分支任務；第三，一旦改了全域位址，手機 Remote Control 就會拒絕連線。

那甚麼時候需要 `magpie`？
- **如果你只接本來就提供 Anthropic 相容端點的 API**（例如 Zhipu GLM、DeepSeek、Kimi、MiniMax、OpenRouter），**單裝 `model-relay` 就能直連**，因為 `model-relay` 內建這些供應商的設定範本（Preset），填上金鑰就能用。
- **但如果你想把 OpenAI（含電腦上已登入的 ChatGPT 訂閱）或 Google Gemini 也接進來，中間就一定需要一層本機格式轉換**。也可以把所有模型都收進 `magpie` 統一管理額度與金鑰，再交給 `model-relay` 在 Claude Code 裡分流與派工：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="relayCompareTitle">
      <title id="relayCompareTitle">直接修改全域 settings.json 與使用 model-relay 搭配 magpie 分工的同屏對照</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">在 Claude Code 混用多家模型：直接改全域設定檔 vs model-relay ＋ magpie 分工</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">❌ 直接改全域 settings.json：所有視窗綁在一起，主線與子代理無法各自選模型</text>
      <rect x="24" y="70" width="210" height="62" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="129" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">改全域 settings.json</text>
      <text x="129" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">所有開著的視窗一起被換掉</text>
      <path d="M234 101 H266" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="266,96 274,101 266,106" fill="#b4352f"/>
      <rect x="274" y="70" width="220" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="384" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">主線與子代理綁死</text>
      <text x="384" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">無法主線跑 Opus、子代理派別家</text>
      <path d="M494 101 H526" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="526,96 534,101 526,106" fill="#b4352f"/>
      <rect x="534" y="70" width="202" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="635" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">專屬機制水土不服</text>
      <text x="635" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">ToolSearch、MCP 重連與遙控易斷</text>
      <line x1="24" y1="154" x2="736" y2="154" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="180" font-size="12.5" font-weight="700" fill="#26734f">✅ 現在做法：Claude Code → model-relay（:8950 視窗與子代理調度）→ 直連或經 magpie（:3425 跨格式與訂閱）</text>
      <rect x="24" y="192" width="210" height="72" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="129" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">① Claude Code 主視窗</text>
      <text x="129" y="236" text-anchor="middle" font-size="11.5" fill="#253047">/provider 單視窗熱切</text>
      <text x="129" y="252" text-anchor="middle" font-size="11.5" fill="#5f687a">一句話點名派各家子代理</text>
      <path d="M234 228 H266" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="266,223 274,228 266,233" fill="#6248c8"/>
      <rect x="274" y="192" width="228" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="388" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">② model-relay（127.0.0.1:8950）</text>
      <text x="388" y="236" text-anchor="middle" font-size="11.5" fill="#253047">自動註冊子代理、429 當場備援</text>
      <text x="388" y="252" text-anchor="middle" font-size="11.5" fill="#26734f">補齊 Claude Code 專屬工具機制</text>
      <path d="M502 228 H534" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="534,223 542,228 534,233" fill="#26734f"/>
      <rect x="542" y="192" width="194" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="639" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">③ magpie（127.0.0.1:3425）</text>
      <text x="639" y="236" text-anchor="middle" font-size="11.5" fill="#253047">轉成 Anthropic 訊息格式</text>
      <text x="639" y="252" text-anchor="middle" font-size="11.5" fill="#26734f">收攏 ChatGPT 訂閱與各家 API</text>
      <text x="24" y="294" font-size="12" fill="#5f687a">💡 支援 Anthropic 格式的 API 可由 model-relay 直連；需轉格式的模型交給 magpie，並由 launch 設定在背景自動拉起。</text>
    </svg>
  </div>
  <figcaption>上方是直接改全域設定檔的三個限制；下方由 model-relay（:8950）負責視窗與子代理調度，並視模型需求直連或交給 magpie（:3425）統一轉換 API 格式與收攏訂閱。</figcaption>
</figure>

| 角色 | 跑在哪裡 | 它幫你解決甚麼事 |
|---|---|---|
| **`model-relay`**（[`cablate/model-relay`](https://github.com/cablate/model-relay)） | 本機 `127.0.0.1:8950` | **Claude Code 專屬調度台**：認得每個視窗的對話識別碼（`session-id`），自動把供應商註冊成 `model-relay:<名稱>` 子代理，支援單視窗熱切、`haiku` 別名分流與 429 備援，並處理 Claude Code 專屬的工具與手機遙控相容性 |
| **`magpie`**（[`yetone/magpie`](https://github.com/yetone/magpie)） | 本機 `127.0.0.1:3425` | **跨廠牌 API 格式轉換與訂閱入口**：把只支援 OpenAI／Gemini 格式的模型與電腦裡已登入的 ChatGPT（Codex）訂閱，統一轉成 `model-relay` 與 Claude Code 採用的 Anthropic `/v1/messages` 格式，並提供多帳號輪替與本機金鑰遮罩 |

看懂兩邊的分工後，你可能會問：既然都是做本機格式轉換，為甚麼我推薦搭 `magpie`，而不是自己用 Python 架 `LiteLLM`？

---

## 為甚麼格式轉換這層我選 `magpie`？它好在哪裡？

**10/29 貼文底下有讀者問「想接 Gemini，Claude 叫我去架 Python 的 `LiteLLM`」。同為格式轉換閘道器，`LiteLLM` 原本是給伺服器端設計的 Python 套件（要配 Python 環境與手寫 YAML）；而 `magpie` 是專為個人開發機設計的單一執行檔（約 15～30 MB），打開就能在桌面選單列或終端機圖形介面直接點選設定。**

實際用下來，`magpie` 最順手的地方有四個：

1. **四種主流 API 格式雙向轉換（含串流、工具呼叫與思考鏈）**：`magpie` 在本機 `127.0.0.1:3425` 同時支援 OpenAI Chat、OpenAI Responses、Anthropic Messages 與 Google Gemini 四種 API 格式互轉。不管上游模型原本是哪種格式，轉出來都是標準的 Anthropic `/v1/messages` 格式，連串流輸出、Tool Calls 跟 Reasoning 思考過程都一併對應好。
2. **直接讀取電腦裡已登入的 ChatGPT（Codex）訂閱與數十種內建供應商設定（Preset）**：這是 `LiteLLM` 沒有、但對雙棲訂戶最實用的功能。`magpie` 會自動偵測你電腦裡已登入的 Codex（ChatGPT 方案）或 GitHub Copilot，在官方開放第三方工具登入的範圍內，直接把 `codex/gpt-6.1-sol`、`codex/gpt-6.1-terra`、`codex/gpt-6-luna` 變成可呼叫的模型端點。DeepSeek、Zhipu GLM、Kimi、MiniMax、官方 Google AI Studio（Gemini）、OpenRouter 等 API 供應商也有現成範本，挑名稱、貼金鑰就設完了。
3. **多帳號自動輪替（Routing Groups）與餘額查詢**：手上有兩組以上帳號，或想把幾家模型編成一組（例如 `group/daily-coding`），`magpie` 支援 `smart`（先耗最快重置的額度，減少到期浪費）、`order`（主帳號用完自動換下一組）等路由策略，同一段對話還會黏著同一個帳號以保住 Prompt Cache（提示詞快取，省時省費用）。打一行 `magpie quota` 或點開桌面選單列，就能查看每家方案剩多少額度。
4. **本機隱私遮罩（Privacy Masking）**：派外部模型讀專案，最怕它讀了 `.env` 或 log 就把 API 金鑰、私鑰、密碼或 Email 傳出去。去 `magpie` 的 `Settings → Privacy` 打開 Masking，請求離開電腦前會先在本機把已識別的敏感值換成 `{{API_KEY_k3v9x2mq}}` 代號，等模型回覆或送回工具參數時再當場換回真值，降低金鑰外流風險，且不影響 Agent 執行指令與快取。

而且把 `magpie` 交給 `model-relay` 接管後，只要在 `model-relay.json` 加上 `launch: { "command": "magpie", "args": ["serve"] }`，平時開 Claude Code 時如果 `:3425` 還沒跑起來，`model-relay` 就會在背景自動幫你啟動它，完全不用自己多顧一個視窗。

---

## `model-relay` 在 Claude Code 裡怎麼運作？我最常用的三種分工

**`magpie` 在 `:3425` 備好模型（或由 `model-relay` 直連支援 Anthropic 格式的供應商）後，`model-relay`（`:8950`）負責在 Claude Code 裡執行「點名派子代理、雜活自動分流、單視窗熱切與 429 額度滿自動備援」三種日常分工。**

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

## 既然已經轉成 Anthropic 格式了，為甚麼還需要 `model-relay` 處理「失憶、掉工具」？

`magpie`（或支援 Anthropic 格式的供應商）解決的是**「標準 API 訊息格式」**；但 **Claude Code 這個 CLI 客戶端本身**還有幾項只對 Anthropic 官方伺服器生效的專屬機制。如果直接把 `ANTHROPIC_BASE_URL` 指給一般端點，很容易水土不服；`model-relay`（v0.7.5+）會在送出前後把這四項 Claude Code 專屬細節補齊：

| 直接改設定常踩到的坑 | 為甚麼光靠格式轉換還不夠 | `model-relay` 怎麼在 Claude Code 端修好它 |
|---|---|---|
| **聊到第二輪突然「失憶」或掉工具** | Claude Code 在部分模式只送差量片段（`message-threads`），且中途重連的 MCP 工具只寫在系統訊息（`tool_addition`），非 Anthropic 官方伺服器不會自動合併 | 送出前自動展開完整對話歷史，並把中途加入的 MCP 工具合併進正式工具清單 |
| **按需載入工具（`WebFetch`、MCP）消失或報 HTTP 400** | Claude Code 會送出專屬的 `ToolSearch` 工具與 `cache_control` 欄位，許多外部端點不認得 | 自動改寫 `ToolSearch` 讓已載入工具可直接呼叫，並依供應商設定剝除 `cache_control` |
| **子代理表面叫 Gemini，實際偷跑回 Claude** | `settings.json` 若設了 `availableModels` 白名單卻漏列外廠模型 ID，Claude Code 會在內部靜默換回預設模型，根本沒送到後面 | 子代理啟動前與結束時雙重核對轉發站實際收到的請求，不一致立刻跳警告並引導跑 `/provider doctor` |
| **手機 Remote Control 拒開、狀態列模型名不準** | Claude Code 發現 `ANTHROPIC_BASE_URL` 不是 `api.anthropic.com` 就會鎖死手機遙控；內建狀態列也只顯示轉發前的模型名 | 打 `/provider rc on` 啟用僅簽發 `api.anthropic.com` 且即毀私鑰的本機 HTTPS 代理；同時將真實模型寫入 `~/.claude/model-relay-status/<session id>` 供狀態列顯示 |

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
