---
schema_version: behavior-contract/v1
id: homepage.narrative-refinement-2026-07-11
title: CabLate 首頁敘事與紙張安全區重構
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 將首頁從 CabLate 素材清單改為訪客問題導向的敘事，同時建立可驗證的紙張內容安全區。
  non_goals:
    - 不更換品牌 Logo、左側固定欄或既有紙張素材
    - 不修改其他頁面的資訊架構與文案
    - 不新增動畫、第三方套件、假案例、未授權證言或未確認企業數字
---

# CabLate 首頁敘事與紙張安全區重構

## Behavior Boundary

- 範圍：`/` 的 Hero、問題診斷、核心主張、訪客路徑、代表案例、方法診斷與更新通知。
- 範圍：首頁專屬 CSS、更新通知文案與 Mobile Headbar 品牌呈現。
- 範圍外：其他路由、導覽名稱、共用品牌素材、表單提交行為與文章內容。

## Consumers And Entrypoints

- 桌機、平板與手機訪客：`/`
- 鍵盤與輔助科技使用者：首頁標題階層、DOM 閱讀順序與 CTA
- 搜尋引擎：首頁可見 HTML 文案與既有 metadata

## Inputs And State

- 使用兩張真實活動照片；第一張為四月 AI 小聚，第二張為工作坊現場。
- 使用 `src/config/authority.ts` 的公開證據與代表案例連結。
- 更新通知只承諾課程、手冊與公開活動的重要更新，不承諾固定寄送頻率。

## Outputs And Side Effects

- 首頁仍輸出靜態 Astro HTML 與 CSS。
- 不新增客戶端狀態、網路請求、儲存行為或依賴。
- CTA 維持導向既有路由與錨點。

## UI States

- First paint：左側品牌導覽、Hero 文字與首張真實活動照片可辨識，圖片尺寸已預留。
- Ready：六個內容群組依 DOM 順序呈現，紙張內文字不裁切、不超出可用區域。
- Mobile：390px 單欄，順序由 DOM 決定，不使用 `order` 或 `display: contents` 跨區塊重排。
- Error / empty：通知表單沿用 Kit 既有錯誤與成功狀態。
- Reduced motion：理解內容不依賴動畫。

## Invariants

- 保留 CabLate 紫色、深藍文字、紙張材質、左側固定欄與真實活動照片輪播。
- `paper-card` 的視覺邊界與內容安全內距分離；所有可見文字位於 `.paper-card__inner` 或等價內層。
- 桌機文字安全內距至少 2.25rem，手機至少 1.25rem。
- 雙欄只在每欄保有可讀寬度時啟用；安全預設為單欄。
- 不以固定高度容納可變文案，不以裁切掩蓋文字溢出。
- 每個內容群組只有一個主要心理任務與一個主要 CTA 意圖。

## Acceptance Examples

```gherkin
Given 訪客在 1280px 桌機開啟首頁
When 首頁載入完成
Then Hero 保留文字紙張與真實活動照片的左右構圖
And H1、說明與 CTA 全部位於紙張安全區
And 頁面依序呈現問題診斷、主張與身份、路徑、案例、方法與更新通知
```

```gherkin
Given 訪客在 390px 手機開啟首頁
When 從頁首捲動到更新通知
Then 所有內容依 DOM 單欄排列
And document scroll width 不大於 document client width
And 中文標題、正文與 CTA 沒有裁切或跑出紙張
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run validate:content
    - npm run build
  manual:
    - 1280x900 首頁截圖與文字溢出檢查
    - 390x844 首頁完整截圖與水平溢出檢查
    - Hero、身份引言、更新通知 CTA 與 Mobile 選單按鈕可見性檢查
```

## Evidence

- `docs/design/references/current-pages/home-desktop-full.png`：改版前基準。
- `docs/design/references/current-pages/home-mobile-top.png`：改版前手機基準。
- `docs/design/references/current-pages/home-desktop-top-narrative-v2-2026-07-11.png`：改版後桌機 Hero 與問題診斷。
- `docs/design/references/current-pages/home-desktop-middle-narrative-final-2026-07-11.png`：改版後桌機訪客路徑與代表案例。
- `docs/design/references/current-pages/home-desktop-bottom-narrative-final-2026-07-11.png`：首頁尾段較早期的 Newsletter 基準；推薦閱讀目前已移除。
- `docs/design/references/current-pages/home-mobile-top-narrative-final-2026-07-11.png`：改版後手機 Hero。
- `docs/design/references/current-pages/home-mobile-middle-narrative-final-2026-07-11.png`：改版後手機代表案例。
- `docs/design/references/current-pages/home-mobile-bottom-narrative-final-2026-07-11.png`：改版後手機 Newsletter 與 Footer。

## Intentional Changes

- Hero 從自我介紹改為訪客結果與問題辨識。
- 新增問題診斷區。
- 路徑從三張獨立卡片改成一張紙內的三個選擇列。
- 移除首頁獨立 proof wall，證據改放在相關決策旁。
- 代表案例改成問題、發現、處理、證據的敘事。
- 方法區改成診斷問題優先、術語次要。
- 移除首頁推薦閱讀，文章保留在導覽中作為內容檔案。
- Newsletter 改為不承諾固定頻率的更新通知。
- 移除代表案例右側重複摘要，證據改成 CTA 後的短句。
- 將 CabLate 身份提升為可掃讀的引言。
- 移除 `Open Desk Archive`，Mobile 選單按鈕改用共用紙張素材。

## Open Questions

- 無。文案與七個內容群組已由使用者確認，可以進入實作與瀏覽器 review。
