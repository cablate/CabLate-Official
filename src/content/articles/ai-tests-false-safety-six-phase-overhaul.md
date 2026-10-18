---
title: "AI 幫你寫的測試全綠，為什麼上線還是壞掉？"
description: "871 支測試全綠，核心流程卻斷了兩天。拆解 AI 最常寫出的假測試、如何用破壞驗證抓出漏網之魚、把預檢從十幾分鐘壓到 20 秒內，文末附可直接貼給 AI 的體檢 Prompt。"
publishDate: 2026-10-18
updatedDate: 2026-10-19
category: 技術觀點
tags: [AI 工程實戰, 測試策略, CI/CD, TypeScript, Claude Code]
readingTime: 10
draft: false
excerpt: "871 支測試全綠，卻連畫面被彈窗擋死兩天都抓不到。這篇順著我們踩過的坑，拆開 AI 假測試的長相、怎麼親眼驗出測試有沒有用，並附上一份可直接貼給 AI 的體檢 Prompt。"
problemTag: "871 支測試全綠，核心流程卻斷了兩天"
ogHighlight:
  label: "本機推送預檢"
  before: "超過 10 分鐘"
  after: "20 秒內"
---

用 AI 寫程式一段時間之後，多數人都會養出一個習慣：別只聽它說「改好了」，要叫它補測試、看綠燈。這個習慣是對的。但我想潑你一點冷水，AI 寫出來的綠燈也會騙人，而且騙得比沒寫測試還徹底。

10 月中，我請 AI 在自己的即時互動教學系統加一個很單純的小功能（老師在台上播放投影片、台下學生掃碼進來投票搶答那種）：學生第一次輸入名字加入課堂時，畫面先彈出一張四位數「找回碼」小卡讓他存成圖片。功能很快寫好，我按下 `git push`，本機的幾百支單元測試與靜態檢查全部綠燈。

結果一開 PR，雲端檢查卻因為一行提示字的色彩對比沒達標而亮紅燈；等修好合併上線，才發現連雲端資料庫的「老師開課＋學生加入」核心流程，早就因為那張新彈窗擋在畫面正中央而卡死兩天。那時這個專案帳面上有 871 支測試、三十多道檢查關卡、九份工程原則文件，每次推送要等十幾分鐘，卻連最基本的「畫面被彈窗擋死」都沒抓到。

我叫 AI 全部停下來，把整條驗證流程砍掉重練。下面順著我們一路追問的順序，拆開這座假安心屎山是怎麼長出來的，以及怎麼把它徹底清乾淨。

---

## 測試明明寫了八百多支，為什麼連畫面壞掉都抓不到？

因為 AI 為了省事，根本沒把畫面跑起來，只是把原始碼當純文字讀進來找變數名。

當我回頭去查那支「專門守色彩對比度」的單元測試為什麼沒叫，才發現它從頭到尾沒有算過半個顏色。它只是把原始碼檔案讀進來，用正規表示式檢查裡面有沒有寫 `--text-muted` 這個 CSS 變數名稱。只要變數名字還在，就算顏色在白底上淡到肉眼看不見，測試永遠綠燈。

你叫 AI「幫這個功能補測試」卻沒限制寫法時，掛載畫面、模擬點擊太麻煩了，它最愛直接寫這三行：

```js
const source = fs.readFileSync('src/features/reset.ts', 'utf8');
expect(source).toMatch(/reset_project_data_v2/);
```

這種測試跑起來只要 0.01 秒，永遠不會因為環境問題失敗，帳面數字又漂亮。但它守的是檔案裡的字，跟使用者看到的功能毫無關係。有人在上面加一行 `if (true) return;` 讓功能徹底失效，它照樣綠燈；反過來你重構程式碼、把邏輯抽去共用函式，功能完全沒變，它卻馬上亮紅燈罵你。我們一盤點，八百多支裡竟然有一百三十多支在幹這件事。

