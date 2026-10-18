---
title: "當 AI 幫你寫了 871 支測試，線上照樣壞掉：六階段測試重整實錄"
description: "871 支測試全綠，核心流程卻斷了兩天。三天重整：假測試清零、推送預檢從十幾分鐘變幾秒、用型別取代原則文件。文附可直接貼給 AI 的體檢 Prompt。"
publishDate: 2026-10-18
category: 技術觀點
tags: [AI 工程實戰, 測試策略, CI/CD, TypeScript, Claude Code]
readingTime: 12
draft: false
excerpt: "871 支測試、幾十道關卡，擋不住一張彈窗弄壞核心流程。三天把假測試清零、預檢從十幾分鐘壓到幾秒，文附可直接貼給 AI 的體檢 Prompt。"
problemTag: "871 支測試，線上照樣壞掉"
ogHighlight:
  label: "本機推送預檢"
  before: "超過 10 分鐘"
  after: "20 秒內"
---

10 月 15 日晚上，我請 AI 在自己的即時互動教學系統加一個小功能（老師播放投影片、學生掃碼進來投票搶答那種）：學生第一次加入課堂時，先彈出一張四位數「找回碼」小卡讓他存成圖片。功能寫好，`git push` 的推送前預檢跑了近兩分鐘全部綠燈，我開了 PR，幾分鐘後 CI 紅了：無障礙檢查抓到一行提示字的色彩對比沒有達標。

一查之下我差點氣死。專門守對比度的那支測試根本沒在算顏色，只是讀原始碼、檢查檔案裡有沒有某個 CSS 變數名稱。而最重要、連真雲端的開課互動測試，早就連續紅了兩次沒人理，卡死它的正是那張彈窗。它只在合併後才跑，平常又偶爾閃紅，大家當成偶發不穩。

那時帳面上有 871 支測試、30 多道檢查關卡、9 份原則文件，每次推送等十幾二十分鐘，換來一座假安心屎山。我叫 AI 全部停下來，整條驗證流程砍掉重練，三天換新一輪。這篇是實錄，文末附一份可以直接貼給你的 AI 的體檢 Prompt。

---

## AI 為什麼會寫出假測試

你叫 AI「補個測試」，它圖快，不掛載畫面、不模擬點擊，直接把原始碼當文字讀，檢查裡面有沒有某個字串：

```js
const source = fs.readFileSync('src/features/reset.ts', 'utf8');
expect(source).toMatch(/reset_project_data_v2/);
```

這種測試 0.01 秒跑完、永遠不會因為環境失敗、數字又漂亮，但它守的是字串，跟功能無關。把 API 呼叫註解掉，字串還在檔案裡，綠燈；把邏輯抽去共用函式，功能完全不變，它反而紅燈罵你。我們盤點出來，這種測試有一百三十多支，接近全部的兩成。

另一種更隱蔽：AI 在測試檔裡抄一份產品邏輯，測它自己抄的那份。產品改了三輪，抄本停在起點，每天在 CI 裡自己測自己、自己亮綠燈。

還有一種看起來最勤勞：一套 SHA 雜湊「證據鏈」，一百多個檔案在互相驗簽章，沒抓過半個 bug，只負責讓 CI 動不動卡死。

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

最諷刺的是，那 9 份原則文件裡白紙黑字寫著「測行為不要測實作」。AI 每次開新對話都讀完上千行，轉頭繼續寫字串比對。那一刻我確定：不改結構，寫再多原則都是自我安慰。

---

## 兩個問題，分辨測試是真是假

判斷一支測試該留、該改、該砍，不用統計行數，逐支問它兩個問題。把它保護的功能改壞，它會紅嗎？不會紅的是假測試。把內部寫法重構、使用者看到的功能完全不變，它會紅嗎？會紅的是綁死實作，也要改。

還有一條安全繩：刪任何測試前，先做破壞驗證。AI 最愛回報「A 已經覆蓋 B，我刪掉 B 了，全綠」，我們第一輪就抓到它看走眼：把產品改壞，全專案只剩原本要刪的那支會紅。從此規定照下面的流程走，沒走完不准刪。

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

> [!TIP] 破壞驗證自己做得起來
> 想刪 A 測試、宣稱 B 已接手？先把 A 保護的產品邏輯故意改壞，只跑 B。B 真的紅了，還原產品碼確認全綠，才准刪 A。

順帶一個分工教訓：我派子代理去改測試，它每改一個檔案就自己跑一次整套測試，一批下來燒掉三百多萬個 token。改成「一次改完、最後只驗一次」，這個數字直接歸零。

---
## 先止血：防線搬回合併前，重工砍掉

最重要、連真雲端的開課互動測試，以前要等合併後才跑。官方說法是要連雲端測試站、PR 階段跑不了。這個說法站不住腳。在 PR 的機器上用 Docker 起一套隔離環境，跑完一位老師加三位學生的完整開課、投票、斷線重連流程，全程不到兩分鐘。於是它前移到 PR，壞程式碼從此進不了主線；合併後萬一紅燈，自動開 Issue 指派給按下合併的那個人，修好自動關，沒有「紅燈掛著大家裝沒看到」這回事。

