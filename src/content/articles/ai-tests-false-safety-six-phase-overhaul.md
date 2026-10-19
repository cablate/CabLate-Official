---
title: "AI 幫你寫的測試全綠，為什麼上線還是壞掉？"
description: "871 支測試全綠，核心流程卻斷了兩天。拆解 AI 最常寫出的假測試、如何用破壞驗證抓出漏網之魚、把預檢從十幾分鐘壓到 20 秒內，文末附可直接貼給 AI 的體檢 Prompt。"
publishDate: 2026-10-18
updatedDate: 2026-10-19
category: 技術觀點
tags: [AI 工程實戰, 測試策略, CI/CD, TypeScript, Claude Code]
readingTime: 7
draft: false
excerpt: "871 支測試全綠，卻連畫面被彈窗擋死兩天都抓不到。這篇順著我們踩過的坑，拆開 AI 假測試的長相、怎麼親眼驗出測試有沒有用，並附上一份可直接貼給 AI 的體檢 Prompt。"
problemTag: "871 支測試全綠，核心流程卻斷了兩天"
ogHighlight:
  label: "本機推送預檢"
  before: "超過 10 分鐘"
  after: "20 秒內"
---

用 AI 寫程式一段時間之後，多數人都會養出一個好習慣：別只聽它說「改好了」，要叫它補測試、看綠燈。但 AI 寫出來的綠燈也會騙人，而且騙得比沒寫測試還徹底。

10 月中，我請 AI 在自己的即時互動教學系統加一個小功能：學生第一次輸入名字加入課堂時，畫面先彈出一張四位數「找回碼」小卡讓他存成圖片。功能寫好後我按下 `git push`，本機幾百支測試全部綠燈。

結果合併上線才發現，「老師開課＋學生加入」的核心流程，早就因為那張新彈窗擋在畫面正中央而卡死兩天。那時專案帳面上有 871 支測試、三十多道檢查關卡，每次推送要等十幾分鐘，卻連最基本的「畫面被彈窗擋死」都沒抓到。

我叫 AI 全部停下來，把整條驗證流程砍掉重練。下面順著我們一路追問的順序，拆開這座假安心系統是怎麼長出來的，以及怎麼把它清乾淨。

---

## 測試明明寫了八百多支，為什麼連畫面壞掉都抓不到？

**因為 AI 為了省事，根本沒把畫面跑起來，只是把原始碼當純文字讀進來找變數名。**

當我回頭去查那支「守色彩對比度」的單元測試為什麼沒叫，才發現它從頭到尾沒有算過半個顏色，只是用正規表示式檢查檔案裡有沒有寫 `--text-muted` 這個字串。你叫 AI「幫這個功能補測試」卻沒限制寫法時，它最愛直接寫這兩行：

```js
const source = fs.readFileSync('src/features/reset.ts', 'utf8');
expect(source).toMatch(/reset_project_data_v2/);
```

這種測試跑起來只要 0.01 秒，永遠不會因為環境問題失敗，但它守的是檔案裡的字，跟使用者看到的功能毫無關係。我們一盤點，八百多支裡竟然有一百三十多支在幹這件事（另外還有在測試檔裡自己抄一份簡化邏輯測自己的「抄本測試」，以及檢查幾個月前早就刪掉的舊錯誤文案）。

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
  <figcaption>讀原始碼比對字串的測試只管「檔案裡有沒有那個字」，功能壞了照樣綠燈；只有實際觸發行為的測試才抓得到故障。</figcaption>
</figure>

---

## 那我叫 AI 把假測試刪掉重寫，總可以了吧？

**直接叫它刪更危險，因為它連「別處已經測過了」都會看走眼。**