更隱蔽的還有兩種。一種是「抄本測試」，AI 懶得掛載真實元件，乾脆在測試檔裡自己重抄一份簡化版的計算邏輯，每天在 CI 裡自己測自己、自己亮綠燈。另一種是檢查畫面上「不要出現某句錯誤提示」，結果那句文案幾個月前早就改版刪掉了，就算畫面整片白屏，這條測試在宇宙毀滅前也都會是綠燈。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 300" role="img" aria-labelledby="fakeTestTitle">
      <title id="fakeTestTitle">同一個改壞的產品，行為測試會亮紅燈，讀原始碼比對字串的測試永遠綠燈</title>
      <text x="24" y="28" font-size="13" font-weight="700" fill="#5f687a">同一個改壞的產品，兩種測試的結果</text>
      <rect class="pulse-node" x="24" y="96" width="216" height="112" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="40" y="122" font-size="15" font-weight="700" fill="#b4352f">產品邏輯被改壞</text>
      <text x="40" y="146" font-size="12.5" fill="#253047" style="font-family:var(--font-mono)">if (true) return;</text>
      <text x="40" y="168" font-size="12.5" fill="#5f687a">重設 API 從此不會被執行</text>
      <text x="40" y="188" font-size="12.5" fill="#b4352f">使用者看到的功能實際上壞了</text>
      <path class="flow-edge" d="M240 130 H288" stroke="#5f687a" stroke-width="2" fill="none"/>
      <path d="M288 124 L300 130 L288 136 Z" fill="#5f687a"/>
      <path class="flow-edge" d="M240 190 H288" stroke="#5f687a" stroke-width="2" fill="none"/>
      <path d="M288 184 L300 190 L288 196 Z" fill="#5f687a"/>
      <rect x="304" y="44" width="392" height="108" rx="8" fill="#eef7f1" stroke="#aed7be"/>
      <text x="320" y="70" font-size="14" font-weight="700" fill="#26734f">行為測試（渲染畫面、模擬點擊、看請求）</text>
      <text x="320" y="94" font-size="12" fill="#5f687a" style="font-family:var(--font-mono)">mount() → click('#reset') → assert api url</text>
      <text x="320" y="122" font-size="13.5" font-weight="700" fill="#26734f">● 亮紅燈，抓到了</text>
      <rect x="304" y="168" width="392" height="108" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
      <text x="320" y="194" font-size="14" font-weight="700" fill="#b4352f">字串比對測試（讀原始碼找變數名）</text>
      <text x="320" y="218" font-size="12" fill="#5f687a" style="font-family:var(--font-mono)">readFileSync('reset.ts') → match /reset_v2/</text>
      <text x="320" y="246" font-size="13.5" font-weight="700" fill="#b4352f">● 保持綠燈，字串還在檔案裡</text>
      <text x="320" y="266" font-size="12.5" fill="#5f687a">產品壞掉它照樣通過，還會擋你重構</text>
    </svg>
  </div>
  <figcaption>同一個壞掉的產品，行為測試會亮紅燈擋下來；讀原始碼比對字串的測試因為字串還在，永遠綠燈。</figcaption>
</figure>

---

## 那我叫 AI 把假測試刪掉重寫，總可以了吧？

直接叫它刪更危險，因為它連「別處已經測過了」都會看走眼。

開始清理的第一天，AI 讀完程式碼很開心地跟我回報：「A 測試跟 B 測試重複了，B 已經完整覆蓋，所以我把 A 刪掉，測試全綠！」我不放心，手動把產品程式碼裡「儲存投影片樣式」的那行邏輯故意改壞，再跑一次測試。結果全專案所有測試竟然一片綠燈，只有它剛才想刪掉的那支 A 測試會亮紅燈。

我不覺得這是模型故意偷懶。你叫它讀程式碼判斷有沒有覆蓋，它看到兩邊都呼叫了同一個元件就以為測過了，卻沒看出其中一邊在畫面掛載後還沒等事件綁定好，就急著發送滑鼠事件，從頭到尾都在測空氣。

