---
schema_version: behavior-contract/v1
id: site.expertise-first-destination-correction
title: Expertise 第一站修正
status: verified
owner_surface: shared
change_context:
  type: feature
  reason: 讓首頁問題診斷的承諾，在 Expertise 形成可理解、可操作、可繼續前進的完整路徑。
  non_goals:
    - 不修改首頁三個既有問題與雙 CTA
    - 不恢復 Articles 站內導流
    - 不新增 CabAI、Discord、Email 或單一商品 CTA
    - 不修改 About、Work、Courses、Services 的頁面內容
    - 不加入 GSAP、ImageGen 或新套件
---

# Expertise 第一站修正行為契約

## Change Context

首頁的「查看診斷方法」會把已經被問題說中的訪客帶到 `/expertise/`。這一輪補齊首頁第三個「出錯後只能重來」的對應診斷，統一 Context、Harness、Skill 的方法順序，並在完成診斷後提供學習與合作兩條下一步。

## Behavior Boundary

### In scope

- `/expertise/` Hero 到 Diagnosis 的頁內導覽。
- 四個症狀案例、三個方法層級與兩者的對應。
- Method map 的完成訊號與往下一層條件。
- Route 回到 Diagnosis 的頁內連結。
- Boundary note 後的 Courses 與 Services CTA。
- 320px 至 1440px 的排版、觸控、鍵盤與水平溢位狀態。

### Out of scope

- 首頁、其他內容頁與全站導覽的內容或視覺重構。
- Articles、搜尋、課程內容頁與文章內頁。
- CabAI 商品、Discord、Email 與外部平台流程。
- 新動畫、素材、依賴與全站 CSS 整理。

## Consumers And Entrypoints

- 首頁訪客：從 `/` 的 `查看診斷方法` 進入 `/expertise/`。
- 直接訪客：直接開啟 `/expertise/`。
- 頁內任務入口：`#diagnosis`。
- 自行學習出口：`/courses/`。
- 實際情境討論出口：`/services/`。
- 共用方法資料：`src/config/authority.ts` 的 `signatureMethods`。

## Inputs And State

- 頁面不依賴登入、遠端資料、JavaScript hydration 或使用者狀態。
- 首頁三個問題固定為：背景接不起來、成果不能直接用、出錯後只能重來。
- 方法固定為 Context、Harness、Skill；Harness 可對應多個症狀。
- Articles 路由可直接存在，但本頁不得產生 Article CTA。

## Outputs And Side Effects

- 初次渲染輸出四個 Diagnosis 案例：A 至 D。
- `signatureMethods` 依 Context、Harness、Skill 排序輸出。
- Hero 與 Route 的頁內連結只改變網址 hash 與捲動位置。
- 頁尾 CTA 只進行站內導覽，不寫入資料、不呼叫 API、不觸發外部平台。

## UI States

### First paint and ready

- 靜態頁面沒有 loading、empty 或 error state；首屏直接顯示 Hero 標題、說明與 filled primary Diagnosis button。
- 紙張材質、紫色識別、細線、迴紋針與 Boundary note 維持既有視覺語法。

### Desktop

- 1280px 與 1440px 可橫向比較四個案例的症狀、檢查與誤判。
- Method map 固定依 Context、Harness、Skill 顯示，不以症狀數量改變方法數量。
- Boundary note 後仍有頁面自己的 CTA，不直接落入 Footer。

### Mobile

- 320px、360px、390px 依症狀、最小檢查、常見誤判垂直閱讀。
- H1、H2 不出現孤立標點或拆開「檢查」等詞語的斷行。
- CTA 垂直排列，互動高度至少 44px。
- 不以縮小正文或 `overflow: hidden` 掩蓋超出問題。

### Keyboard and focus

- Hero link、Route recovery link、Courses CTA、Services CTA 都能以 Tab 聚焦並以 Enter 啟動。
- `:focus-visible` 在紙張背景上清楚可見。
- Hero Diagnosis 入口必須有清楚的按鈕邊界；其他小型互動文字也不能只靠顏色表達可點擊性。

### Reduced motion

- 本輪不新增自動位移、視差、進場動畫或 scroll hijack。
- 既有狀態變化不妨礙 `prefers-reduced-motion` 使用者閱讀或操作。

## Invariants

1. Expertise 先呈現症狀，再呈現方法名詞。
2. 首頁三個問題都能在 Diagnosis 找到直接或明確相近的案例。
3. 案例使用 A 至 D，方法使用 01 Context、02 Harness、03 Skill；兩套識別不混用。
4. Context、Harness、Skill 在 Diagnosis、Method map 與 Route 的順序一致。
5. Diagnosis 回答症狀、最小檢查與誤判；Method map 回答修好訊號與往下一層條件。
6. 「不是每個問題都需要 Agent」維持正常閱讀權重。
7. Articles CTA 維持暫停，不新增 CabAI、Discord、Email 或商品直連。
8. 全頁不新增未經證實的數字、成果、案例或見證。

## Acceptance Examples

