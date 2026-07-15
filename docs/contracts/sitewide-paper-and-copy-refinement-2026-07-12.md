---
schema_version: behavior-contract/v1
id: site.personal.paper-copy-refinement
title: 個人網站跨頁紙質視覺與文案敘事契約
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 將首頁已驗證的紙質視覺、內容層級與閱讀節奏延伸到主要訪客頁面。
  non_goals:
    - 不更改既有 URL、主要導覽名稱與表單欄位。
    - 不把所有頁面改成首頁的同一份版型。
    - 不新增尚未提供的產品、課程、電子報承諾或未授權客戶證據。
---

# 個人網站跨頁紙質視覺與文案敘事契約

## Behavior Boundary

本輪涵蓋 `/about/`、`/expertise/`、`/services/`、`/work/`、`/courses/`、`/articles/` 的列表／入口頁。文章內頁、課程內頁、搜尋、隱私權與 404 不在這一輪敘事重構範圍。

## Consumers And Entrypoints

- 初次認識 CabLate、想判斷是否值得繼續閱讀的訪客。
- 已有 AI 使用問題，想找方法、學習內容或合作方式的訪客。
- 從搜尋、文章或社群直接進入任一主要頁面的訪客。

## Inputs And State

- 專業資料與公開證據以 `src/config/authority.ts` 為準。
- 課程與文章只呈現目前實際發布的內容。
- 首頁 checkpoint `77bc19a` 是視覺與文字判斷的基準，不改變其成果。

## Outputs And Side Effects

- 主要頁面共享紙張表面、內距、標籤、文字連結與響應式規則。
- 各頁保留自己的資訊架構，但刪除重複說明與無法驅動下一步的內容。
- 不產生網路寫入、資料庫寫入或第三方追蹤變更。

## UI States

- First paint：文字與紙張容器直接由 HTML/CSS 呈現，不依賴客戶端 JavaScript。
- Ready：所有主要 CTA 可鍵盤操作，標題不超出紙張安全範圍。
- Mobile：單欄排列、無水平溢出，紙張邊緣可見但內容至少保留 1.25rem 安全內距。
- Forced colors：即使背景圖消失，仍保留可辨識的實體邊框。

## Invariants

- 紫色仍是唯一主要強調色，紙質風格不取代 CabLate 品牌識別。
- 一個區塊只完成一個閱讀任務；證據不能打斷尚未成立的敘事。
- 不宣稱電子報固定更新，也不把尚未開放內容寫成已可取得。
- 所有標題使用自然中文斷句；不靠任意 `<br>` 補救桌機與手機排版。
- `.paper-card` 負責表面，內容內距由 `.paper-card__inner` 或等價的頁面安全容器負責。
- `.paper-page` 只負責頁面寬度、垂直留白與紙張之間的間距。
- `.page-paper` 是跨 Astro scoped CSS 邊界的容器契約，負責外框尺寸、紙張背景與安全內距；頁面局部 CSS 不得重新定義這些屬性。
- 頁面局部 CSS 只負責該頁特有的內容 grid、清單、時間軸與文字層級。
- 迴紋針依紙張數量與敘事用途交錯使用，優先固定歷程、方法、證據、作品或學習路徑；左右位置交替，也不統一貼在每頁首屏。

## Acceptance Examples

```gherkin
Given 訪客直接進入合作方式頁
When 他讀完首屏與合作類型
Then 他能先理解適合解決的問題
And 不必先讀完 CabLate 所有產品與工具名稱
And 能知道聯絡時應提供哪些資訊
```

```gherkin
Given 訪客以 390px 寬度瀏覽任一主要入口頁
When 頁面完成載入
Then 所有文字與 CTA 都位於紙張安全內距內
And 文件沒有水平溢出
And Headbar 不遮住錨點標題
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
    - git diff --check
  browser:
    - 1280x900 逐頁首屏與主要區塊截圖
    - 390x844 逐頁標題、CTA、水平溢出與紙張內距檢查
```

## Evidence

- 1280×900：六個主要入口頁的 `scrollWidth` 均等於 `clientWidth`；紙張區塊與 H1 均位於可視範圍內。
- 390×844：六頁水平溢出皆為 0；紙張寬約 350.57px，左右各保留約 12px 外部空間，H1 位於紙張內距內。
- About 桌機首屏修正後，雙欄寬度分別約 445px 與 403px，兩欄 `scrollWidth` 未超出容器。
- Articles 手機首屏與 Services 手機首屏已以實際瀏覽器截圖檢查；console 無 error 或 warning。
- `npm run build`：成功產生 49 個頁面（Starter Pack 已退役）。

## Intentional Changes

- 首頁以外的主要入口頁由各自獨立的平面樣式，統一成同一紙質視覺語言。
- 文案從「完整列出我有什麼」改為「先回答訪客此刻想判斷什麼」。
- 刪除舊的內頁白框全域選擇器與各頁重複容器 override，改由 `.paper-page > .page-paper` 提供單一樣式來源。
- 第二輪依 `docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md` 切開跨頁責任：首頁負責辨識與分流，Expertise 負責可操作診斷，Work 負責案例判斷，Courses 負責學習選擇，Services 負責適配，Articles 負責閱讀尋路。
- 同一內容不再同時以問題路徑、推薦卡與一般列表重複曝光；一頁只保留一個 Primary CTA 意圖。

## Open Questions

- Starter Pack 已退役；文章／課程內頁仍另開輪次，不與主要入口共用同一內容模板。

## Deferred Visual Language Pass

- 目前先完成 About、Expertise、Work、Courses、Services、Articles 的第一版文案與閱讀任務。
- 本輪只維持共用紙張材質、安全內距、紫色識別與響應式可讀性，不在逐頁改文案時同步發明新版型。
- 六頁文案完成後，再一次比較全站，分別建立人物歷程、問題診斷、案例檔案、學習地圖、合作簡報與閱讀目錄的專屬視覺語法。
