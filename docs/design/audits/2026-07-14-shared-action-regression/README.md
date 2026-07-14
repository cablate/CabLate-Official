---
slice: F2-F4
status: verified
date: 2026-07-14
parent_plan: docs/content/remaining-primary-pages-visual-conversion-master-plan-2026-07-14.md
execution_plan: docs/content/remaining-primary-pages-incremental-execution-plan-2026-07-14.md
contract: docs/contracts/remaining-primary-pages-cta-and-sequence-contract-2026-07-14.md
evidence_type: shared-cta-state-and-browser-regression
---

# F2：共用 CTA states

## Slice result

F2 已完成。Production 只修改 `src/styles/global.css`，補上共用 `.btn` 的 bordered hover、focus-visible、active 邊界、reduced-motion 與 forced-colors 狀態；沒有修改頁面 DOM、文案、route 或 `.text-link` 語意。

Foundation 仍需由 F3 Home regression 與 F4 Expertise regression 完成整體 checkpoint；本紀錄只證明 F2 的共用狀態與目前兩頁的 targeted regression。

## Intentional CSS changes

| State | Evidence |
| --- | --- |
| Filled | `.btn-primary` 保留既有深色 filled state；hover 排除 `:disabled` 與 `aria-disabled="true"` |
| Bordered | `.btn-ghost:hover` 使用 `--accent`、`--accent-subtle`、`--accent-text`，不把 `.text-link` 轉成按鈕 |
| Focus-visible | `.btn:focus-visible` 為 3px accent outline、3px offset |
| Active | 原有 1px 位移只套用可操作 CTA；reduced-motion 時移除位移 |
| Reduced motion | `.btn` transition 設為 none；active 不再位移 |
| Forced colors | `.btn` 使用 `ButtonText`、`ButtonFace`、`Highlight`、`HighlightText`，不依賴 shadow 或背景圖表達狀態 |

## Browser evidence

### Home

- Live URL：`http://127.0.0.1:4321/`
- Viewport API：`innerWidth 1280`、`clientWidth 1265`、`scrollWidth 1265`；沒有水平溢位。
- Hero CTA 維持 48px；Tab 後 `:focus-visible` 為 true，outline computed 約 `2.73px solid rgb(98, 72, 200)`、offset 約 `2.73px`。
- Home H1、Hero image、CTA destination 與 paper layout 未改變。

### Expertise

- Live URL：`http://127.0.0.1:4321/expertise/`
- Viewport API：`innerWidth 1280`、`clientWidth 1265`、`scrollWidth 1265`；沒有水平溢位。
- Hero、recovery、Courses、Services 四個 `.btn` 仍為 48px；`Context → Skill → Harness` 順序未變。
- 頁尾 `討論實際情境` `.btn-ghost` 可 Tab 聚焦，`:focus-visible` 為 true，focus ring 在 paper surface 上清楚可見。

### Current user-facing tab

- 使用者分頁目前開在 Expertise 的頁尾決策區，`討論實際情境` 為聚焦狀態，方便確認 bordered CTA 與 focus ring。
- 分頁 client width `658`、scroll width `658`；沒有水平溢位。

## Checks

- `npm run check`：0 errors、0 warnings、17 existing hints。
- `npm run validate:content`：通過。
- `npm run build`：48 pages built；保留既有 8 個 Vite public asset placeholder warnings，未觀察到本輪 CSS 相關失敗。
- `git diff --check`：通過；僅顯示既有 LF／CRLF warning。

## Evidence boundary and next gate

F2 部分是 targeted state evidence，不宣稱五種 production viewport、完整 forced-colors runtime 或四頁已完成。F3 延續同一份 evidence 做 Home regression；若後續 Home 或 Expertise 的既有 CTA、route、尺寸或順序失敗，回到 F2，不修改 page scoped CSS。

## F3：Home regression

### Slice result

F3 已完成，沒有修改任何 production file；只補本節 evidence。Home 的既有 Hero、Diagnosis、trust、routes、case 與 CabAI CTA 均維持原有順序、destination、尺寸與 native-anchor 行為。

### Live inventory

