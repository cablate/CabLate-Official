---
title: "帶 AI 救活 2012 年老遊戲：報錯消失後，我們差點改壞原版任務"
description: "沒有原始碼的老遊戲，從啟動閃退、中文亂碼到本機封存。記錄多模型協作的修復過程，以及封版比對如何推翻前一天的修法：客戶端不報錯，仍可能把服務端任務改壞。"
publishDate: 2026-10-21T12:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "逆向工程", "Multi-Model", "model-relay", "舊系統維護"]
readingTime: 7
draft: false
excerpt: "我只是想回主城聽背景音樂、牽著羊駝散步，卻先碰上閃退、亂碼和老服務端不相容。帶 AI 把遊戲救活後，封版比對又抓到我們昨天的修法：報錯消失了，原版任務卻差點被改壞。"
problemTag: "客戶端不報錯，任務卻被改壞"
ogHighlight:
  label: "2012 老遊戲本機保存研究"
  before: "消掉客戶端報錯"
  after: "雙端核對，還原誤改任務"
---

> [!IMPORTANT] 研究邊界與安全聲明
> 本文記錄之逆向分析與相容性調校，全程僅於**個人封閉本機環境（`127.0.0.1`）**進行老舊軟體數位保存（Digital Preservation）與舊系統（Legacy System）相容性研究。文中已隱去特定商業作品名稱與網路位址；本專案**不公開、不散播、亦不提供任何受著作權保護之執行檔、封包或資料庫下載，且絕不涉及任何私服架設或商業營運**。文內提及之「v1.0.0 基準版」純屬個人本機相容性研究的封存里程碑。

**帶 AI 修老系統，報錯消失還不夠。我們曾把一條看似打錯字的任務指令修到不報錯，封版前才發現，那個修改會覆寫原本的傳送目的地。**

這件事的起點其實很單純。我一直想把一款 2012 年的 3D MMORPG 在自己電腦上跑起來，偶爾回主城聽聽背景音樂，牽著羊駝坐騎散步。

手邊沒有 C++ 原始碼，只有編譯好的客戶端、六支舊 Linux 服務端和四座 PostgreSQL 資料庫。把這批老檔案搬到 2026 年的 Windows 11 與現代容器後，連好好開進遊戲都成了難題。

後來我們帶著 AI 完成本機 v1.0.0 原版優化基準。一路修過的閃退、亂碼與背景日誌，讓遊戲能重新運作；封存前推翻自己的那一次，才讓我看清楚，AI 的修復建議要怎樣驗收。

## 先讓它跑起來，再談保存原版

最先碰上的故障分散在不同地方。Linux 服務端碰到現代環境的名稱解析就崩潰；角色列表載不出來，背後有殘留的舊連線設定與連接埠衝突。好不容易能啟動客戶端，載入時切個視窗，又會撞上 UI 尚未初始化的錯誤。

這些現象一起出現，很容易被一句「老遊戲不相容」混過去。但要修，就得分清楚是哪個程序、哪個階段出事。

以切視窗閃退為例，原本啟動會先播約 67 秒片頭名單，再花約 12 秒預載動作檔。在 UI 系統尚未準備好的期間，視窗失焦卻已經會觸發使用 UI 的流程。追清楚這個順序後，我們調整啟動設定、略過片頭名單，當時本機進登入畫面的等待從約 79 秒縮短到約 3 秒，也避開了這條啟動期間的閃退路徑。

這次處理啟動問題，沒有修改主程式。能用既有設定解決的地方，先用設定；每多改一處，就多一處需要證明沒有傷到原版行為的地方。

進遊戲後，還有中文亂碼與舊點陣字型的閱讀問題。我們沿著資料庫編碼、傳輸和客戶端顯示逐段核對，還原中文資料，再處理字型呈現。這些工作看起來都叫「字顯示不對」，實際上得在不同位置修。

## 多模型能分工，結論仍要回到同一份證據

這次研究用了多模型協作，透過 model-relay 把不同模型接進同一個工作環境。有的工作偏向客戶端行為，有的查服務端與資料，有的負責比對修改前後的差異。

分工的好處，是能把不同範圍交出去查，再把結果放在一起核對。但模型回報得再完整，仍要說清楚它看了哪個版本、實際查到哪些內容，以及哪些地方只有推論。

尤其沒有原始碼時，一個錯誤訊息通常只照到系統的一小部分。客戶端說某條指令不存在，能證明的是客戶端在那個位置不認得它；服務端是否使用、怎樣使用，還得另外查。

