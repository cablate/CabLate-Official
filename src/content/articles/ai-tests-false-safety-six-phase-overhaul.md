---
title: "AI 幫你寫的測試全綠，為甚麼上線還是壞掉？"
description: "871 支測試全綠，找回碼彈窗卻擋住核心流程兩天。從字串測試、刪錯測試到沒在跑的瀏覽器測試，拆解怎樣驗出測試有沒有保護功能；文末附可交給 AI 的唯讀盤點指令。"
publishDate: 2026-10-18
updatedDate: 2026-10-19
category: 技術觀點
tags: [AI 工程實戰, 測試策略, CI/CD, TypeScript, Claude Code]
readingTime: 7
draft: false
excerpt: "我以為八百多支測試足以擋住明顯故障，結果一張找回碼彈窗，讓老師開課、學生加入的核心流程卡住兩天。清查後才發現，有些測試只找原始碼裡的字，有些能抓問題卻沒在自動跑。"
problemTag: "871 支測試全綠，核心流程卻斷了兩天"
ogHighlight:
  label: "本機推送預檢"
  before: "超過 10 分鐘"
  after: "20 秒內"
---

**871 支測試全綠，仍然漏掉了擋在畫面中央的彈窗。要相信 AI 寫的測試，先確認功能壞掉時，有哪支測試會因此失敗。**

10 月中，我請 AI 在自己的即時互動教學系統加一個小功能：學生第一次輸入名字加入課堂時，彈出一張四位數「找回碼」小卡，讓他存成圖片。

功能寫好，測試全綠。合併上線後才發現，「老師開課＋學生加入」的核心流程，已經被那張新彈窗擋住兩天。

那時專案帳面上有 871 支測試、三十多道檢查，每次推送要等十幾分鐘。檢查很多，也很慢，卻沒擋下這種打開畫面就看得到的故障。

我叫 AI 停下來，重新盤點測試和 CI。這次整理最後讓本機推送預檢縮到 20 秒內，但我在意的改變，是能問清楚每一盞綠燈究竟證明了哪些事。

## 有些測試從來沒碰過它宣稱保護的功能

回頭看那支「守色彩對比度」的測試，它沒有算過顏色，只讀原始碼，檢查裡面有沒有 `--text-muted` 這個字串。

類似的測試，大致長這樣：

```js
const source = fs.readFileSync('src/features/reset.ts', 'utf8');
expect(source).toMatch(/reset_project_data_v2/);
```

這能證明檔案裡還有那串字。按鈕按下去會不會送出請求、資料有沒有重設，這兩行完全沒查。

我們盤點出一百三十多支這類字串檢查，還有另一種問題：測試檔自己抄一份簡化的產品邏輯，再驗證那份抄本。產品後來改壞，測試裡的抄本沒變，照樣通過。

| 測試怎樣驗證 | 通過能證明的範圍 | 仍可能漏掉的事 |
|---|---|---|
| 搜原始碼的函式名或字串 | 某段文字存在 | 函式沒被呼叫、按鈕沒反應 |
| 在測試裡重抄一份邏輯 | 抄本符合自己的斷言 | 產品實作用了另一條路徑 |
| 呼叫產品函式或操作真實畫面 | 指定輸入下得到指定結果 | 未涵蓋的分支、環境或互動 |

靜態檢查有自己的用途，例如禁止某種語法或鎖定依賴方向。問題出在把「某段文字存在」拿來當成「功能正常」的證據。

測試檔叫得再像整合測試，也得看它有沒有碰到要保護的行為。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 230" role="img" aria-labelledby="fakeTestTitle">
      <title id="fakeTestTitle">同一個壞掉的產品，字串測試照亮綠燈放行，行為測試當場亮紅燈攔截</title>
      <rect x="0" y="0" width="760" height="230" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="20" y="68" width="188" height="94" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="114" y="98" text-anchor="middle" font-size="14" font-weight="700" fill="#b4352f">產品功能壞掉</text>
      <text x="114" y="122" text-anchor="middle" font-size="12" fill="#253047" style="font-family:var(--font-mono)">if (true) return;</text>
      <text x="114" y="144" text-anchor="middle" font-size="12" fill="#5f687a">重設按鈕按了沒反應</text>
      <path d="M208 95 H258" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="258,90 266,95 258,100" fill="#b4352f"/>
      <path d="M208 140 H258" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="258,135 266,140 258,145" fill="#26734f"/>
      <rect x="266" y="28" width="248" height="78" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="282" y="56" font-size="13.5" font-weight="700" fill="#253047">AI 偷懶寫的「字串測試」</text>
      <text x="282" y="80" font-size="12" fill="#5f687a" style="font-family:var(--font-mono)">readFileSync() 找函式名</text>
      <path d="M514 67 H552" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="552,62 560,67 552,72" fill="#b4352f"/>
      <rect x="560" y="28" width="180" height="78" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="650" y="56" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b4352f">🟢 照亮綠燈（假安心）</text>
      <text x="650" y="80" text-anchor="middle" font-size="12" fill="#5f687a">字還在，壞程式碼放行上線</text>
      <rect x="266" y="124" width="248" height="78" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="282" y="152" font-size="13.5" font-weight="700" fill="#253047">真實「行為測試」</text>
      <text x="282" y="176" font-size="12" fill="#5f687a" style="font-family:var(--font-mono)">點擊按鈕 → 檢查 API 請求</text>
      <path d="M514 163 H552" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="552,158 560,163 552,168" fill="#26734f"/>
      <rect x="560" y="124" width="180" height="78" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="650" y="152" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">🔴 亮紅燈當場攔截</text>
      <text x="650" y="176" text-anchor="middle" font-size="12" fill="#26734f">請求沒送出，擋下故障</text>
    </svg>
  </div>
  <figcaption>讀原始碼比對字串的測試只管「檔案裡有沒有那個字」，功能壞了照樣綠燈；這個行為測試可抓到圖中請求未送出的故障。</figcaption>