清理第一天，AI 讀完程式碼跟我回報：「A 測試跟 B 測試重複了，B 已經完整覆蓋，所以我把 A 刪掉，測試全綠！」我不放心，手動把產品裡「儲存投影片樣式」的那行邏輯故意改壞，再跑一次測試。結果全專案一片綠燈，只有它剛才想刪掉的那支 A 測試會亮紅燈。原來 B 測試在畫面掛載後還沒等事件綁定好就急著點按鈕，從頭到尾都在測空氣。

所以我們立下一條死規矩：不聽 AI 口頭保證，想刪改任何測試，必須先通過下面的**破壞驗證（Break-Check）**：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 200" role="img" aria-labelledby="breakCheckTitle">
      <title id="breakCheckTitle">破壞驗證（Break-Check）四步閘門：故意改壞產品碼，親眼看接手測試亮紅燈才准刪</title>
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
      <text x="458" y="116" text-anchor="middle" font-size="11.5" fill="#9b6017">看 B 會不會叫？</text>
      <path d="M526 82 H564" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="564,77 572,82 564,87" fill="#26734f"/>
      <path d="M526 118 H564" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="564,113 572,118 564,123" fill="#b4352f"/>
      <rect x="572" y="24" width="170" height="68" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="657" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">B 亮紅燈 → 准刪 A</text>
      <text x="657" y="72" text-anchor="middle" font-size="11.5" fill="#5f687a">還原產品碼確認全綠</text>
      <rect x="572" y="108" width="170" height="68" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="657" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">B 仍綠燈 → 不准刪</text>
      <text x="657" y="156" text-anchor="middle" font-size="11.5" fill="#b4352f">B 在測空氣，先補保護</text>
    </svg>
  </div>
  <figcaption>不信 AI 的口頭「已覆蓋」：先故意改壞產品，親眼看到接手的測試亮紅燈，才准動刀刪舊測試。</figcaption>
</figure>

清完假測試後，我們還反過來抽考剩下的測試：不碰測試檔，隨機挑幾十個業務邏輯故意改壞（反轉分數判斷、拿掉權限檢查、關掉快取過期），結果抓出二十幾個只測成功路徑、沒測權限拒絕的漏網之魚，全數補到會亮紅燈為止。

---

## 測試都改對了，為什麼每次推程式碼還是要等十幾分鐘？

**因為本機、PR 跟合併後這三道關卡一直在重複跑同一批慢檢查，真正會抓出線上故障的雙端測試卻拖到合併後才跑。**

