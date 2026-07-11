---
schema_version: behavior-contract/v1
id: homepage.class-consolidation-2026-07-12
title: CabLate 首頁 CSS class 責任收斂
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 移除首頁無效 class，將可跨頁使用的標籤、文字連結與紙張安全區責任集中，降低後續內頁重複實作與視覺漂移。
  non_goals:
    - 不改變首頁內容順序、文案、圖片順序或 CTA 目的地
    - 不改變紙張材質、色彩、字體比例、桌機雙欄與手機單欄結果
    - 不在本次批次重寫其他頁面的 class
---

# CabLate 首頁 CSS class 責任收斂

## Behavior Boundary

- 範圍：`src/pages/index.astro` 的 class 命名與首頁 scoped CSS。
- 範圍：`src/styles/global.css` 中可供後續頁面使用的 `.section-label`、`.text-link`。
- 範圍外：首頁敘事、輪播互動、導覽結構、其他路由 markup 與全站 token。

## Consumers And Entrypoints

- 首頁 `/` 的桌機與手機訪客。
- 後續重構內頁時可重用 `.paper-card`、`.paper-card__inner`、`.section-label`、`.text-link` 與既有 `.btn` 系列的開發者。

## Inputs And State

- 首頁仍由 Astro 靜態輸出。
- `HeroCarousel.astro` 仍以陣列順序決定 LCP 圖片與輪播次序。
- 共用視覺 token 仍由 `src/styles/base.css` 提供。

## Outputs And Side Effects

- 移除沒有 CSS 或互動責任的 section marker class。
- 標籤與文字連結的共用樣式移至 `global.css`。
- 首頁重複的 grid/list 基礎規則收斂為 `.home-split`、`.home-list`；區塊 class 只保留差異。
- 不新增 JavaScript、網路請求、狀態或依賴。

## UI States

- First paint：Hero 文案、首張照片與 CTA 的位置及尺寸維持不變。
- Ready：首頁七個紙張群組依原順序呈現，文字仍位於紙張安全區。
- Mobile：390px 仍為單欄，Hero CTA 滿寬，無水平溢位。
- Interaction：文字連結與主 CTA 保留 hover、active、focus 行為；輪播不受 class 重構影響。

## Invariants

- `.paper-card` 只負責紙張表面；`.paper-card__inner` 只負責內容安全內距。
- 共用 utility 不得依賴首頁區域變數，例如 `--purple`；必須使用全站 token。
- page-specific class 必須對應實際版面差異或互動責任，不能只作為名稱標籤。
- 不用固定高度或 overflow 裁切掩蓋文案溢出。
- 桌機與手機的 DOM 順序相同，不用 `order` 或 `display: contents` 重排敘事。

## Acceptance Examples

```gherkin
Given 訪客以 1280 × 900 開啟首頁
When class 重構後頁面完成載入
Then Hero、診斷、主張、路徑、案例、方法與更新通知仍維持原本順序
And 首圖、標題、CTA 與紙張安全內距沒有位移或裁切
```

```gherkin
Given 訪客以 390 × 844 開啟首頁
When 捲動首頁並操作輪播
Then document scroll width 不大於 document client width
And CTA、標題與段落都位於紙張邊界內
And 輪播仍只包含兩張真實活動照片
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - git diff --check
    - npm run check
    - npm run build
  manual:
    - 1280x900 首頁首屏與輪播第二張檢查
    - 390x844 首頁首屏、CTA、輪播與水平溢位檢查
    - 瀏覽器 console error/warning 檢查
```

## Evidence

- 1280 × 900：首頁無水平溢位；6 個 `.section-label`、6 個 `.text-link` 正常套用；兩張輪播照片、Hero 與紙張安全區位置正常。
- 390 × 844：Hero CTA 寬 `310.57px` 並位於 `350.57px` 的紙張內層安全區；頁面無水平溢位。
- DOM 不再出現 `diagnosis-card`、`routes-card`、`methods-card`、`notification-card`、`section-kicker`、`text-action`、`primary-action`。
- 瀏覽器 console 無 error 或 warning。

## Intentional Changes

- `section-kicker` 更名並抽為共用 `.section-label`。
- `text-action` 更名並抽為共用 `.text-link`。
- Hero 主 CTA 改用既有 `.btn .btn-primary`，僅保留首頁尺寸差異 class。
- 移除 `diagnosis-card`、`routes-card`、`methods-card`、`notification-card` 等無責任 class。

## Open Questions

- 其他頁面的 `.eyebrow`、Hero CTA 與文字連結，待各頁內容重構時依本契約逐頁遷移，不在本次一次全改。
