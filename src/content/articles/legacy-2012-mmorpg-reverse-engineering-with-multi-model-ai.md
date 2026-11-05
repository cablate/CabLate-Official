---
title: "帶 AI 救活 2012 年老遊戲：報錯消失後，我們差點改壞原版任務"
description: "沒有原始碼的老遊戲，先帶 AI 讓舊服務端與客戶端在本機跑起來，封版前的比對又推翻了前一天的修法：客戶端不報錯，仍可能把服務端任務改壞。效能數字也要先看量到的是哪一端。"
publishDate: 2026-10-21T12:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "逆向工程", "Multi-Model", "model-relay", "舊系統維護"]
readingTime: 7
draft: false
excerpt: "我只是想回主城聽音樂、牽著草原羊駝散步，卻得先讓沒有原始碼的六支舊服務端跑起來。帶 AI 把遊戲救活後，封版比對又抓到我們昨天的修法：報錯消失了，原版任務卻差點被改壞。"
problemTag: "客戶端不報錯，任務卻被改壞"
ogHighlight:
  label: "2012 老遊戲本機保存研究"
  before: "消掉客戶端報錯"
  after: "雙端核對，還原誤改任務"
---

> [!IMPORTANT] 研究邊界與安全聲明
> 本文記錄之逆向分析與相容性調校，全程僅於**個人封閉本機環境（`127.0.0.1`）**進行老舊軟體數位保存（Digital Preservation）與舊系統（Legacy System）相容性研究。文中已隱去特定商業作品名稱與網路位址；本專案**不公開、不散播、亦不提供任何受著作權保護之執行檔、封包或資料庫下載，且絕不涉及任何私服架設或商業營運**。文內提及之「v1.0.0 基準版」純屬個人本機相容性研究的封存里程碑。

一條看似打錯字的任務指令，被 AI 修到客戶端日誌不再報錯，直到封版前核對服務端才發現，那個修改會直接覆寫原本的傳送目的地。若你也常讓 AI 修缺原始碼或文件的舊系統 bug，當它回報完成，該去哪確認沒改壞別處？

起點是我只想在自己電腦把一款 2012 年的 3D MMORPG 跑起來，回主城聽音樂、用 GM 工具補發草原羊駝坐騎散步。手邊沒有 C++ 原始碼，只有編譯好的客戶端、六支舊 Linux 服務端與四座 PostgreSQL 資料庫，要搬到 2026 年的 Windows 11 與現代容器（把舊執行環境打包隔開的工具）上跑。以前有些靠逆向客戶端把伺服器端還原出來，現在 AI 用小模型就能做到，當然也不排除是這些遊戲太早期、技術沒那麼完善。

## 沒有原始碼，先讓六支舊服務端與客戶端跑起來

Linux 服務端一進現代環境碰到名稱解析就崩潰，先讓容器不做反查才解決；角色列表載不出來，則是殘留舊連線設定（失效公網 IP）加連接埠衝突。

客戶端啟動原需約 67 秒片頭加約 12 秒預載共約 79 秒；不改主程式、只動已驗證設定，調整預載設定並略過必播片頭與 logo 就壓到約 3 秒。中文亂碼沿資料庫編碼、傳輸、顯示逐段修，無損還原八萬多筆資料。載入時切視窗閃退，則是因介面未初始化完、失焦觸發介面流程。

讓 AI 改遊戲找到突破口就順了，沿途還會看到離譜技術債；幸好自己對遊戲有開發概念，不然 AI 常繞一大圈，token 經不起燒。

## 昨天修好的錯字，今天核對服務端得改回去

我讓不同 AI 模型在同一環境（透過 `model-relay`）依客戶端、服務端與資料、前後差異分工查證。

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

10 月 20 日客戶端報未知任務指令，AI 當錯字改成拼法相近的傳送指令，報錯就消失了。隔天（10 月 21 日）封存 `v1.0.0` 基準版前，我的標準是玩家玩到的要仍是原版；若修復可能改變玩法或計算結果，先標記爭議附證據、不自行保留，並以實際程式、二進位差異（執行檔直接比對）與運行結果為準，不信文件的「已完成」。

沒原始碼時，我讓 AI 反組譯服務端程式（把執行檔拆回可讀指令），看處理該指令的程式段實際寫哪個欄位。一查發現報錯在客戶端、執行在服務端：原指令負責寫重生區，改錯不只漏設重生點，還會覆蓋前一步的傳送目的地；再比對該遊戲 2012、2024、2026 三個版本的同任務原文皆相同，兩相印證後隨即還原。

當天 AI 三次說「100%」同日都被推翻；拿 AI 動手前的原始備份對帳，抓出「該改沒改、做過頭、被執行期污染、無法證明」四類問題，AI 最後回「Ready for Review」並列出待人工實機確認項。

| 判斷位置 | 看得到的結果 | 能下的結論 |
|---|---|---|
| 只看客戶端日誌 | 未知指令的報錯消失 | 客戶端不再報這條錯 |
| 核對服務端行為 | 原指令處理重生區，改寫後會覆寫傳送目的地 | 昨天的修法改變了任務，需要還原 |
| 與原始備份比對 | 找回這一處修改及其理由 | 把誤改腳本恢復為原版 |

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

## 效能數字也一樣：先看量到的是哪一端、哪個情境

待機時服務端由寫入呼叫送出的資料量（非硬碟落盤量），四支為零、兩支各約每秒 10 bytes，共約每秒 20 bytes，比修補前少約三個數量級（約千分之一），但並非六支都零寫入。另外對遊戲的福袋抽獎資料表自寫查詢測出約 149 倍速度差，但服務端啟動時就一次載入整張表，玩家登入不查，這 149 倍不會讓登入變快。多模型調度做法見〈[想在 Claude Code 混用 Gemini 與 GLM，為甚麼一改設定檔就全亂套？](/articles/claude-code-multi-model-routing-and-subagent-relay/)〉。

## 下次 AI 說修好了，封存前先問這三個問題

下次 AI 幫你把報錯修到消失（報錯消失，不等於沒改壞），封存前先照這三個問題對過一遍：

1. **這條錯誤由誰回報，行為由誰執行？** 分清客戶端、服務端與資料的責任，再決定改哪裡。
2. **這項修改改變了哪些原有行為？** 把「讓它能跑」與「想改玩法」分開，才能驗收保存範圍。
3. **與原始備份相比，每一處差異都有理由嗎？** 封存前重看差異，尤其查只因名稱相近、報錯消失就放行的修法。

若團隊常讓 AI 修程式、想整理驗收步驟，可看 [AI 工作流健檢](/expertise/)；有完整原始碼與自動化測試的系統怎麼驗收，可讀〈[AI 幫你寫的測試全綠，為甚麼上線還是壞掉？](/articles/ai-tests-false-safety-six-phase-overhaul/)〉。
