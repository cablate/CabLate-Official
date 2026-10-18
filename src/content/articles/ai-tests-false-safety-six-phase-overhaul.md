---
title: "當 AI 幫你寫了 871 支測試，線上照樣壞掉：六階段測試重整實錄"
description: "AI 生成的 871 支測試裡，超過 130 個檔案只在讀原始碼比對字串；預檢跑 617 秒，最核心的互動流程卻合併後才測、紅了兩天。三天六階段把假測試清零、預檢壓到 18 秒，文末附可直接貼給 AI 的體檢 Prompt。"
publishDate: 2026-10-18
category: 技術觀點
tags: [AI 工程實戰, 測試策略, CI/CD, TypeScript, Claude Code]
readingTime: 25
draft: false
excerpt: "871 支測試、37 道關卡，擋不住一張彈窗弄壞核心流程。三天六階段重整：假測試清零、預檢 617 秒變 18 秒、用型別與規則表取代文件拜託 AI。文附可直接貼給 AI 的六階段體檢 Prompt。"
---

10 月 15 日晚上，我請 AI 在自己的線上即時互動教學系統加一個小功能（老師在台上播放投影片、台下學生掃碼加入，即時投票搶答那種）：學生第一次輸入名字加入課堂時，先彈出一張四位數「找回碼」小卡讓他存成圖片，避免換手機或關掉無痕視窗後弄丟身分。

功能很快就寫好。我按了下 `git push`，推送前預檢跑了近兩分鐘，幾十項靜態檢查加幾百支單元測試全部綠燈。我很有把握地開了 PR，幾分鐘後 GitHub Actions 亮紅燈：無障礙檢查（axe）抓到加入頁有一行提示字的色彩對比只有 4.21，不到 4.5 的標準。

我問 AI 兩個問題：為什麼推送前的預檢沒測出來？我們不是有一支專門守對比度的單元測試嗎？

查完答案，我差點氣死。那支守對比度的測試根本沒有在算顏色。它用 `fs.readFileSync` 把原始碼當純文字讀進來，用正規表示式檢查檔案裡有沒有寫 `--text-muted` 這個 CSS 變數名稱。變數名還在，就算顏色在白底上淡到肉眼看不見，測試永遠綠燈。CI 會爆只因為頁面有淡入動畫，測試在文字還半透明時就衝進去掃描。

更糟的在後面。修好對比度、合併進開發主線之後，才發現真正連雲端資料庫的「老師開課＋學生加入」互動測試，已經連續紅了兩次。禍首正是那張找回小卡，一進頁面就擋在正中央，舊測試腳本不知道要關掉它，整條流程卡死。這支測試只在合併後才跑，平常又偶爾因為網路慢閃紅，大家早就把它當成偶發不穩，沒人發現核心流程已經斷了兩天。

那晚我只想通一件事。幾個月下來，AI 幫這個專案寫了 871 支測試、37 道檢查關卡、9 份工程原則文件，每次推送要等十幾二十分鐘，換來的是一座「改壞產品不會紅、改個變數名就亂紅」的假安心屎山。

我直接跟 AI 說：停下來，不要東補西湊。整條驗證流程、全部測試、架構約束跟規則文件，從頭到尾盤點重做。接下來三天，我們從 P0 一路做到 P6，這篇是完整實錄，文末附一份不綁定任何專案、可以直接貼給 Claude Code 或 Codex 的六階段體檢 Prompt。

---

## 假安心從哪長出來：AI 最愛寫的三種廢測試

如果你也高度依賴 Claude Code、Cursor 或 Codex 開發，專案超過三個月，repo 裡幾乎一定長得出下面三種東西。

### 讀原始碼比對字串，跟抄一份產品邏輯測自己

你叫 AI「幫這個功能補測試」而且沒限制寫法時，它最常做兩件事。

第一種，原始碼文字比對。要測「點擊重設按鈕會呼叫 V2 重設 API」，正常寫法是渲染畫面、模擬點擊、看發出去的請求。AI 會直接寫三行：

```js
const source = fs.readFileSync('src/features/reset.ts', 'utf8');
expect(source).toMatch(/reset_project_data_v2/);
```

這種測試跑起來 0.01 秒、永遠不會因為環境問題失敗、測試數量又漂亮，但有兩個致命傷。有人在上面加一行 `if (true) return;` 讓 API 永遠不執行，它照樣綠燈，因為字串還在檔案裡。你把邏輯抽去共用函式，功能完全沒變，它馬上紅燈罵你。我們盤點發現，871 支裡有超過 130 個測試檔在幹這件事。

