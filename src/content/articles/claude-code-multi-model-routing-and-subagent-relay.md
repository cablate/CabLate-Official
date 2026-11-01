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
**同時訂了好幾家模型，最煩的就是切來切去。每家都付了錢，想換個模型檢查程式碼或潤稿，就得換工具、切視窗，把同一包背景資料重貼一遍。**

為了解決這件事，我寫了開源外掛 **`model-relay`**，讓 Claude Code 可以直接把其他模型當成「子代理（分身助手）」派出去做事；再搭配另一個開源工具 **`magpie`**，把 OpenAI、Gemini 等不同廠牌的模型統一轉成 Claude Code 收得懂的訊息規格，連電腦裡已經登入的 ChatGPT（Codex）訂閱都能直接拿進來用。

現在不管叫哪家模型，全都在同一個 Claude Code 視窗裡完成。我要發文章時，跟主線的 Claude 說一句「給 Gemini 潤一次」，它當場就派出 Gemini 子代理去改稿；寫完功能想找盲點，就叫它同時派 GPT、Gemini、GLM 平行交叉審查。Claude 本家的 Fable、Opus、Sonnet、Haiku 照常運作；就算哪天停訂 Claude，也能改接其他模型，繼續沿用你平常整理好的工作規則與自動檢查流程（Harness）。

這篇用最白話的方式把 **`model-relay` 與 `magpie` 各自幫你做甚麼**、**怎麼省下額外開銷與切換時間**講清楚；文末還附了一段**「直接複製貼給 Claude Code，讓 AI 自動幫你把兩邊設好並測通」**的提示詞。

---

## 為甚麼要分 `model-relay` 與 `magpie` 兩個工具？直接改設定檔差在哪？

**想在同一個 Claude Code 裡混用別家模型，要解決兩件不同的事：第一是「怎麼在同一個視窗裡自由切換模型、派分身去跑，而不影響其他視窗」，這由 `model-relay` 負責；第二是「各家 AI 接收指令的規格不同，怎麼把 OpenAI 或 Gemini 轉成 Claude Code 收得懂的規格」，這由 `magpie` 負責。**

很多人一開始會照網路教學去改 Claude Code 的全域設定檔（`~/.claude/settings.json`），結果馬上撞到三個麻煩：
1. **牽一髮動全身**：全域設定一改，你電腦上所有開著的終端機視窗會全部一起被換掉，沒辦法這個視窗用 Claude、隔壁視窗用別家。
2. **沒辦法分工派助手**：你沒辦法讓主對話留在最聰明的 Claude Opus 控場，同時只派一個便宜或擅長改稿的 Gemini、GPT 分身去跑小任務。
3. **原本好用的功能會壞掉**：一旦手動改了連線位址，Claude Code 的手機遠端遙控（Remote Control）就會拒絕連線，連搜尋網頁或外部工具也常一起失效。