```gherkin
Given 訪客從首頁的「一出錯就找不到原因，只能從頭再來」進入 Expertise
When 訪客閱讀 Diagnosis
Then 可以找到 Harness 的失敗復原案例
And 可以看見最後正確結果、第一個錯誤訊號與可恢復位置的最小檢查
```

```gherkin
Given 訪客已經辨認出問題層級
When 訪客閱讀 Method map
Then 依序看見 Context、Harness、Skill
And 每個方法都有修好後的可觀察訊號與往下一層條件
```

```gherkin
Given 訪客完成 Diagnosis 與 Boundary note
When 訪客到達頁尾行動區
Then 可以選擇「查看學習路線」前往 /courses/
And 可以選擇「討論實際情境」前往 /services/
And 不會看見 Articles、CabAI、Discord 或 Email CTA
```

```gherkin
Given 使用者以 320px 寬度或鍵盤瀏覽 Expertise
When 使用者閱讀標題並操作所有連結
Then 頁面沒有水平溢位或詞語破裂
And 每個互動元素都有可見焦點且可由 Enter 啟動
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run validate:content
    - npm run build
    - git diff --check
  browser:
    - 1440x900 desktop content and geometry review
    - 1280x720 desktop content and geometry review
    - 390x844 mobile content, touch target and heading review
    - 360x800 mobile content, touch target and heading review
    - 320x568 narrow mobile no-overflow and heading review
  keyboard:
    - Tab through Hero, Route and page-end links, then activate with Enter
```

## Evidence

### Before

- Baseline checkpoint：`f3317f2 chore: checkpoint before expertise correction`。
- 核准文案與目標：`docs/content/expertise-first-destination-correction-master-plan-2026-07-13.md`。

### After

- 內容與旅程第一版：`300f909 feat: complete expertise diagnosis journey`。
- 響應式與視覺證據第一版：`612c60a fix: refine expertise responsive experience`。
- 重新打開驗收：`ecefb96 docs: reopen expertise correction audit`。
- 症狀優先與去重修正：`cdee402 fix: enforce symptom-first expertise flow`。
- 第一版 Screenshot evidence：`docs/design/audits/2026-07-13-expertise-first-destination/`；重新稽核後只作基線，不再作為 Verified 證據。
- `npm run check`：通過，0 errors、0 warnings、17 個既有 hints。
- `npm run validate:content`：通過。
- `npm run build`：通過，共 48 pages。
- `git diff --check`：通過。
- 320 × 568、360 × 800、390 × 844、1280 × 720、1440 × 900：`scrollWidth === clientWidth`，沒有水平溢位。
- 360px Hero button 高度為 48px；390px Courses 與 Services CTA 高度約 48px。
- Hero 入口使用全站既有 `.btn.btn-primary`：1440px 為 232 × 48px，390px 為紙張內滿寬 326 × 48px；不再只以底線文字表示可點擊。
- `--accent-text` 對白底與紙面近似底色的對比分別約 6.40:1、6.03:1。
- 首頁 `查看診斷方法` → `/expertise/` → Hero `#diagnosis` 已走完；390px Mobile 的 Headbar bottom 為 70px，Diagnosis heading top 為 260px，保留 190px 安全距離。
- Courses 與 Services CTA 已分別實際前往 `/courses/`、`/services/`；accessible name 與 href 正確。
- Hero 由連續四次 Tab 聚焦，Shift+Tab 後再 Tab 可返回，Enter 正確前往 `#diagnosis`；Route、Courses、Services 亦通過真實 Tab、Shift+Tab 與 Enter 操作。
- Hero、Route、Courses、Services 均為原生 `<a href>`，可聚焦且 `:focus-visible` outline 清楚。
- Expertise 可執行的 Article CTA 為 0；頁面沒有 CabAI、Discord、Email 或商品直連。

### Correction evidence verified

- Diagnosis 在五種尺寸均先呈現 Case A 至 D 與症狀，方法名稱只在症狀之後作為弱化分類。
- Method map 已移除重複定義；320／360／390／1280／1440 的高度皆短於 Diagnosis。
- 公開方法名稱統一為 Context、Harness、Skill；中文僅作輔助說明。
- v2 evidence 已補齊 homepage entry、完整 Desktop Diagnosis、Desktop Method map／page end，以及五種尺寸長頁。
- 截圖、量測、DOM 與真實鍵盤紀錄：`docs/design/audits/2026-07-13-expertise-first-destination-v2/README.md`。

## Intentional Changes

- Diagnosis 從三個案例增加為四個，新增 Harness 失敗發現與復原案例。
- 案例識別由 01 至 03 改為 A 至 D；方法識別固定為 01 至 03。
- `signatureMethods` 由 Harness、Context、Skill 改為 Context、Harness、Skill。
- Method map 由「適合先看」改為「修好後會看見什麼」與「什麼時候往下一層查」。
- Route 最後一項改為真正的 `#diagnosis` 連結。
- Boundary note 後新增 Courses primary 與 Services secondary CTA。

## Open Questions

- None. Master Plan 的修正項目、五種尺寸、真實鍵盤操作與 regression boundaries 均已有 production evidence。