速度的原則只有一條：同一件事只跑一次。本機只留秒級的靜態檢查，不跑測試、不打包；PR 依改動範圍選跑、只打包一次；合併後發現是同一份程式碼，直接沿用 PR 的綠燈，不重跑。那套雜湊證據鏈也在這裡整組拆除。

<figure class="article-diagram" data-diagram>
  <div class="article-diagram__head">
    <button type="button" class="diagram-mode is-active" data-mode="before">重整前</button>
    <button type="button" class="diagram-mode" data-mode="after">重整後</button>
  </div>
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 300" role="img" aria-labelledby="pipelineTitle">
      <title id="pipelineTitle">重整前後的推送驗證管線對比：重整前每關重工、耗時數百秒，重整後同一件事只跑一次</title>
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
  <figcaption>同一條推送流程的前後對照，可切換分頁。</figcaption>
</figure>

實測下來，本機預檢從超過 10 分鐘變 20 秒上下，純改文件的 PR 半分鐘內結束，合併後一分鐘內過關。快到我又敢小步快跑了。

---

## 大掃除：假測試是這樣清到零的

先把源頭封死：測試不准再讀原始碼，檢查規則直接擋。守寫法的（不准引用什麼、不准用哪些危險 API），升格成檢查規則，測試刪掉；守行為的，改寫成掛載畫面、模擬點擊、看送出去的請求。每改一批，破壞驗證一次。

清的過程還抓到一種更廢的：斷言某個字串「不要出現」，結果那個字串在產品裡早就絕種，這條斷言在宇宙毀滅前都會綠燈。一掃，十幾個。

最後用突變抽樣驗收。不碰測試，隨機挑幾十個業務邏輯點故意改壞（分數判斷反過來、拿掉權限檢查、關掉快取過期），看測試攔得下幾個。兩輪下來漏掉二十多個，全是同一種病，只測成功路徑，沒測失敗、過期與權限拒絕。補上行為測試，重跑，全數轉紅。那之後累積一百多次刪除前的破壞驗證，每一次都紅。

---

## 讓錯的程式碼，連編譯都不過

清完測試，更根本的問題來了：能不能別等跑到測試才抓錯，在 AI 寫下去的第 0.1 秒就擋死它？把規則往上搬到架構與型別那一層：

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

實際做兩件事，就清掉一大批防呆測試。第一，系統裡六種 ID 本來全叫 string，AI 常把單次場次的 ID 塞進要長期課程 ID 的函式；用型別貼標讓六種 ID 互斥之後，傳錯編譯器直接拒收，十來支防呆測試跟著退休。第二，資料表名與後端函式名集中註冊，打錯一個字母，存檔那一刻就是紅線，不是上線才爆。循環依賴全部拆開並設為錯誤，三個六百行以上的巨型函式順手拆小。

---

## 收尾：文件砍一半，孤兒清零

9 份原則文件近千行，通用的大道理佔了六成，全刪，換成一行指引，只留外界猜不到的專案事實（正式站資料庫規格小，查詢不准一次拉整份簡報；排行榜讓同班互看是刻意功能，別再誤報越權）。行數砍掉六成，AI 每次開場少讀一半。再加一張表：每條規則旁邊寫清楚現在是誰在擋，沒有工具擋的老實標「未強制」。

瀏覽器測試收成兩句話。只有需要真實版面、瀏覽器原生安全、多媒體或跨頁流程的事，才開真瀏覽器，其餘全部降到記憶體裡跑；每支留在 repo 的測試，都必須排進自動關卡。第二句來自血的教訓。把二十多支從來沒在跑的孤兒測試放回 CI 的第一輪，立刻爆出十個失敗，全卡死在同一張找回小卡彈窗。孤兒不會等你，它們只會腐爛。

---

## 三天後留下的數字與判斷

先看數字。本機預檢從十幾分鐘變 20 秒上下；一百三十多支假測試清到零；突變抽樣漏掉的二十多個缺口全補上；瀏覽器測試砍掉將近三成、零孤兒，幾十個版面檢查十來秒跑完；原則文件砍掉六成。全部發生在三天、三十多條 PR。

帶走的判斷：

1. AI 說「已覆蓋」就值得懷疑。挑一個點把產品改壞，看它紅一次再信。
2. 每道關卡只回答一個問題，同一件事只跑一次。通道不快，小步快跑永遠是口號。
3. 防線往上推。能用型別與檢查規則擋住的錯，不寫成測試；能寫成測試的，不寫成文件。
4. 瀏覽器測試只留給非開真瀏覽器不可的事，而且絕不留孤兒。
5. 給子代理明確的不重疊清單、一次改完一次驗證；通用方法交給標準框架，專案文件只留特有事實。

---

## 附錄：六階段體檢 Prompt，直接貼給你的 AI

這份範本抽掉了所有專案名詞，任何有測試與 CI 的 repo 都能用，直接貼給 Claude Code、Cursor 或 Codex：

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

這份 Prompt 的每一條，都對應這三天裡真實踩過的坑。拿去用的時候記住，AI 交回來的每個「已覆蓋」「已驗證」，都值得你挑一個點，親手改壞一次看看。
