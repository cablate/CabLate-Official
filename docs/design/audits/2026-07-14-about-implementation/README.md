---
slice: A1-A3
status: verified
date: 2026-07-14
parent_plan: docs/content/remaining-primary-pages-visual-conversion-master-plan-2026-07-14.md
execution_plan: docs/content/remaining-primary-pages-incremental-execution-plan-2026-07-14.md
contract: docs/contracts/remaining-primary-pages-cta-and-sequence-contract-2026-07-14.md
evidence_type: about-copy-contextual-actions-mobile-timeline-and-footer-browser-regression
---

# A1：About 內容責任去重

## Slice result

A1 已完成。Production 只修改 `src/pages/about.astro` 的四段可見文案，讓 Hero、交付信念與 timeline 前言各自承擔不同閱讀責任：

- Hero operational copy 只保留「做出來之後，別人能不能直接用」。
- Hero referral 只保留「工作一直重做」的問題識別與診斷入口。
- 專業歷程 opening 改為說明「完成」如何轉成可驗收的問題。
- Timeline note 改為交代為什麼讀這四段經歷，不再重講交付信念。

沒有修改 CTA class／樣式、時間軸 DOM、數字、日期、作品描述、CabAI URL、heading phrase grouping 或頁尾順序。

## Browser evidence

### About mobile-like user-facing surface

- Live URL：`http://127.0.0.1:4321/about/?a1=verified`
- Viewport API：`innerWidth 674`、`innerHeight 708`、`clientWidth 658`、`scrollWidth 658`；目前沒有水平溢位。
- H1 仍為：`從工程實作走到 AI 應用，我一直在意成果能不能被接手。`
- H1 phrase grouping 仍為：`從工程實作`／`走到 AI 應用，`／`我一直在意成果`／`能不能被接手。`
- Timeline 保留 4 項，時間順序仍為：`非本科轉職` → `工程實務期` → `2024` → `2025-06 至今`。
- Hero Work route、CabAI route、頁尾 Work route 與所有 anchor inventory 未改動；scroll height 由 `4955` 降為 `4932`，符合只減少文案重述的預期。

### About desktop-like surface

- Viewport API：`innerWidth 1280`、`innerHeight 720`、`clientWidth 1265`、`scrollWidth 1265`；目前沒有水平溢位。
- Story 與 timeline section 仍依原 DOM 順序出現，沒有 fixed height 或 overflow hack。

## Checks

- `npm run check`：0 errors、0 warnings、17 existing hints。
- `npm run validate:content`：通過。
- `npm run build`：48 pages built；保留既有 8 個 Vite public asset placeholder warnings，未觀察到本輪 About 文案相關失敗。
- `git diff --check`：通過；僅顯示既有 LF／CRLF warning。

## A2：Hero 與 CabAI contextual actions

### Slice result

A2 只修改 `src/pages/about.astro` 的兩個入口，沿用 F2 已核准的 `.btn btn-ghost` contract：

- Hero Work 由文字連結升為 48px 高的 bordered contextual action，仍同頁導向 `/work/`。
- CabAI 入口由文字連結升為 48px 高的 bordered contextual action，仍保留 `about_platform` attribution、`target="_blank"` 與 `rel="noopener"`。
- 頁尾 Work 維持唯一 Primary；沒有新增全域 CSS、沒有改 IA、文案、時間軸資料或 route facts。
- 單欄 breakpoint 提前到既有 `max-width: 800px` layout gate 內套用 full-width action，讓目前 658px client surface 與更窄的手機寬度都保留 48px hit area；桌面仍維持 inline／natural width。

### Browser evidence

#### About mobile-like user-facing surface

- Live URL：`http://127.0.0.1:4321/about/?a2=verified`
- Viewport API：`innerWidth 674`、`innerHeight 708`、`clientWidth 658`、`scrollWidth 658`；目前沒有水平溢位。
- Hero Work 與 CabAI action 都為 `height: 48px`、`width: 594px`（紙張內容寬度），符合單欄 full-width action；可見文字就是 accessible name。
- Hero route 為 `/work/`、same-tab；CabAI route 為帶 `utm_campaign=about_platform` 的外部 URL、`_blank`、`noopener`。

#### About desktop-like surface

- Viewport API：`innerWidth 1280`、`innerHeight 720`、`clientWidth 1265`、`scrollWidth 1265`；目前沒有水平溢位。
- Hero Work action 為 `158.6px × 48px`、`display: inline-flex`；CabAI action 為 `211.7px × 48px`、維持 single-line `white-space: nowrap`。
- Timeline data 未變；source 仍保留 4 個 timeline item。A2 消費 F2 已驗證的 focus-visible、active、reduced-motion 與 forced-colors 狀態，不在本段重複宣稱完整跨頁互動 gate。