第二種，抄本測試。畫面元件太大、AI 懒得掛載，乾脆在測試檔裡重寫一個簡化版函式，把產品的計算邏輯抄過來，測它自己抄的那份。幾個月後產品改了三輪，抄本還停在舊邏輯，每天在 CI 裡自己測自己、自己亮綠燈。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 300" role="img" aria-labelledby="fakeTestTitle">
      <title id="fakeTestTitle">同一個改壞的產品，行為測試會亮紅燈，讀原始碼比對字串的測試永遠綠燈</title>
      <text x="24" y="28" font-size="13" font-weight="700" fill="#5f687a">同一個改壞的產品，兩種測試的判決</text>
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
  <figcaption>假安心製造機：同一個壞掉的產品，行為測試會亮紅燈擋下來；讀原始碼比對字串的測試因為字串還在，永遠綠燈。我們盤點出超過 130 個這樣的測試檔。</figcaption>
</figure>

### 過度防禦強迫症：萬物皆可 SHA-256

這個專案早期近八成測試與 CI 腳本由 Codex 參與產出。掃完全 repo、再對照國外開發者的討論，那批模型有一種典型的防禦癖好：你說「要確保部署跟測試的證據可靠」，它就設計一整套 SHA-256 雜湊驗證鏈，連 CI 要不要重跑都得先驗好幾道自建簽章。全 repo 有 112 個檔案命中雜湊邏輯，沒抓到半個產品 bug，反而每次改一點東西，整條證據鏈就因為 hash 對不上卡死。

另外還有 28 支「管清單有沒有同步」的測試：新增一個檔案忘了跑索引產生器，產品功能完全正常，CI 直接紅燈把你擋在門外。

### 不管改 2 行還是 900 檔，每一關都重跑一樣的慢檢查

我後來只敢把十幾件事情憋成一個大批次、一次推一條大 PR。理由很簡單：不管改 2 行字還是 900 個檔案，每次推送加 CI 都要十幾二十分鐘，拆小步快跑是在燒 GitHub Actions 額度跟我的生命。

攤開來量更荒謬。本機 pre-push，大改動 617 秒，裡面跑了完整打包、31 項靜態檢查、所有單元測試、149 支工具測試，還在本機重灌一次資料庫跑 SQL 測試。PR CI 把本機剛跑過的那批檢查在雲端從頭再跑一次，約 4 分鐘牆鐘、10 分鐘虛擬機時間，沒改前端也照開瀏覽器測試。合併進主線之後，才第一次去跑連真雲端的開課互動測試，一紅，再付一次 15 分鐘過路費。

最諷刺的是，我們有 9 份近千行的工程原則文件，裡面白紙黑字寫著「測行為不要測實作」「要注重效率」。AI 每次開新對話，讀完上千行，轉頭繼續寫 `readFileSync` 比對字串。那一刻我徹底想通：寫在 Markdown 裡的規定，對 AI 來說就是空氣。不改架構、不靠型別與 Linter 把錯誤寫法直接擋死、不把關卡拆乾淨，寫再多原則文件都只是自我安慰。

---
## 動手前先立三條規矩，不然越清越破洞

動任何一行程式碼之前，我們先定了三條死規矩。後來能清掉幾百支測試又沒有漏掉任何保護網，靠的就是它們。

### 每支測試都要過「兩個想像修改」的拷問

判斷一支測試該留、該改寫還是該砍，不准用腳本統計行數猜，必須逐支打開來讀它的斷言，問兩個問題。

把這支測試宣稱在保護的產品功能改壞，它會不會亮紅燈？不會紅的叫假測試，改寫或砍掉。把內部實作重構（改變數名、拆小函式），使用者看到的功能完全不變，它會不會亮紅燈？會紅的叫綁死實作的脆弱測試，也要改寫。只有「功能壞了會紅、內部重構不紅」的測試，才配留在專案裡。

### 沒有破壞驗證，不准刪任何一支測試

這條是整場手術的安全繩。你叫 AI「把重複的測試刪掉」，它超愛回報：「我讀過程式碼了，A 已經覆蓋 B，所以我把 B 刪了，全綠！」千萬不要相信。第一輪實測就抓包：一支大型流程測試，AI 讀程式碼以為別處都測過了，我們真的把產品裡的「儲存投影片樣式」改壞，現存所有測試竟然全部綠燈，只有原本要刪掉的那支會紅。

