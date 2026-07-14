---
schema_version: behavior-contract/v1
id: site.services.s1-heading-and-process-language
status: verified
owner_surface: services
change_context:
  type: refactor
  reason: Services 的合作經驗缺少真實 heading，且既有標題片語與流程用語在實測畫面中造成不自然斷句與抽象表達。
  non_goals:
    - 不改服務資料、合作經驗主張、CTA、目的地或區塊順序
    - 不處理服務卡去重、字級、合作邊界內容或 Threads 按鈕
    - 不修改共用 CSS、Home 或 Expertise
---

# Services S1：文件大綱與流程用語

## Behavior Boundary

本 slice 只調整 `/services/` 的文件語意與既有標題換行控制：替合作經驗建立可見的 `h2`，將流程第三步的名稱由「推進」改成「執行」，並重組 Hero、服務選擇、合作邊界與聯絡區的既有 `heading-phrase`。除「推進」改為「執行」外，不改任何原句文字。

## Consumers And Entrypoints

| Consumer | Entrypoint | Observable responsibility |
| --- | --- | --- |
| 桌面訪客 | `/services/`，1280px | 主要標題以完整語意片語換行，合作經驗出現在文件大綱中 |
| 手機訪客 | `/services/`，390px | 標題不留下「工作，」「也能」「卡在哪裡」等孤立短詞，頁面不產生水平溢位 |
| Heading navigation 使用者 | `/services/` heading outline | 合作經驗有可見 `h2`，沒有用 `aria-label` 代替標題 |
| 錨點訪客 | `#service-options`、`#contact` | 原 id、目的地與區塊順序維持不變 |

## Inputs And State

- Astro 靜態頁面 `src/pages/services.astro`。
- 既有 `processSteps` 陣列與 `serviceTracks` canonical data。
- 既有 `.display-heading`／`.heading-phrase` 規則；片語內不換行、片語間可重排。
- 本頁沒有 loading、empty、error 或 hydration state；驗收狀態為 first paint 與 ready。

## Outputs And Side Effects

- 可見輸出：既有標題文字以較完整的語意片語換行，流程第三步顯示「執行」。
- 語意輸出：合作經驗的可見主張成為 `h2`，`aside` 由該 heading 命名。
- 無網路、儲存、分析事件或外部系統副作用。

## Invariants

1. Hero、options、boundary、contact 的完整 `textContent` 不變。
2. 三種服務內容、順序與 ids 不變；四步流程順序仍為診斷、設計、第三步、驗收。
3. `#service-options`、`#contact`、Email `mailto:`、Threads `href`／`target`／`rel` 不變。
4. 合作經驗可見主張與揭露文字不擴張，不新增客戶、成果或服務承諾。
5. 不新增 fixed height、`overflow: hidden`、縮字或共用 CSS 覆寫。
6. S2–S5 的服務資料去重、字級、邊界內容與 CTA 樣式留待各自 slice。

## Acceptance Examples

```gherkin
Scenario: Mobile Hero uses complete thought groups
  Given Services is rendered at 390px
  When the Hero heading is inspected
  Then it has four author-selected phrase spans
  And no phrase consists only of "工作，" or "也能"
  And the full heading text is unchanged
```

```gherkin
Scenario: Cooperation experience is part of the heading outline
  Given a visitor reaches the cooperation experience aside
  When the DOM is inspected
  Then the visible delivery claim is an h2 with id "service-proof-title"
  And the aside is named by aria-labelledby="service-proof-title"
  And no aria-label substitutes for the visible heading
```

```gherkin
Scenario: Process language names an observable phase
  Given the four process nodes are rendered in DOM order
  When their headings are read
  Then the sequence is "診斷、設計、執行、驗收"
  And the third node body remains unchanged
```

```gherkin
Scenario: Major headings keep their original meaning without isolated short words
  Given Services is rendered at 1280px and 390px
  When options, boundary and contact headings are inspected
  Then each heading uses complete author-selected phrase groups
  And its full text matches the baseline
  And document scroll width does not exceed the viewport width
```