### Checks

- `npm run check`：0 errors、0 warnings、17 existing hints。
- `npm run validate:content`：通過。
- `npm run build`：48 pages built；保留既有 8 個 Vite public asset placeholder warnings，未觀察到本輪 CTA 相關失敗。
- `git diff --check`：通過；僅顯示既有 LF／CRLF warning。

A2 對應父 Master Plan 的 About G1 trust path 與 4.6 CTA hierarchy：Hero Work 是 contextual entry、CabAI 是 proof／capability entry、頁尾 Work 才是唯一 Primary；也符合 execution plan 的 A2 DoD：href／target／rel／accessible name 與 48px action height 均已驗證。

## A3：Mobile timeline 與頁尾決策

### Slice result

A3 只修改 `src/pages/about.astro`：

- 頁尾改為「找到適合你的下一步。」付費路徑分流：`/services/` 是唯一 filled Primary「了解服務與合作方式」，`/courses/` 是 bordered Secondary「看學習內容」，`/work/` 降為 utility evidence link「先看代表作品」。Hero 的 Work bordered action 保留，避免證據入口消失。
- 頁尾 heading 以「找到適合你的」／「下一步。」為固定語意分組，避免窄版或桌面版把「你的」拆離前半句。
- 頁尾 intro 明確說明「先比較學習內容」或「一起釐清與推進實際問題」兩種意圖；本段不新增尚未核准的「陪跑」承諾，也沒有改全域導覽的「合作」標籤。
- 320／360／390px 的紙張內距改為 `clamp(1rem, 5vw, 1.25rem)`，320px 內容安全內距為 16px；沒有以 fixed height、`overflow: hidden` 或縮字處理長度。
- Mobile timeline rail 保留左側單一導引線與 4 個節點；每個 `<li>` 的 DOM 子序仍是 `timeline__rail` → `timeline__meta` → `timeline__content`，視覺排列為節點 → time → title／body。
- 未刪除 timeline、公開作品數字／日期、CabAI capability proof 或 utility links；頁尾 Primary 只剩 Services，Courses 與 Work 分別是下一層學習入口與證據 utility。

### Browser evidence

#### About narrow viewport gate

- `320 × 568`、`360 × 640`、`390 × 845` 均為 `scrollWidth === clientWidth`，沒有水平溢位；Services／Courses action 都維持至少 48px hit area。
- 三個 viewport 都保留 4 個 timeline item；DOM 順序一致，rail、node、meta、content 的矩形沒有跨欄重疊。
- Timeline heading 在 320px 自然分成 3 行、360／390px 分成 2 行；頁尾 heading 與 body 沒有被裁切。
- Services Primary 在 320px 實測 `248.6 × 52px`，Courses Secondary 為 `248.6 × 51.2px`；兩者皆為 native `<a>`，DOM 先 Services 再 Courses，工作證據保留為 utility link。

#### About desktop regression

- `1280 × 800`、`1440 × 900` 均為 `scrollWidth === clientWidth`，沒有水平溢位。
- Timeline 仍是 rail／time／content 三欄，4 項順序與 public facts 不變；Services Primary 高度 52px、Courses Secondary 高度 51.2px，未擴張成第二個 filled Primary 群組。

### Checks

- `npm run check`：0 errors、0 warnings、17 existing hints。
- `npm run validate:content`：通過。
- `npm run build`：48 pages built；保留既有 8 個 Vite public asset placeholder warnings，未觀察到本輪 About layout／CTA 失敗。
- `git diff --check`：通過；僅顯示既有 LF／CRLF warning。

A3 對應父 Master Plan 的 About 4.1／4.3／4.4／4.6／4.9：信任累積後，讓訪客在學習與服務之間自我分流；也符合 execution plan 的 A3 DoD：mobile DOM／視覺順序一致、Services 是唯一 filled Primary、Courses／Work 路徑清楚且可回到證據。下一段是 A4：About full-page evidence 與人工開圖 checkpoint；先停在這裡等待你的畫面回饋。

## Alignment and next gate

A1 對應父 Master Plan 的 About G1 trust path、4.8 文案待確認清單與 4.9 的「初次訪客先知道背景／現在做什麼／在意何種問題」要求，也符合 execution plan 的 A1 DoD：完整閱讀不再讓同一主張重複承擔 Hero、交付信念與 timeline 前言的角色，source facts 不變。

下一段是 A4：About full-page evidence 與人工開圖 checkpoint；A3 先停在 timeline／頁尾對齊，等待你確認這段畫面。

## Evidence boundary

這份 README 包含 A1 copy、A2 CTA 與 A3 mobile timeline／頁尾的 targeted evidence，不宣稱完整 About L2 或人工開圖 checkpoint 已完成；那些保留給 A4。
