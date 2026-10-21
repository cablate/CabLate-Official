---
title: "帶著 AI 把 2012 年的無原始碼老遊戲從零救活：多模型逆向除錯與本機 v1.0.0 優化實錄"
description: "面對 14 年前無原始碼的 32-bit 客戶端與 6 支老 Linux 服務端，拆解我們如何透過 model-relay 調度 DeepSeek、GLM 與 Gemini 等低阻攔模型啃下 x86 組語與封包雜湊，並在封版前靠雙端反組譯救回原版任務。"
publishDate: 2026-10-21T12:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "逆向工程", "Multi-Model", "model-relay", "舊系統維護"]
readingTime: 9
draft: false
excerpt: "每個人心裡都有一款想在自己電腦上重溫的童年老遊戲。當我們在封閉本機環境測試一套 2012 年、完全沒有原始碼的 3D MMORPG 雙端執行檔時，放上 2026 年的環境卻是一開機就全毀。這篇記錄我們如何搭配低阻攔模型一路拆解 x86 組語、封包雜湊與 Linux 服務端，完成本機 v1.0.0 原版優化基準。"
problemTag: "無原始碼老系統一開機就崩潰且 AI 拒看組語"
ogHighlight:
  label: "2012 老遊戲本機逆向救活"
  before: "秒崩閃退＋啟動 79 秒＋狂刷硬碟"
  after: "3 秒瞬開＋0 B/s 待機＋查詢快 149 倍"
---

> [!IMPORTANT] 研究邊界與安全聲明
> 本文記錄之逆向分析與相容性調校，全程僅於**個人封閉本機環境（`127.0.0.1`）**進行老舊軟體數位保存（Digital Preservation）與舊系統（Legacy System）相容性研究。文中已隱去特定商業作品名稱與網路位址；本專案**不公開、不散播、亦不提供任何受著作權保護之執行檔、封包或資料庫下載，且絕不涉及任何私服架設或商業營運**。文內提及之「v1.0.0 基準版」純屬個人本機相容性研究的封存里程碑。

每個人心裡大概都有一款十幾年前的童年神作。對我來說，那是一款 2012 年的經典 3D MMORPG：一直很想在自己的電腦上單機跑起來，偶爾上去站在主城聽聽背景音樂、牽著羊駝坐騎散步，重溫當年的感動。

但當我們在封閉本機環境裡，把 2012 年那批老檔案（1 支 32-bit C++ 客戶端 `game_.exe`、6 支靜態編譯的舊 Linux 服務端、4 座舊 PostgreSQL 資料庫）搬到 2026 年的 Windows 11 與現代容器上時，四個大坑同時炸開：

1. **Linux 服務端一啟動就秒崩（Segfault）**：十幾年前靜態編譯的執行檔，一碰到現代容器的名稱解析（`NSS / glibc`）當場暴斃。
2. **連進去了卻永遠卡在「載入角色列表」**：`LoginServer` 讀出的資料庫還殘留著十幾年前寫死的舊公網 IP，而且單機同 IP（`127.0.0.1`）下 `WorldServer` 與 `ZoneServer` 的內外連接埠還會自己打架。
3. **開遊戲切個視窗（`Alt+Tab`）就閃退**：每次啟動得先看 67 秒片頭名單、再卡 12 秒載入 141MB 動作檔；這期間只要滑鼠點到別的視窗，立刻跳出 `CEGUISingleton.h Line: 79 ms_Singleton` 空指標崩潰。
4. **進遊戲後滿地亂碼、防外掛驗證碼踢人、硬碟還被狂刷**：資料庫裡 **87,325 筆**中文因為當年 `LATIN1 / BIG5` 雙重錯置全變天書；單機沒有外部圖片伺服器，走兩步跳出驗證碼（Captcha）就把人踢下線；6 支服務端在背景每秒狂刷幾千次 `EVAL()` 計時日誌與 `fflush`；舊版點陣字在現代高解析度螢幕上更是糊到眼睛痛。

手邊沒有任何一行 C++ 原始碼，只有編譯好的二進位執行檔與加密封包。幾天後，我們帶著 AI 不只把這座 14 年前的老系統在本機救活，還完成了個人保存的 **「v1.0.0 原版優化基準版」**。

---

## 為什麼拿一般 AI 修無原始碼的老系統，第一步就會卡死？

**因為只要提到「反組譯執行檔、檢視 ELF binary 位移、略過離線驗證碼或解析封包格式」，一般護欄過敏的模型就會開始跳針說教，拒絕往下分析。**