以前不管改兩行字還是改幾百個檔案，本機推送前都要跑完整打包與全套測試；推上 PR 後雲端從頭再跑第二遍；等合併進主線，才第一次去跑最核心的雙端互動流程。我們定了一條新原則，**同一件事只跑一次，把真後端測試前移到 PR 階段**，直接看下面的時間長條比例就能看出等待時間與攔截點的差距。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 280" role="img" aria-labelledby="pipelineTitle">
      <title id="pipelineTitle">重整前後推送管線的耗時長條比例與故障攔截點對比</title>
      <rect x="0" y="0" width="760" height="280" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">推送驗證管線的時間比例對照：砍掉重複慢檢查，把真故障攔截點前移到 PR</text>
      <text x="24" y="60" font-size="12.5" font-weight="700" fill="#b4352f">❌ 重整前：總耗時 20+ 分鐘（重工 2~3 遍），核心雙端故障卻漏到合併後才爆</text>
      <rect x="24" y="72" width="310" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="179" y="96" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b4352f">1. 本機 pre-push：10+ 分鐘</text>
      <text x="179" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">全套測試＋完整打包＋重灌 DB</text>
      <rect x="340" y="72" width="236" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="458" y="96" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b4352f">2. PR CI：7~10 分鐘</text>
      <text x="458" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">本機跑過的再重跑＋重複打包 5 次</text>
      <rect x="582" y="72" width="154" height="58" rx="6" fill="#b4352f"/>
      <text x="659" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#fffdf8">3. 合併後才測雙端</text>
      <text x="659" y="116" text-anchor="middle" font-size="11.5" fill="#fff1ef">💥 壞兩天沒人發現</text>
      <line x1="24" y1="152" x2="736" y2="152" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="178" font-size="12.5" font-weight="700" fill="#26734f">✅ 重整後：總耗時 2~3 分鐘（省下 85% 等待），壞程式碼在 PR 當場攔下</text>
      <rect x="24" y="190" width="96" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="72" y="214" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">本機 20 秒</text>
      <text x="72" y="234" text-anchor="middle" font-size="11.5" fill="#5f687a">秒級型別/Lint</text>
      <rect x="126" y="190" width="196" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="2"/>
      <text x="224" y="214" text-anchor="middle" font-size="13.5" font-weight="700" fill="#26734f">PR CI：1~3 分鐘 🛡️ 攔截點</text>
      <text x="224" y="234" text-anchor="middle" font-size="11.5" fill="#253047">打包 1 次＋真後端雙端互動測試</text>
      <rect x="328" y="190" width="104" height="58" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="380" y="214" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">合併 1 分鐘</text>
      <text x="380" y="234" text-anchor="middle" font-size="11.5" fill="#5f687a">沿用綠燈直上</text>
      <text x="452" y="215" font-size="13" font-weight="700" fill="#26734f">← 省下的 17 分鐘重複等待時間</text>
      <text x="452" y="235" font-size="12" fill="#5f687a">小改動隨時敢推，不再憋成巨型 PR</text>
    </svg>
  </div>
  <figcaption>長條寬度直接對應等待時間：把重複打包與重跑砍掉後，整條管線縮短到 3 分鐘內，且真後端雙端測試前移到 PR 階段當場攔截。</figcaption>
</figure>

通道變快之後，我們順手清查了以前因為「跑太慢」被移出自動名單的二十多支孤兒瀏覽器測試。把不依賴真實排版的案例降到記憶體裡跑、剩下的孤兒重新排進 PR 自動關卡後，第一輪就爆出十個紅燈，全數抓到開頭說的那張找回碼彈窗。**留在專案裡的測試，要嘛每輪自動跑，要嘛驗證後刪掉；躺在角落不跑的測試只會默默腐爛。**

---

## 寫了九份原則文件叫 AI 別再犯，為什麼它讀完照樣寫錯？

**因為寫在 Markdown 裡的規定對 AI 來說只是參考，只有編譯器跟靜態檢查畫的紅線它才繞不過去。**