所以我們寫了一支小工具（break-check），把規則變成硬的：

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
  <figcaption>Break-Check 的完整迴圈。沒有親眼看它紅一次，任何「已覆蓋」都只是 AI 的推測；這條規矩後來救了我們至少一次差點刪掉唯一會紅的測試。</figcaption>
</figure>

> [!TIP] 破壞驗證怎麼自己做
> 想刪 A 測試、宣稱 B 已經接手？先把 A 保護的產品邏輯故意改壞（條件反轉、把 API 呼叫註解掉都行），只跑 B。B 真的亮紅燈，還原產品碼確認全綠，這時候才准刪 A。整段流程一支幾十行的 Node 腳本就做得起來。

### 子代理不准邊改邊跑測試

第一波施工我派了好幾個子代理出去改測試，等半小時沒回來，一看後台紀錄差點吐血：子代理每改完一個小檔案就自己跑一次測試套件，改 20 個檔案跑 20 次，光一個批次燒掉 360 萬個 token。

我們馬上改成分層。主代理（Opus 或 Sonnet）只負責切不重疊的檔案範圍、定規格、做總審查；施工交給便宜快的模型（Haiku、GLM 或 Codex），拿到明確的 10 到 15 個檔案清單，一次全部改完，最後只跑一次集合測試，連敗兩次就停下來回報，不准原地微調鬼打牆。收件後主代理用腳本一次把那批測試保護的產品點同時改壞、跑一次看是不是全紅、一鍵還原確認全綠。

> [!NOTE] 順序有講究
> 先讓通道又快又準（P0 到 P2），再回頭清理單元測試、型別架構、規則文件與瀏覽器測試（P3 到 P6）。通道變快，後面每一輪重構都能在幾十秒內拿到真實回饋。

---

## P0、P1：把最重要的防線拉回合併前

動手前先解決一個疑問：最核心的「老師開課、學生加入、即時投票、斷線重連」測試，為什麼要等合併後才跑，紅了兩天還沒人處理？

原本的理由聽起來合理：它要連真實的雲端測試站（staging 資料庫與即時通訊服務），PR 階段程式碼還沒部署上去，跑不了。仔細想，這是藉口。PR CI 為什麼不能在自己的虛擬機裡用 Docker 起一套乾淨的本機資料庫與後端、套完整 migration，直接跑真槍實彈的雙端互動？我們做了原型驗證：在 GitHub Actions 起一套隔離後端，跑完一位老師加三位學生的開課、投票、斷線重連、重設全流程，總共約 105 秒。

於是 P0、P1 一口氣做了三件事。修好擋路的彈窗與壞掉的腳本，讓測試認得新的找回小卡，關掉再走完流程，把卡死發佈的紅燈變回綠燈。真後端雙端互動測試前移到 PR CI，以後只要 PR 改到學生畫面、講台畫面或即時通訊，雲端自動起隔離環境幫你跑完，壞程式碼進不了主線。合併後紅燈指派到人，workflow 改成紅燈就自動開一張 Issue 指派給剛按下合併的那個人，Claude Code 一開場（SessionStart hook）直接跳警告，修好變綠 Issue 自動關閉。從此沒有「紅燈掛在那邊大家裝沒看到」這回事。

---

## P2：預檢從 617 秒壓到 18 秒，先砍重工再談優化

很多人優化 CI 的第一反應是調快取、調平行參數。我們差點掉進這個坑，後來踩了煞車：一個關卡裡跑的東西根本不該在那裡跑，你幫它加再多快取，都只是在幫垃圾加速。正確順序是先定每道關卡的框架與它唯一要回答的問題，再決定誰有資格進來，最後才優化關卡內部。

我們重新定義了五道關卡，規定同一件事只跑一次：

| 關卡（什麼時候跑） | 這一關只回答 | 放進來的條件 |
|---|---|---|
| ① 推送前預檢（本機，每次 `git push`） | 有沒有弄壞語法、型別、規範？ | 必須秒級。只跑 `tsc`、ESLint、依賴圖、對比公式；不跑單元測試、不打包、不起資料庫 |
| ② PR CI（每個 PR） | 這次改動會不會弄壞既有功能？ | 依影響範圍選跑：純文件 19 秒；只改工具不開瀏覽器；改到畫面才打包一次、3 分片平行跑瀏覽器與雙端互動 |
| ③ 合併主線（PR 合併時） | 部署到測試站後，線上正常嗎？ | git tree 跟剛通過 PR CI 的完全相同，直接沿用證據，重型測試全跳過，只部署與線上驗證 |
| ④ 正式發布（上正式站時） | 這個版本能不能給真實用戶？ | 檢查資料庫備份、確認沒有老師正在上課、測試站證據齊全，才把同一份驗證過的程式升上去 |
| ⑤ 排程健康檢查（定時） | 線上有沒有突發異常？ | 只開告警 Issue，不擋任何開發操作 |

