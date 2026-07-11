---
schema_version: behavior-contract/v1
id: site.full-visual-system
title: CabLate 全站視覺一致性契約
status: active
owner_surface: shared
change_context:
  type: bugfix
  reason: 內頁在內容重構後保留各自的導覽、字體比例與區塊表面，造成同站不同品牌的視覺漂移。
  non_goals:
    - 不重做首頁主視覺
    - 不為這一輪大量生成圖片
    - 不強迫所有頁面採用相同內容編排
---

# CabLate 全站視覺一致性契約

## Behavior Boundary

- 本次統一首頁、關於、文章、學習、合作、Starter Pack、作品與專業方法的網站外框與品牌視覺。
- 各頁可以依任務使用列表、時間軸、網格或長文，但不得另建第二套導覽、色彩、字體與卡片語言。

## Consumers And Entrypoints

- 共用入口：`src/layouts/BaseLayout.astro`、`src/styles/base.css`、`src/styles/global.css`。
- 主要路由：`/`、`/about/`、`/articles/`、`/courses/`、`/services/`、`/starter-pack/`、`/work/`、`/expertise/`。
- 其他使用 `BaseLayout` 的文章、標籤、搜尋與內容頁，也必須沿用相同外框。

## Inputs And State

- 桌機視覺母版是首頁目前的 Open Desk Archive：左側固定資料夾式導覽、紙面背景、紫色重點、細框與輕陰影。
- 手機視覺母版是首頁目前的精簡頂部列與單欄紙面內容。
- 品牌色、紙面色、文字色、圓角與陰影只能由共用 token 提供。

## Outputs And Side Effects

- 桌機內頁顯示與首頁同源的左側導覽，不再顯示另一套橫向 landing-page 導覽。
- 手機內頁顯示與首頁同源的精簡頂部列。
- 所有主要頁面的標題使用同一套襯線字體、相近比例與行高。
- 內容區塊維持紙張表面、紫色重點、細框與輕陰影；頁尾不切換成另一個深色網站。

## UI States

- First paint：紙面背景、導覽與主要內容同時採用正確 token，不出現橘紅或第二套主題。
- Ready：桌機導覽固定於左側，內容不被遮住；手機導覽不擠壓、不造成水平捲動。
- Empty/disabled：未開放的學習項目顯示文字狀態，不渲染沒有 `href` 的假連結。

## Invariants

- 首頁是全站視覺母版，不是視覺例外。
- 全站唯一 accent 為 `#8064ea`。
- 全站唯一主要紙面為 `#fffdf8`，外部背景為 `#eeeae2`。
- 桌機與手機皆不得水平溢位。
- 頁面任務與資訊架構可不同；導覽、字體、色彩、表面、圓角與陰影不可漂移。

## Acceptance Examples

```gherkin
Given 訪客在 1440px 桌機從首頁進入關於、作品或合作頁
When 新頁面完成載入
Then 左側仍是 Open Desk Archive 導覽
And 內容仍位於相同紙面背景與紫色視覺系統中
And 不出現另一套頂部 landing-page 導覽

Given 訪客在 390px 手機切換八個主要路由
When 任一頁面完成載入
Then 頂部品牌列與主要導覽維持一致
And 頁面寬度不超過 viewport

Given 學習路徑中的項目尚未公開報名
When 頁面渲染該項目
Then 顯示「目前未開放公開報名」
And 不產生沒有 href 的連結
```

## Test Mapping

- `npm run check`
- `npm run validate:content`
- `npm run build`
- 瀏覽器：1440 × 900 與 390 × 844 逐頁截圖和水平溢位檢查。

## Evidence

- `npm run validate:content`、`npm run check`、`npm run build` 於 2026-07-11 通過；正式 build 產出 50 頁。
- 1440 × 900：八個主要路由、文章詳頁、搜尋、隱私與標籤頁均顯示同一 Open Desk Archive rail、共用頁尾，且無水平溢位。
- 390 × 844：八個主要路由、文章詳頁、搜尋、隱私與標籤頁均無水平溢位；手機選單可達六個主要入口與搜尋。
- Articles → Expertise 的 `#context-engineering` 深連結實際點擊後定位於 96px，且父層導覽正確標示專業方法。
- 逐頁參考圖存於 `docs/design/references/current-pages/`；紙面轉譯規格存於 `docs/design/cablate-paper-ui-page-translation-plan-2026-07-11.md`。

## Intentional Changes

- 內頁橫向頂部導覽改為首頁同款左側資料夾式導覽。
- 內頁深色頁尾改回紙面頁尾。
- 過大的內頁 hero 標題收斂到首頁尺度。

## Open Questions

- 真實 headshot、產品截圖與案例授權仍屬後續素材階段，不阻擋本輪 CSS 對齊。