所以我們立下一條死規矩，不看 AI 的口頭保證，只看破壞驗證（Break-Check）。想刪掉或改寫任何一支測試，必須先去把產品程式碼故意改壞，親眼看著接手的測試亮紅燈，再把產品程式碼還原確認全綠，這時候才准動刀。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 320" role="img" aria-labelledby="breakCheckTitle">
      <title id="breakCheckTitle">Break-Check 流程：刪測試前先故意改壞產品，證明接手的測試會亮紅燈，才准刪</title>
      <rect x="24" y="24" width="220" height="56" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="40" y="48" font-size="14" font-weight="700" fill="#253047">① 想刪測試 A</text>
      <text x="40" y="68" font-size="12" fill="#5f687a">AI 說「B 已經覆蓋了」</text>
      <path class="flow-edge" d="M134 80 V96" stroke="#5f687a" stroke-width="2" fill="none"/>
      <path d="M128 96 L134 108 L140 96 Z" fill="#5f687a"/>
      <rect x="24" y="108" width="220" height="64" rx="8" fill="#f1edff" stroke="#b8afc9"/>
      <text x="40" y="132" font-size="14" font-weight="700" fill="#6248c8">② 故意改壞 A 保護的產品碼</text>
      <text x="40" y="156" font-size="12" fill="#5f687a">條件反轉、把 API 呼叫註解掉</text>
      <path class="flow-edge" d="M134 172 V188" stroke="#5f687a" stroke-width="2" fill="none"/>
      <path d="M128 188 L134 200 L140 188 Z" fill="#5f687a"/>
      <rect x="24" y="200" width="220" height="56" rx="8" fill="#f1edff" stroke="#b8afc9"/>
      <text x="40" y="224" font-size="14" font-weight="700" fill="#6248c8">③ 只跑接手的 B 測試</text>
      <text x="40" y="244" font-size="12" fill="#5f687a">其他都不動</text>
      <path class="flow-edge" d="M244 228 H300" stroke="#9b6017" stroke-width="2" fill="none"/>
      <path d="M300 222 L312 228 L300 234 Z" fill="#9b6017"/>
      <rect x="312" y="188" width="152" height="80" rx="12" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="388" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#9b6017">B 亮紅燈了嗎？</text>
      <text x="388" y="246" text-anchor="middle" font-size="12" fill="#5f687a">看證據，不看宣稱</text>
      <path class="flow-edge" d="M464 208 C 496 180, 508 140, 540 118" stroke="#26734f" stroke-width="2" fill="none"/>
      <path d="M534 118 L546 112 L542 124 Z" fill="#26734f"/>
      <text x="474" y="172" font-size="13" font-weight="700" fill="#26734f">是</text>
      <path d="M464 248 C 496 272, 508 286, 540 292" stroke="#b4352f" stroke-width="2" fill="none"/>
      <path d="M540 286 L552 294 L538 298 Z" fill="#b4352f"/>
      <text x="474" y="286" font-size="13" font-weight="700" fill="#b4352f">否</text>
      <rect x="544" y="52" width="152" height="112" rx="8" fill="#eef7f1" stroke="#aed7be"/>
      <text x="560" y="78" font-size="14" font-weight="700" fill="#26734f">④ 還原產品碼</text>
      <text x="560" y="100" font-size="12.5" fill="#5f687a">跑全套確認全綠</text>
      <text x="560" y="124" font-size="13.5" font-weight="700" fill="#26734f">這時候才准刪 A</text>
      <rect x="544" y="262" width="152" height="48" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
      <text x="560" y="284" font-size="13.5" font-weight="700" fill="#b4352f">不准刪</text>
      <text x="560" y="302" font-size="12" fill="#5f687a">先補會亮紅燈的保護</text>
    </svg>
  </div>
  <figcaption>刪測試前，先把產品故意改壞，親眼看接手的測試亮紅燈，還原確認全綠之後才准刪。</figcaption>