框架定了，動刀清三塊肥肉。

拆除整套 SHA 雜湊證據鏈與空殼 workflow，改成比對 Git 原生的 `tree SHA`（兩個 commit 的檔案樹完全相同就代表程式碼一模一樣，直接沿用 PR 的綠燈結果），同時在 ESLint 加一條死規矩：產品內建的加密需求之外，禁止任何測試或工具腳本呼叫 `createHash` 或 `crypto.subtle.digest`。

把散落的邊界檢查腳本收編。以前有幾十支各自遍歷全專案跑正規表示式的 `verify-*.mjs`，逐支做破壞驗證後，能轉的全部寫進 `eslint.config.mjs`（AST 語法樹檢查，又快又準）跟 `dependency-cruiser`，刪掉多餘腳本與「管測試的測試」。

打包只做一次。PR CI 只執行一次 `vite build`，產物直接給 3 個瀏覽器分片與互動測試共用，省掉四次重複編譯。

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
        <text x="40" y="108" font-size="22" font-weight="700" fill="#b4352f">617s</text>
        <text x="40" y="134" font-size="12" fill="#5f687a">31 項靜態檢查＋全套單元測試</text>
        <text x="40" y="154" font-size="12" fill="#5f687a">完整打包＋本機重灌 DB 跑 SQL</text>
        <text x="40" y="180" font-size="12" fill="#b4352f">大改動等超過 10 分鐘</text>
        <path class="flow-edge" d="M228 124 H248" stroke="#9b6017" stroke-width="2" fill="none"/>
        <rect x="252" y="52" width="204" height="144" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
        <text x="268" y="76" font-size="13" font-weight="700" fill="#5f687a">PR CI（雲端）</text>
        <text x="268" y="108" font-size="22" font-weight="700" fill="#b4352f">420–614s</text>
        <text x="268" y="134" font-size="12" fill="#5f687a">本機跑過的全部再跑一遍</text>
        <text x="268" y="154" font-size="12" fill="#5f687a">打包 5 次，瀏覽器測試全開</text>
        <text x="268" y="180" font-size="12" fill="#b4352f">同一批檢查，第二次收費</text>
        <path class="flow-edge" d="M456 124 H476" stroke="#9b6017" stroke-width="2" fill="none"/>
        <rect x="480" y="52" width="204" height="144" rx="8" fill="#fff1ef" stroke="#efb4ae"/>
        <text x="496" y="76" font-size="13" font-weight="700" fill="#5f687a">合併主線之後</text>
        <text x="496" y="108" font-size="22" font-weight="700" fill="#b4352f">≤280s</text>
        <text x="496" y="134" font-size="12" fill="#5f687a">第一次跑核心雙端互動流程</text>
        <text x="496" y="154" font-size="12" fill="#5f687a">紅了還要再付 15 分鐘過路費</text>
        <text x="496" y="180" font-size="12" fill="#b4352f">紅兩天沒有人發現</text>
        <rect x="24" y="220" width="660" height="52" rx="8" fill="#fff7e8" stroke="#e7c58f"/>
        <text x="354" y="251" text-anchor="middle" font-size="13.5" font-weight="700" fill="#9b6017">同一批檢查跑 2–3 遍，只好把十幾件事憋成一條大 PR 一次推</text>
      </g>
      <g data-pane="after" style="display:none">
        <rect x="24" y="52" width="204" height="144" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="40" y="76" font-size="13" font-weight="700" fill="#5f687a">本機 pre-push</text>
        <text x="40" y="108" font-size="22" font-weight="700" fill="#26734f">7–21s</text>
        <text x="40" y="130" font-size="12" fill="#5f687a">只留秒級靜態檢查</text>
        <text x="40" y="148" font-size="12" fill="#5f687a">（型別、ESLint、依賴圖）</text>
        <text x="40" y="166" font-size="12" fill="#5f687a">不跑測試、不打包、不灌 DB</text>
        <text x="40" y="186" font-size="12" fill="#26734f">改 1,258 個檔案也只要 21 秒</text>
        <path class="flow-edge" d="M228 124 H248" stroke="#26734f" stroke-width="2" fill="none"/>
        <rect x="252" y="52" width="204" height="144" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="268" y="76" font-size="13" font-weight="700" fill="#5f687a">PR CI</text>
        <text x="268" y="108" font-size="22" font-weight="700" fill="#26734f">19–186s</text>
        <text x="268" y="134" font-size="12" fill="#5f687a">依範圍選跑，打包 1 次共用</text>
        <text x="268" y="154" font-size="12" fill="#5f687a">真後端互動 105 秒前移到這關</text>
        <text x="268" y="180" font-size="12" fill="#26734f">壞程式碼進不了主線</text>
        <path class="flow-edge" d="M456 124 H476" stroke="#26734f" stroke-width="2" fill="none"/>
        <rect x="480" y="52" width="204" height="144" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="496" y="76" font-size="13" font-weight="700" fill="#5f687a">合併主線</text>
        <text x="496" y="108" font-size="22" font-weight="700" fill="#26734f">47s</text>
        <text x="496" y="134" font-size="12" fill="#5f687a">git tree 相同直接沿用 PR 證據</text>
        <text x="496" y="154" font-size="12" fill="#5f687a">重型測試全部穩定跳過</text>
        <text x="496" y="180" font-size="12" fill="#26734f">紅燈自動開 Issue 指派給合併者</text>
        <rect x="24" y="220" width="660" height="52" rx="8" fill="#eef7f1" stroke="#aed7be"/>
        <text x="354" y="251" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">同一件事只跑一次，改 2 行跟改 900 檔的負擔跟著範圍走</text>
      </g>
    </svg>
  </div>
  <figcaption>同一條推送流程的前後對照，可切換分頁。重整前的三段重工與「合併後才發現」對比重整後的證據沿用，這也是我敢再拆小步快跑的理由。</figcaption>