我們原本有九份近千行的原則文件，白紙黑字寫著「不要亂傳 ID」「不要寫讀原始碼的測試」，但 AI 讀完轉頭照犯。與其寫文件拜託 AI 記住，我們直接把規則沿著下面的五層階梯往上搬，讓錯的程式碼在存檔或推送那一刻就被工具擋死：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 310" role="img" aria-labelledby="constraintTitle">
      <title id="constraintTitle">五層約束階梯：越往上搬，攔截速度越快、越不靠人與 AI 記憶</title>
      <rect x="0" y="0" width="760" height="310" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">把文字規定往上搬成硬約束：越高層擋得越早，越不需要 AI「記得遵守」</text>
      <path d="M38 272 V62" stroke="#6248c8" stroke-width="3" fill="none"/>
      <polygon points="32,66 38,52 44,66" fill="#6248c8"/>
      <rect x="62" y="48" width="490" height="42" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="78" y="74" font-size="13.5" font-weight="700" fill="#6248c8">① 架構消除：移除危險入口，Store 外部唯讀</text>
      <rect x="564" y="48" width="172" height="42" rx="6" fill="#6248c8"/>
      <text x="650" y="74" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fffdf8">⚡ 錯誤根本寫不出來</text>
      <rect x="62" y="98" width="490" height="42" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="78" y="124" font-size="13.5" font-weight="700" fill="#26734f">② 編譯期型別：6 種 ID 貼互斥標籤（Branded Types）</text>
      <rect x="564" y="98" width="172" height="42" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="650" y="124" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">⏱️ 存檔 0.1 秒拒收</text>
      <rect x="62" y="148" width="490" height="42" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="78" y="174" font-size="13.5" font-weight="700" fill="#253047">③ 語法樹與依賴圖：ESLint 禁讀原始碼、鎖單向依賴</text>
      <rect x="564" y="148" width="172" height="42" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="650" y="174" text-anchor="middle" font-size="12.5" font-weight="700" fill="#253047">⏱️ 推送前 3 秒攔截</text>
      <rect x="62" y="198" width="490" height="42" rx="6" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="78" y="224" font-size="13.5" font-weight="700" fill="#9b6017">④ 行為測試：通過破壞驗證的業務與雙端互動測試</text>
      <rect x="564" y="198" width="172" height="42" rx="6" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="650" y="224" text-anchor="middle" font-size="12.5" font-weight="700" fill="#9b6017">⏱️ PR 1~3 分鐘攔截</text>
      <rect x="62" y="248" width="490" height="42" rx="6" fill="#fff1ef" stroke="#efb4ae"/>
      <text x="78" y="274" font-size="13.5" font-weight="700" fill="#b4352f">⑤ 純文字提醒：寫在 CLAUDE.md / AGENTS.md 的口頭規定</text>
      <rect x="564" y="248" width="172" height="42" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="650" y="274" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">❌ 0 攔截（讀完照忘）</text>
    </svg>
  </div>
  <figcaption>寫過第二次的第 ⑤ 層文字提醒，就該沿左側箭頭往上搬成第 ①～③ 層的自動紅線；把六種 ID 換成型別標籤後，傳錯參數存檔即報錯，十幾支防呆測試當場退役。</figcaption>
</figure>

---

## 看到測試全綠，現在就能拿去考 AI 的體檢指令

下次看到測試一片綠燈，先問三個問題：**把功能故意改壞一行會不會紅？這支測試有沒有在每次 PR 自動跑？這條規定能不能往上搬進型別或 ESLint？**

如果你想讓 AI 幫你把專案裡的假測試、重複慢關卡與肥大規則檔清一遍，直接把下面這段體檢指令貼給 Claude Code、Cursor 或 Codex（第一輪先讓它交唯讀診斷報告，確認清單後再動手）：

```text
請對這個專案進行「測試真實性、CI 管線耗時與型別約束」唯讀體檢（先不要修改任何檔案），交出以下 4 份清單：

1. 假測試名單：找出所有用 readFileSync 讀原始碼比對字串、在測試裡重抄產品邏輯測自己、或斷言舊文案不存在的測試檔，逐支標註建議「改為行為測試」或「轉成 ESLint 規則後淘汰」。
2. 孤兒測試與慢關卡對照：列出本機 pre-push、PR CI、合併後各自跑了哪些指令與耗時，標出重複跑了兩遍以上的檢查，以及躺在目錄裡卻沒排進 PR 自動執行的孤兒測試。
3. 可升級為硬約束的規則：讀完 CLAUDE.md / AGENTS.md，挑出哪些文字規定可以直接升級成 Branded Types、集中註冊表、ESLint AST 規則或 dependency-cruiser 單向依賴鎖。
4. 分批改造計畫：每一批刪除或改寫測試前，必須先執行破壞驗證（故意改壞對應產品碼 → 證明接手測試亮紅燈 → 還原確認全綠），請列出第一批最值得動刀的 5 個檔案。
```

拿到清單後，挑最痛的一批開始，親眼看到紅燈再放行。如果還不確定自己的專案最該先修哪一層，可以先做[免費的 AI 工作流五層健檢](/expertise/)，照題目、資料、工具、進度、驗收五個問題找出最划算的修法；想看整套配置怎麼運作，也可以接著讀〈[Claude Code 實戰：我怎麼用 AI 寫完一整個網站](/articles/claude-code-workflow/)〉。