</figure>

## AI 說另一支已經測過，先別急著刪

清理時，AI 告訴我：「A 測試跟 B 測試重複了，B 已經完整覆蓋，所以我把 A 刪掉，測試全綠！」

我不放心，手動把產品裡「儲存投影片樣式」的邏輯故意改壞，再跑一次。

結果其他測試全綠，只有它剛才想刪掉的 A 會失敗。

原來 B 在畫面掛載後，還沒等事件綁定完成就點了按鈕，也沒有有效查到樣式是否被儲存。AI 口中的「已覆蓋」，沒有經過這個故障的考驗。

因此，想拿 B 接替 A，至少得先做這一輪破壞驗證：

1. 在可還原的本機測試環境，列出 A 原本保護的行為與斷言。
2. 暫時改壞對應的產品邏輯，保留測試，確認這個故障確實被觸發。
3. 跑接手的 B，確認它因預期的行為錯誤而失敗，不能只看見任意紅燈就算數。
4. 還原產品程式，再跑相關測試確認通過，核對 A 其他保護是否也有人接手。

這屬於 mutation testing 的思路：暫時把產品改壞，檢驗測試能不能抓到。

**B 能抓到這一次故障，只證明它抓得到這一次。A 還有其他斷言，就得繼續核對，不能憑一個紅燈把整支刪掉。**

後來我們也抽查剩下的測試，暫時改壞分數判斷、權限拒絕與快取過期等邏輯，抓出只驗成功路徑的缺口。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 200" role="img" aria-labelledby="breakCheckTitle">
      <title id="breakCheckTitle">破壞驗證（Break-Check）四步閘門：故意改壞產品碼，確認指定故障與其餘斷言都有保護</title>
      <rect x="0" y="0" width="760" height="200" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="18" y="64" width="144" height="72" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="90" y="94" text-anchor="middle" font-size="13" font-weight="700" fill="#253047">① AI 想刪 A 測試</text>
      <text x="90" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">宣稱「B 已覆蓋」</text>
      <path d="M162 100 H186" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="186,95 194,100 186,105" fill="#6248c8"/>
      <rect x="194" y="64" width="164" height="72" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="276" y="94" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">② 故意改壞產品碼</text>
      <text x="276" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">把 A 守的功能註解掉</text>
      <path d="M358 100 H382" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="382,95 390,100 382,105" fill="#6248c8"/>
      <rect x="390" y="64" width="136" height="72" rx="8" fill="#fff7e8" stroke="#9b6017" stroke-width="1.5"/>
      <text x="458" y="94" text-anchor="middle" font-size="13" font-weight="700" fill="#9b6017">③ 只跑 B 測試</text>
      <text x="458" y="116" text-anchor="middle" font-size="11.5" fill="#9b6017">確認 B 因此故障失敗</text>
      <path d="M526 82 H564" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="564,77 572,82 564,87" fill="#26734f"/>
      <path d="M526 118 H564" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="564,113 572,118 564,123" fill="#b4352f"/>
      <rect x="572" y="24" width="170" height="68" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="657" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">B 紅 → 查其他斷言</text>
      <text x="657" y="72" text-anchor="middle" font-size="11.5" fill="#5f687a">還原後確認相關測試通過</text>
      <rect x="572" y="108" width="170" height="68" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="657" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">B 仍綠燈 → 不准刪</text>
      <text x="657" y="156" text-anchor="middle" font-size="11.5" fill="#b4352f">未抓此故障，先補保護</text>
    </svg>
  </div>
  <figcaption>不信 AI 的口頭「已覆蓋」：先故意改壞產品，親眼看到接手的測試亮紅燈，再核對其餘保護是否有人接手。</figcaption>