那甚麼時候需要多裝一個 `magpie`？
- **如果你只接本來就支援 Claude 規格的模型**（例如 Zhipu GLM、DeepSeek、Kimi、MiniMax、OpenRouter），**只裝 `model-relay` 就能直接連**，填上金鑰就能用。
- **但如果你想把 OpenAI（含電腦上已登入的 ChatGPT 訂閱）或 Google Gemini 也接進來，中間就一定需要一個「翻譯總機」幫你轉規格**。你也可以乾脆把所有模型都放進 `magpie` 集中看額度，再交給 `model-relay` 在 Claude Code 裡派工：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="relayCompareTitle">
      <title id="relayCompareTitle">直接修改全域設定檔與使用 model-relay 搭配 magpie 分工的同屏對照</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">在 Claude Code 混用多家模型：直接改全域設定檔 vs model-relay ＋ magpie 分工</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">❌ 直接改全域設定檔：所有視窗綁在一起，主線與分身助手無法各自選模型</text>
      <rect x="24" y="70" width="210" height="62" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="129" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">改全域設定檔</text>
      <text x="129" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">所有開著的視窗一起被換掉</text>
      <path d="M234 101 H266" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="266,96 274,101 266,106" fill="#b4352f"/>
      <rect x="274" y="70" width="220" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="384" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">主線與子代理綁死</text>
      <text x="384" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">無法主線跑 Opus、分身派別家</text>
      <path d="M494 101 H526" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="526,96 534,101 526,106" fill="#b4352f"/>
      <rect x="534" y="70" width="202" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="635" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">內建工具容易失效</text>
      <text x="635" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">網頁搜尋、外掛工具與手機遙控易斷</text>
      <line x1="24" y1="154" x2="736" y2="154" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="180" font-size="12.5" font-weight="700" fill="#26734f">✅ 現在做法：Claude Code → model-relay（派工調度台）→ 直連或經 magpie（跨廠牌翻譯總機）</text>
      <rect x="24" y="192" width="210" height="72" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="129" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">① Claude Code 主視窗</text>
      <text x="129" y="236" text-anchor="middle" font-size="11.5" fill="#253047">打 /provider 只切眼前視窗</text>
      <text x="129" y="252" text-anchor="middle" font-size="11.5" fill="#5f687a">一句話點名派各家分身助手</text>
      <path d="M234 228 H266" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="266,223 274,228 266,233" fill="#6248c8"/>
      <rect x="274" y="192" width="228" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="388" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">② model-relay（派工調度台）</text>
      <text x="388" y="236" text-anchor="middle" font-size="11.5" fill="#253047">自動註冊子代理、額度滿當場接手</text>
      <text x="388" y="252" text-anchor="middle" font-size="11.5" fill="#26734f">保住搜尋、外部工具與手機遙控</text>
      <path d="M502 228 H534" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="534,223 542,228 534,233" fill="#26734f"/>
      <rect x="542" y="192" width="194" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="639" y="216" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">③ magpie（翻譯與訂閱總機）</text>
      <text x="639" y="236" text-anchor="middle" font-size="11.5" fill="#253047">把各家模型轉成 Claude 規格</text>
      <text x="639" y="252" text-anchor="middle" font-size="11.5" fill="#26734f">直接沿用已登入的 ChatGPT 訂閱</text>
      <text x="24" y="294" font-size="12" fill="#5f687a">💡 支援 Claude 規格的服務可由 model-relay 直連；需轉規格的則交給 magpie，並由 model-relay 在背景自動啟動。</text>
    </svg>
  </div>
  <figcaption>上方是直接改全域設定檔的三個限制；下方由 model-relay 負責視窗與子代理調度，並視模型需求直連或交給 magpie 統一轉換規格與收攏訂閱。</figcaption>
</figure>