| Order | Action | Destination | Target / rel | Height |
| ---: | --- | --- | --- | ---: |
| 1 | 找出問題卡在哪一層 | `#diagnosis` | same tab | 48px |
| 2 | 查看診斷方法 | `/expertise/` | same tab | 48px |
| 3 | 討論合作 | `/services/` | same tab | 48px |
| 4 | 認識我的經歷與判斷方式 | `/about/` | same tab | 48px |
| 5 | 先做問題診斷 | `/expertise/` | same tab | 48px |
| 6 | 找適合的學習路線 | `/courses/` | same tab | 48px |
| 7 | 查看合作方式 | `/services/` | same tab | 48px |
| 8 | 查看工程手冊 | CabAI handbook + `home_case_handbook` | `_blank` + `noopener` | 48px |
| 9 | 查看免費試看與學習內容 | CabAI products + `home_learning` | `_blank` + `noopener` | 48px |

### Browser facts

- Home H1：`讓 AI 把工作做完，成果也能放心交付。`
- Desktop live surface：`clientWidth 1265`、`scrollWidth 1265`、`innerHeight 720`；沒有水平溢位。
- Current user-facing Home surface：`clientWidth 658`、`scrollWidth 658`、`innerHeight 708`；沒有水平溢位。
- 9 個 CTA 依 DOM／視覺順序連續出現；逐一以 Tab 聚焦時，9／9 `:focus-visible` 為 true，focus outline computed 約 `2.73px solid rgb(98, 72, 200)`。
- Hero `#diagnosis` anchor 實測後 target top `83px`、mobile Headbar bottom `70px`，目標沒有被遮住。
- Hero carousel images `complete: true`，可見圖片 natural width 為 `2000` 與 `1970`；沒有 broken image 或空白 loading state。

### Evidence boundary

本次 L1 使用內部瀏覽器當下的 desktop 與 user-facing mobile-like surfaces；瀏覽器控制介面不提供直接切換到精確 `1440×900`／`390×844` 的 viewport，因此不把這兩個精確尺寸宣稱為本節已完成。F2 已由使用者確認 CTA hover／focus 視覺；精確 viewport capture 保留到 G1 的 deferred visual gate。

## F4：Expertise regression 與 Foundation checkpoint

### Slice result

F4 已完成，沒有修改 production file；只補本節 evidence。Expertise 的 Hero、recovery、Courses、Services CTA、三方法順序與頁內 anchors 均維持已驗證行為，F1–F4 的 Foundation evidence 現在一致。

### Live inventory

| Order | Action | Destination | Height |
| ---: | --- | --- | ---: |
| 1 | 先從你看到的問題開始 | `#diagnosis` | 48px |
| 2 | 仍不確定？回到診斷表 | `#diagnosis` | 48px |
| 3 | 查看學習路線 | `/courses/` | 48px |
| 4 | 討論實際情境 | `/services/` | 48px |

- H1：`AI 一直鬼打牆，先別只改 Prompt。`
- Method order：`Context → Skill → Harness`，DOM 與畫面順序一致。
- Anchors `#diagnosis`、`#method-map`、`#next-step` 均存在。

### Browser facts

- Desktop live surface：`clientWidth 1265`、`scrollWidth 1265`、`innerHeight 720`；沒有水平溢位。
- Current user-facing Expertise surface：`clientWidth 658`、`scrollWidth 658`、`innerHeight 708`；沒有水平溢位。
- 4／4 CTA 逐一以 Tab 聚焦時，`:focus-visible` 為 true，outline computed 約 `2.73px solid rgb(98, 72, 200)`。
- Hero 與 recovery CTA 啟動後，`#diagnosis` target top `180px`，Mobile Headbar bottom `70px`；目標保持可見。
- 使用者分頁目前停在 Expertise `next-step`，可直接看到 Primary `查看學習路線`、Secondary `討論實際情境` 與 focus ring。

### Foundation result

| Slice | Result |
| --- | --- |
| F1 | CTA／sequence behavior contract 建立，仍保留 `draft` 等待後續頁面角色確認 |
| F2 | 共用 filled／bordered CTA states、focus、reduced-motion、forced-colors 完成 |
| F3 | Home 9 個 CTA、route、campaign、anchor、尺寸與 focus regression 通過 |
| F4 | Expertise 4 個 CTA、Context → Skill → Harness、anchors、尺寸與 focus regression 通過 |

這個 checkpoint 沒有建立 git commit；commit 仍保留給使用者要求的 checkpoint／交付動作。
