---
title: "Agent SDK 每句吃 2–3% 額度：我怎麼從失敗修法追到快取問題"
description: "2026 年 3 月，我用 Claude Agent SDK v0.2.76 追查短訊息的高消耗：擋 diff 沒讓快取改善，改用當時的 V2 後升到 84%。保留實驗數據，也交代 V2 已移除後該怎麼判斷。"
publishDate: 2026-03-25
updatedDate: 2026-10-29
category: 技術觀點
tags: [Claude Agent SDK, prompt caching, 逆向工程, token 成本優化, Claude Code]
readingTime: 10
draft: false
excerpt: "擋掉 system-reminder 的 diff，快取仍只有 15–25%。這次追查讓我分清楚少送內容與沿用快取，也留下不能直接照抄到新版的歷史修法。"
problemTag: "Agent SDK 短訊息仍大量耗額度"
ogHighlight:
  label: "2026 年 3 月實驗"
  before: "原呼叫方式 15–25%"
  after: "當時 V2 第 4 則 84%"
---

用 Claude Agent SDK 跑多代理系統，每則訊息只有幾個字，卻吃掉 2–3% 的五小時額度。同一段對話換到 Claude Code CLI，resume 後只有第一則高，後面卻降到 1% 以下。

這是我在 2026 年 3 月遇到的狀況。我花了幾天逆向約 12MB 的 minified JavaScript，先找到重複注入檔案 diff 的機制，以為擋掉它就好了，結果改完快取數字還是沒變好。那次失敗讓我分清楚，**少送了一段內容，和原本的大段內容有沒有沿用快取，要分開量。**

> 版本：SDK v0.2.76、Claude Code v2.1.71（2026 年 3 月）。V2 session API 後來在 SDK 0.3.142 移除，文中的 V2 修法是當時的做法。

## 幾個字的訊息，為甚麼需要處理那麼多 tokens？

**因為每次送出的還有前面的對話、工具定義和環境資訊。** 你畫面上打的字，只佔其中一小段。

當時我的程式每送一則訊息，就重新呼叫 V1 `query()` 並帶上 `resume`，每次都會啟動新的 `cli.js` 程序、從 JSONL 對話紀錄還原狀態再組裝請求；CLI 互動模式則是同一個程序持續存活。

這個差異給了我追查方向。Prompt cache 存在服務端，只要送出的可快取前綴相同、還在保存時間內並符合命中條件，換一個本機程序仍可能命中，所以真正要查的，是重建過程**把請求內容改了哪裡**。

## 重建狀態時，到底是甚麼改動了請求？

**resume 重建檔案狀態時，可能讓檔案 diff 再次塞進請求。**

當時的 `cli.js` 有張 `readFileState` 記錄讀寫過的檔案，執行環境會比對檔案時間與內容，必要時把變更 diff 包進 `<system-reminder>` 送給模型。那個版本從歷史重建追蹤資料時，會收集無 `offset`、無 `limit` 的完整 Read，以及帶路徑和 `content` 的 Write；每次呼叫並 resume 都可能重跑這段重建。