我們前一天恰好就漏掉了這一步。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 330" role="img" aria-labelledby="legacyRelayTitle">
      <title id="legacyRelayTitle">客戶端、資料與服務端分工後共同核對證據</title>
      <rect x="0" y="0" width="760" height="330" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">本機保存研究：各端分工，再回到證據核對</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">單看一端：錯誤消失仍無法驗收全系統</text>
      <rect x="24" y="70" width="220" height="58" rx="6" fill="#f8f5ed" stroke="#d7d1c6" stroke-width="1.5"/>
      <text x="134" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#253047">客戶端的觀察</text>
      <text x="134" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">啟動、顯示與錯誤日誌</text>
      <path d="M244 99 H282" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="282,94 290,99 282,104" fill="#b4352f"/>
      <rect x="290" y="70" width="446" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="513" y="94" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">只知道這一端的現象</text>
      <text x="513" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">另一端是否改變，仍須核對</text>
      <line x1="24" y1="146" x2="736" y2="146" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="172" font-size="12.5" font-weight="700" fill="#26734f">多模型分工：分別查證，再交叉核對修改前後</text>
      <rect x="24" y="186" width="206" height="120" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="127" y="212" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">主對話統整證據</text>
      <text x="127" y="234" text-anchor="middle" font-size="11.5" fill="#253047">核對版本與研究範圍</text>
      <text x="127" y="254" text-anchor="middle" font-size="11.5" fill="#6248c8" font-weight="700">分別調查客戶端、</text>
      <text x="127" y="272" text-anchor="middle" font-size="11.5" fill="#6248c8" font-weight="700">服務端與資料</text>
      <text x="127" y="292" text-anchor="middle" font-size="11.5" fill="#5f687a">逐項記錄觀察與推論</text>
      <path d="M230 246 H266" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="266,241 274,246 266,251" fill="#26734f"/>
      <rect x="274" y="186" width="146" height="120" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="347" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">客戶端</text>
      <text x="347" y="232" text-anchor="middle" font-size="11.5" fill="#253047">啟動路徑與顯示</text>
      <text x="347" y="252" text-anchor="middle" font-size="11.5" fill="#253047">先用既有設定</text>
      <text x="347" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">約 79 秒 → 3 秒</text>
      <rect x="432" y="186" width="146" height="120" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="505" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">資料與字型</text>
      <text x="505" y="232" text-anchor="middle" font-size="11.5" fill="#253047">核對編碼與傳輸</text>
      <text x="505" y="252" text-anchor="middle" font-size="11.5" fill="#253047">檢查實際顯示</text>
      <text x="505" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">依核對紀錄驗收</text>
      <rect x="590" y="186" width="146" height="120" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="663" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">服務端與資料庫</text>
      <text x="663" y="232" text-anchor="middle" font-size="11.5" fill="#253047">核對實際載入時機</text>
      <text x="663" y="252" text-anchor="middle" font-size="11.5" fill="#253047">寫入呼叫量約 20 B/s</text>
      <text x="663" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">149 倍不代表登入效益</text>
    </svg>
  </div>
  <figcaption>各端觀察必須對回同一個版本與原始備份。效能數字只適用於各自量測的情境。</figcaption>
</figure>

## 昨天修好的錯字，今天得改回去

封存前，我們把目標定為「原版優化基準」：維持原本的經驗、掉寶、技能數值與任務，只處理相容性、穩定性和閱讀體驗。

為了核對有沒有改過頭，我們把修改過的檔案與原始備份逐一比對。任務腳本裡，一條昨天才改好的差異被重新翻了出來。

當時客戶端日誌報了一條未知任務指令。同一行附近剛好有另一條拼法相近的傳送指令，我們跟 AI 都懷疑是當年寫錯字，於是把未知的那條也改成傳送指令。

改完，客戶端日誌乾淨了。單看這個結果，很像修好了。

但封版時再核對服務端，才發現原本那條指令確實存在，負責設定角色的重生區域。旁邊的傳送指令則負責傳送目的地，兩者各有用途。

原版要做的事，是把玩家傳到一個區域，同時把重生點設在另一個區域。我們把兩條都改成傳送指令後，後面那條便會覆寫前面設好的目的地。

| 判斷位置 | 看得到的結果 | 能下的結論 |
|---|---|---|
| 只看客戶端日誌 | 未知指令的報錯消失 | 客戶端不再報這條錯 |
| 核對服務端行為 | 原指令處理重生區，改寫後會覆寫傳送目的地 | 昨天的修法改變了任務，需要還原 |
| 與原始備份比對 | 找回這一處修改及其理由 | 把誤改腳本恢復為原版 |

我們隨即還原那條任務指令。這次對帳保住的，正是起初說好要保存的原版設計。