</figure>

> [!TIP] 怎麼知道剩下的測試夠不夠密？
> 假測試清完後，我們還反過來考了一次剩下的測試。不碰測試檔，隨機挑幾十個業務邏輯故意改壞（例如把分數判斷反過來、拿掉刪除前的權限檢查、關掉快取過期），看測試攔得下幾個。結果抓出二十幾個漏網之魚，全都是「只測了成功路徑，沒測失敗、過期與權限拒絕」。把這些缺口補到全數會紅，才算真正清完。

---

## 測試都改對了，為什麼每次推程式碼還是要等十幾分鐘？

因為本機、PR 跟合併後這三道關卡，一直在重複跑同一批慢檢查，而真正該跑的測試卻躺在角落沒人跑。

以前我常把十幾件事憋成一個超大批次才敢推，因為不管改兩行字還是改幾百個檔案，每次推送加 CI 都要等十幾二十分鐘。把時間攤開來看才發現有多荒謬。本機推送前已經跑了完整打包、幾十項靜態檢查跟全套單元測試；推上 PR 後，雲端機器把一模一樣的東西從頭再跑一遍，連只改後端腳本也照開瀏覽器測試；等合併進主線，才第一次去跑最核心的雙端互動測試，一紅燈就得整輪重來。

甚至為了「確保測試證據可靠」，早期 AI 還在專案裡建了一百多個檔案的雜湊簽章鏈，每次改一點東西還沒測到產品，就先因為簽章對不上而卡死。

我們把那套簽章鏈整組拆掉，重新定了一條簡單的原則，同一件事只跑一次，每一道關卡只回答一個問題。本機推送前只留 20 秒內的秒級靜態檢查，不打包、不跑重型測試；PR 階段依改動範圍選跑，而且用容器在雲端直接跑完「老師開課＋學生加入」的真後端互動測試，壞程式碼在合併前就擋下來；合併後只要程式碼沒變，直接沿用 PR 的綠燈結果去部署。

