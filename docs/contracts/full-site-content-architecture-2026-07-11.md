---
schema_version: behavior-contract/v1
id: site.full-content-architecture
title: CabLate 全站內容架構
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 將 Content OS 與 A-H 素材轉成每頁可驗證、可維護、可轉換的公開內容。
  non_goals:
    - 不全量公開 Content OS
    - 不在未確認狀態下新增可購買產品
    - 不公開營收、客戶機密或未授權證言
---

# CabLate 全站內容架構契約

## Behavior Boundary

- 範圍：首頁、作者頁、文章索引與內頁、課程索引與內頁、服務、Starter Pack、搜尋、Footer 與新增內容路由的公開資訊。
- 範圍外：付款、登入、課程交付、會員權益、Kit 自動化與第三方 CRM 實作。

## Consumers And Entrypoints

- 一般訪客、學員、創作者、小團隊、企業決策者、搜尋引擎與 AI 搜尋。
- 入口：`/`、`/about/`、`/articles/`、`/courses/`、`/services/`、`/starter-pack/`、`/search/`。

## Inputs And State

- 2026-07-11 Content OS 本地備份。
- A-H snapshot 與既有網站 content collections。
- A 級素材可公開；B 級需匿名／核准；C 級禁止發布。

## Outputs And Side Effects

- 靜態頁面內容、內部連結、JSON-LD、CTA 與公開 proof。
- 不新增資料寫入或第三方傳輸。

## UI States

- 首屏能辨識頁面唯一任務。
- 無資料時不得顯示假 proof、空產品卡或假 testimonial。
- 桌機與 390px 手機均無水平溢位。

## Invariants

- 每頁一個 primary CTA。
- 所有動態數字顯示 `asOf`。
- About 是 canonical author page。
- 客戶、學員與合作方未授權時保持匿名。
- Article、Guide、Method 不競爭同一搜尋意圖。

## Acceptance Examples

```gherkin
Given 訪客想判斷應該自學還是尋求合作
When 他進入首頁
Then 他能選擇學習、作品或合作路徑
And 不需要先理解所有產品名稱

Given 訪客查看一項公開數字
When 數字出現在首頁或 About
Then 同一區塊能找到查核日期

Given 一項案例仍未取得客戶授權
When 網站建置
Then 頁面只顯示匿名能力描述
And 不顯示客戶名稱、Logo、照片或原話
```

## Test Mapping

- `npm run validate:content`
- `npm run check`
- `npm run build`
- 桌機與 390px 瀏覽器逐頁截圖。
- 搜尋公開頁面不得出現營收與 C 級素材。

## Evidence

- `docs/content/full-site-content-map-2026-07-11.md`
- 後續逐頁 QA 截圖與 build output。

## Intentional Changes

- Courses 從商品列表提升成學習路線。
- Services 從角色卡提升成服務決策頁。
- Articles 從時間列表提升成主題探索入口。

## Open Questions

- 產品即時狀態、服務 CTA、Newsletter promise、正式 headshot、testimonial 與案例授權仍待 Cab 定版。