</figure>

## 能抓故障的測試，也可能根本沒在跑

另一批測試寫在專案裡，卻因為以前跑得慢，被移出自動執行名單。

我們重查二十多支這類瀏覽器測試，把不需要真實排版的案例移到較輕的環境，剩下需要瀏覽器的測試重新接進 PR 檢查。第一輪就出現十個失敗，抓到了開頭那張找回碼彈窗。

測試存在、能抓錯、會在適當時機執行，是三件需要分別確認的事。漏掉最後一件，前面做得再好也保護不到這次變更。

這也讓「跑太慢」成了必須處理的問題。原本本機推送前跑全套打包與測試，PR 再重跑，最需要的真後端雙端互動測試，卻等合併後才執行。

我們重新分配檢查的時間：

| 階段 | 這次重整後的安排 | 目的 |
|---|---|---|
| 本機修改與推送前 | 與改動相關的測試、型別和 Lint | 及早回饋，不讓每次推送都重跑所有慢檢查 |
| PR 合併前 | 必要建置、真後端與老師／學生雙端互動 | 核心流程故障要在合併前暴露 |
| 合併與部署 | 確認合併結果和部署環境需要的檢查 | 不把另一版本或另一環境的通過當作本次證據 |

當時本機推送預檢從十幾分鐘降到 20 秒內。這個數字只描述本機那一段，必要的整合測試仍在 PR 執行，沒有變成「20 秒驗完整個產品」。

也不用把每支測試都塞進每一次執行。每支測試都應有明確的觸發條件，交代哪類修改會跑它、哪些故障必須在合併前抓到，以及長期沒跑時由誰處理。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 280" role="img" aria-labelledby="pipelineTitle">
      <title id="pipelineTitle">重整前後的檢查階段與故障攔截位置</title>
      <rect x="0" y="0" width="760" height="280" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">檢查安排對照：先確認哪些保護在合併前執行</text>
      <text x="24" y="60" font-size="12.5" font-weight="700" fill="#b4352f">重整前：重複跑慢檢查，雙端測試卻太晚執行</text>
      <rect x="24" y="72" width="310" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="179" y="96" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b4352f">本機：完整檢查</text>
      <text x="179" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">全套測試、打包與 DB</text>
      <rect x="340" y="72" width="236" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="458" y="96" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b4352f">PR：重跑檢查</text>
      <text x="458" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">重複打包與測試</text>
      <rect x="582" y="72" width="154" height="58" rx="6" fill="#b4352f"/>
      <text x="659" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#fffdf8">合併後才測雙端</text>
      <text x="659" y="116" text-anchor="middle" font-size="11.5" fill="#fff1ef">故障太晚暴露</text>
      <line x1="24" y1="152" x2="736" y2="152" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="178" font-size="12.5" font-weight="700" fill="#26734f">重整後：本機預檢縮到 20 秒內，整合驗證留在 PR</text>
      <rect x="24" y="190" width="96" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="72" y="214" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">本機預檢</text>
      <text x="72" y="234" text-anchor="middle" font-size="11.5" fill="#5f687a">20 秒內</text>
      <rect x="126" y="190" width="196" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="2"/>
      <text x="224" y="214" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">PR 整合檢查</text>
      <text x="224" y="234" text-anchor="middle" font-size="11.5" fill="#253047">必要建置與雙端測試</text>
      <rect x="328" y="190" width="104" height="58" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="380" y="214" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">合併檢查</text>
      <text x="380" y="234" text-anchor="middle" font-size="11.5" fill="#5f687a">核對版本與環境</text>
      <text x="452" y="215" font-size="13" font-weight="700" fill="#26734f">圖中寬度不代表時間比例</text>
      <text x="452" y="235" font-size="12" fill="#5f687a">不可把本機結果當全產品驗證</text>
    </svg>
  </div>
  <figcaption>本機 20 秒內只描述本機預檢；必要整合測試仍在 PR 執行，長條寬度不代表實測耗時比例。</figcaption>
</figure>

## 能由工具擋下的錯，別只留在提醒文件

這次盤點還有一個發現。我們原本寫了九份、近千行的原則文件，提醒 AI 別亂傳 ID、別寫讀原始碼的功能測試，結果仍會再犯。

於是我們把能明確判斷的規則交給工具。不同種類的 ID 用 Branded Types 區分，讓型別檢查能抓出部分混用；禁止的測試寫法交給 ESLint；依賴方向由工具檢查。仍需執行才知道的業務結果，交給行為測試。

這些工具各有適用範圍。型別檢查能擋住被型別表達出的錯誤，無法證明使用者能順利完成課堂流程；靜態規則能抓違規寫法，不能替瀏覽器看彈窗有沒有擋住畫面。