**一份乾淨的錯誤日誌，只能證明那些訊息沒再出現。任務是否照原本的方式運作，要看執行任務的那一端。**

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 295" role="img" aria-labelledby="sraAuditTitle">
      <title id="sraAuditTitle">單端報錯消失與雙端任務核對的結果對照</title>
      <rect x="0" y="0" width="760" height="295" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">封存前：比較單端報錯與實際任務行為</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">只看客戶端：把不認得的指令當成錯字</text>
      <rect x="24" y="70" width="230" height="58" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="139" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">客戶端日誌報錯</text>
      <text x="139" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">有一條不認得的任務指令</text>
      <path d="M254 99 H290" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="290,94 298,99 290,104" fill="#b4352f"/>
      <rect x="298" y="70" width="206" height="58" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="401" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">改成名稱相近的指令</text>
      <text x="401" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">報錯消失</text>
      <path d="M504 99 H540" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="540,94 548,99 548,104" fill="#b4352f"/>
      <rect x="548" y="70" width="188" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="642" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">傳送目的地被覆寫</text>
      <text x="642" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">另一端的行為已改變</text>
      <line x1="24" y1="146" x2="736" y2="146" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="172" font-size="12.5" font-weight="700" fill="#26734f">核對服務端與原始備份：兩條指令各有用途</text>
      <rect x="24" y="186" width="230" height="86" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="139" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">傳送指令</text>
      <text x="139" y="232" text-anchor="middle" font-size="11.5" fill="#253047">設定傳送目的地</text>
      <text x="139" y="252" text-anchor="middle" font-size="11.5" fill="#26734f" font-weight="700">有自己使用的資料欄位</text>
      <rect x="274" y="186" width="246" height="86" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="397" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#6248c8">重生區指令</text>
      <text x="397" y="232" text-anchor="middle" font-size="11.5" fill="#253047">設定角色重生區</text>
      <text x="397" y="252" text-anchor="middle" font-size="11.5" fill="#6248c8" font-weight="700">使用另一個資料欄位</text>
      <path d="M520 229 H552" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="552,224 560,229 552,234" fill="#26734f"/>
      <rect x="560" y="186" width="176" height="86" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="648" y="212" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">還原誤改腳本</text>
      <text x="648" y="234" text-anchor="middle" font-size="11.5" fill="#253047">核對這一處行為</text>
      <text x="648" y="254" text-anchor="middle" font-size="11.5" fill="#5f687a">逐項確認保存範圍</text>
    </svg>
  </div>
  <figcaption>傳送目的地與重生區分別儲存，將兩條都改成傳送指令會覆寫目的地；核對後還原這一處誤改。</figcaption>
</figure>

## 效能數字也得對回實際情境

同樣的核對方式，也適用於修復成果。

服務端背景日誌確實大幅減少，但待機時並非六支服務端都零寫入。專案核對紀錄顯示，其中四支的寫入呼叫量為零，另外兩支各約每秒 10 bytes，合計約每秒 20 bytes，比修補前少約三個數量級。這裡量的是寫入呼叫量，不能直接稱為硬碟實際落盤量。

資料庫也有一個容易誤讀的結果。自寫查詢曾測到約 149 倍的速度差，但遊戲服務端讀取福袋資料表的方式，是啟動時一次載入，登入時不會執行那條查詢。因此那個倍數無法拿來證明登入變快。

資源索引的核對紀錄則是 83,202 筆，不能寫成沒有來源的 21.8 萬筆。

把這幾件事分清楚，並不會抹掉修復成果。遊戲能在本機啟動、中文能讀、背景日誌減少，都是具體進展；每項進展各自需要對應的證據，不能靠另一個漂亮數字代替。

相關問題可接著看〈[想在 Claude Code 混用 Gemini 與 GLM，為甚麼一改設定檔就全亂套？](/articles/claude-code-multi-model-routing-and-subagent-relay/)〉。

若要把本文的判準用在自己的工作，可參考[AI 工作流健檢](/expertise/)的適用範圍。

## 下次修舊系統，先問改動會影響誰

如果你也在維護沒有完整原始碼或文件的舊系統，這次經驗可以濃縮成三個問題：

1. **這條錯誤由誰回報，行為由誰執行？** 先分清楚客戶端、服務端與資料各自的責任，再判斷要改哪裡。
2. **這項修改改變了哪些原有行為？** 把「讓它能跑」與「想改玩法」分開，才有辦法驗收保存範圍。
3. **與原始備份相比，每一處差異都有理由嗎？** 封存前重看差異，尤其要查那些只因名稱相近、報錯消失就被接受的修法。

我想回去聽主城音樂、牽羊駝散步，所以這個專案有一條很實際的判準：把遊戲修到能重溫，也得保住當年值得重溫的東西。

如果你想接著看有原始碼的產品怎樣驗收，可以讀〈[AI 幫你寫的測試全綠，為甚麼上線還是壞掉？](/articles/ai-tests-false-safety-six-phase-overhaul/)〉。那次我們拿來當證據的測試，同樣被實際行為推翻。
