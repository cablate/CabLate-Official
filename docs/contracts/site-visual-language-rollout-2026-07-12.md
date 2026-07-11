---
schema_version: behavior-contract/v1
id: cablate.site-visual-language-rollout
title: CabLate 全站專屬視覺語法 rollout
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 在既有紫色紙質品牌系統上，讓七個主要入口頁依照各自任務建立可辨識、可維護的資訊版面。
  non_goals:
    - 不重寫已完成的全站文案策略
    - 不更換品牌主色、字體方向或紙張材質
    - 不依賴大量生成圖片才能維持版面
    - 不新增網站路由或產品承諾
---

# CabLate 全站專屬視覺語法 Rollout Contract

## Behavior Boundary

本輪涵蓋 `/about/`、`/expertise/`、`/work/`、`/courses/`、`/services/`、`/articles/` 與首頁的視覺層級校準。每頁依 Master Plan 建立專屬資訊結構，同時保留共用紫色紙質品牌語言。

文章內頁、課程內容頁、搜尋結果、404、隱私權頁面及新的商業功能不在本輪範圍。

## Consumers And Entrypoints

- 一般訪客：桌機與手機瀏覽七個主要入口頁。
- 維護者：透過 Astro 頁面與 `src/styles/global.css` 延伸共用視覺系統。
- ImageGen：使用每頁完整 PC／Mobile 長條截圖作為設計探索輸入。
- 後續 AI／工程協作者：依 Master Plan 與本 contract 確認頁面差異及驗收證據。

## Inputs And State

- `docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md` 是頁面任務與視覺語法的 canonical source。
- 首頁 checkpoint `77bc19a` 與文案 checkpoint `89b4e55` 是既有成果基準。
- 每個頁面在設計前必須具備經人工檢查的完整 PC 與 Mobile 長條截圖。
- ImageGen 參考圖必須來自實際網站，不得使用錯誤拼接、重複 viewport 或過期畫面。

## Outputs And Side Effects

- `docs/design/visual-language-reference-2026-07-12/` 保存現況長條截圖與設計方向圖。
- 網站程式只採用能以 HTML／CSS 與既有真實素材穩定實作的結構。
- 缺少且確實需要的圖片素材可由 ImageGen 另外產生，並以 WebP 放入專案後才由頁面引用。
- 每個完成階段建立獨立 commit，但不推送遠端。

## UI States

- First paint：品牌識別、標題、紙張材質與主要閱讀順序不依賴客戶端 JavaScript。
- Ready：頁面專屬結構完整呈現，CTA、導覽與既有互動可操作。
- Mobile：不是桌機縮小版；閱讀順序、標題斷句、觸控區與紙張安全內距分別驗證。
- Error：圖片載入失敗時仍保有可理解的文字結構與替代文字。

## Invariants

- 紫色是唯一主要強調色；紙張風格不取代 CabLate 品牌。
- `.page-paper` 的材質、安全內距與響應式邊界仍由共用 CSS 管理。
- 各頁差異來自資訊結構、版面節奏與內容層級，不是隨機裝飾。
- 迴紋針、標籤、註記與圖片必須協助定位、分組、比較、敘事或證明。
- 桌機與手機皆不得出現水平溢位、文字超出紙張或 CTA 被裁切。
- 既有導覽、輪播、錨點與外部連結行為不可因視覺重構失效。

## Acceptance Examples

```gherkin
Given 訪客不看網址與頁面標題
When 他依序看到 About、Expertise、Work、Courses、Services 與 Articles
Then 能從版面結構辨認人物故事、排查文件、案例檔案、學習地圖、合作簡報與編輯目錄
And 所有頁面仍能辨認為同一個 CabLate 網站
```

```gherkin
Given ImageGen 要重新詮釋某個頁面
When 生成設計方向
Then 輸入同時包含該頁完整 PC 與 Mobile 長條截圖
And 參考圖沒有重複 viewport、錯誤拼接或缺少主要內容區段
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - git diff --check
    - npm.cmd run check
    - npm.cmd run build
  browser:
    - 逐頁桌機與手機長條截圖比較
    - 逐頁水平溢位、標題斷句、紙張內距與 CTA 檢查
    - 導覽、輪播、錨點與主要連結操作
  visual:
    - 現況長條圖與實作後長條圖並排比較
    - 七頁去除網址與標題後的視覺語法辨識檢查
```

## Evidence

- 文案與頁面角色 checkpoint：`89b4e55`
- 現況及設計參考：`docs/design/visual-language-reference-2026-07-12/`
- 各階段 commit 與 Browser 截圖於完成時追加。

## Intentional Changes

- About 轉為人物故事與時間軸。
- Expertise 轉為診斷表與方法對照。
- Work 轉為逐件案例檔案。
- Courses 轉為階段路線與選擇比較。
- Services 轉為情境、成果與合作流程簡報。
- Articles 轉為問題索引與編輯目錄。
- Home 保留最大敘事變化，只在其他視覺語法成立後校準。

## Open Questions

- 各頁 ImageGen 方向由執行者依 Master Plan 自主審查與收斂，不再將方向選擇逐頁交回使用者；參考圖只決定視覺敘事、資訊層級與節奏，實作仍以真實內容、響應式限制及可維護的 HTML／CSS 為準。
- 新圖片素材只有在版面與證據需求明確時才產生。

## About Direction Decision

- 採用「連續紫色時間軸」作為 About 的主要視覺方向。
- 時間軸必須從人物起點延續至形成方法、代表作品、工作原則與下一步，不能退化成互不相關的紙卡堆疊。
- 工作筆記、頁籤、迴紋針與照片只在標示階段、支援時間線或提供證據時使用。
- Mobile 重新編排為單欄時間線，不直接縮小桌機版。