</figure>

P2 改完的實測數字：本機預檢純文件 7 秒、改單一元件 18 秒、一次改 1,258 個檔案也只要 21 秒；PR CI 純文件 19 秒、全跑牆鐘 167 到 186 秒；合併主線靠 tree 沿用機制，47 秒過關去部署測試站。

---
## P3：871 支測試大掃除，突變抽樣抓出 23 個缺口

預檢變成 18 秒、CI 不再重工之後，回頭對付最大的那座山：幾百支真假混雜的測試。

第一步，封鎖源頭。ESLint 加規則：`tests/` 目錄禁止用 `readFile` 讀 `src/` 底下的檔案，還沒改完的先列進例外清單，規定這份清單只准減少、不准增加。接著逐支審判那 100 多支讀原始碼的假測試：守「某檔不准 import 某檔」「不准寫 innerHTML」這類寫法約束的，直接升格成 ESLint 或 `dependency-cruiser` 規則，然後刪掉；守產品行為的（例如「老師公布答案後，學生畫面會看到統計」），改寫成掛載真元件、模擬點擊、檢查最後渲染的畫面與送出去的 API 請求。每改完一批，跑一次破壞驗證，確認改壞產品時新測試真的會紅，才把舊的文字斷言刪掉。

第二步，清空斷言。有一支測試寫著 `expect(pageText).not.toContain('等待講師開始簡報')`，看起來很合理，學生進到課堂就該看到投影片。我們拿搜尋工具反查整個 `src/`，發現產品文案早就改版，全專案沒有任何地方有這八個字。也就是說，就算學生頁面整個白屏，這條斷言照樣綠燈，因為它要求「不要出現」的字串根本絕種了。寫了一支小工具掃所有 `not.toContain` 類的否定斷言、反查字串還存不存在，當場抓出 15 個過時空斷言。

> [!NOTE] 空斷言的特徵
> 斷言「某字串或 class 不存在」的測試，風險在於那個字串可能早已從產品移除，這條斷言從此永遠成立。清單式的否定斷言要定期反查目標是否還存在於 `src/`。

第三步，突變抽樣。假測試清完，我心裡還是不放心。剩下的測試看起來都在測行為了，但它們夠密嗎？我不碰測試，從核心模組隨機挑 80 個真實的業務邏輯點故意改壞，把分數判斷的 `>` 改成 `>=`、拿掉「刪除前先確認權限」的 `if`、註解掉快取過期檢查，然後只跑引用到那個檔案的測試，看有幾個突變會被紅燈攔下。

