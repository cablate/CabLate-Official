---
schema_version: behavior-contract/v1
id: homepage.refinement-2026-07-11
title: CabLate 首頁收斂改版
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 將過度激進的權威網站改版收回原站氣質，以既有主視覺與低成本 CSS 完成成熟化。
  non_goals:
    - 不新增大量生成圖片素材
    - 不更動既有路由、文章內容或服務流程
    - 不公開營收、客戶身分或未授權證言
---

# CabLate 首頁收斂改版契約

## Behavior Boundary

- 範圍：首頁、全站導覽與共用色彩語彙。
- 範圍外：文章、課程、服務頁的資訊架構與商業流程。

## Consumers And Entrypoints

- 桌機與手機瀏覽者：`/`
- 搜尋引擎與分享預覽：首頁 SEO 與 Person／WebSite JSON-LD
- 既有導覽使用者：文章、課程、服務、關於、搜尋

## Inputs And State

- 使用現有 `/images/concept/hero-organic-concept.webp`。
- 使用 `src/config/authority.ts` 的公開身分、證據、方法與作品資料。
- 最新文章由 Astro content collection 提供。

## Outputs And Side Effects

- 首頁以靜態 HTML 與 CSS 輸出，不增加前端狀態或網路請求。
- 導覽與 CTA 仍導向既有 URL。

## UI States

- 首屏：文字、三條訪客路徑與既有主視覺同時可辨識。
- Ready：主圖維持 1:1 比例，無內容位移；互動元素有 hover 與 focus-visible。
- Mobile：單欄排列、無水平捲動、主要 CTA 不被截斷。
- Reduced motion：不依賴動畫理解內容。

## Invariants

- 保留 CabLate、Noto Serif TC、白底／深藍灰／淡紫的原站辨識。
- 不使用超大宣言式標題，不把首頁改成全黑或強烈編輯風。
- 所有公開數字帶有查核時間或明確來源語境。
- 不新增假案例、假客戶、假證言或營收數字。

## Acceptance Examples

```gherkin
Given 使用者在 1440px 桌機開啟首頁
When 首屏完成載入
Then 可在同一視窗辨識 CabLate 身分、三種前進路徑與既有主視覺
And 主標題不超過原站氣質可接受的尺度

Given 使用者在 390px 手機開啟首頁
When 從頂部捲動至電子報
Then 頁面沒有水平溢位
And 所有連結、標題與中文段落沒有被裁切
```

## Test Mapping

- 自動：`npm run check`、`npm run build`、內容驗證。
- 手動：瀏覽器 1440px 與 390px 截圖、導覽與中文語句檢查。

## Evidence

- 桌機與手機截圖存放於 `D:/_CabLate_Agents/coder/projects/cablate-website/evidence/homepage-refinement-2026-07-11/`。
- 真實 390px 裝置模擬：viewport 390px、document client 390px、document scroll width 390px。
- `npm run check`、`npm run validate:content`、`npm run build` 全數通過。

## Intentional Changes

- 首頁內容從角色卡片改為三條明確訪客路徑。
- 保留原主視覺，增加類相框的偏移層次，但不依賴額外圖片。
- 權威證據、方法與作品內容保留，但改回較接近原站的字級與配色。

## Open Questions

- 主視覺未來是否換成更貼近個人品牌的新圖，留待版型確認後處理。