很多人試過帶 AI 做底層除錯或逆向工程（Reverse Engineering），最挫折的地方往往卡在護欄：你明明只是在本機救一套十幾年前的孤兒系統，才剛把 `objdump` 的輸出貼上去，它就回你一段道德勸說：「我無法協助逆向或修改執行檔。」在沒有原始碼的老系統除錯裡，這種無腦攔截等於直接宣判死刑。

要打穿這道牆，做法其實很直接：透過我們開源的 [`model-relay`](https://github.com/cablate/model-relay) 外掛，在同一個 Claude Code 工作台裡**混搭主力模型與「阻攔低、不無腦說教」的模型**（例如中國開源模型 DeepSeek、GLM，或是 Gemini / Argon 等願意直接啃組合語言與 Binary byte offset 的模型）：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 330" role="img" aria-labelledby="legacyRelayTitle">
      <title id="legacyRelayTitle">單靠高護欄模型卡死 vs 用 model-relay 混搭低阻攔模型拆解 2012 老遊戲雙端黑盒子</title>
      <rect x="0" y="0" width="760" height="330" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">面對 2012 無原始碼雙端黑盒子：高護欄單一模型 vs 多模型手術分工</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">❌ 單靠高護欄模型：一看到反組譯、ELF offset 與封包結構就觸發拒絕說教</text>
      <rect x="24" y="70" width="220" height="58" rx="6" fill="#f8f5ed" stroke="#d7d1c6" stroke-width="1.5"/>
      <text x="134" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#253047">輸入 x86 組語 / Binary 位移</text>
      <text x="134" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">game_.exe · ZoneServer · .nfs</text>
      <path d="M244 99 H282" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="282,94 290,99 282,104" fill="#b4352f"/>
      <rect x="290" y="70" width="446" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="513" y="94" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">🛑 護欄誤判攔截：「我不能協助逆向或分析二進位執行檔…」</text>
      <text x="513" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">連記憶體偏移與封包雜湊都不肯算，本機除錯進度直接停擺</text>
      <line x1="24" y1="146" x2="736" y2="146" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="172" font-size="12.5" font-weight="700" fill="#26734f">✅ 主線統籌 ＋ 低阻攔模型（DeepSeek / GLM / Gemini）：直接攤開組語逐行破案</text>
      <rect x="24" y="186" width="206" height="120" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="127" y="212" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">Claude Code 雙層調度</text>
      <text x="127" y="234" text-anchor="middle" font-size="11.5" fill="#253047">• 主線：架構統籌與版本對帳</text>
      <text x="127" y="254" text-anchor="middle" font-size="11.5" fill="#6248c8" font-weight="700">• 低阻攔模型：DeepSeek /</text>
      <text x="127" y="272" text-anchor="middle" font-size="11.5" fill="#6248c8" font-weight="700">  GLM / Gemini (Argon)</text>
      <text x="127" y="292" text-anchor="middle" font-size="11.5" fill="#5f687a">直接啃 objdump 與 Binary 位移</text>
      <path d="M230 246 H266" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="266,241 274,246 266,251" fill="#26734f"/>
      <rect x="274" y="186" width="146" height="120" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="347" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">① 客戶端診斷</text>
      <text x="347" y="232" text-anchor="middle" font-size="11.5" fill="#253047">抓出 0x6790c0 競態</text>
      <text x="347" y="252" text-anchor="middle" font-size="11.5" fill="#253047">0 byte 動主程式</text>
      <text x="347" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">79 秒 → 3 秒瞬開</text>
      <rect x="432" y="186" width="146" height="120" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="505" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">② 封包與字體還原</text>
      <text x="505" y="232" text-anchor="middle" font-size="11.5" fill="#253047">解 FNV-1 64-bit 雜湊</text>
      <text x="505" y="252" text-anchor="middle" font-size="11.5" fill="#253047">換上 6.1 萬字向量字型</text>
      <text x="505" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">87,325 筆亂碼歸零</text>
      <rect x="590" y="186" width="146" height="120" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="663" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">③ 6 大服務端與 DB</text>
      <text x="663" y="232" text-anchor="middle" font-size="11.5" fill="#253047">3-byte 停用離線驗證碼</text>
      <text x="663" y="252" text-anchor="middle" font-size="11.5" fill="#253047">補 13 組外鍵索引</text>
      <text x="663" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">0 B/s 寫入 · 快 149 倍</text>
    </svg>
  </div>
  <figcaption>上方是單一高護欄模型在底層除錯中的常見死結；下方透過多模型分工，讓低阻攔模型直接分析組合語言與封包結構，一次打通客戶端、封包與服務端。</figcaption>
</figure>

當 AI 不再跟你打官腔，願意直接把 `objdump` 與 Ghidra 等級的 x86 / x64 組合語言攤開來一行一行追記憶體位址，整個本機救援進度就像開了倍速一樣。

---

## 沒有一行原始碼，AI 怎麼讓 14 年前的老遊戲「3 秒瞬開、畫質升級、硬碟零寫入」？

**靠的是直接追進客戶端訊息迴圈、推導 64-bit 虛擬檔案系統（VFS）的雜湊演算法，並對 6 支 Linux 服務端與資料庫動微創手術。**

在主線模型統籌、低阻攔模型動刀的配合下，我們一路解開了三個原本看起來無解的陳年頑疾：

### 1. 抓出 2012 年的 Race Condition：主程式 0 byte 修改，啟動從 79 秒縮成 3 秒

以前開遊戲最痛苦的就是漫長等待，而且載入期間只要不小心按到 `Alt+Tab` 切視窗就會當場崩潰。AI 直接追進 `game_.exe` 的 Windows 訊息迴圈（`0x6790c0 -> 0x78a520`），一眼抓出當年留下的競態條件（Race Condition）：客戶端在啟動時同步預載 141MB 的動作檔（`.kfm`），這 12 秒內 UI 系統（`CEGUI::System`）根本還沒初始化完成，但只要視窗失焦觸發 `WM_ACTIVATEAPP`，程式就會直接衝進去呼叫 `CEGUI::System::getSingleton()`，當場撞上空指標。

找到根因後，我們甚至**連 `game_.exe` 主程式都不用改（0 byte 修改，完整保留原始數位簽章與 4GB LAA 大記憶體支援）**。只要在 `client.ini` 關掉同步動作預載（`PrecacheKFM=0`），並略過每次啟動必播 67 秒的片頭人員名單，啟動時間直接從「67 秒 + 12 秒」縮短成 **3 秒瞬開進登入畫面**，怎麼切視窗都不會再閃退。

### 2. 解開設定檔混淆與 64-bit VFS 雜湊：把 8.7 萬筆亂碼與高清向量字體一次救回

解決了閃退，下一個難關是畫面上的天書與鋸齒字。我們先逆向解開了服務端 `.ini` 的 `<encode>` 雙層混淆（`XOR 0x5A` + 4-bit 旋轉 + 變長標頭），把雙端 **319 張資料表**全部對齊；再用腳本把 PostgreSQL 資料庫裡因 `LATIN1 / BIG5` 雙重錯置而毀掉的 **87,325 筆**資料無損還原回繁體中文，並補齊 15 個破損的 UI layout，讓 `CEGUI.log` 上百筆報錯直接歸零（**0 Error**）。

接著是字體升級。2012 年的舊字型內嵌了 1-bit 點陣表（`EBDT / EBLC`），在現代高解析度螢幕上鋸齒感極重。為了釐清同系引擎在 64-bit 架構下的無檔名封包（`.nfs`）索引機制，AI 針對引擎讀檔函式（`0x140B7E290` 與 `0x140B7EA50`）逆向推導出它專屬的 **FNV-1 64-bit 有號位元組雙段雜湊演算法**，從 21.8 萬個封包節點裡把 90 張資料表的真實路徑 100% 還原出來，並將拔除舊版 1-bit 點陣表的 **61,190 字全向量高清字型 `FONT01.TTF`** 掛回 2012 客戶端。一進主城，字體瞬間清晰得像現代重製版。

### 3. 對 6 支 Linux 服務端動 3-byte 微創手術：待機硬碟寫入降到 0 B/s、登入查詢快 149 倍

最後是背景那 6 支老 Linux 服務端。為了讓本機單機環境徹底順暢，我們在測試容器的執行檔與資料庫動了三刀：

| 原本卡死或拖慢的病灶 | 底層逆向找出的真因 | 微創手術與實測結果 |
|---|---|---|
| **走兩步就跳驗證碼把人踢下線** | 單機環境沒有外部驗證碼圖片伺服器，`WorldServer` 與 `ZoneServer` 逾時即斷線 | 定位 `CCaptcha::IsA` 與 `SendCaptchaTest`，用 **3 個 byte**（`xor eax,eax; ret` / `ret`）在單機環境停用 |
| **伺服器待機時硬碟狂刷不停** | 6 支服務端的 `CPerfTimer::Elapsed` 每秒狂刷幾千次 `EVAL()` 日誌與 `fflush`，加上 WSL2 微秒時鐘偶發倒退 | 將計時函式 patch 為回傳 `0.0`（`fldz; ret`）並夾制 `ICurrentTime::Update`，**待機硬碟寫入降至 `0.0 B/s`** |
| **角色登入與讀福袋明顯卡頓** | 當年資料庫漏建 13 個高頻外鍵的 B-Tree 索引，每次登入讀 `fortune_bag` 都觸發全表掃描 | 補齊 13 組索引，查詢耗時從 `16.86 ms` 降至 `0.113 ms`（**加速 149 倍**），且維持 `synchronous_commit = on` 斷電零掉檔 |

---

## 為什麼在封存「本機 v1.0.0 原版優化基準」前夕，AI 推翻了自己昨天的修改？

**因為我們要求把所有改過的檔案與原始備份（`.bak`）做逐位元組（byte-by-byte）對帳，結果 AI 反組譯服務端後發現：前一天為了消掉客戶端報錯而改的一個字，反而會把原版 81 等任務的傳送座標蓋掉。**

這整場救援裡最讓我們起雞皮疙瘩的一幕，發生在封版前夕的自我推翻。

在準備封存第一個完整里程碑時，我們定下了一條鐵則：這個本機里程碑叫做 **「v1.0.0 原版優化基準版（Original Optimized Baseline）」**。意思是單機重溫時必須維持 **100% 原汁原味的 2012 年原版體驗**（不改經驗倍率、不改掉寶、不改技能數值、不塞任何魔改內容，連新手創角的 8 支開場劇情動畫 `Opening*.ogv` 都完整保留），只讓它比當年更穩、更快、更清晰。

為了確保沒有誤傷任何原版邏輯，我們請 AI 把所有修改過的檔案跟原始 `.bak` 備份逐位元組比對。比對到任務腳本時，跳出了一個我們前一天剛修好的地方。

前一天我們在清查客戶端 `error.log` 時，看到系統報錯說 81 等任務（ID 3435）裡有一條指令 `AcceptSRA 1 11` 不存在。當時看同一行前面緊鄰著一個 `AcceptTPA 1 51`（傳送指令），我們跟 AI 都合理懷疑：S 跟 T 都在鍵盤左手邊，這八成是 14 年前企劃把 `AcceptTPA` 打錯成 `AcceptSRA` 了吧？於是昨天順手把它改成了 `AcceptTPA 1 11`，客戶端報錯也真的消失了。

但在 v1.0.0 封版審查時，AI 沒有放過這條差異。它主動把服務端 `ZoneServer` 反組譯出來核對，當場推翻了昨天的修改：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 295" role="img" aria-labelledby="sraAuditTitle">
      <title id="sraAuditTitle">單看客戶端 log 把 AcceptSRA 改成 AcceptTPA 導致座標覆寫 vs 雙端反組譯對帳保住原版任務邏輯</title>
      <rect x="0" y="0" width="760" height="295" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">81 等任務（ID 3435）封版對帳：單看客戶端報錯修字 vs 雙端反組譯追記憶體偏移</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">❌ 前一天的表面修法：只看客戶端 error.log 報錯，把 AcceptSRA 當成錯字改成 AcceptTPA</text>
      <rect x="24" y="70" width="230" height="58" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="139" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">客戶端 error.log 報錯</text>
      <text x="139" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">未知指令：AcceptSRA 1 11</text>
      <path d="M254 99 H290" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="290,94 298,99 290,104" fill="#b4352f"/>
      <rect x="298" y="70" width="206" height="58" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="401" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">誤判為企劃打錯字</text>
      <text x="401" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">改成 AcceptTPA 1 11（log 乾淨）</text>
      <path d="M504 99 H540" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="540,94 548,99 548,104" fill="#b4352f"/>
      <rect x="548" y="70" width="188" height="58" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="642" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4352f">💥 服務端座標被覆寫！</text>
      <text x="642" y="114" text-anchor="middle" font-size="11.5" fill="#5f687a">把原本傳送 51 區的 +0x1f8 蓋掉</text>
      <line x1="24" y1="146" x2="736" y2="146" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="172" font-size="12.5" font-weight="700" fill="#26734f">✅ v1.0.0 封版雙端反組譯對帳：追進 ZoneServer 執行檔（0x08488ce0）還原真實設計</text>
      <rect x="24" y="186" width="230" height="86" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="139" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">MC_AcceptTPA（傳送指令）</text>
      <text x="139" y="232" text-anchor="middle" font-size="11.5" fill="#253047">AcceptTPA 1 51 → 傳送至 51 區</text>
      <text x="139" y="252" text-anchor="middle" font-size="11.5" fill="#26734f" font-weight="700">寫入服務端記憶體偏移 +0x1f8</text>
      <rect x="274" y="186" width="246" height="86" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="397" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#6248c8">MC_AcceptSRA（0x08488ce0）</text>
      <text x="397" y="232" text-anchor="middle" font-size="11.5" fill="#253047">AcceptSRA 1 11 → 設定重生區 11</text>
      <text x="397" y="252" text-anchor="middle" font-size="11.5" fill="#6248c8" font-weight="700">寫入服務端記憶體偏移 +0x04</text>
      <path d="M520 229 H552" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="552,224 560,229 552,234" fill="#26734f"/>
      <rect x="560" y="186" width="176" height="86" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="648" y="212" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">還原腳本 · 0 誤傷封存</text>
      <text x="648" y="234" text-anchor="middle" font-size="11.5" fill="#253047">客戶端僅漏註冊預覽表</text>
      <text x="648" y="254" text-anchor="middle" font-size="11.5" fill="#5f687a">伺服器邏輯 100% 完好保留</text>
    </svg>
  </div>
  <figcaption>上方是單看客戶端報錯就改字的隱性破壞；下方透過反組譯服務端 `ZoneServer`，確認兩個指令寫入完全不同的結構體偏移（`+0x1f8` vs `+0x04`），救回 14 年前的原版任務設計。</figcaption>
</figure>

看到 AI 貼出 `ZoneServer` 位址 `0x08488ce0` 的反組譯結果時，真的會忍不住讚嘆：

原來在服務端裡，真的有一個獨立函式叫做 `MC_AcceptSRA`！它是用來**設定角色重生區域**（寫入任務結構體偏移 `+0x04`），而前面的 `MC_AcceptTPA` 是用來**設定傳送目標**（寫入結構體偏移 `+0x1f8`）。14 年前企劃寫下 `AcceptTPA 1 51` 再寫 `AcceptSRA 1 11`，是為了「把玩家傳送到 51 區，同時把重生點設在 11 區」；客戶端會報錯，純粹是因為客戶端的字串預覽表當年漏註冊了這個純伺服器端指令。如果照我們前一天的改法把 `AcceptSRA` 改成 `AcceptTPA`，表面上客戶端 `error.log` 變乾淨了，實際上卻會在伺服器裡把剛剛設好的 51 區傳送座標直接覆蓋成 11 區！

當下我們立刻把這行腳本還原回原版，正式完成本機 **v1.0.0 原版優化基準版** 的封存。

---

## 帶 AI 啃無原始碼的舊系統時，怎麼複製這套工作流？

回頭看這次在本機從零救活 2012 年老遊戲並完成 v1.0.0 基準版的過程，如果你手邊也有沒有原始碼的企業舊系統（Legacy Binary）、老舊工具或底層效能瓶頸想找 AI 一起攻克，動手前可以先檢查這三件事：

1. **你的工具鏈有沒有被單一模型的護欄綁死？**
   遇到需要看 `objdump` 反組譯、分析封包格式或修補二進位相容性的合法研究任務，先用 [`model-relay`](https://github.com/cablate/model-relay) 把 DeepSeek、GLM 或 Gemini 等低阻攔模型接進 Claude Code。讓主線模型管架構與驗收、派低阻攔模型直接進場拆組語，就不會把時間浪費在跟護欄吵架。
2. **修掉一行報錯前，有沒有對過「另一端」的真實行為？**
   無論是修老系統還是修前後端服務，不要只因為客戶端 `error.log` 不再報錯就以為修好了。要求 AI 拿執行檔或接收端的實際程式碼對帳，確認那個欄位寫進哪個偏移、會不會蓋掉既有狀態。
3. **封存前有沒有守住「與 `.bak` 逐位元組對帳」的基準線？**
   先把第一版鎖定在「100% 不改業務與核心數值的原版優化基準」，每一處二進位或設定修改都必須說得出對應的根因位址，才不會在優化過程中把原作者的細節一起洗掉。

如果你想把這套「單視窗秒切各家模型 ＋ 直接指派低阻攔子代理」的工作台裝進自己的終端機，可以直接看上一篇〈[想在 Claude Code 混用 Gemini 與 GLM，為什麼一改設定檔就全亂套？](/articles/claude-code-multi-model-routing-and-subagent-relay/)〉，或參考〈[AI 幫你寫的測試全綠，為什麼上線還是壞掉？](/articles/ai-tests-false-safety-six-phase-overhaul/)〉看看我們怎麼設計不會被表面綠燈騙過去的驗收防線；想盤點自己手上的 AI 除錯與驗證流程卡在哪一層，也可以先做[免費的 AI 工作流五層健檢](/expertise/)。