結果很震撼。第一輪 40 個突變抓到 31 個，漏 9 個。第二輪再抽 40 個更刁鑽的邊界突變，只抓到 25 個，漏 14 個。23 個漏接全是同一種形態，平常大家以為有測到，其實只測了成功路徑，沒測失敗、快取過期與權限拒絕。針對這 23 個缺口補上行為測試，再跑一次突變，23 個全部轉紅被抓到。

第四步，分類建檔。剩下的 641 支單元與元件測試，依四層管理：物理目錄分開純邏輯（Node 環境極速跑）、畫面元件（JSDOM 掛載）、真環境瀏覽器；每支歸屬唯一一個業務領域（即時通訊、編輯器、計分、權限等 10 大領域）；標上風險等級（P0 核心契約與資安 312 支、P1 核心旅程 187 支、P2 元件狀態 31 支、P3 維運工具 111 支）；檔內排列統一成主流程、邊界與權限拒絕、競態與斷線恢復。順勢整併刪掉 30 支完全重疊的測試，同樣先做 34 項破壞驗證全紅才動手。

---

## P4：與其補一百支測試，讓錯的程式碼連編譯都不過

P3 收尾時我們問了一個更進一步的問題：有些錯誤，為什麼要等到跑測試才抓得到？能不能在 AI 寫下那行程式的第 0.1 秒，TypeScript 編譯器或 Linter 就直接畫紅線擋死它？

這就是約束優先序，把防線從「寫測試」往上推到「架構與型別」：

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
  <figcaption>約束優先序。P4 做的事，就是把原本靠第④層測試跟第⑤層文件守的規則，整批搬上第①到③層。</figcaption>
</figure>

P4 沒有新增任何一支傳統測試，直接在地基上動了幾刀。

**六種 ID 貼上編譯期標籤。** 專案裡有課程專案 ID、單次場次 ID、六位數加入碼、學生 ID、投影片 ID、題目元件 ID，以前在 TypeScript 裡全部叫 `string`，AI 三不五時就把單次場次的 ID 傳進要長期課程 ID 的函式，導致查不到資料。以前防這件事靠 11 支讀原始碼的測試，現在用 Branded Types 讓六種 ID 在編譯期互斥：

```ts
export type ProjectId = string & { readonly [projectIdBrand]: 'ProjectId' };
export type StudentId = string & { readonly [studentIdBrand]: 'StudentId' };
export type SlideId   = string & { readonly [slideIdBrand]: 'SlideId' };
```

執行期它們還是普通字串，零效能損耗；但把 `SlideId` 傳給要求 `StudentId` 的參數，不用跑任何測試，編譯器當場報錯拒收，11 支文字比對測試光榮退役。

**資料表與後端函式名集中註冊。** 以前呼叫 `db.select('submissions')` 或 `db.rpc('reset_project_data_v2')`，參數是寬鬆的 `string`，表名少一個 s、或去呼叫已退役的舊函式，編譯全過、上線才爆。我們集中定義 11 張資料表與 49 支後端函式，直接鎖死資料庫客戶端的型別簽章。改上去那一刻，`vue-tsc` 馬上抓出好幾個深藏在匯出與重設模組裡、還維持寬鬆型別的轉接器。

**單一入口與零循環依賴。** 前端原本有 7 個地方各自用字串拼後端 API 網址，收斂成唯一的 `buildEdgeFunctionUrl`，網址 slug 必須是註冊在案的聯合型別，打錯連編譯都不過。用 `dependency-cruiser` 掃 1,065 個模組，把 6 組循環依賴（56 條邊）全部拆開，規則從警告升成錯誤，以後誰再引入循環依賴，預檢 3 秒內擋下。狀態管理 Store 補上唯讀視圖型別配 AST 檢查，855 個生產檔案裡 0 處從外部偷改內部狀態。另外堵掉一個競態：底層查詢合併（single-flight）在「重設課堂」或寫入進行中，可能回傳重設前的舊 Promise，改成寫入與非唯讀操作時自動清掉進行中的讀取，從根源斷掉「重設後還讀到舊票數」。