<figure class="article-diagram" data-diagram>
  <div class="article-diagram__head">
    <button type="button" class="diagram-mode is-active" data-mode="before">重整前</button>
    <button type="button" class="diagram-mode" data-mode="after">重整後</button>
  </div>
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 300" role="img" aria-labelledby="pipelineTitle">
      <title id="pipelineTitle">重整前後的推送驗證管線對比：重整前每關重工、耗時十幾分鐘，重整後同一件事只跑一次</title>
      <g data-pane="before">
        <rect x="24" y="52" width="204" height="144" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
        <text x="40" y="76" font-size="13" font-weight="700" fill="#5f687a">本機 pre-push</text>
        <text x="40" y="108" font-size="22" font-weight="700" fill="#b4352f">超過 10 分鐘</text>
        <text x="40" y="134" font-size="12" fill="#5f687a">全套靜態檢查＋單元測試</text>
        <text x="40" y="154" font-size="12" fill="#5f687a">完整打包＋本機重灌 DB 跑 SQL</text>
        <text x="40" y="180" font-size="12" fill="#b4352f">大改動等超過 10 分鐘</text>
        <path class="flow-edge" d="M228 124 H248" stroke="#9b6017" stroke-width="2" fill="none"/>
        <rect x="252" y="52" width="204" height="144" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
        <text x="268" y="76" font-size="13" font-weight="700" fill="#5f687a">PR CI（雲端）</text>
        <text x="268" y="108" font-size="22" font-weight="700" fill="#b4352f">7–10 分鐘</text>
        <text x="268" y="134" font-size="12" fill="#5f687a">本機跑過的全部再跑一遍</text>
        <text x="268" y="154" font-size="12" fill="#5f687a">打包 5 次，瀏覽器測試全開</text>
        <text x="268" y="180" font-size="12" fill="#b4352f">同一批檢查，第二次收費</text>
        <path class="flow-edge" d="M456 124 H476" stroke="#9b6017" stroke-width="2" fill="none"/>
        <rect x="480" y="52" width="204" height="144" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
        <text x="496" y="76" font-size="13" font-weight="700" fill="#5f687a">合併主線之後</text>
        <text x="496" y="108" font-size="22" font-weight="700" fill="#b4352f">最多 5 分鐘</text>
        <text x="496" y="134" font-size="12" fill="#5f687a">第一次跑核心雙端互動流程</text>
        <text x="496" y="154" font-size="12" fill="#5f687a">紅了就整輪重來</text>
        <text x="496" y="180" font-size="12" fill="#b4352f">紅兩天沒有人發現</text>
        <rect x="24" y="220" width="660" height="52" rx="8" fill="#fff7e8" stroke="#e7c58f"/>
        <text x="354" y="251" text-anchor="middle" font-size="13.5" font-weight="700" fill="#9b6017">同一批檢查跑 2–3 遍，只好把十幾件事憋成一條大 PR 一次推</text>
      </g>
      <g data-pane="after" style="display:none">
        <rect x="24" y="52" width="204" height="144" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="40" y="76" font-size="13" font-weight="700" fill="#5f687a">本機 pre-push</text>
        <text x="40" y="108" font-size="22" font-weight="700" fill="#26734f">20 秒內</text>
        <text x="40" y="130" font-size="12" fill="#5f687a">只留秒級靜態檢查</text>
        <text x="40" y="148" font-size="12" fill="#5f687a">（型別、ESLint、依賴圖）</text>
        <text x="40" y="166" font-size="12" fill="#5f687a">不跑測試、不打包、不灌 DB</text>
        <text x="40" y="186" font-size="12" fill="#26734f">改上千個檔案也在 20 秒內</text>
        <path class="flow-edge" d="M228 124 H248" stroke="#26734f" stroke-width="2" fill="none"/>
        <rect x="252" y="52" width="204" height="144" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="268" y="76" font-size="13" font-weight="700" fill="#5f687a">PR CI</text>
        <text x="268" y="108" font-size="22" font-weight="700" fill="#26734f">1–3 分鐘</text>
        <text x="268" y="134" font-size="12" fill="#5f687a">依範圍選跑，打包 1 次共用</text>
        <text x="268" y="154" font-size="12" fill="#5f687a">真後端互動前移到這關，兩分鐘內</text>
        <text x="268" y="180" font-size="12" fill="#26734f">壞程式碼進不了主線</text>
        <path class="flow-edge" d="M456 124 H476" stroke="#26734f" stroke-width="2" fill="none"/>
        <rect x="480" y="52" width="204" height="144" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="496" y="76" font-size="13" font-weight="700" fill="#5f687a">合併主線</text>
        <text x="496" y="108" font-size="22" font-weight="700" fill="#26734f">1 分鐘內</text>
        <text x="496" y="134" font-size="12" fill="#5f687a">同一份程式碼直接沿用證據</text>
        <text x="496" y="154" font-size="12" fill="#5f687a">重型測試全部穩定跳過</text>
        <text x="496" y="180" font-size="12" fill="#26734f">紅燈自動開 Issue 指派給合併者</text>
        <rect x="24" y="220" width="660" height="52" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="354" y="251" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">同一件事只跑一次，改 2 行跟改 900 檔的負擔跟著範圍走</text>
      </g>
    </svg>
  </div>
  <figcaption>同一條推送流程的前後對照，可點擊上方按鈕切換。</figcaption>
</figure>

通道變快之後，我們順手掀開最笨重的瀏覽器測試目錄，發現裡面有二十多支測試檔因為以前跑太慢被移出自動名單，成了沒人跑的「孤兒測試」。把不依賴真實排版的案例降到記憶體裡跑、並把剩下的孤兒重新排進 PR 自動關卡的第一輪，當場爆出十個紅燈，全數卡死在開頭說的那張找回碼小卡。