這說明了重複注入的來源，但還不算全部額度消耗的原因。依 [Claude API 官方快取文件](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)，前綴按 `tools → system → messages` 組成，變動點以前符合條件的快取仍可能沿用，變動點之後才可能要重新處理，不能把任何差異都說成整包歸零。即使 diff 只多幾百 tokens，改到前面大段前綴影響就大，只追加在最後則前面仍可能命中；如下圖，程序重開只是線索，得核對實際請求的普通輸入、讀取與建立。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 310" role="img" aria-labelledby="cacheBreakTitle">
      <title id="cacheBreakTitle">可快取前綴由 tools、system、messages 組成，需核對實際差異</title>
      <text x="24" y="30" font-size="13" font-weight="700" fill="#5f687a">可快取前綴與變動位置示意</text>
      <rect x="24" y="44" width="336" height="48" rx="8" fill="#eef7f1" stroke="#aed7be"/>
      <text x="40" y="66" font-size="14" font-weight="700" fill="#26734f">tools 工具定義</text>
      <text x="40" y="84" font-size="12.5" fill="#5f687a">符合條件的前綴可能命中</text>
      <rect x="24" y="100" width="336" height="48" rx="8" fill="#eef7f1" stroke="#aed7be"/>
      <text x="40" y="122" font-size="14" font-weight="700" fill="#26734f">system 系統指令</text>
      <text x="40" y="140" font-size="12.5" fill="#5f687a">接在 tools 之後</text>
      <rect class="flow-edge" x="24" y="156" width="336" height="66" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="40" y="178" font-size="14" font-weight="700" fill="#b4352f">messages 對話與環境資訊</text>
      <text x="40" y="196" font-size="12.5" fill="#5f687a">需逐次比對實際內容</text>
      <text x="40" y="214" font-size="12.5" fill="#b4352f">不能由 spawn 推定差異</text>
      <rect x="24" y="230" width="336" height="48" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="40" y="252" font-size="14" font-weight="700" fill="#253047">差異位置之後的內容</text>
      <text x="40" y="270" font-size="12.5" fill="#5f687a">可能需要重新處理</text>
      <path class="flow-edge" d="M364 189 H392" stroke="#b4352f" stroke-width="2" fill="none"/>
      <path d="M392 183 L404 189 L392 195 Z" fill="#b4352f"/>
      <rect x="410" y="60" width="288" height="62" rx="8" fill="#fffdf8" stroke="#253047"/>
      <text x="426" y="84" font-size="14" font-weight="700" fill="#253047">快取前綴比對</text>
      <text x="426" y="104" font-size="12.5" fill="#5f687a">依實際請求與保存條件判斷</text>
      <path d="M554 122 V146" stroke="#b4352f" stroke-width="2" fill="none"/>
      <path d="M548 146 L554 156 L560 146 Z" fill="#b4352f"/>
      <rect class="pulse-node" x="410" y="158" width="288" height="76" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="426" y="182" font-size="14" font-weight="700" fill="#b4352f">假設這裡真的有差異</text>
      <text x="426" y="202" font-size="12.5" fill="#5f687a">差異前的前綴仍可能命中</text>
      <text x="426" y="222" font-size="12.5" fill="#b4352f">需核對普通輸入、讀取與建立</text>
      <rect x="410" y="246" width="288" height="52" rx="8" fill="#eef7f1" stroke="#aed7be"/>
      <text x="426" y="268" font-size="13" font-weight="700" fill="#26734f">程序生命週期只是調查線索</text>
      <text x="426" y="286" font-size="12.5" fill="#5f687a">是否命中仍看實際請求</text>
    </svg>
  </div>
  <figcaption>此圖改為條件示意，未定位當年請求的唯一差異點；新程序不會自行清除服務端快取。</figcaption>
</figure>

## 把可疑的注入關掉，有改善嗎？

**沒有，快取讀取比例仍停在 15–25%，大量重建並未消失。**

我先試了兩件事：一是設 `CLAUDE_CODE_REMOTE=1`，利用該版本的內部條件減少 git status 注入；二是在 resume 前處理 JSONL（下稱 sanitizer），避開部分檔案追蹤的收集條件。後者非官方支援且會改動對話歷史，細節與代價另寫在〈[擋掉 diff，為甚麼還沒省到額度？](/articles/agent-sdk-system-reminder-diff-fix/)〉。

我在同一個 session 連續送短訊息（間隔約 11–90 秒），留下這組比較：

| 紀錄條件 | cacheRead | cacheCreation | 原紀錄的快取比例 |
|---|---:|---:|---:|
| 設定 `CLAUDE_CODE_REMOTE=1` | 8,624 | 48,661 | 15% |
| 設定 `CLAUDE_CODE_REMOTE=1` | 11,945 | 45,499 | 21% |
| 未設定該變數 | 15,294 | 45,724 | 25% |
| 未設定該變數 | 15,294 | 45,735 | 25% |

讀取快取維持在 8.6K–15.3K，建立快取仍約 45K–49K。我能下的判斷很具體，**這次修法沒有用量改善的證據，不能因為 diff 少了，就宣稱成本問題修好了。**

在這幾次請求裡，關掉可疑來源沒讓大量重建消失，這逼我改試讓程序持續存活。

## 後來改用 V2，數字怎麼變？

**改成持續存活的 V2 session 後，快取讀取比例在第 4 則升到 84%。**

v0.2.76 有實驗性的 `unstable_v2_createSession()`，讓單一 `cli.js` 程序常駐並走 `stdin / stdout` 接收後續訊息，不必每則重新啟動並還原。當時 V2 選項不夠用，為接回原系統，我還直接修補 `sdk.mjs`，轉發工作目錄、設定來源、thinking 與執行限制、額外參數及 MCP 連線資料，也增加了升級維護成本。

切換後的四列紀錄：

| 訊息 | cacheRead | cacheCreation | 原紀錄的快取比例 |
|---|---:|---:|---:|
| 第 1 則 | 11,689 | 45,974 | 20% |
| 第 2 則 | 69,352 | 46,108 | 60% |
| 第 3 則 | 127,149 | 46,208 | 73% |
| 第 4 則 | 402,087 | 78,011 | 84% |