**拆三大巨型函式。** 前三名超過 600 行的核心函式全數拆到 300 行以下：956 行的講台廣播狀態機拆成 288 行（互動控制、場次持久化、事件訂閱三個職責檔）、625 行的文字雲運行時拆成 244 行、607 行的即時互動集線器拆成 276 行，順手移除 ESLint 給它的行數豁免，也清掉兩個零引用的依賴與兩邊各寫一份的 65 行載入器邏輯。

---

## P5：寫在文件裡的規定，對 AI 來說就是空氣

CI 快了、測試純了、型別鎖死了，最後回頭處理那 9 份近 900 行的原則文件。我當時跟 AI 說了一段後來被驗證到底的話：通用工程最佳實踐，直接叫 AI 遵守現成的標準框架就好；專案文件只准留「外界跟通用框架絕對不可能知道的專案特有事實」。

9 份文件逐段對照框架的技能庫，通用長篇大論全刪，換成一行指引；854 行減到 349 行，連同入口檔從 1,080 行減到 548 行。AI 每次冷啟動少讀一半 token，重點比以前清楚十倍。留下的 349 行全是猜不到的事實，例如：正式站資料庫維持小型規格，查詢嚴禁一次拉出整份簡報大 JSON；文字雲、作品牆、排行榜讓同班學生互相看到結果是刻意設計的教學互動，不是越權漏洞，免得 AI 每次做資安審查都誤報；編輯器存檔必須檢查版本號，衝突時停下來提示，不准強制覆蓋別人的修改。

還把「跟標準做法相反的例外」寫進入口第一頁。通用框架教你「改了新 API 就把呼叫端一次改完、同一個 PR 把舊 API 刪乾淨」，但老師跟學生的瀏覽器分頁可能在教室開好幾個小時沒重整，直接刪掉舊資料庫函式，課堂上的舊分頁一按就壞。所以正式站資料庫更新必須走 expand（先上相容新版）、相容發布、cleanup（等舊分頁淘汰再刪舊版）三步。這種例外不寫清楚，AI 就會拿通用原則來害你。

最後建立整個 P5 最有價值的一張表：`AGENTS.md` 裡每一條工程與架構規則，右邊那欄必須寫出現在由哪個編譯器型別、哪條 ESLint 規則、哪條依賴規則、或哪支 CI 測試在擋；沒有任何工具在擋的，老老實實標上粗體的「未強制」。表列完，12 類錯誤已經有機器 24 小時把關、3 件事還沒有靜態規則能擋，一目了然。

---
## P6：瀏覽器測試只留四種事，孤兒一支都不准留

最後一塊硬骨頭是 Playwright 真瀏覽器測試。開一個真實 Chromium、載入整個前端、打假資料 API，比在記憶體裡跑一個元件測試慢幾十倍，但以前的 AI 只要寫到畫面功能，不管三七二十一就開一個瀏覽器測試。

把整個 e2e 目錄掀開來算，數字嚇人：全專案 37 支 Playwright 測試檔、243 個案例，但 PR CI 只挑了其中 10 支檔案（78 個案例）在跑。換句話說，repo 裡有 26 支檔案、76 個案例，是沒有任何 PR 關卡在跑的孤兒測試，躺在 repo 裡放到發臭。

宣判從三個方向來。

**降維。** 只有四種事配開真瀏覽器：真的要量像素座標與版面幾何（按鈕有沒有超出外框、RWD 有沒有破版）；真的要測瀏覽器原生安全與隔離（iframe sandbox、CSP、postMessage）；真的要碰 Canvas 繪圖、WebRTC、PDF Worker、真實檔案下載；跨頁面的核心主旅程。像「按 Ctrl+Z 會不會復原」「伺服器回 403 時彈窗保不保留重試鈕」這種純狀態與 DOM 事件，全部搬進 JSDOM。37 個殺雞用牛刀的案例降維後，從幾十秒變一兩秒跑完，保護力一模一樣。

**去重。** 29 個案例底下的單元與元件測試早就測得一清二楚，另有 6 個在測暫停中的功能。刪之前照鐵律對 12 處核心邏輯做破壞驗證，結果在第 5 項抓到一支假綠的 JSDOM 測試：它 `mount()` 之後沒等 `await nextTick()` 就發送滾輪事件，那時事件監聽器根本還沒掛上去，整支測試從頭到尾在測空氣。修好等待時機、補上負向控制，重驗 12 項突變 12 全紅，這才敢刪那 29 個案例。

