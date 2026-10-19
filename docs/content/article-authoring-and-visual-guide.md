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

## 3. 文章結構與「疑問鏈」閱讀節奏（對齊 `public-content-methodology.md`）

為確保讀者打開文章時「第一眼就進入現場、順著一條疑問鏈讀到底不覺得累」，內文結構遵循以下五條原則：

1. **原稿與筆記退回「材料層」，不照施工階段或分類清單排**
   - 工程筆記、研究紀錄或舊稿只是**概念與事實來源**，不是文章大綱。
   - **禁止**照「P0～P6 施工階段」「病症一二三 → 規矩一二三 → 成果總結」這種內部驗收報告順序寫文章。動筆前先把材料拆散，重排成讀者心裡的疑問順序。
2. **首屏切入現場，用「同一件事往前推的疑問鏈」貫穿全篇**
   - `excerpt` 導言框用 1–2 句話講完「遇到了什麼卡點 → 根因是什麼 → 最後怎麼解決」。
   - 正文前 2–3 段直接切入具體翻車現場（誰、手上有什麼、哪裡壞掉或卡住），不寫時代背景。若依賴特定軟體版本（如 `Claude Code v2.1.71`），用 `> [!WARNING]` 講清楚版本前提。
   - **上一節解開一個問題，自然撞出下一節的疑問**；理解了就往下走，不在每節結尾回頭做小總結。
3. **小標寫成「讀者此刻心裡冒出的話」，下面第一句直接給答案（H2 / H3）**
   - 內文只用 `##`（H2）與 `###`（H3），禁止用 `#`（H1）或 `####`。
   - H2 小標優先寫成讀者順著上一段會問出口的問題（或具體機制主張），**小標下面第一句直接回答**，第二句才展開原因與例子：
     - ❌ 工程階段／分類標題：`## P3：大掃除`、`## 收尾：文件砍一半`、`## 背景介紹`
     - ✅ 疑問鏈小標＋首句直答：
       `## 那我叫 AI 把假測試刪掉重寫，總可以了吧？`
       `直接叫它刪更危險，因為它連「別處已經測過了」都會看走眼。`
   - 當每一節都符合「問句小標＋首句直答＋判斷與例子」，任何一節都能單獨抽出來重用為貼文或電子報段落。
4. **「我」只在轉折處下判斷；為節奏放寬瑣碎驗收細節**
   - 用「你」描述讀者處境，到了需要潑冷水、點破盲點或取捨時，用「我」直接講判斷（如：「但我想潑你一點冷水」「我不覺得這是模型壞或不乖」）。
   - **放寬瑣碎細節**：材料裡若有幾十個精確秒數、PR 編號、內部函式名，只要不影響理解核心機制（Why / Debug / Done），就濃縮成直覺量級（「超過 10 分鐘變 20 秒內」）或移除。
   - **段落呼吸感**：每段只講一個完整想法（2–4 句話），每 350–500 字搭配一個視覺錨點（H2 小標、Callout、程式碼或 SVG 圖解）。
5. **結尾停在「十秒鐘能問出口的檢查問題」或可直接複製的工具**
   - 結尾不寫重複全文的回顧摘要，也不列工程成績單；回到開頭的問題，給讀者 2–3 個十秒鐘能問出口的檢查問題，或直接附上可用的 Prompt／程式碼。文末轉換交給 `ArticleEnd` 元件處理。

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