第四列約等於 `402087 / (402087 + 78011)`，是快取讀取占比，不是費用比例。當時五小時額度消耗也跟著降下來。

這次比較支持當時的整體改法有幫助，但未逐項隔離程序生命週期、選項修補和請求組裝的影響，也未定位唯一造成失效的字元。下圖對照三種模式：CLI（close 再 resume 才重建）與 V2 皆為單一程序常駐，V1 `query()` 則是每則重新 spawn。

<figure class="article-diagram" data-diagram>
  <div class="article-diagram__head">
    <button type="button" class="diagram-mode" data-mode="cli">CLI 互動模式</button>
    <button type="button" class="diagram-mode is-active" data-mode="v1">SDK V1 query()</button>
    <button type="button" class="diagram-mode" data-mode="v2">SDK V2 persistent</button>
  </div>
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 300" role="img" aria-labelledby="archCompareTitle">
      <title id="archCompareTitle">CLI 互動模式、SDK V1 與 V2 的 process 生命週期與 cache 行為對比</title>
      <g data-pane="cli" style="display:none">
        <rect x="24" y="96" width="128" height="64" rx="8" fill="#f8f5ed" stroke="#253047"/>
        <text x="88" y="122" text-anchor="middle" font-size="14" font-weight="700" fill="#253047">你的程式</text>
        <text x="88" y="142" text-anchor="middle" font-size="12" fill="#5f687a">終端機互動</text>
        <path d="M156 128 H196" stroke="#5f687a" stroke-width="1.5" fill="none"/>
        <path d="M196 122 L208 128 L196 134 Z" fill="#5f687a"/>
        <rect x="216" y="88" width="296" height="80" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
        <text x="364" y="116" text-anchor="middle" font-size="14" font-weight="700" fill="#26734f">同一個 cli.js process 常駐</text>
        <text x="364" y="138" text-anchor="middle" font-size="12.5" fill="#5f687a">同一程序可持續接收訊息</text>
        <text x="364" y="156" text-anchor="middle" font-size="12" fill="#5f687a">（close 再 resume 才會重建）</text>
        <path d="M520 128 H560" stroke="#5f687a" stroke-width="1.5" fill="none"/>
        <path d="M560 122 L572 128 L560 134 Z" fill="#5f687a"/>
        <rect x="580" y="96" width="116" height="64" rx="8" fill="#f8f5ed" stroke="#253047"/>
        <text x="638" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="#253047">Anthropic API</text>
        <rect x="24" y="248" width="672" height="40" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="360" y="273" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">當時 CLI 第 2 則起低於 1% 額度，非費率比較</text>
      </g>
      <g data-pane="v1">
        <rect x="24" y="96" width="128" height="64" rx="8" fill="#f8f5ed" stroke="#253047"/>
        <text x="88" y="122" text-anchor="middle" font-size="14" font-weight="700" fill="#253047">你的程式</text>
        <text x="88" y="142" text-anchor="middle" font-size="12" fill="#5f687a">SDK query()</text>
        <path d="M156 128 H196" stroke="#5f687a" stroke-width="1.5" fill="none"/>
        <path d="M196 122 L208 128 L196 134 Z" fill="#5f687a"/>
        <rect x="216" y="36" width="296" height="52" rx="8" fill="#fffdf8" stroke="#b4352f" stroke-dasharray="5 4"/>
        <text x="232" y="58" font-size="13" font-weight="700" fill="#253047">cli.js process #1</text>
        <text x="232" y="76" font-size="12" fill="#5f687a">spawn → 組 request → 結束</text>
        <rect x="216" y="100" width="296" height="52" rx="8" fill="#fffdf8" stroke="#b4352f" stroke-dasharray="5 4"/>
        <text x="232" y="122" font-size="13" font-weight="700" fill="#253047">cli.js process #2</text>
        <text x="232" y="140" font-size="12" fill="#5f687a">spawn → 組 request → 結束</text>
        <rect x="216" y="164" width="296" height="52" rx="8" fill="#fffdf8" stroke="#b4352f" stroke-dasharray="5 4"/>
        <text x="232" y="186" font-size="13" font-weight="700" fill="#253047">cli.js process #3</text>
        <text x="232" y="204" font-size="12" fill="#5f687a">spawn → 組 request → 結束</text>
        <text x="364" y="238" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">當時逐輪呼叫並 resume 的使用方式</text>
        <path d="M520 128 H560" stroke="#5f687a" stroke-width="1.5" fill="none"/>
        <path d="M560 122 L572 128 L560 134 Z" fill="#5f687a"/>
        <rect x="580" y="96" width="116" height="64" rx="8" fill="#f8f5ed" stroke="#253047"/>
        <text x="638" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="#253047">Anthropic API</text>
        <rect x="24" y="248" width="672" height="40" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
        <text x="360" y="273" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b4352f">當時每則 2–3% 額度，快取讀取比例約 15–25%</text>
      </g>
      <g data-pane="v2" style="display:none">
        <rect x="24" y="96" width="128" height="64" rx="8" fill="#f8f5ed" stroke="#253047"/>
        <text x="88" y="122" text-anchor="middle" font-size="14" font-weight="700" fill="#253047">你的程式</text>
        <text x="88" y="142" text-anchor="middle" font-size="12" fill="#5f687a">V2 createSession()</text>
        <path d="M156 128 H196" stroke="#5f687a" stroke-width="1.5" fill="none"/>
        <path d="M196 122 L208 128 L196 134 Z" fill="#5f687a"/>
        <rect x="216" y="88" width="296" height="80" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
        <text x="364" y="114" text-anchor="middle" font-size="14" font-weight="700" fill="#6248c8">V2 session · 單一 process 常駐</text>
        <text x="364" y="136" text-anchor="middle" font-size="12.5" fill="#5f687a">stdin / stdout 通訊，不重新 spawn</text>
        <text x="364" y="154" text-anchor="middle" font-size="12" fill="#5f687a">（歷史 API，現已移除）</text>
        <path d="M520 128 H560" stroke="#5f687a" stroke-width="1.5" fill="none"/>
        <path d="M560 122 L572 128 L560 134 Z" fill="#5f687a"/>
        <rect x="580" y="96" width="116" height="64" rx="8" fill="#f8f5ed" stroke="#253047"/>
        <text x="638" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="#253047">Anthropic API</text>
        <rect x="24" y="248" width="672" height="40" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="360" y="273" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">當時第 4 則快取讀取比例 84%，不等於省費用 84%</text>
      </g>
    </svg>
  </div>
  <figcaption>保留三模式切換元件，比較當時的程序生命週期。V2 已移除，圖中結果限於原案，無法單獨證明因果。</figcaption>