**整併。** 五支各自開頁面的零碎版面測試（膠囊按鈕、投影卡、文字雲縮放、作品牆排版）整併成一支，只開唯一一個瀏覽器分頁，46 個案例靠前端路由在毫秒間切換畫面、直接量測真實 DOM 外框。在 GitHub Actions 上跑完這 46 個真排版測試，總共 11.3 秒，平均一個案例 0.25 秒。

最後上「零孤兒政策」：分片執行器與守門測試規定，除了有專屬 Job 的 PDF 測試，剩下全部 27 支瀏覽器測試檔百分之百排進 PR 的 3 個平行分片。把沉睡已久的舊測試喚醒的第一輪，shard 1 立刻爆出 10 個失敗案例，全都栽在同一件事上。那 10 個學員流程測試自從加了找回小卡之後從來沒人跑過，彈窗鎖住畫面，全部卡死在第一步。

看到那 10 個紅燈，我反而覺得慶幸。一支測試只要不在自動關卡裡跑，就會在你沒注意的時候默默腐爛，等你哪天以為它還在保護你。補上關閉彈窗的步驟後，37 檔 243 案精簡成 28 檔 172 案（少 29.2%），零孤兒；順手還在 800px 視窗抓到一個版面 bug，縮圖欄的「新增投影片」按鈕壓住畫布底部的預覽切換鈕、攔截滑鼠點擊，這種只有真瀏覽器像素測試抓得到。

---

## 三天後的數字

| 指標 | 重整前 | 重整後 |
|---|---|---|
| 本機 `git push` 預檢 | 大改動 617 秒，改單檔 77 秒 | 純文件 7 秒；改 1,258 個檔案 21 秒 |
| PR CI | 固定 420–614 秒，重複打包 5 次 | 純文件 19 秒；全跑 167–186 秒，打包 1 次 |
| 合併主線後 | 重跑整套，最多 280 秒 | tree 相同沿用證據，47 秒 |
| 讀原始碼比對字串的假測試 | 138 支（占 18%）＋抄本＋空斷言 | 0（僅留 12 支契約例外，ESLint 鎖死不准新增） |
| 突變抽樣 80 個 | 漏接 23 個（28.8% 沒紅） | 23 個缺口補齊全轉紅；累計 162 次刪除前破壞驗證 |
| 瀏覽器 E2E | 37 檔 243 案，26 檔孤兒 | 28 檔 172 案，零孤兒，46 個版面測試 11.3 秒 |
| 原則與入口文件 | 9 份 854 行（入口共 1,080 行） | 349 行（入口共 548 行），附「規則 → 強制機制」表 |

三天、六個階段、33 條 PR。表面上改的是測試跟 CI，實際上重新設計的是人、AI 與程式碼庫之間的信任機制。帶得走的是這六個判斷。

1. **不要相信 AI 寫的測試，也不要相信它口頭說的「已覆蓋」。** 唯一的證據是把產品改壞一次，親眼看它亮紅燈。
2. **先問這道關卡回答什麼問題，再往裡面塞檢查。** 本機只做秒級靜態防呆，PR 依影響範圍選跑，合併後程式碼樹沒變就沿用證據，絕不重工。
3. **把防線往上推。** 能用 Branded Types 讓錯的 ID 傳不進去，就不要寫單元測試；能用 ESLint 或依賴圖擋掉的髒寫法，就不要靠人工 code review。
4. **瀏覽器 E2E 只留給非開真瀏覽器不可的事，而且絕不留孤兒。** 純狀態與快捷鍵全部降維到 JSDOM，版面測試共用單一頁面，每一支 E2E 都必須進自動分片，否則不到一個月就會腐爛。
5. **管住子代理的手腳。** 給便宜快的模型明確不重疊的檔案清單，一次改完、一次驗證，主代理最後做批次破壞驗證，token 消耗直接砍到零頭。
6. **通用方法交給標準框架，專案文件只留特有事實與「規則 → 強制機制」對照表。** 寫了第二次的文字提醒，應該立刻變成一條 Lint 規則或型別約束；還沒變成工具的規則，誠實標註未強制。

---

## 附錄：六階段體檢 Prompt，直接貼給你的 AI

這份範本從我們的做法抽掉了所有專案特定名詞，適用任何有測試與 CI 的 repo。直接複製貼給 Claude Code、Cursor 或 Codex：

> [!WARNING] 先跑唯讀盤點
> 第一輪讓它只輸出診斷報告與分階段計畫，你確認每一階段的刪除清單後再逐階段放行。任何刪測試的步驟，都要求附上破壞驗證的實際結果。

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