這也是那三天最痛的教訓。留在專案裡的測試，要嘛每一輪自動跑，要嘛驗證後刪掉；躺在角落不跑的測試不會等你，只會默默腐爛。

---

## 寫了九份原則文件叫 AI 別再犯，為什麼它讀完照樣寫錯？

因為寫在 Markdown 裡的規定對 AI 來說只是參考，只有編譯器跟檢查規則畫的紅線它才繞不過去。

我們原本有九份加起來近千行的工程與測試原則文件，裡面白紙黑字寫著「要測行為不要測實作」「不要亂傳 ID」。但 AI 每次開新對話讀完這上千行，轉頭繼續寫讀原始碼對字串的測試。

與其寫文件拜託 AI 遵守，不如把防線往上搬，讓錯的程式碼連編譯都不過。例如系統裡有課程 ID、場次 ID、學生 ID、投影片 ID 等六種識別碼，以前型別全部叫 `string`，AI 常把單次場次 ID 誤傳進需要長期課程 ID 的函式，為了防這件事還寫了十幾支測試。我們直接在型別系統幫這六種 ID 貼上互斥標籤（Branded Types），並把資料表名稱與後端函式集中註冊成清單。改完之後，只要傳錯 ID 或拼錯一個字母，存檔那一刻編譯器就直接報錯拒收，那十幾支防呆測試當場退役。

至於「禁止測試讀取原始碼文字」「禁止跨層循環引用」這類規矩，也全部寫進靜態檢查規則裡，本機推送時三秒內就能攔下。最後回頭把那九份原則文件裡的通用說教砍掉六成，只留下外界猜不到的專案特有事實，以及一張「每條規則現在由哪個工具擋」的對照表；沒有工具在擋的，就老實標上「未強制」。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 340" role="img" aria-labelledby="constraintTitle">
      <title id="constraintTitle">約束優先序五層，越高層擋得越早、越不需要人與 AI 記住</title>
      <text x="24" y="28" font-size="13" font-weight="700" fill="#5f687a">越高層的約束，擋得越早、越便宜，也越不靠任何人記得</text>
      <rect x="24" y="48" width="672" height="48" rx="8" fill="#f1edff" stroke="#b8afc9"/>
      <rect x="24" y="48" width="6" height="48" rx="3" fill="#6248c8"/>
      <text x="46" y="78" font-size="14.5" font-weight="700" fill="#6248c8">① 架構消除（根本沒有這個入口）</text>
      <text x="680" y="77" text-anchor="end" font-size="12" fill="#5f687a">錯誤寫不出來</text>
      <rect x="24" y="104" width="672" height="48" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <rect x="24" y="104" width="6" height="48" rx="3" fill="#b8afc9"/>
      <text x="46" y="134" font-size="14.5" font-weight="700" fill="#253047">② 編譯期型別（Branded Types、註冊表）</text>
      <text x="680" y="133" text-anchor="end" font-size="12" fill="#5f687a">存檔那一刻畫紅線</text>
      <rect x="24" y="160" width="672" height="48" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <rect x="24" y="160" width="6" height="48" rx="3" fill="#d7d1c6"/>
      <text x="46" y="190" font-size="14.5" font-weight="700" fill="#253047">③ 語法樹與依賴圖（ESLint、dependency-cruiser）</text>
      <text x="680" y="189" text-anchor="end" font-size="12" fill="#5f687a">pre-push 3 秒內擋下</text>
      <rect x="24" y="216" width="672" height="48" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <rect x="24" y="216" width="6" height="48" rx="3" fill="#d7d1c6"/>
      <text x="46" y="246" font-size="14.5" font-weight="700" fill="#253047">④ 行為測試（Break-Check、突變抽樣）</text>
      <text x="680" y="245" text-anchor="end" font-size="12" fill="#5f687a">要跑起來才知道</text>
      <rect x="24" y="272" width="672" height="48" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <rect x="24" y="272" width="6" height="48" rx="3" fill="#d7d1c6"/>
      <text x="46" y="302" font-size="14.5" font-weight="700" fill="#5f687a">⑤ 文件提醒（AGENTS.md 裡的原則）</text>
      <text x="680" y="301" text-anchor="end" font-size="12" fill="#5f687a">讀完照樣忘，最弱</text>
      <text x="360" y="336" text-anchor="middle" font-size="12.5" fill="#5f687a">能往上推的規則就不要留在下面；寫過第二次的提醒，就該變成上面幾層的約束</text>
    </svg>
  </div>
  <figcaption>把規則往上搬：能用架構與型別擋住的，就不靠測試，更不靠文件。</figcaption>