</figure>

## 今天遇到相同問題，還要 patch V2 嗎？

**不用，V2 已移除；先看目前 SDK 支援的多輪方式，再量你自己的呼叫路徑。**

2026-10-29 查閱的 [官方 V2 文件](https://code.claude.com/docs/en/agent-sdk/typescript-v2-preview)與 [SDK CHANGELOG](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)都寫明：V2 自 0.2.133 棄用，0.3.142 移除。官方改建議使用 `query()`，多輪可傳入 `AsyncIterable<SDKUserMessage>`；接續已保存對話則使用 `options.resume`。因此「V1 必然 miss，V2 是唯一解」已不能當成選型建議，當年的 patch 也不能只換個套件版本繼續套（同版本的逆向追查見〈[我逆向了 Claude Code v2.1.71，找到 token 消耗暴增的根因](/articles/claude-code-token-drain-system-reminder/)〉）。

若你仍是每輪重新呼叫並 resume，可先用小型對話，固定模型、工具、工作目錄和訊息間隔，比較這條路徑與官方支援的持續輸入方式，記下各輪實際用量；同時確認工具權限、MCP 與中斷恢復仍正常，別只看命中率變漂亮（如〈[AI 幫你寫的測試全綠，為甚麼上線還是壞掉？](/articles/ai-tests-false-safety-six-phase-overhaul/)〉所談，只看單一指標容易漏掉問題；要把本文判準用在工作上，可參考[課程與工程手冊](/courses/)的適用範圍）。

## 怎麼判斷這次真的修到了？

**同時看讀取、建立與普通輸入，並比較完成相同任務的結果。**

Claude API 的輸入用量可以這樣讀：

```text
全部輸入 = input_tokens
         + cache_creation_input_tokens
         + cache_read_input_tokens

快取讀取比例 = cache_read_input_tokens / 全部輸入
```

SDK 的彙總欄位名稱可能不同，要按你所用版本的定義對應，避免把逐輪值和累計值混在一起。比例低，可能是第一輪、剛換工具、超過保存時間，或任務本來就一直在讀新資料；比例高，也可能只是反覆處理沒幫助的舊內容，因此沒有一條「低於 50% 就是在燒錢」的通用線。

那次追查裡，逆向幫我找到可疑機制，A/B 數據卻逼我承認第一版修法還沒解決問題。下次遇到短訊息異常昂貴，先留一組固定條件的前後用量：**改完之後，大量建立快取的情況，有沒有在後續幾輪下降？** 這個答案，比「我關掉了幾個注入來源」更能幫你決定要不要保留修法。