把適合機械判斷的事交給工具，才有空把測試留給需要跑起來才能知道的事。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 310" role="img" aria-labelledby="constraintTitle">
      <title id="constraintTitle">五層約束階梯：以架構、型別、靜態規則、測試與文字指引分別處理</title>
      <rect x="0" y="0" width="760" height="310" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">依錯誤類型選擇檢查方式，每一層都有適用範圍</text>
      <path d="M38 272 V62" stroke="#6248c8" stroke-width="3" fill="none"/>
      <polygon points="32,66 38,52 44,66" fill="#6248c8"/>
      <rect x="62" y="48" width="490" height="42" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="78" y="74" font-size="13.5" font-weight="700" fill="#6248c8">① 架構消除：移除危險入口，Store 外部唯讀</text>
      <rect x="564" y="48" width="172" height="42" rx="6" fill="#6248c8"/>
      <text x="650" y="74" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fffdf8">減少危險入口</text>
      <rect x="62" y="98" width="490" height="42" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="78" y="124" font-size="13.5" font-weight="700" fill="#26734f">② 編譯期型別：6 種 ID 貼互斥標籤（Branded Types）</text>
      <rect x="564" y="98" width="172" height="42" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="650" y="124" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">型別檢查時發現</text>
      <rect x="62" y="148" width="490" height="42" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="78" y="174" font-size="13.5" font-weight="700" fill="#253047">③ 語法樹與依賴圖：ESLint 禁讀原始碼、鎖單向依賴</text>
      <rect x="564" y="148" width="172" height="42" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="650" y="174" text-anchor="middle" font-size="12.5" font-weight="700" fill="#253047">靜態檢查時發現</text>
      <rect x="62" y="198" width="490" height="42" rx="6" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="78" y="224" font-size="13.5" font-weight="700" fill="#9b6017">④ 行為測試：通過破壞驗證的業務與雙端互動測試</text>
      <rect x="564" y="198" width="172" height="42" rx="6" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="650" y="224" text-anchor="middle" font-size="12.5" font-weight="700" fill="#9b6017">執行行為時發現</text>
      <rect x="62" y="248" width="490" height="42" rx="6" fill="#fff1ef" stroke="#efb4ae"/>
      <text x="78" y="274" font-size="13.5" font-weight="700" fill="#b4352f">⑤ 純文字提醒：寫在 CLAUDE.md / AGENTS.md 的口頭規定</text>
      <rect x="564" y="248" width="172" height="42" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="650" y="274" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">需確認是否遵守</text>
    </svg>
  </div>
  <figcaption>能明確表達的規則交給對應工具；工具通過仍不能代替實際流程驗證。</figcaption>
</figure>

若要把本文的判準用在自己的工作，可參考[AI 工作流健檢](/expertise/)的適用範圍。

相關問題可接著看〈[Claude Code 實戰：我怎麼用 AI 寫完一整個網站](/articles/claude-code-workflow/)〉。

## 先拿一支測試來查，別叫 AI 整包刪掉

下一次看到 AI 回報測試全綠，可以先挑一個最在意的功能，問三個問題：

- 它壞掉時，哪支測試會因對應原因失敗？
- 那支測試有沒有在這次變更合併前執行？
- 這份通過結果，對應的是哪個版本和環境？

若要請 AI 幫忙盤點，可以直接貼下面這段。第一輪先看證據，再決定動哪些檔案。

```text
請對這個專案做測試與 CI 的唯讀盤點，先不要修改檔案、刪測試或更改 CI。

1. 找出讀原始碼比對字串、在測試裡重抄產品邏輯的案例。逐支列出檔案、斷言、實際呼叫的產品邏輯，以及能證明和不能證明的行為。靜態規則有明確用途時，保留用途說明，勿直接判成無用。
2. 對照本機、PR、合併後的實際執行指令，列出沒被觸發的測試與重複檢查。耗時沒有紀錄就標未知，勿估成實測。
3. 挑一個核心使用流程，列出目前誰在測、在哪個階段跑、測試是否操作真實產品。缺證據的地方明列。
4. 提議第一批少量修改，說明原有保護由誰接手、準備用哪些可還原的故障確認接手測試有效，以及還原後要跑哪些相關檢查。單一故障被抓到不能當成全部覆蓋。先交提案，不執行破壞驗證。
```

這次讓我改掉的習慣，是看到數百支綠燈就放心。現在我會先追其中一支，確認它在功能壞掉時會叫，而且會在需要的時候被執行。

想接著看同一種核對方式怎樣用在沒有原始碼的系統，可以讀〈[帶 AI 救活 2012 年老遊戲：報錯消失後，我們差點改壞原版任務](/articles/legacy-2012-mmorpg-reverse-engineering-with-multi-model-ai/)〉。我們曾把客戶端報錯修乾淨，卻差點改壞服務端的任務。