| 工具角色 | 一句話說它幫你做甚麼 | 誰最需要它 |
|---|---|---|
| **`model-relay`**（[`cablate/model-relay`](https://github.com/cablate/model-relay)） | **Claude Code 裡的派工調度台**：讓你只切換眼前這一個視窗的模型、自動把各家模型變成可隨時點名的子代理，並在 Claude 額度用完時當場換備援接手 | 所有想在 Claude Code 裡混用第二家模型的個人與團隊 |
| **`magpie`**（[`yetone/magpie`](https://github.com/yetone/magpie)） | **跨廠牌翻譯與訂閱總機**：把只講 OpenAI 或 Gemini 規格的模型、還有你電腦裡已登入的 ChatGPT（Codex）訂閱，統一轉成 Claude Code 收得懂的規格 | 想在 Claude Code 裡直接用 ChatGPT 訂閱、Gemini，或有多組帳號想集中看餘額與遮罩金鑰的人 |

看懂兩邊的分工後，你可能會問：轉規格的工具以前也有 `LiteLLM`，為甚麼我推薦搭 `magpie`？

---

## 為甚麼轉規格這層我選 `magpie`？它好用在哪裡？

**10/29 貼文底下有讀者問：「想接 Gemini，AI 叫我去架 Python 的 `LiteLLM`。」同樣是做規格轉換，`LiteLLM` 原本是給工程師架伺服器用的 Python 套件，得先處理 Python 環境跟設定檔；而 `magpie` 是做給個人電腦用的單一輕量程式（不到 30 MB），點兩下打開就能在桌面選單列直接勾選設定。**

實際用下來，`magpie` 對日常工作最有幫助的有四點：

1. **主流模型規格自動互轉，工具與思考過程都不漏**：不管你接的是 OpenAI、Google Gemini 還是其他廠牌，`magpie` 都會在本機自動轉成 Claude Code 收得懂的訊息規格，連打字機式的串流輸出、呼叫工具（Tool Calls）跟模型的推理思考過程都一併對應好。
2. **直接沿用電腦裡已登入的 ChatGPT（Codex）訂閱，免再重買一筆 API**：這是 `LiteLLM` 沒有、但對同時訂了 Claude 與 ChatGPT（或公司有配額度）的人最省錢的功能。`magpie` 會自動偵測你電腦裡已登入的 Codex（ChatGPT 方案）或 GitHub Copilot，在官方開放第三方工具登入的範圍內，直接把 `gpt-6.1-sol`、`gpt-6.1-terra`、`gpt-6-luna` 變成 Claude Code 可以呼叫的模型。其他像 DeepSeek、Zhipu GLM、Kimi、MiniMax、官方 Google AI Studio（Gemini）也都有現成選單，挑名稱、貼上金鑰就設完了。
3. **多帳號自動輪替與一眼看清剩餘額度**：如果你手上有兩組以上帳號，或想把幾家模型編成一組輪流用，`magpie` 支援自動先消耗「最快到期重置」的額度（`smart` 策略），或是主帳號用完自動換下一組（`order` 策略）；同一段對話還會固定走同一個帳號，不會打斷提示詞快取（Prompt Cache，能減少重複計費與等待時間）。點開電腦右上角的選單列（或打一行 `magpie quota`），就能直接看每家方案還剩多少額度。
4. **本機自動遮罩敏感金鑰，不怕誤傳給外部模型**：派外部模型讀專案，最怕它讀了設定檔就把你的 API 金鑰、密碼或客戶 Email 傳出去。在 `magpie` 打開隱私遮罩（`Settings → Privacy → Masking`）後，資料離開你的電腦前，會先在本機把金鑰換成 `{{API_KEY_...}}` 這類假代號，等模型回覆時再當場換回真值，大幅降低金鑰外流風險。

更省心的是，只要照文末的提示詞讓 `model-relay` 綁定 `magpie`，以後你打開 Claude Code 時如果 `magpie` 還沒開，`model-relay` 就會在背景自動幫你啟動它，平時根本不用自己去開關。

---

## `model-relay` 在 Claude Code 裡怎麼運作？我最常用的三種分工

**模型準備好之後，`model-relay` 負責在 Claude Code 裡幫你執行「點名派子代理、日常雜活自動分流、單視窗切換與額度滿自動備援」三種日常分工。**

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 280" role="img" aria-labelledby="subagentDispatchTitle">
      <title id="subagentDispatchTitle">用 model-relay 混搭主線、各家子代理、雜活分流與額度滿自動備援的調度圖</title>
      <rect x="0" y="0" width="760" height="280" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">把各家模型額度用滿的調度台：主線控場 ＋ 點名派子代理 ＋ 雜活自動分流 ＋ 額度滿自動備援</text>
      <rect x="24" y="56" width="190" height="146" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="119" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="#6248c8">① 當前對話主線</text>
      <text x="119" y="110" text-anchor="middle" font-size="12" fill="#253047">打 /provider 按 1~9 切換</text>
      <text x="119" y="132" text-anchor="middle" font-size="11.5" fill="#5f687a">只改眼前這個視窗</text>
      <text x="119" y="152" text-anchor="middle" font-size="11.5" fill="#5f687a">隔壁終端機照跑原本模型</text>
      <text x="119" y="178" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8" style="font-family:var(--font-mono)">Opus / GPT / Gemini / GLM</text>
      <path d="M214 96 H292" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="292,91 300,96 292,101" fill="#6248c8"/>
      <text x="256" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">點名派工</text>
      <rect x="300" y="56" width="436" height="68" rx="8" fill="#f1edff" stroke="#b8afc9" stroke-width="1.5"/>
      <text x="318" y="82" font-size="13" font-weight="700" fill="#6248c8">② 自動變成子代理：model-relay:gpt-sol / gemini / glm</text>
      <text x="318" y="106" font-size="12" fill="#253047">免手寫設定檔，直接說「給 Gemini 潤一次」或平行多模型審查</text>
      <path d="M214 166 H292" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="292,161 300,166 292,171" fill="#26734f"/>
      <text x="256" y="156" text-anchor="middle" font-size="11.5" font-weight="700" fill="#26734f">自動轉彎</text>
      <rect x="300" y="134" width="436" height="68" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="318" y="160" font-size="13" font-weight="700" fill="#26734f">③ 雜活分流與額度備援：讀檔搜尋交給便宜模型 ＋ 撞牆自動接手</text>
      <text x="318" y="184" font-size="12" fill="#253047">日常搜尋摘要自動走 GLM / DeepSeek；Claude 額度滿了當場換手不中斷</text>
      <rect x="24" y="220" width="712" height="42" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="380" y="246" text-anchor="middle" font-size="11.5" font-weight="700" fill="#253047">🛡️ 雙重核對子代理有沒有偷跑回高價模型，並完整保留外掛工具、網頁預覽、Chrome 與手機遙控</text>
    </svg>
  </div>
  <figcaption>主線可隨時用 `/provider` 單視窗切換，底下同時支援一句話點名派出各家子代理、把日常搜尋雜活導給便宜模型，以及在 Claude 額度滿時當場接手。</figcaption>
</figure>

我每天在 Claude Code 最常用這三種分工：

1. **主對話直接開口點名派分身（子代理）**：只要加進 `model-relay` 的模型，啟動時就會自動變成可點名的子代理（例如 `model-relay:gpt-sol`、`model-relay:gemini`、`model-relay:glm`、`model-relay:deepseek`），不用自己手寫一堆設定檔，也不用重開對話。主線留給最擅長統籌的 Claude Opus 控場，寫完文章喊一句「給 Gemini 潤一次」，寫完架構喊一句「派 GPT、Gemini、GLM 平行做獨立審查」，都在同一個視窗完成。
2. **讀檔搜尋這類雜活交給便宜模型，主線額度留給難題**：日常翻找檔案、關鍵字搜尋與網頁摘要，其實不需要燒最貴的模型。只要打一行替身設定指令 `/provider alias haiku glm`（或 `deepseek`），`model-relay` 就會把原本預設派給輕量模型（`haiku`）的跑腿工作，自動轉給便宜許多的外部模型。想看這週外部模型幫你省下多少主線額度，打 `/provider stats` 就能看到本機統計表。
3. **單一視窗隨時切換＋Claude 額度撞牆時自動接手**：在對話框打 `/provider` 會跳出選單，按數字鍵 `1–9` 只會把「眼前這個視窗」切到你選的模型（按 `p` 還能當場測每家模型的反應速度），隔壁終端機完全不受影響。當 Claude 撞上 5 小時額度上限（HTTP 429 錯誤）時，備援名單（`failover.chain`）裡的模型會當場接手把話講完，不會做到一半卡死；就算某個月停訂 Claude，也能切去別家模型，繼續用你原本設好的工作規則與工具。

## 為甚麼自己改設定常讓別家模型「聊兩句就失憶、工具壞掉」，用 `model-relay` 卻不會？

就算 `magpie` 已經把訊息規格轉好了，**Claude Code 這個軟體本身**還有幾個只對 Anthropic 官方伺服器生效的特殊設計。如果直接改設定檔硬連，別家模型常會水土不服；`model-relay`（v0.7.5+）在中間幫你把這四個常見問題都處理掉了：

| 自己改設定常遇到的狀況 | 背後原因是甚麼 | `model-relay` 幫你做了甚麼處理 |
|---|---|---|
| **聊到第二輪突然忘記前面講甚麼，或外掛工具消失** | Claude Code 有時只傳送「最新一輪的變動片段」，而且中途重連的外部工具（MCP）只寫在系統提示裡，非官方伺服器不會自動拼回去 | 送出前自動幫外部模型拼回完整對話紀錄，並把中途重連的外部工具放回正式工具清單（展開 `message-threads` 與合併 `tool_addition`） |
| **搜尋網頁（`WebFetch`）或外掛工具無法呼叫、直接報錯** | Claude Code 會送出專屬的「按需尋找工具」指令與快取標記，許多外部模型不認得 | 自動把工具轉成外部模型能直接呼叫的形式，並拿掉不相容的快取欄位（改寫 `ToolSearch` 與剝除 `cache_control`） |
| **明明點名派 Gemini 子代理，帳單卻還是扣在 Claude 上** | 如果 Claude Code 設定檔裡設了「允許使用的模型白名單（`availableModels`）」卻漏填外部模型，系統會在內部偷偷換回預設的 Claude，不跳任何錯誤 | 在子代理啟動前與結束時雙重核對「實際收到的請求是不是你點名的模型」，被偷換就會立刻跳出警告並教你用 `/provider doctor` 補齊 |
| **手機遠端遙控（Remote Control）被鎖死、狀態列顯示舊名字** | Claude Code 只要發現連線網址被改掉，就會關閉手機遙控功能；內建狀態列也不會顯示切換後的模型名 | 打 `/provider rc on` 就能在不改動官方網址的前提下分流模型、保住手機遙控；同時把當前視窗的真實模型寫進狀態檔供狀態列顯示 |

---

## 怎麼從零裝起來？（附「複製給 AI 自動配到好」的完整提示詞）

**你只需要做兩件小事：先下載打開 `magpie` 登入你的模型帳號，再跑兩行指令裝好 `model-relay`；剩下的設定檔串接與連線測試，直接把第三步的提示詞貼給 Claude Code，讓 AI 幫你一次弄到好。**

## 第一步：安裝 `magpie` 並登入你的模型或填入 API 金鑰

到 **[usemagpie.ai](https://usemagpie.ai)** 下載桌面版安裝檔（支援 macOS、Windows、Linux），或在終端機執行安裝指令（執行前建議先檢視腳本內容）：

```bash
# macOS / Linux 安裝（Windows 可直接從 usemagpie.ai 下載桌面版安裝檔）
curl -fsSL https://usemagpie.ai/install.sh | sh
```

打開 `magpie` 後：
1. **想直接用已付費的 ChatGPT 訂閱**：只要你的電腦裡已經登入 **Codex（ChatGPT 訂閱）** 或 **GitHub Copilot**，`magpie` 會自動抓到，不用另外設定。
2. **想加其他家的 API 金鑰**（例如官方 Google AI Studio 的 Gemini、DeepSeek、Zhipu GLM、Kimi、OpenRouter）：在介面點 **`Providers → Add provider`**，從內建選單挑廠商名稱、貼上金鑰就完成了。

## 第二步：在 Claude Code 安裝 `model-relay` 外掛

在終端機執行這兩行指令安裝外掛（如果 Claude Code 已經開著，裝完在對話框輸入 `/reload-plugins` 即可載入）：

```bash
claude plugin marketplace add cablate/model-relay
claude plugin install model-relay@model-relay
```

## 第三步：複製這段提示詞貼給 Claude Code，讓 AI 幫你自動設好並測通

不用自己研究設定檔怎麼寫。把下面這段文字**整段複製貼進 Claude Code 對話框**（裡面那些網址跟英文參數都是寫給 AI 看的，你完全不用懂，只要把最後一行改成你在 `magpie` 裡有開通的模型名稱就好；提示詞也已規定 AI 改動設定檔前要先給你看變更預覽）：

```text
請幫我把 model-relay 跟本機的 magpie（http://127.0.0.1:3425）串接起來，完成以下設定與驗證（改動 ~/.claude/settings.json 前請先給我看預覽）：

1. 先執行 `/provider init` 建立 format 2 的 `~/.claude/model-relay.json`，並檢查本機 `127.0.0.1:3425`（magpie）是否有回應，以及裡面有哪些可用模型。
2. 透過 model-relay 的 `setup.mjs`（或 `/provider setup`），把我在 magpie 裡開通的模型加進 `~/.claude/model-relay.json` 的 `providers`：
   - `baseUrl` 指向 `http://127.0.0.1:3425`
   - `stripCacheControl` 設為 `true`
   - 加上 `launch: { "command": "magpie", "args": ["serve"] }`，讓連接埠沒開時自動在背景啟動 magpie
   - 為每個供應商填寫清楚的 `agent.description`（說明什麼任務適合派給這個 `model-relay:<名稱>` 子代理）
3. 若我的 `~/.claude/settings.json` 有設定 `availableModels` 白名單，請把這些外部模型的 `model` ID 一併補進去，避免子代理被偷偷換回主線模型。
4. 設定完成後，請執行 `/provider restart` 與 `/provider doctor --ping`，確認每個模型都亮綠燈（`✓ answers`）並顯示反應秒數，最後用白話跟我說我現在可以用哪些指令切換視窗或點名派子代理。

我目前在 magpie 裡想接進來的模型有：GPT（Codex）、Gemini、GLM、DeepSeek。
```

等 AI 跑完、看到畫面上的模型全部亮起綠燈 `✓`，你就可以在對話框打 `/provider` 切換眼前視窗的模型，或直接跟 Claude 說「派 Gemini 幫我潤稿」「派 GPT 幫我檢查這段邏輯」了！

---

## 常見問題 FAQ

## 1. 「給 Gemini 潤一次」這種分工，怎麼避免子代理讀到整個客戶專案的機密？

**看那件事需不需要子代理自己去翻檔案。** 10/29 貼文底下有讀者問，用在公司或客戶專案時，怎麼控制外部子代理看到的範圍？實務上有兩種做法：

| 分工情境 | 白話做法 | 甚麼時候用 |
|---|---|---|
| **只改文章、檢查文案或看一小段程式碼** | 叫主線的 Claude「只把要改的那段文字貼給子代理，不要讓它讀取其他資料夾」 | 單篇潤稿、翻譯、小段邏輯檢查，或專案裡有客戶機密資料夾時 |
| **需要子代理自己跨幾個檔案比對** | 在 `model-relay` 設定裡限制該子代理只能用唯讀工具、掛一道自動守門腳本（`PreToolUse` Hook）鎖住可讀取的資料夾，並打開 `magpie` 的隱私遮罩（Masking）把設定檔（`.env`）裡的金鑰換成假代號 | 需要外部子代理幫忙找跨檔案問題，但仍要守住資料夾與金鑰安全時 |

至於派子代理前怎麼決定工作包大小與回傳格式，可接著看〈[派子代理之前，先想清楚要換回甚麼](/articles/subagent-what-to-get-back/)〉。

## 2. 想設定「半夜離峰時段優先派便宜的 DeepSeek、白天尖峰改派 GPT」做得到嗎？

**做得到，而且不要只寫在文字規則檔裡賭 AI 自己記得，直接掛一個「派工前自動檢查的小腳本（`PreToolUse` Hook）」最穩。** 每次 AI 要派子代理時，腳本會先看現在幾點：半夜離峰如果沒派 DeepSeek 就當場退回重派，白天尖峰叫了 DeepSeek 也一樣擋下來改派 GPT。完整腳本與設定步驟寫在〈[寫在 CLAUDE.md 也攔不住？為甚麼你叫子代理用便宜模型，帳單還是扣在最貴的 Opus 上](/articles/subagent-model-hook-guard/)〉。

## 3. 接 Google Gemini 建議用免費反代還是官方 API？可以在 Claude 裡叫 GPT 生圖嗎？

- **Google Gemini 強烈建議走官方 Google AI Studio API Key**：網路上雖然有工具能拿個人 Google 訂閱來做非官方轉接（反代），但非常容易觸發 Google 風控導致帳號被鎖。我自己接 Gemini 全部走官方 API 帳單；至於 OpenAI 的 Codex 則是官方本來就正式開放第三方工具登入使用。
- **叫 GPT 生圖**：`model-relay` 負責的是文字與工具對話；如果想在 Claude Code 裡請 GPT 畫圖，可以直接叫 Claude 透過終端機執行 `codex` 指令或 `magpie tool generate_image` 把圖生出來。

---

相關問題可接著看〈[寫在 CLAUDE.md 也攔不住？為甚麼你叫子代理用便宜模型，帳單還是扣在最貴的 Opus 上](/articles/subagent-model-hook-guard/)〉、〈[帶著 AI 把 2012 年的無原始碼老遊戲從零救活：多模型逆向除錯與本機 v1.0.0 優化實錄](/articles/legacy-2012-mmorpg-reverse-engineering-with-multi-model-ai/)〉與〈[寫了 Skill 卻死都不觸發？拆解 CLAUDE.md、Skill 與 MCP 的分工](/articles/claude-code-skill-vs-claude-md-and-mcp/)〉；若要把這套多模型分工落實在團隊工作流，可參考[AI 工作流健檢](/expertise/)的適用範圍。
