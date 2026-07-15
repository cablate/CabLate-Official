---
schema_version: behavior-contract/v1
id: cablate.home.paper-material-system
title: CabLate 首頁模組化紙材系統
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 以可重複使用的紙紋與裝飾素材，讓首頁符合已選定的 Paper Stock Library 視覺稿，同時保持響應式與內容可維護性。
  non_goals:
    - 不改變首頁資訊架構、區塊順序或公開文案。
    - 不新增銷售承諾、案例、見證或產品畫面。
    - 不改變既有路由、表單欄位、導覽目的地或分析事件。
---

# CabLate 首頁模組化紙材系統

## Change Context

本次只把既有首頁從平面紙色卡片轉成模組化紙材表面。CSS 繼續負責尺寸、排版與響應式；WebP 素材只負責紙張纖維、紙卡輪廓與少量迴紋針裝飾。

## Behavior Boundary

範圍內：

- 首頁 `/` 的紙張表面、紙卡背景、裝飾層、陰影與手機降級規則。
- 共用桌面 rail 與 footer 的紙面材質，以及 rail 中的小型作者頭貼。
- 推薦閱讀卡片使用專用橫線索引紙素材。

範圍外：

- 其他頁面的內容、版型與元件重排。
- 新增動畫框架、前端依賴、後端行為或訂閱服務變更。
- 用圖片取代可選取、可讀取的 HTML 文字。

## Consumers And Entrypoints

- 瀏覽器路由：`/`。
- 共用外框：`BaseLayout.astro`、`ArchiveNavigation.astro`。
- 首頁內容：`src/pages/index.astro`。
- 推薦閱讀：`src/components/sections/LatestArticles.astro`。
- 電子報：`src/components/sections/Newsletter.astro` 與既有 Kit 表單。
- 素材：`public/images/paper-ui/`。

## Inputs And State

- 使用現有 authority、代表作品、方法與公開證據資料。
- 使用已核准的 `home-paper-stock-library-v4-clips-labels.png` 作為視覺目標。
- 素材必須提供透明 PNG 母檔與瀏覽器使用的 WebP。

## Outputs And Side Effects

- 桌面：每個主要區塊具有可辨識但不干擾閱讀的紙纖維；少量區塊使用迴紋針版本；推薦閱讀使用專用索引紙卡。
- 手機：維持單欄與零水平溢位；降低陰影、毛邊與裝飾密度；導覽與表單仍可完整操作。
- 不增加網路請求以外的執行期副作用；不新增 JavaScript 動畫。

## UI States

- First paint：文字與基本紙色立即可讀，WebP 尚未完成時仍有 `#fffdf8` 背景。
- Ready：素材載入後顯示紙纖維、紙卡邊緣與少量迴紋針。
- Hover/focus：既有連結與按鈕維持清楚焦點；卡片只使用輕微位移與邊色，不改變布局。
- Form error/success：沿用 Kit 表單既有 live region 與狀態樣式。
- Reduced motion：沒有自動動畫；只保留瞬時或極短的互動回饋。

## Invariants

- 首頁區塊順序、標題、內文、CTA、連結與公開數字保持不變。
- 紫色 `#8064ea` 仍是唯一全站 accent；橘色只存在作者頭貼內。
- Hero 紫色主視覺仍是 LCP 候選，繼續使用 HTML `<img>`，不改成 CSS 背景。
- 裝飾素材必須 `pointer-events: none`、`aria-hidden` 或以偽元素呈現，不進入閱讀順序。
- 390px 寬度不得出現水平捲動，主要 CTA 與表單不得被紙張裝飾遮住。

## Acceptance Examples

```gherkin
Given 訪客以 1440 x 900 開啟首頁
When 首頁完成載入
Then Hero、核心主張、路徑、精選專案、方法、推薦閱讀、電子報、公開成果與 footer 皆顯示紙材表面
And 紫色 Hero 圖、所有文字與 CTA 保持原有內容與順序
And 推薦閱讀三張卡片使用橫線索引紙材
```

```gherkin
Given 訪客以 390 x 844 開啟首頁
When 開啟手機導覽並瀏覽到電子報
Then 七個既有導覽入口仍可到達
And 頁面沒有水平溢位
And 紙張裝飾不遮住文字、按鈕或表單
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run validate:content
    - npm run check
    - npm run build
  browser:
    - 1440 x 900 首頁完整頁面截圖與選定視覺稿比較
    - 390 x 844 首頁頂部、手機選單、電子報與頁尾檢查
    - scrollWidth 等於 clientWidth
    - 導覽、CTA、推薦文章與表單控制仍可操作
```

## Evidence

- Source visual truth：`docs/design/generated/home/home-paper-stock-library-v4-clips-labels.png`。
- Baseline implementation：`docs/design/references/current-pages/home-desktop-full-current-v5-2026-07-11.png`。
- 實作後截圖與結果寫回 `design-qa.md`。

## Intentional Changes

- 首頁與共用 rail/footer 的平面紙色改為可見的紙纖維素材。
- 推薦閱讀卡片改用專用橫線索引紙素材。
- rail 品牌區新增小型 CabLate 作者頭貼。
- 2026-07-11 後續依 Cab 指示暫停視覺擴充，改由 `site.full-content-architecture` 契約進行全站文案打磨；該文案變更不屬於本紙材契約的視覺範圍。

## Open Questions

- 其他內頁的紙材分配暫緩，待文案與內容架構穩定後再重新評估。
