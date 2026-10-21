---
status: active
as_of: 2026-10-18
applies_to: src/content/articles/*.md, src/pages/articles/, src/layouts/ArticleLayout.astro, src/pages/og/[slug].png.ts
companion_docs:
  - docs/content/copy-voice-guidelines-2026-07-11.md
  - scripts/lint-copy.mjs
  - scripts/validate-content.js
  - scripts/validate-svg-diagrams.mjs
---

# CabLate 文章寫作、Markdown 排版與 AI 圖解規範

這份文件是日後在 `cablate.com` 撰寫新文章、改寫舊文章，以及請 AI 生成文章內動靜態 SVG 圖解與 OG 圖時的**唯一實戰基準**。寫文章前或請 AI 協作前，請先讀取本檔。

---

## 1. 文章定位與分流規則（寫在哪裡？）

動筆前先確認文章屬於哪一類（依據決策 D1）：

| 類型 | 發佈位置 | 核心特徵 | 範例 |
|---|---|---|---|
| **Cab 的判斷／逆向拆解／架構觀點** | `cablate.com/articles/`（本站） | 帶有個人實測數據、原始碼逆向、工程取捨，或對產業現象的結構化拆解；能建立長期權威並導流至電子報與企業內訓 | 〈逆向 Claude Agent SDK 找出 2-3% 額度消耗根因〉、〈OpenClaw 五層架構拆解〉 |
| **純產品操作／步驟教學／環境排查** | `cabai.cablate.com/library` | 針對特定工具安裝、設定步驟、常見報錯的快速排除手冊 | 〈Codex CLI 安裝與常見錯誤排查〉 |

---

## 2. Frontmatter 欄位契約

每篇 `.md` 檔案頂部必須包含以下 YAML Frontmatter（由 `src/content/config.ts` 與 `scripts/validate-content.js` 自動驗證）：

```yaml
---
title: "逆向 Claude Agent SDK：找出每則訊息 2-3% 額度消耗的根因與解法" # 必填，≤ 60 字元，直述問題與解法
description: "Agent SDK 的 V1 query() 每次 spawn 新 process 導致 prompt cache 永遠 miss。逆向 cli.js 找到根因，用 V2 persistent session 把 cache efficiency 從 25% 拉到 84%。" # 必填，≤ 160 字元，供搜尋引擎與社群預覽
publishDate: 2026-03-25T10:00:00+08:00 # 必填，若含時間必須帶 +08:00 時區
updatedDate: 2026-04-04 # 選填，有實質更新才填，不可批次刷同一個假日期
category: "技術觀點" # 必填，目前統一用「技術觀點」或「AI工具實戰」
tags: ["Claude Agent SDK", "prompt caching", "逆向工程"] # 選填，供內部索引與結構化資料使用
readingTime: 15 # 建議填寫，預估閱讀分鐘數（以每分鐘 350–400 字加圖表閱讀時間估算）
draft: false # 正式發佈設為 false
excerpt: "SDK 每則訊息吃 2-3% 額度，逆向 cli.js 找到根因，用 V2 persistent session 解決。" # 強烈建議填寫，≤ 200 字元，會渲染為文章開頭的暖米底重點導言框
problemTag: "Agent SDK 每次呼叫都燒 2-3% 額度" # 選填（已啟用），≤ 24 字元，顯示於列表頁卡片與 OG 圖左上角徽章
ogHighlight: # 選填（已啟用），供 OG 圖生成高辨識度數據卡
  label: "Prompt Cache Efficiency"
  before: "25%（V1 query）"
  after: "84%（V2 persistent）"
---
```

- **`problemTag` 與 `ogHighlight` 用途與限制**：`problemTag` 用一句話直述讀者痛點（上限 24 字元），會顯示在文章列表與 OG 圖左上角徽章；`ogHighlight` 則在 OG 圖標題下方渲染 `before → after` 數據對比卡（`before` 與 `after` 建議各控制在 20 字元內，避免擠壓標題；無明確前後數字對比的觀點文可省略 `ogHighlight`）。兩個欄位皆受 `scripts/lint-copy.mjs` 掃描，值內禁止使用破折號、冒號揭示句與禁用詞。

---

## 3. 人本三維度、價值鏈與「疑問鏈」閱讀節奏（對齊 `public-content-methodology.md`）

我們的文章不需要靠長篇大論或艱深術語撐場面，而是站在**「人類工作記憶上限（一次 3–4 個資訊塊）」**與**「資訊覓食本能（每 10 秒計算繼續讀值不值得）」**設計體驗。遇到取捨時，嚴守**不可倒置的四層價值鏈（真 → 懂 → 記 → 美）**：

1. **真（Truth & Current Reality）**：機制與事實不誤導；必須採用**當下最新（而非一年前已淘汰）的真實實戰與證據邊界**，引用《講師與企業培訓經歷主檔》時嚴守原單位口徑（如「23 份網站網址提交」「76 次平台練習提交」）。
2. **懂（Zero-Tax Comprehension）**：一眼看清結構、分流與因果；零比喻切換稅、零跨頁記憶稅。
3. **記（10-Second Memory Anchor）**：讀者關掉頁面後，腦中留得下 **1 張結構白板圖** 或 **1 個十秒判準**。
4. **美（Editorial Craft & Voice）**：語氣自然、排版呼吸感、紙本墨色與去 AI 腔。

### 動筆前必鎖定的 7 欄人本規格（Human Spec Card）

動筆或改稿前，必須先從三個「人」的維度確認這 7 件事：
- **看內容的人（Reader's Reality）**：
  1. `misconception`（他點進來前卡在哪個錯誤歸因？）
  2. `familiar_carrier`（他今天打開電腦親眼看到的真實介面、設定檔或報錯是什麼？直接拿真實載體開場）
- **理解與記憶的大腦（Cognitive Model）**：
  3. `mental_model`（整篇只用哪 **1 個核心空間模型**貫穿到底？**嚴禁每段換一套生活比喻造成 Metaphor Overload**）
  4. `must_coexist`（哪兩端對照必須在同一個視野裡**同屏並置**，讓眼睛直接掃視比對？）
  5. `memory_anchor`（關掉分頁後，他腦中帶走的那 1 張白板圖或 1 個十秒檢查問題是什麼？）
- **講話／寫作的創作者（Creator's Lens）**：
  6. `creator_lens`（有哪些是只有 Cab 親身踩過坑才講得出來的決策取捨、代價與不適用邊界？）
  7. `whiteboard_role`（哪個複雜流向或攔截點交給 SVG 白板畫出來，讓內文不必用文字硬描繪空間？）

### 疑問鏈推進五原則

1. **原稿與筆記退回「材料層」，先過濾時效再重排疑問鏈**
   - 工程筆記、研究紀錄或舊稿只是**概念與事實來源**，不是文章大綱。若舊筆記的做法已被原生功能或新架構取代，只能作「以前走過的彎路」對照，主力必須寫**當下最新的真實做法**。
   - **禁止**照「P0～P6 施工階段」「病症一二三 → 規矩一二三 → 成果總結」這種內部驗收報告順序寫文章。
2. **首屏切入 `familiar_carrier` 現場，用「同一件事往前推的疑問鏈」貫穿全篇**
   - `excerpt` 導言框用 1–2 句話講完「遇到了什麼卡點 → 根因是什麼 → 最後怎麼解決」。
   - 正文前 2–3 段直接切入具體翻車現場（誰、手上有什麼真實載體、哪裡壞掉或卡住），點破 `misconception`。
   - **上一節解開一個問題，自然撞出下一節的疑問**；理解了就往下走，不在每節結尾回頭做小總結。
3. **小標寫成「讀者此刻心裡冒出的話」，下面第一句直接給答案（H2 / H3）**
   - 內文只用 `##`（H2）與 `###`（H3），禁止用 `#`（H1）或 `####`。
   - H2 小標優先寫成讀者順著上一段會問出口的問題，**小標下面第一句粗體直接回答**，第二句才展開原因與例子：
     - ❌ 工程階段／分類標題：`## P3：大掃除`、`## 收尾：文件砍一半`、`## 背景介紹`
     - ✅ 疑問鏈小標＋首句直答：
       `## 那我叫 AI 把假測試刪掉重寫，總可以了吧？`
       `**直接叫它刪更危險，因為它連「別處已經測過了」都會看走眼。**`
4. **「我」只在轉折處下判斷（`creator_lens`）；為節奏放寬瑣碎驗收細節**
   - 用「你」描述讀者處境，到了需要潑冷水、點破盲點或取捨時，用「我」直接講判斷與真實代價（如：「但我想潑你一點冷水」「這樣做很靈活，但代價也很明顯」）。
   - **放寬瑣碎細節**：材料裡若有幾十個精確秒數、PR 編號、內部函式名，只要不影響理解核心機制，就濃縮成直覺量級（「超過 10 分鐘變 20 秒內」）或移除。
5. **結尾停在 `memory_anchor`（十秒鐘能問出口的檢查問題或可直接複製的工具）**
   - 結尾不寫重複全文的回顧摘要，也不列工程成績單；回到開頭的問題，給讀者 2–3 個十秒鐘能問出口的檢查問題，或直接附上可用的 Prompt／檢核單。文末轉換交給 `ArticleEnd` 元件處理。

---

## 4. Markdown 各格式使用規範

### 4.1 語意化提示框（Callouts）與引用（Blockquotes）
區分「作者的結構化提醒」與「外部原文引用」：
- **`> [!IMPORTANT]`（研究邊界與安全聲明）**：涉及無原始碼逆向工程、封包／記憶體拆解、資安漏洞實測或敏感第三方系統時，必須置頂於正文第一段前，載明封閉本機測試環境（`127.0.0.1`）、數位保存／相容性研究目的與不散播受版權保護檔案之邊界；同時全篇須完成去識別化（含文章檔名 slug、產品與廠商名、真實公網 IP、SVG 內部 `id` 及程式碼專有 Namespace）。
- **`> [!NOTE]`（結論速記／本段重點）**：放在長段逆向推導或實驗數據之後，幫跳讀的讀者抓出 1–2 句核心結論。
- **`> [!TIP]`（實作捷徑／省時做法）**：可以直接照抄的設定、指令或最佳實踐。
- **`> [!WARNING]`（版本限制／踩坑警告）**：例如「此 patch 僅適用 v2.1.71，升級前請先跑測試」或「切勿在正式環境關閉驗證」。
- **一般 `>` 引用**：只用於引用他人原話、官方文件原文、或讀者常問的那句原話。

### 4.2 程式碼區塊（Code Blocks）
- **必標語言**：永遠寫明語言（如 ```` ```typescript ````、```` ```bash ````、```` ```json ````），讓語法高亮與頂部語言標籤正確顯示。
- **控制在 25 行內**：貼進文章的程式碼只留「關鍵差異行」與必要的上下文，省略無關的 boilerplate。若完整實作超過 30 行，先拆成「第一步／第二步」分段講解，或放重點片段並附上完整檔案結構說明。
- **註解只寫「為什麼」**：不在程式碼裡寫 `// 宣告變數` 這類廢話，只標示關鍵攔截點（例如 `// 關鍵：清空 readFileState 避免 C26 觸發重複 diff 注入`）。

### 4.3 表格（Tables）
- 只要內文出現 **3 個以上對象的多維度比較**（例如：`CLI 互動模式 vs SDK V1 vs SDK V2`、`理論覆蓋率 vs 實際落地`），**一律改用 Markdown 表格呈現**，不要用冗長的排比句硬寫。
- 表格欄數控制在 **3–5 欄**，每格文字簡短直接，確保在手機橫向捲動時一眼能對照。

### 4.4 站內文章互連與商業 Hub 導流（Topic Cluster & Internal Linking）
- **為什麼要做**：讓讀者在碰到延伸疑問時有路可走，同時把搜尋引擎權重集中到同主題叢集（見 `seo-topic-cluster-小型站點內容成長策略.md`）。
- **連結方式（自然嵌入語境，不堆砌死板清單）**：
  1. **關聯已發舊文（Spokes 互連）**：每篇至少自然連向 **1～2 篇站內已發布的相關文章**（使用相對路徑 `/articles/<slug>/`）。當內文提到某個已在別篇拆解過的底層機制（例如寫逆向協作提到 `model-relay` 路由、寫測試提到 `CLAUDE.md` 與 `Skill` 分工），直接把關鍵詞做成行內連結，不必在本篇重講一遍。
  2. **連回核心服務／產品頁（Hub 導流）**：在文章後半段或結尾收斂處，依主題順著語境連回對應的商業 Hub（如 `/courses/`、`/expertise/`、`/services/enterprise/`、`/services/consulting/`），並同步登記於《知識帳本》的「關聯文章與商業 Hub」欄位。

---

## 5. AI 生成 HTML / JS / SVG 白板圖解規範（`whiteboard_role` & `must_coexist`）

SVG 圖解存在的唯一理由是**幫讀者的大腦省力氣**，扮演作者手上的**白板（`whiteboard_role`）**：把文字難以一眼講清楚的「空間包含、資料流向、破口與攔截點、前後比例差異」攤開在眼前。

### 5.0 三條認知與白板鐵則（違反任一條即退件重畫）

> **認知科學與 UX 設計依據**（保留於本規範鞏固結構，不在文章正文掉書袋）：
> - **工作記憶上限与認知負荷**：Cowan (2001) [*The magical number 4 in short-term memory*](https://doi.org/10.1017/S0140525X01003922)、Sweller (1988) [*Cognitive Load Theory*](https://doi.org/10.1207/s15516709cog1202_4)、NN/g [*Minimize Cognitive Load*](https://www.nngroup.com/articles/minimize-cognitive-load/)。
> - **空間鄰近原則與冗餘效應**：Mayer & Moreno (2003) [*Nine Ways to Reduce Cognitive Load in Multimedia Learning*](https://doi.org/10.1207/S15326985EP3801_6)（Spatial Contiguity Principle & Redundancy Effect）。
> - **分頁隱藏的比較稅**：NN/g [*Tabs, Used Right*](https://www.nngroup.com/articles/tabs-used-right/)（指出當讀者需要同時比較兩個分頁的內容時，隱藏式 Tab 會迫使讀者來回切換並消耗短期記憶）。
> - **資訊覓食理論**：Pirolli & Card (1999) [*Information Foraging*](https://doi.org/10.1037/0033-295X.106.4.643)、NN/g [*Information Foraging Theory*](https://www.nngroup.com/articles/information-foraging/)。

1. **白板測試（拒絕「Bento 純字卡病」）**：
   - **嚴禁把內文已經寫過的句子抄進三個並排方框充當圖解。** 如果把 SVG 裡的 `<rect>` 拿掉只留文字，跟一般段落條列沒有差別，這張圖就是在製造冗餘負擔（Redundancy Effect）。
   - 每一張 SVG 圖（以及每一個分頁）**必須畫出真實的結構關係**：包含表示資料流向／因果連接／攔截點的 `<path>`、`<line>`、箭頭、時間軸節點（`<circle>`）或比例長條（由 `scripts/validate-svg-diagrams.mjs` 自動檢查是否缺少結構連接元素）。
2. **關係同屏並置原則（`must_coexist` —— 優先同屏對照，不亂藏進切換按鈕）**：
   - 根據空間鄰近原則（Spatial Contiguity），人類理解「❌ 錯誤做法哪裡破洞 ↔ ✅ 正確機制在哪裡攔截」靠的是**眼睛在上下或左右兩條路徑之間直接來回掃視**。
   - 因此，凡是兩條路徑能夠上下或左右並排畫在同一張畫布上的對照，**優先畫成「同屏上下／左右對照流向圖（Split-Path Whiteboard）」**，讓讀者第一眼不用點任何按鈕就能看穿差異！
   - 只有在「同一個系統隨模式切換的原地架構變化（且每個模式內部都畫有完整的資料流向與攔截箭頭）」或「3 種以上情境超過單一畫布容量」時，才使用 `data-diagram` 切換按鈕。
3. **視覺與結構誠實（Visual & Structural Honesty）**：
   - 圖中的箭頭方向、容器包含關係、長條比例必須 100% 反映真實系統機制（例如：Webhook 是金流商伺服器直接打向後端伺服器，箭頭絕不能經過前端瀏覽器）。

### 5.1 圖解型態選擇表（依認知目的選擇，而非湊花樣）

| 讀者需要理解的關係 | 推薦白板圖解型態 | 認知省力來源（為什麼這樣畫） |
|---|---|---|
| **❌ 舊做法破口 vs ✅ 新做法攔截點** | **同屏雙軌對照流向圖（Split-Path Comparison SVG）** | 上半軌畫錯誤流向與爆開的破口（紅），下半軌畫正確流向與攔截閘門（綠），眼睛上下一掃立刻看懂「差在哪一步」。 |
| **資料流／注入順序／快取命中與斷裂** | **管線流向與攔截圖（Pipeline & Gate SVG，可搭 CSS 流動虛線）** | 直接看見請求包裹從哪裡進、在哪個節點被塞入多餘資料、在哪道閘門被擋下。 |
| **判斷標準／這件事該放哪裡（3 秒分流）** | **空間決策樹／分層路由圖（Decision Tree / Routing SVG）** | 順著 Q1 / Q2 的是/否路徑走到底，3 秒鐘幫讀者把手頭問題對號入座。 |
| **同一系統在不同模式下的內部管線切換** | **原地狀態切換白板（Interactive State Toggle SVG）** | 當兩個模式都包含完整的多節點流向箭頭、同屏塞不下時，讓讀者在同一個座標系切換觀察管線結構變化。 |

### 5.2 視覺設計 Token（必須與全站紙本墨色 100% 一致）

所有 SVG 圖解禁止使用刺眼的純黑底、螢光色或隨機色盤，必須嚴格採用以下色票：

- **畫布與容器背景**：
  - 圖表外框容器底色：`#fffdf8`（`var(--bg-soft)`），邊框 `1px solid #d7d1c6`（`var(--border)`），圓角 `8px`。
  - 節點／次級卡片底色：`#f8f5ed` 或 `#f3efe5`。
- **文字與線條墨色**：
  - 主文字／核心節點框：`#253047`（`var(--text-primary)`）
  - 次要說明文字／輔助線：`#5f687a`（`var(--text-secondary)`）
  - 結構分隔線／未啟動路徑：`#d7d1c6`
- **語意強調色（Semantic Accents）**：
  - **品牌主強調（關鍵機制／焦點步驟）**：深紫 `#6248c8`（底色 `#f1edff`、邊框 `#b8afc9`）
  - **正常／Cache Hit／推薦路徑（綠）**：文字與線條 `#26734f`（底色 `#eef7f1`、邊框 `#aed7be`）
  - **異常／Cache Miss／Token 暴增／攔截點（紅）**：文字與線條 `#b4352f`（底色 `#fff1ef`、邊框 `#efb4ae`）
  - **警告／條件判斷／中繼狀態（琥珀）**：文字與線條 `#9b6017`（底色 `#fff7e8`、邊框 `#e7c58f`）

### 5.3 字型、字級與多裝置 RWD 鐵則

1. **字型一致**：
   - 中文與一般標籤：`font-family: var(--font-sans)`
   - 函數名、檔案路徑、數據、步驟編號：`font-family: var(--font-mono)`
2. **字級下限（防手機螞蟻字）**：
   - 桌面版 SVG `viewBox` 寬度統一設為 `720` 或 `760`（完美貼合文章 `41rem` ≈ `656px` 閱讀欄寬）。
   - 在 `viewBox="0 0 720 H"` 座標系下，**正文字級不得小於 `13px`，次要標籤不得小於 `11.5px`，節點主標題為 `14px–16px`（`font-weight: 700`）**。
   - 若流程圖橫向超過 4 個節點，在窄螢幕（或預設排版）優先採用**「由上而下（Vertical Flow）」或「雙排折返（Z-Flow）」**構圖，避免在 `375px` 手機上縮成一整排看不清的小字。
3. **無障礙、動畫禮儀與 Markdown HTML 區塊鐵則（Accessibility, Motion & No-Blank-Line Rule）**：
   - **禁止在 `<figure>` 或 `<svg>` 內部留空行（Blank Lines）**：Markdown（CommonMark）遇到空行會強制終止 HTML 區塊，並把後續縮排滿 4 格的 `<path>`／`<rect>`／`<text>` 轉成 `<pre><code>` 程式碼區塊。`<figure>...</figure>` 內所有行必須緊密相連，不得出現空白行。
   - **容器與邊界契約**：每個 `<text>` 的預估寬度必須完全落在所屬 `<rect>`（右邊界至少留 `4px`）與 `viewBox` 內，禁止文字壓框、出框或上下行重疊（由 `scripts/validate-svg-diagrams.mjs` 機械驗證）。
   - 每個 `<svg>` 必須包含 `role="img"` 與 `<title id="...">`（對應 `aria-labelledby`），外層包裹 `<figure class="article-diagram">` 與 `<figcaption>` 說明圖表結論。
   - **動畫必加降級保護**：所有 CSS `@keyframes` 動態效果必須放在 `@media (prefers-reduced-motion: no-preference)` 內，或於 `@media (prefers-reduced-motion: reduce)` 下設為 `animation: none;`，確保靜態終態依然完整可讀。
   - **禁止高頻閃爍**：流動光點或脈衝週期控制在 `2.5s–4s`，柔和不搶奪正文閱讀注意力。

---

## 6. 去 AI 味與語氣紅線（`npm run lint:copy -- --strict`）

寫完文章或圖說後，必須確保 **0 觸發** 以下句型（前六項由建置與 CI 自動阻擋，最後一項比喻紅線靠人工檢查）：

| 禁用模式 | 為什麼不自然 | 替代寫法 |
|---|---|---|
| **破折號 `——`** | 中文 AI 翻譯腔最明顯的標記 | 改用逗號、句號、括號，或直接拆成兩句 |
| **對比句型：「不是 A，而是 B」「不是 A，是 B」** | AI 最愛用來故作深沉的轉折公式 | 直接陳述事實（例如：「問題出在 `readFileState` 每次都被重建」） |
| **遞進套話：「不只是…」「不只/不僅…更…」** | 像銷售簡報口號 | 直接並列兩件事，或講清楚先後關係 |
| **強調贅詞：「真正的」「關鍵」「說白了」** | 靠形容詞撐氣勢，缺乏實質資訊 | 刪掉贅詞，直接給出數據、函數名或因果關係 |
| **冒號揭示句（Colon Reveal）**<br>如：`答案很簡單：`、`結論只有一個：`、`我學到一件事：` | 刻意賣關子的社群農場文腔調 | 把結論直接寫成完整的陳述句 |
| **空泛黑話**：`打造`、`賦能`、`無縫`、`一站式`、`全方位`、`深度`、`極致` | 像公關稿而非工程師實作筆記 | 改用具體動詞：`寫了`、`接上`、`改用`、`實測`、`拆開` |
| **刻意怪異的名詞、形容與比喻**（人工檢查，lint 不涵蓋）：自造擬人化或搞笑說法，如「測試有沒有在上班」「假安心製造機」這類為了有趣而有趣的新造詞 | 讀者要先解碼你的俏皮話才看得懂，多付一次認知成本，而且讀起來像在表演 | 用直述詞：`分辨測試是真是假`、`永遠綠燈`。業界既有慣用語不在此限（`孤兒測試`、`屎山`、`測試腐爛`、`止血`），但第一次出現要順手讓讀者懂 |

---

## 7. 發佈前自我檢查清單（Pre-publish Checklist）

每次新增或修改文章、插圖與 OG 設定後，在 `F:/_Program/OwnProject/CabLate` 執行以下指令確認全數通過：

```bash
# 1. 檢查文案是否有 AI 禁用詞或破折號（必須為 0 total）
npm run lint:copy -- --strict

# 2. 檢查 Frontmatter 日期時區、禁用標記、圖片路徑與內嵌 SVG 圖解幾何／結構契約
npm run validate:content
npm run validate:svg

# 3. 檢查 TypeScript 與 Astro 模板型別（必須 0 errors, 0 warnings, 0 hints）
npx astro check

# 4. 完整建置並驗證 SEO / JSON-LD / 編譯後 SVG 完整性 / 入口契約（若修改了 src/plugins/ 或 src/content/config.ts，建置前須先執行 rm -f node_modules/.astro/data-store.json 清除內容快取）
npm run build && node scripts/validate-entry-surfaces.mjs && npm run validate:seo
```

---

## 8. 與內容產製中心及知識帳本的銜接

本站文章的選題、查重複、寫作節奏與完稿沉澱，統一由**內容產製中心**管理，不在本技術規範重複維護清單：
- **流程與選題入口**：`D:/_CabLate_Agents/general/projects/內容與媒體/內容生產與再利用/README.md`
- **已發文章索引與待發候選佇列（能發就發）**：`D:/_CabLate_Agents/general/projects/內容與媒體/內容生產與再利用/知識帳本.md`
- **跨專案唯一寫作與疑問鏈節奏正本**：`D:/_CabLate_Agents/general/knowledge/writing/public-content-methodology.md`
- **SEO 主題叢集與 GSC 複查規劃**：`D:/_CabLate_Agents/general/knowledge/business/seo-topic-cluster-小型站點內容成長策略.md`