</figure>

---

## 看到測試全綠，現在我會先問哪三件事？

花十秒鐘問這三個問題，就能看出眼前的綠燈有沒有在保護你。

- **把產品功能故意改壞一行，它會不會亮紅燈？** 不會紅的綠燈只是在測文字或測空氣；刪改任何測試前，先看它紅一次再信。
- **這支測試有沒有在每次 PR 自動執行？** 沒有排進自動關卡的孤兒測試，不出一個月就會跟著舊畫面一起腐爛。
- **這條規則能不能往上搬到型別或靜態檢查？** 寫過第二次的文字提醒，就該變成編譯器或 Linter 畫的紅線，別再靠文件拜託 AI 記住。

如果你也想讓 AI 幫你把專案裡的假測試、重複慢關卡、鬆散型別與肥大規則檔徹底清一遍，我把這次的做法抽掉所有專案名詞，整理成下面這份通用體檢指令，直接貼給 Claude Code、Cursor 或 Codex 就能開始。

> [!WARNING] 先跑唯讀盤點
> 第一輪只讓它交診斷報告與分階段計畫，你確認每階段的刪除清單後再放行；刪測試的步驟都要附破壞驗證的實際結果。

```text
我要對這個專案進行「測試、CI 驗證流程、型別架構約束、規則文件與瀏覽器 E2E」的
全面盤點與重整。第一輪只做唯讀盤點：交出診斷報告與分階段執行計畫，未經我確認
不動任何檔案。

核心鐵律（全程不可違反）
1. 測試只驗外部可見行為。每支測試都要過兩個檢驗：(a) 把它保護的產品功能改壞，
   它會不會亮紅燈？(b) 重構內部實作但外部行為完全不變，它會不會保持綠燈？
   用 readFile/readFileSync 讀 src 原始碼做字串比對的測試、或在測試裡複製產品
   邏輯測自己的抄本測試，一律列為改造或淘汰對象。
2. 刪除或合併測試前必須做破壞驗證（Break-Check）。不准只憑讀程式碼宣稱「已有
   覆蓋」：先故意改壞它保護的產品程式碼，證明接替的測試（或 Lint/型別檢查）會
   亮紅燈，還原後確認全綠，才准刪。
3. 約束優先序（高到低）：架構消除 > 編譯期型別（Branded Types、Registry）>
   語法樹與依賴圖（ESLint AST、dependency-cruiser）> 行為測試 > 文件提醒。
   能用前四層擋住的規則，不寫成純文字規定。
4. 施工紀律：每批先劃定明確不重疊的檔案清單，一次全部改完，最後只跑一次相關
   測試與批次破壞驗證；嚴禁每改一個檔案就重跑整套測試。

六個階段（依序規劃、逐階段回報）

[P1、P2] CI 與本機預檢重整
- 盤點從 git push（pre-push hook）、PR CI、合併到正式發布，每一關跑了哪些指令、
  各耗時多久、哪些檢查在不同關卡重複執行。
- 重對齊五道關卡：本機只留秒級快速靜態檢查（型別、Lint、依賴圖、機密掃描），
  目標 30 秒內，不跑重型測試與完整打包；PR CI 依改動檔案的影響範圍選跑對應
  測試，只 Build 一次讓後續測試共用產物，把原本拖到合併後才跑的核心整合測試
  前移到 PR 階段（容器或本機隔離環境執行）；合併後若 Git Tree 與通過 PR CI
  的版本完全相同，直接沿用證據不重跑，只做部署與線上讀回驗證；關卡失敗要有
  自動開 Issue 指派或明確告警。
- 清除自我檢查類的雜湊證據鏈、空殼 workflow、無人使用的 npm scripts。

[P3] 單元與元件測試體檢
- 逐支盤點（禁止用腳本猜測）：讀 src 做字串比對的、複製產品邏輯的抄本、斷言
  字串早已不存在於產品的空斷言（Vacuous Negatives）、高度重疊的測試。
- 寫法約束類轉成 ESLint no-restricted-syntax 或 dependency-cruiser 規則後刪除；
  產品行為類改寫成呼叫公開介面的行為測試，通過破壞驗證。
- 突變抽樣：隨機挑 30 到 80 個核心業務邏輯點故意改壞（反轉條件、移除權限或
  過期檢查），實測攔截率，針對漏接補齊行為測試後重驗。
- 依「測試環境層 × 業務領域 × 風險等級 × 檔內排列（主流程 → 錯誤與權限 →
  競態與恢復）」分類建檔管理。

[P4] 型別與架構加固
- 容易混傳的 ID（UserId、ProjectId、SessionId 等）定義編譯期互斥的 Branded Types。
- 資料庫表名、RPC 名稱、API endpoint 收斂為集中型別註冊表與單一 URL 建構
  函式，拼錯名稱或呼叫退役 API 在編譯期直接報錯。
- dependency-cruiser 鎖死模組單向依賴，解開現有靜態循環依賴並設為 error。
- 狀態管理 Store 補唯讀邊界，外部不得直接改內部 state；拆解超過行數上限的
  巨型檔案並移除 Lint 豁免。

[P5] 文件與規則收斂
- 通用工程做法（怎麼寫測試、怎麼除錯、怎麼重構）改為引用標準框架並刪除說教；
  專案文件只留框架不可能知道的業務事實、權限邊界與架構例外。
- 建立「規則 → 強制機制」對照表：每條規則標註由哪個型別、哪條 ESLint 規則、
  哪條依賴規則或哪支 CI 檢查在擋；沒有工具擋的誠實標「未強制」。
- 清零所有指向已刪除或改名檔案的壞引用。

[P6] 瀏覽器 E2E 重掃
- 逐案盤點所有 Playwright/Cypress 案例並引用核心斷言，標出沒有在 PR CI 自動
  執行的孤兒 E2E。
- 不依賴真實排版引擎（getBoundingClientRect、scroll、CSS layout）、iframe/CSP
  隔離、Canvas/WebRTC/PDF 或跨頁主旅程的案例，降維搬進 JSDOM；已被單元或
  元件測試覆蓋的案例，破壞驗證後刪除。
- 零碎版面測試整併為共用單一 Worker Page、以路由切換畫面；剩餘全部依實測
  耗時均衡分配進 PR CI 平行分片，加守門測試確保 0 孤兒。
```

這份指令交出去只是第一步：每一階段的刪除清單要你親自確認，破壞驗證要親眼看到紅燈再還原。如果還不確定自己的專案最該先修哪一層，可以先做[免費的 AI 工作流五層健檢](/expertise/)，拿一件最近 AI 做壞的事，照題目、資料、工具、進度、驗收五個問題找出最划算的修法；想看一份完整的實作紀錄，我在[用 Claude Code 做完一整個網站的工作流](/articles/claude-code-workflow/)裡，整理了哪些關卡交給工具、哪些地方必須自己把關。
