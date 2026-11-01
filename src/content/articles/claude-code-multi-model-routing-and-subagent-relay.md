---
title: "不用再切視窗換工具：用 model-relay 接上 magpie，在 Claude Code 派各家子代理"
seoTitle: "Claude Code 混用多家模型：model-relay 搭配 magpie 單視窗切換與子代理設定指南"
description: "想在 Claude Code 同時調用 ChatGPT 訂閱、Gemini、GLM 與 DeepSeek？拆解 model-relay 子代理分流與 magpie 怎麼分工，附複製給 AI 自動設定到好的提示詞。"
publishDate: 2026-10-20T15:00:00+08:00
category: AI工具實戰
tags: [Claude Code, model-relay, magpie, Subagent, Multi-Model, Agent Engineering]
readingTime: 7
draft: false
excerpt: "同時訂了好幾家模型，換模型就得切視窗換工具。這篇拆解我如何用 model-relay 管理單視窗切換與子代理分流，再搭配 magpie 轉換 OpenAI／Gemini 訊息規格並共用已付費的 ChatGPT 方案；文末附一段複製給 AI 自動設定到好的提示詞。"
problemTag: "多家模型額度分散、切換工具斷工作流"
---
如果你手邊同時訂了 Claude、ChatGPT 與 Gemini，或者公司另外配了零星的模型額度給你，日常工作最煩人的往往是為了換模型得一直切視窗、換工具。每次想請另一家模型幫忙看一段內容或潤飾文字，就得把背景資料重新複製貼上一遍，原本順暢的工作節奏當場被打斷。

所以我自己做了 Claude Code 外掛 `model-relay`，把各家模型直接註冊成子代理，再視需求搭配輕量桌面程式 `magpie`，把不同廠牌統一轉成 Claude Code 收得懂的訊息規格。

設定好之後，我要寫文章或做交叉審查時，只要在同一個視窗說一句「給 Gemini 潤一次」，主線就會直接派出 Gemini 子代理去處理；Claude 本家的 Fable、Opus、Sonnet、Haiku 照常可用。

下面帶你看懂「`model-relay`（派工調度台）＋ `magpie`（跨廠牌翻譯與訂閱總機）」怎麼分工、幫你擋掉哪些相容性問題。讀到安裝那一節時，把整理好的提示詞貼給 Claude Code，AI 就會一步步帶你把環境配好。

---

## 為甚麼不直接改設定檔，而要拆成 `model-relay` 與 `magpie` 兩層？

**直接修改 Claude Code 的全域設定檔會把所有視窗與內建工具綁死，拆成「派工調度台」與「跨廠牌翻譯總機」兩層，才能做到單視窗切換、按任務指派子代理，而且不弄壞既有功能。**

很多人第一次想在 Claude Code 裡接別家模型時，直覺會去改全域設定檔裡的連線網址（`~/.claude/settings.json` 的 `ANTHROPIC_BASE_URL`）。但實際改下去，馬上會撞上三個問題：

1. **所有視窗被一起換掉**：電腦上每一個開著的 Claude Code 視窗都會被迫換成同一個外部模型，沒辦法只切換眼前這一個工作視窗。
2. **主線與子代理綁在一起**：沒辦法讓對話主線繼續用最穩的 Claude Opus 統籌，同時只把潤稿、查資料或第二意見審查派給 Gemini、GPT 或便宜模型。
3. **內建工具與手機遙控容易失靈**：手機遠端遙控（Remote Control）一旦發現連線網址被改掉就會拒絕連線，外部模型遇到專屬的網頁搜尋或外掛工具時也常直接報錯。

`model-relay` 同樣會把這個網址指向本機的轉發站，差別在轉發站預設把請求原樣交給 Claude，只有你點名的子代理、切換過的視窗和你設定的分流規則才走外部模型（第一家接進來的模型，會預設成 Claude 額度滿時的接手者），所以上面三個問題都能各別解掉。