## Test Mapping

```yaml
static:
  - npm run check
  - git diff --check
browser_dom:
  - heading outline and aria-labelledby inspection at 1280px and 390px
  - exact heading phrase arrays and full text comparison
  - process heading order and protected href inspection
  - scrollWidth <= innerWidth
visual:
  - desktop Hero/options and proof/process captures
  - desktop boundary/contact capture
  - mobile Hero/options, proof/process and boundary/contact captures
  - reopen every saved screenshot before acceptance
```

## Intentional Changes

- `推進` 改為 `執行`。
- 合作經驗主張由 `strong` 改為同等視覺重量的 `h2`，並負責命名 `aside`。
- 四個 major heading 只重組片語邊界，不改完整文字。

## Evidence

### Accepted screenshots

1. `01-desktop-top.png`：Desktop Hero 與 service-options heading 入口。
2. `02-desktop-proof-process.png`：Desktop 合作經驗 trust strip。
3. `03-desktop-boundary-contact.png`：Desktop 流程尾端與合作邊界。
4. `04-desktop-contact.png`：Desktop 聯絡 heading 與既有 CTA。
5. `05-mobile-top.png`：390px Hero 四個等長語意句組。
6. `06-mobile-proof-process.png`：390px 合作經驗 heading 與流程開頭。
7. `07-mobile-process-execution.png`：390px 流程第三步「執行」與前後順序。
8. `08-mobile-boundary.png`：390px 合作邊界兩個完整句組。
9. `09-mobile-contact.png`：390px 聯絡 heading 三個完整句組。

每張檔案都在存檔後重新開啟檢查；包含錯誤捲動位置或 browser paint artifact 的中間截圖未納入 evidence。

### Runtime facts

| Check | 1280px | 390px |
| --- | --- | --- |
| Horizontal overflow | none；`1265 <= 1280` | none；`382 <= 390` |
| Hero phrases | 4；完整文字不變 | 4；各句組約 `238.38px`，均在內容邊界內 |
| Options phrases | 2 | 2；最寬約 `310.57px` |
| Boundary phrases | 2 | 2；最寬約 `279.69px` |
| Contact phrases | 3 | 3；最寬約 `310.57px` |

- Heading outline 現在包含 `H1 → options H2 → service H3／H4 → cooperation proof H2 → process H2／H3 → boundary H2 → contact H2`。
- `.service-proof` 使用 `aria-labelledby="service-proof-title"`；目標元素為可見 `H2`，沒有殘留 `aria-label`。
- 流程 DOM 與畫面順序皆為 `診斷 → 設計 → 執行 → 驗收`；第三步 body 未變。
- Hero、options、boundary、contact 的完整文字與 baseline 相同；只改片語邊界。
- `#service-options`、`#contact`、config-backed Email `mailto:`、Threads `href`／`target="_blank"`／`rel="noopener"` 均維持原值。
- `npm run check`：0 errors、0 warnings；18 個既有 Astro hints 未增加。
- `git diff --check`：通過。

### Visual judgment

- Desktop Hero 由六個碎片收斂成四個寬度接近的語意行，仍保留原本紙張簡報感。
- 合作經驗的字級與原 `strong` 視覺重量相近，沒有被誤做成另一個大型 Hero；新增 heading 的主要價值是讓信任主張進入文件大綱。
- Boundary 與 Contact 在 Desktop／Mobile 都不再留下孤立短詞，且沒有靠縮字、固定高度或裁切解決。
- S2 的服務卡去重／字級、S3 的 proof 與 boundary 內容責任、S4 的 Threads 按鈕、S5 的 Mobile comparison／process 字級與 anchor 仍是 pending，本次沒有提前宣稱完成。

### Master Plan alignment

S1 對應 Master Plan 7.3–7.5 與 incremental plan S1：合作經驗有真實 heading、流程第三步改為「執行」、四個 major heading 只重組既有文字。S1 的 L1 DoD 已通過；Services 7.9 page-level DoD 仍需 S2–S6。
