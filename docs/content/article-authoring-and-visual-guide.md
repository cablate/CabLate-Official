---
status: active
as_of: 2026-10-18
applies_to: src/content/articles/*.md, src/pages/articles/, src/layouts/ArticleLayout.astro, src/pages/og/[slug].png.ts
companion_docs:
  - docs/content/copy-voice-guidelines-2026-07-11.md
  - scripts/lint-copy.mjs
  - scripts/validate-content.js
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

## 3. 文章結構與人因閱讀節奏

為確保讀者在桌機與手機打開文章時「第一眼就看懂重點、順著滑下去不覺得累」，內文結構遵循以下四條鐵則：

1. **首屏結論先行（Above-the-Fold Rule）**
   - `excerpt` 導言框用 1–2 句話直接講完「遇到了什麼卡點 → 根因是什麼 → 最後怎麼解決（含關鍵數字）」。
   - 正文前 3 段控制在 **150–250 字內**，直接切入真實場景（例如：「用 SDK 跑多代理系統，每則訊息只打幾個字卻吃掉 2–3% 額度…」），**禁止**寫「在當今 AI 飛速發展的時代…」這類無意義開場白。
   - 若文章依賴特定軟體版本（如 `Claude Code v2.1.71`），在第 3–4 段用一行或 `> [!WARNING]` 講清楚版本前提。
2. **段落長度與呼吸感（Chunking）**
   - **每段只講一個意思**，長度以 **2–4 句話（桌機約 2–4 行、手機約 4–6 行）** 為上限。超過 4 行的段落請拆成兩段或改用項目清單。
   - **每 350–500 字（約 1.5 個螢幕高度）必須出現一個視覺錨點**：可以是 H2/H3 標題、語意化 Callout、比較表格、程式碼區塊，或一張 SVG 圖解，打破純文字牆。
3. **標題階層（H2 / H3）**
   - 內文只用 `##`（H2）與 `###`（H3）。**禁止在內文用 `#`（H1，已由文章標題佔用）或 `####`（H4 以下層級過碎）**。
   - H2 標題必須自帶資訊量（能放進右側目錄讓人一眼看懂文章脈絡）：
     - ❌ 壞標題：`## 背景介紹`、`## 解決方案`、`## 總結`
     - ✅ 好標題：`## Agent SDK 每次呼叫都在 spawn 新 process`、`## 用 V2 Persistent Session 解決 prompt cache 問題`
4. **文末收尾**
   - 結尾直接給出「現在怎麼選／下一步建議」或延伸閱讀連結，不需要再寫一段重複全文的「總結來說，本文介紹了…」。文末轉換統一交給 `ArticleEnd` 元件處理。

---

## 4. Markdown 各格式使用規範

### 4.1 語意化提示框（Callouts）與引用（Blockquotes）
區分「作者的結構化提醒」與「外部原文引用」：
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

---

## 5. AI 生成 HTML / JS / SVG 動靜態圖解規範

這是讓 CabLate 文章「理解爽感上一個層次」的核心武器。當文字涉及**系統架構、資料流向、生命週期差異、決策分流、或前後效能數據對比**時，優先用 AI 生成原生向量 SVG（搭配 CSS 動畫或輕量 JS 狀態切換），取代手繪截圖或純文字描述。

### 5.1 圖解型態選擇表（什麼時候用哪種？）

| 內容情境 | 推薦圖解型態 | 技術作法 | 爽感來源 |
|---|---|---|---|
| **資料流／注入順序／快取命中與斷裂** | **CSS 動態 SVG（Animated Dataflow SVG）** | 純 `<svg>` 搭配 `stroke-dasharray` + `@keyframes` 流動虛線／脈衝圓點 | 讀者直接「看見」請求從哪裡進、在哪個節點塞入多餘資料、在哪裡觸發紅燈 Cache Miss |
| **多方案／多版本行為對照（V1 vs V2、CLI vs SDK）** | **輕量 JS 互動切換圖（Interactive Toggle Diagram）** | 頂部 2–3 個切換按鈕（`<button data-mode="...">`）控制 SVG 群組顯隱與指標數字跳動 | 讀者在同一個畫面點一下就能比較「改之前 vs 改之後」的架構差異，不用上下來回捲動兩張圖 |
| **判斷標準／要不要用某工具（Agent vs 排程）** | **靜態向量決策樹／分層圖（Layered / Decision SVG）** | 結構清晰的 `<svg>` 節點與是/否分支，搭配語意色塊 | 3 秒鐘幫讀者對號入座，找到自己該走哪條路 |
| **實測數據對比（Token 消耗、Cache 命中率曲線）** | **原生向量圖表（Vector Chart SVG）** | 精準刻度的 `<svg>` 折線圖／長條對比圖，關鍵轉折點直接標註文字註解 | 比通用圖表庫更乾淨，直接把「為什麼這裡掉下來」寫在數據點旁邊 |

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
3. **無障礙與動畫禮儀（Accessibility & Motion）**：
   - 每個 `<svg>` 必須包含 `role="img"` 與 `<title>`／`<desc>`，外層包裹 `<figure class="article-diagram">` 與 `<figcaption>` 說明圖表結論。
   - **動畫必加降級保護**：所有 CSS `@keyframes` 動態效果必須放在 `@media (prefers-reduced-motion: no-preference)` 內，或於 `@media (prefers-reduced-motion: reduce)` 下設為 `animation: none;`，確保靜態終態依然完整可讀。
   - **禁止高頻閃爍**：流動光點或脈衝週期控制在 `2.5s–4s`，柔和不搶奪正文閱讀注意力。

---

## 6. 去 AI 味與語氣紅線（`npm run lint:copy -- --strict`）

寫完文章或圖說後，必須確保 **0 觸發** 以下 AI 常見句型（建置與 CI 會自動阻擋）：

| 禁用模式 | 為什麼不自然 | 替代寫法 |
|---|---|---|
| **破折號 `——`** | 中文 AI 翻譯腔最明顯的標記 | 改用逗號、句號、括號，或直接拆成兩句 |
| **對比句型：「不是 A，而是 B」「不是 A，是 B」** | AI 最愛用來故作深沉的轉折公式 | 直接陳述事實（例如：「問題出在 `readFileState` 每次都被重建」） |
| **遞進套話：「不只是…」「不只/不僅…更…」** | 像銷售簡報口號 | 直接並列兩件事，或講清楚先後關係 |
| **強調贅詞：「真正的」「關鍵」「說白了」** | 靠形容詞撐氣勢，缺乏實質資訊 | 刪掉贅詞，直接給出數據、函數名或因果關係 |
| **冒號揭示句（Colon Reveal）**<br>如：`答案很簡單：`、`結論只有一個：`、`我學到一件事：` | 刻意賣關子的社群農場文腔調 | 把結論直接寫成完整的陳述句 |
| **空泛黑話**：`打造`、`賦能`、`無縫`、`一站式`、`全方位`、`深度`、`極致` | 像公關稿而非工程師實作筆記 | 改用具體動詞：`寫了`、`接上`、`改用`、`實測`、`拆開` |

---

## 7. 發佈前自我檢查清單（Pre-publish Checklist）

每次新增或修改文章、插圖與 OG 設定後，在 `F:/_Program/OwnProject/CabLate` 執行以下指令確認全數通過：

```bash
# 1. 檢查文案是否有 AI 禁用詞或破折號（必須為 0 total）
npm run lint:copy -- --strict

# 2. 檢查 Frontmatter 日期時區、禁用標記與圖片路徑
npm run validate:content

# 3. 檢查 TypeScript 與 Astro 模板型別（必須 0 errors, 0 warnings, 0 hints）
npx astro check

# 4. 完整建置並驗證 SEO / JSON-LD / 入口契約
npm run build && node scripts/validate-entry-surfaces.mjs && npm run validate:seo
```
