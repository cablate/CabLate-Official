---
schema_version: behavior-contract/v1
id: cablate.site-copy.adjusted-source-2026-07-15
title: CabLate 使用者調整版文案完整套用
status: active
owner_surface: shared
change_context:
  type: feature
  reason: 使用者要求將指定調整版文案完整套入網站，並明確禁止任何自主文案調整。
  non_goals:
    - 不潤稿、不補句、不刪句、不改語氣。
    - 不改 URL、價格、追蹤參數、互動、頁面結構或視覺設計。
    - 不處理 Work、Articles、單篇 Course、Privacy 或 404。
---

# CabLate 使用者調整版文案完整套用契約

## Change Context

- 唯一文案來源：`C:\Users\User\Downloads\CabLate_網站文案_調整版_2026-07-15.md`
- 來源行數：579
- 來源 SHA-256：`0F13AC430EEED42ACEA0014D7CC3161F114465131C1464F67B68AD5AFE1FEB2F`
- 使用者指令：「完整改進去」，並「禁止再自主做調整」。

## Behavior Boundary

### In scope

- Home、Expertise、About、Services、Courses 的 SEO、可見文案、CTA 標籤、圖片替代文字、狀態文字、價格與輔助文字。
- 全站主要導覽的 rail label、Footer 品牌說明。
- 首頁訂閱區塊文案；未變動欄位或訊息照原樣保留。

### Out of scope

- 調整版中的「結構作用」與編輯說明不渲染至網站。
- 括號內的目的地說明不是按鈕文案，不得寫入可見文字。
- 未被調整版更動的連結、UTM、元件、CSS、DOM 語意與資料流程不得改動。

## Consumers And Entrypoints

- Browser routes：`/`、`/expertise/`、`/about/`、`/services/`、`/courses/`
- Shared shell：Desktop/Mobile navigation、Footer
- Source files：
  - `src/pages/index.astro`
  - `src/pages/expertise.astro`
  - `src/pages/about.astro`
  - `src/pages/services.astro`
  - `src/pages/courses/index.astro`
  - `src/config/authority.ts`
  - `src/layouts/BaseLayout.astro`
  - `src/components/sections/Newsletter.astro`

## Inputs And State

- 調整版 Markdown 是唯一核准的文案輸入。
- 動態頁面文字仍由既有 `authority.ts` 陣列投影至 DOM。
- SEO 仍由各頁傳入 `BaseLayout`；依調整版指示，只有標題本身未含 `CabLate` 時才自動補上 `| CabLate`。

## Outputs And Side Effects

- 五個主要頁面與全站共用介面的文字更新。
- 不新增網路請求、狀態、事件、儲存、套件或追蹤行為。
- 既有 href、mailto、外部 target/rel 與 UTM campaign 不變。

## UI States

- First paint／ready：新文案直接隨 Astro HTML 輸出，不新增載入狀態。
- Pending：Courses 02 仍為不可點擊的「尚未開放」。
- Error／empty／disabled：無新增狀態。
- Responsive：新文案不可造成主要頁面水平溢出或遮蔽操作元件。

## Invariants

- 網站文字必須逐欄等於調整版，不得做同義改寫。
- 所有現有連結目的地、價格與可用／未開放狀態維持不變。
- 標題層級、清單語意、表單 label、ARIA 與隱藏輔助文字結構維持不變；只有調整版明確指定的文字可變。
- Work 維持封存，Articles 入口維持暫停。
- 不以修正跑版為理由改動使用者文案；若新字數超過既有強制不換行片段，只能讓該片段在 Mobile 自然換行，不改字、不改視覺系統。

## Acceptance Examples

```gherkin
Given 使用者調整版的 Home H1 是「AI 做得很快，但你需要的是做完。」
When 首頁完成渲染
Then H1 必須逐字顯示該句
And 不得替換標點或加入其他字句
```

```gherkin
Given Courses 02 在調整版中仍標示「尚未開放」
When 學習地圖完成渲染
Then 該路線沒有 href、button 或 pointer affordance
And 狀態補充是「有新場次時會在這裡更新」
```

```gherkin
Given 調整版括號標記 CTA 目的地
When CTA 文案被套用
Then 括號內說明不會顯示在按鈕上
And 原本 href 保持不變
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run validate:content
    - npm run build
    - git diff --check
  source_comparison:
    - 逐頁核對調整版欄位與 production source
  manual:
    - 在實際瀏覽器檢查五個 routes 的 Desktop/Mobile 文字換行與水平 overflow
```

## Evidence

- 調整版 production source 靜態逐欄比對：通過；所有核對欄位皆存在。首頁問題 3 因既有兩行資料結構拆成兩個字串，渲染後完整句子一致。
- `npm run check`：0 errors、0 warnings、18 existing hints。
- `npm run validate:content`：通過。
- `npm run build`：通過；保留既有 Vite public asset placeholder warnings。
- `git diff --check`：通過；僅既有 LF→CRLF notices。
- Browser runtime：五頁於 `1280 × 800` 與 `390 × 844` 均為零 document/body horizontal overflow。
- Browser SEO/H1/H2 evidence：五頁 Title、Description、H1 與主要 H2 皆讀到調整版文字。
- About runtime follow-up：公開作品主卡不再重複顯示 `mcp-google-map`；公開輸出入口列與結尾雙 CTA 於實際瀏覽器均無水平溢出。
- Courses runtime follow-up：學習路線方案保留原有 padding，黃色紙張素材覆蓋完整內容框；實際瀏覽器確認標籤、標題、說明、價格與 CTA 均位於紙張邊緣內，且無水平溢出。
- Visual evidence：`docs/design/audits/2026-07-15-site-copy-application/`

## Intentional Changes

- 調整版逐欄指定的文案變更。
- 依調整版 SEO 備註，標題本身已含 `CabLate` 時不再重複附加站名。
- About、Services、Courses 的長標題片段在 `520–560px` 以下允許自然換行，避免完整文案造成水平溢出；文字與 Desktop 樣式不變。
- 依 2026-07-15 使用者即時回饋，About 公開作品主卡移除重複的可見 repo 名稱；連結仍保留螢幕閱讀器辨識文字。
- 依 2026-07-15 使用者即時回饋，About 的 GitHub／Threads 保留完整按鈕外觀，並整理為有前導文字的雙按鈕區；結尾移除重複且混雜的專業方法／GitHub／Threads／Email 連結列。
- 依 2026-07-15 使用者提供的正式網址，Courses「講座與工作坊」改為可開始項目，連至 `https://tbr.digital/claude`，入口標籤同步改為「查看講座與工作坊」。
- 依 2026-07-15 使用者提供的完整文字，Courses「內容如何交付」內文原句替換，不做自主改寫。
- 依 2026-07-15 使用者視覺回饋，Courses 學習路線保留原方案內容框的 padding 與尺寸，將整個框的背景材質換成黃色紙張；移除紙張外額外疊加的純黃色底、邊框與矩形陰影，確保文字位於紙張內側。文字、連結及版面結構不變。

## Open Questions

- 無。來源內容與禁止自主調整的限制均明確。