所以我把方案拆成 [`cablate/model-relay`](https://github.com/cablate/model-relay) 與 [`yetone/magpie`](https://github.com/yetone/magpie) 兩層。如果你的目標模型本來就支援 Claude 訊息規格（如 Zhipu GLM、DeepSeek、Kimi、MiniMax 或 OpenRouter），**只裝 `model-relay` 就能直連**，連 `magpie` 都不用裝（直連 `/v1/messages`）。當你想接 OpenAI、Gemini，或直接共用你已付費的 ChatGPT 方案（用 OpenAI 官方的 Codex 工具登入同一個帳號即可，不用另外買）時，才需要加上輕量桌面程式 `magpie` 當跨廠牌翻譯與訂閱總機，統一轉成 Claude 訊息規格。

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

---

## 跨廠牌轉換訊息規格這層，為甚麼我推薦直接裝 `magpie`？

**因為 [`magpie`](https://usemagpie.ai) 是約 30 MB 的輕量桌面程式，點兩下就能在選單列把各家模型與電腦裡已登入的 ChatGPT 訂閱轉成 Claude 訊息規格，完全不用自己配 Python 環境。**

前陣子有讀者在 Threads 留言問我：「想拿來接 Gemini，剛剛讓 Claude 跑一下說需要架 `LiteLLM` 轉，是這樣嗎？」我直接推薦他改用 `magpie`。

伺服器端用的 Python `LiteLLM` 要自己顧環境與長篇設定檔；相比之下，開源的 `magpie`（`yetone/magpie`）在個人電腦上有四個直接省力的亮點：

1. **免配環境的輕量桌面程式，自動轉好訊息規格**：約 30 MB 的單一桌面程式，常駐在桌面選單列（Mac 右上角、Windows 右下角系統列；本機服務預設跑在 `127.0.0.1:3425`）。勾選模型後，它會把串流打字、工具呼叫（Tool Calls）與推理過程一併轉成 Claude Code 收得懂的訊息規格（`/v1/messages`）。
2. **直接共用電腦裡已登入的 ChatGPT 訂閱，不用再買一筆 API**：只要電腦裡的 Codex 工具已登入你的 ChatGPT 付費帳號，或已登入 GitHub Copilot，`magpie` 會自動偵測並把 `gpt-6.1-sol`、`gpt-6.1-terra`、`gpt-6-luna` 變成 Claude Code 可呼叫的模型。DeepSeek、Zhipu GLM、Kimi、MiniMax 與官方 Google AI Studio（Gemini）也有現成選單，貼上金鑰即可啟用。
3. **多帳號自動輪替，一眼看清剩餘額度**：支援優先用仍有額度、最快重置的訂閱（`smart` 策略）或主帳號用完換下一組（`order` 策略），同一段對話預設也會盡量留在同一帳號，保住提示詞快取（Prompt Cache）。想看各家剩餘額度，點開選單列或打一行指令就能查看（`magpie quota`）。
4. **資料出門前先在本機遮罩敏感金鑰**：隱私遮罩預設關閉，到 `Settings → Privacy` 打開後，送出前會先在本機把符合規則的 API 金鑰等字串換成安全代號（如 `{{API_KEY_...}}`），收到回覆時再自動換回真值。規則偶爾會判錯，可到 `Insights → Masking` 查紀錄。它保護的是這些敏感字串，要限制子代理能讀哪些檔案，做法在文末常見問題第 1 題。

搭配 `model-relay` 的自動啟動設定後（設定檔開啟 `launch`），以後開 Claude Code 時若 `magpie` 還沒開，`model-relay` 會在背景自動拉起它。

---

## 裝好之後，`model-relay` 在日常工作裡怎麼幫我們調度與防呆？

**`model-relay` 會把你接進來的外部模型自動註冊成可點名的子代理，並提供單視窗切換、雜活自動分流、額度滿自動備援，同時在底層幫外部模型修補四個水土不服的問題。**

當各家模型都接進 `model-relay` 之後，我最常用這三種分工把各家額度用起來：

1. **一句話點名派各家子代理，把零星額度用光**：不用手寫設定檔，系統會自動註冊好子代理（如 `model-relay:gpt-sol`、`model-relay:gemini`、`model-relay:glm`、`model-relay:deepseek`）。像有讀者分享的，自己訂了 Claude、公司又給了零星 GPT 額度，以前懶得另開視窗就放著浪費，現在直接在同一個畫面叫 GPT 子代理檢查，完全不用斷工作流。我寫文章或審架構時，也常直接說「給 Gemini 潤一次」或同時派多家平行審查。
2. **日常讀檔與搜尋雜活，自動分流給便宜模型**：翻找檔案、整理日誌或初步摘要不需要動用最貴的模型。設定好輕量模型別名後（執行 `/provider alias haiku glm` 或 `deepseek`），日常雜活就會自動導給便宜快速的模型。
3. **單視窗隨時切換主線，Claude 額度滿了當場接手**：打 `/provider` 點面板上的按鈕，就能只切換眼前這一個視窗的模型（用鍵盤就先按 `ctrl+x tab`，再按 `1–9` 切換或 `p` 測試）。萬一撞上 Claude 的 5 小時額度上限（HTTP 429 錯誤），備援名單會當場接手（`failover.chain`），接手的模型能力與 Claude 不同，重要工作完成後自己再看一次；就算沒訂閱 Claude，也能透過其他模型照常使用培養已久的 Claude Code 工作環境。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 280" role="img" aria-labelledby="subagentDispatchTitle">
      <title id="subagentDispatchTitle">用 model-relay 混搭主線、各家子代理、雜活分流與額度滿自動備援的調度圖</title>
      <rect x="0" y="0" width="760" height="280" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">把各家模型額度用滿的調度台：主線控場 ＋ 點名派子代理 ＋ 雜活自動分流 ＋ 額度滿自動備援</text>
      <rect x="24" y="56" width="190" height="146" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="119" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="#6248c8">① 當前對話主線</text>
      <text x="119" y="110" text-anchor="middle" font-size="12" fill="#253047">打 /provider 選模型切換</text>
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
  <figcaption>主線可隨時用 /provider 單視窗切換，底下同時支援一句話點名派出各家子代理、把日常搜尋雜活導給便宜模型，以及在 Claude 額度滿時當場接手。</figcaption>
</figure>

此外，Claude Code 有不少專為自家模型設計的內部機制，外部模型直接連常會水土不服。下表是 `model-relay`（v0.7.5+）在背後自動幫你修好的四個問題，裝好就會生效，想直接動手可以跳到下一節：

| 你在畫面上遇到的怪現象 | 為甚麼外部模型會卡住？ | `model-relay` 在背後怎麼幫你修好？ |
|---|---|---|
| **聊到第二輪突然失憶，或中途重連的外掛工具消失** | Claude Code 第二輪起只傳對話差額與新增工具，外部模型看不懂這種縮寫格式。 | 自動讓外部模型收到完整的對話紀錄與工具清單，中途重連的外部工具（MCP）也會放回去（處理 `message-threads` 與 `tool_addition`）。 |
| **無法抓網頁內容（`WebFetch`）或呼叫外掛工具，直接報錯** | 系統預設使用自家的按需查工具指令與快取標記，別家模型收到不認識的欄位會拒絕執行。 | 自動把按需尋找工具的指令轉成外部模型能直接呼叫的形式，並依供應商設定拿掉對方不認得的附加欄位（改寫 `ToolSearch`；`stripCacheControl` 剝除 `cache_control`，下方提示詞會幫你打開）。 |
| **明明點名派 Gemini 子代理，帳單卻還是扣在 Claude 上** | 若設定檔設了允許模型白名單（`availableModels`）卻漏填外部模型，系統會默默換回預設的 Claude 模型。 | 在子代理啟動前與結束時雙重核對，被系統偷換就跳警告，提醒你把模型補進白名單。 |
| **手機遠端遙控（Remote Control）被鎖死，且狀態列顯示舊名字** | 手機遙控一旦發現預設連線網址被改動就會拒絕啟動。 | 打 `/provider rc on` 改走本機代理模式（新開的對話才生效）：模型請求照樣分流，手機遙控的流量直接交給 Anthropic。狀態列要用支援的自訂 statusline 才會顯示實際模型。 |

---

## 怎麼從零裝起來？三步完成，直接貼這段提示詞讓 AI 自動配到好

**先裝好 `magpie` 與 `model-relay` 兩個工具，再把下方的設定提示詞一個字都不用改、整段貼給 Claude Code，AI 就會偵測你開通的模型，問過你之後把設定寫好。**

這裡假設你已經裝好 Claude Code。不用擔心手改 JSON 設定檔會打錯字，照著下面三步走就能交給它自動配好：

## 第一步：安裝 `magpie` 並登入你想用的模型

Windows 與一般使用者直接到 [`usemagpie.ai`](https://usemagpie.ai) 下載桌面版最省事；macOS 或 Linux 使用者可在終端機執行：

```bash
# macOS / Linux 終端機安裝（Windows 與一般使用者直接從 usemagpie.ai 下載桌面版最省事）
curl -fsSL https://usemagpie.ai/install.sh | sh
```

打開 `magpie` 後，到選單的 `Providers → Add provider` 加模型：

1. **想用已付費的 ChatGPT**：電腦裝過 Codex 工具並已登入的話，`magpie` 會自動抓到；沒裝過就在這個畫面直接登入訂閱。
2. **想加 Gemini、GLM、DeepSeek**：挑廠商、貼上金鑰。Gemini 的金鑰到 Google AI Studio 申請，其他家到各自的官網後台申請。

## 第二步：在 Claude Code 裡安裝 `model-relay` 外掛

在終端機依序貼上這兩行指令安裝外掛（Claude Code 已經開著的話，裝完在對話框輸入 `/reload-plugins` 載入）：

```bash
claude plugin marketplace add cablate/model-relay
claude plugin install model-relay@model-relay
```

## 第三步：整段複製提示詞貼給 Claude Code 自動設定

外掛裝好後，把下面這段貼進 Claude Code。AI 會問你要加哪幾家、要不要開雜活分流與備援，並在寫入前請你確認。

```text
請幫我把這台電腦上的 model-relay 外掛與 magpie 串接起來，讓我可以在 Claude Code 裡直接呼叫外部模型當子代理。請依序完成這 4 件事。修改任何設定檔前，先用白話告訴我要改甚麼，等我確認後再寫入。需要我自己輸入的指令，直接告訴我要打甚麼。

1. 偵測我已開通的模型：檢查本機 magpie（預設 http://127.0.0.1:3425/v1/models；沒回應就先確認桌面版有開，或執行 magpie serve）目前有哪些模型，列出來問我要加入哪幾家。Google 的模型只用官方 AI Studio API Key，不要啟用 Antigravity 或 Gemini CLI 的訂閱轉發。
2. 用 model-relay 的設定工具寫入（外掛安裝目錄裡的 tools/setup.mjs，或請我輸入 /provider setup；不要請我把金鑰貼進對話）：把我選定的模型加進 ~/.claude/model-relay.json 的 providers，每家都連向本機 magpie、模型 ID 用 magpie models 列出的名稱，並設定 stripCacheControl: true 與清楚的 agent.description，讓主對話能點名 model-relay:<名稱> 子代理。如果終端機能直接執行 magpie，再為每家加上 launch: { "command": "magpie", "args": ["serve"] }；不能就告訴我，請我平常開著桌面版。
3. 問過我才決定的兩件事：要不要把日常雜活（haiku）交給最便宜的模型；Claude 額度滿時由哪家接手。設定工具會把第一家加進 failover.chain，我不要備援就把它清空，完成後列給我核對。
4. 檢查與實測：如果 ~/.claude/settings.json 設了 availableModels，把新增的外部模型補進去，避免子代理被默默換回 Claude。接著請我執行 /reload-plugins，再跑 /provider doctor --ping（轉發站還沒讀到新設定時先跑 /provider restart），確認每家模型都亮綠燈，最後用白話告訴我平常怎麼點名呼叫它們。
```

---

## 常見問題：設定與日常使用的三個實戰疑問

**子代理不會帶著你的長篇對話出門，但它能讀哪些檔案要靠設定鎖住；尖離峰分流、帳號安全與生圖需求，也都有對應的簡單做法。**

## 1. 說一句「給 Gemini 潤一次」，會不會把整個專案都送過去？
不會整包送，但要看它有沒有自己去翻。子代理在獨立對話裡啟動，不帶你的長篇歷史對話，靠主線交辦的任務開工；不過它預設繼承主線的工具，有權限就能自己讀專案裡的檔案。碰到客戶資料時，在 `model-relay` 把該子代理的工具限制成你要的範圍（`providers.<name>.agent.tools`），不給能執行指令的工具，再掛一道工具攔截規則（`PreToolUse` Hook）鎖住可讀的資料夾，這兩件事都可以直接請 Claude 幫你設定；API 金鑰這類字串再交給 `magpie` 的隱私遮罩在送出前換成代號。

## 2. 可以設定離峰時段優先用 DeepSeek、尖峰時段改用 Codex 嗎？
可以，直接請 Claude 幫你針對子代理呼叫設一條工具攔截規則（Hook）最穩：若離峰時段呼叫了非 DeepSeek 模型，或尖峰時段誤叫了 DeepSeek，規則就直接擋下並要求改派正確模型。詳細設定可參考〈[寫在 CLAUDE.md 也攔不住？為甚麼你叫子代理用便宜模型，帳單還是扣在最貴的 Opus 上](/articles/subagent-model-hook-guard/)〉。

## 3. 用訂閱轉接會有被封號的風險嗎？想叫外部模型生圖怎麼辦？
分廠牌看最清楚：Google Gemini 我一律只走官方 Google AI Studio 的 API 金鑰，不使用非官方訂閱反代以免帳號被封鎖；OpenAI 的 ChatGPT（Codex）是官方開放第三方工具登入，我是這樣用；實際方案與授權範圍以 OpenAI 當下公告為準。至於生圖需求，因為 Claude Code 對話通道是傳文字與工具呼叫，只要請 Claude 在終端機呼叫外部指令（如 `codex` CLI 或生圖腳本）把圖存進資料夾即可。

下次當你又準備切視窗、把同一段內容複製去別的網頁問另一家模型時，先停下來問自己兩件事：
1. **這家模型支援 Claude 訊息規格嗎？**（支援就用 `model-relay` 直連；不支援或想共用已登入的 ChatGPT 訂閱，就交給 `magpie` 轉換。）
2. **這件事要換主線，還是派個分身去跑就好？**（讓主線留在原地控場，直接點名子代理去跑，別再自己切視窗重貼背景。）
