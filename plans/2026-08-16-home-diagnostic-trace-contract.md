---
schema_version: behavior-contract/v1
id: cablate.home.diagnostic-trace
title: CabLate 首頁診斷追跡台
status: active
owner_surface: shared
change_context:
  type: feature
  reason: 把首頁的症狀與方法兩個靜態段落合成一個可操作、可驗證的 CabLate 專屬診斷切片。
  non_goals:
    - 不改 Hero、route section、CabAI handoff、newsletter 或 footer。
    - 不改 /expertise/ 的五層正式健檢與事件契約。
    - 不增加 runtime dependency、API、儲存或 analytics event。
---

# CabLate 首頁診斷追跡台

## Change Context

目前首頁先列三個症狀，再以另一個深色 section 解釋 Context、Skill、Harness。兩段內容正確，但讀者必須自己把症狀和檢查層接起來。這次 targeted evolution 將兩段合為一個 `Diagnostic field + Process trace`，讓選擇症狀本身就顯示診斷問題、判斷方法與一條「證據 → 驗證」路徑。

## Behavior Boundary

In scope：

- `/` 首頁在 Hero 後的症狀辨識與三層簡化診斷。
- 三個互斥症狀的 pointer、touch 與 keyboard selection。
- 選取後顯示對應 Context／Skill／Harness trace。
- 760px 以下重新構圖與 reduced-motion 完成狀態。

Out of scope：

- 真正替使用者判分、保存答案或產生健檢結果。
- 修改 `/expertise/` 互動、事件名稱或 UTM。
- 發明成功率、客戶案例、效能倍數或產品能力。

## Consumers And Entrypoints

- Public browser route：`GET /`。
- Search engine／screen reader：初始 HTML 中的完整症狀與診斷。
- Keyboard users：radio group、自然 Tab 順序與可見 focus。

## Inputs And State

- 輸入只有三個本機 radio choices：`context`、`skill`、`harness`。
- 初始狀態選取 `context`，讓 first paint 有完整範例，不出現空白 panel。
- 狀態不寫入 URL、storage、cookie、analytics 或伺服器。
- `:has()` 可用時只顯示選中 panel；不支援時三份 trace 依序顯示，內容仍完整可讀。

## Outputs And Side Effects

- 視覺輸出：選中症狀、對應診斷章、判斷方法與一條「證據 → 驗證」路徑。
- 本切片停在辨認與初步診斷，不提供導頁行動，也不產生 navigation side effect。
- 不新增 network request、timer、observer、RAF、hydration 或 dependency。

## UI States

- First paint：三個症狀可見，Context 預選，Context trace 完整可讀。
- Heading：不使用裝飾性 eyebrow 或補充說明段；標題以「你是不是也遇過／這幾種情況」邀請讀者辨認自身狀態，並在 390px 維持兩行。
- Ready：pointer／touch 點 label，或鍵盤以 Tab 進入 radio group、方向鍵改選。
- Selected：只有一份對應 trace 是主要證據；選中狀態不只靠顏色，另有 inset marker 與文字章。
- Mobile selection：三個症狀入口保持可見，只顯示各自一個完整短句；原因、分類與第一步全部交給下方診斷紙，避免重複解釋。
- Motion：只有使用者選擇後才執行 `Focus → Trace → Verify`；診斷章落下，判斷與驗證路徑隨後顯示並停住。沒有 timer、循環或自動換題。
- Reduced motion：直接切換完成狀態，不執行 trace reveal。
- No CSS `:has()`：三份 trace 全部呈現，不遺失內容。
- No JavaScript：功能不變；本切片不依賴 JavaScript。
- Error／empty／loading：不存在遠端資料，因此沒有 loading 或 network error state。
- Teardown：無 listener、timer 或 runtime cleanup。

## Invariants

- H1、Hero、首頁 title／description、主要 routes 與既有 CabAI UTM 不變。
- 保留 Noto Sans TC／Noto Serif TC／mono 角色與既有色彩 tokens。
- 技術名詞出現在讀者症狀之後。
- 完整內容存在初始 HTML，不用動畫或 JS 才能理解。
- 動態只由使用者選擇觸發；每次完成後永久停住，不自動輪播症狀。
- page-level horizontal overflow 在 390px 必須為 0。

## Acceptance Examples

```gherkin
Given 首頁第一次載入
Then 「講了很多次 AI 表現仍很差」為預選症狀
And Context／資訊脈絡的診斷問題、判斷方法與驗證路徑完整可見
And 本切片沒有健檢 CTA
```

```gherkin
Given 使用者以鍵盤聚焦症狀 radio group
When 使用者以方向鍵選擇「只要一步出錯，整個流程就得重來」
Then Harness／執行環境的 trace 變成可見
And 焦點仍留在所選 radio
And 診斷結果之後沒有額外導頁按鈕
```

```gherkin
Given viewport 為 390px 且 prefers-reduced-motion 為 reduce
When 使用者切換任一症狀
Then 對應 trace 直接顯示完成狀態
And document scrollWidth 不大於 document clientWidth
```

## Test Mapping

```yaml
test_mapping:
  static:
    - npm run check
    - npm run build
  browser:
    - Chrome desktop screenshot and DOM inspection at /
    - Chrome 390px screenshot and horizontal-overflow measurement
    - Keyboard radio selection and natural focus path
    - prefers-reduced-motion visual state
  regression:
    - Confirm existing CabAI UTM href remains unchanged
```

## Evidence

- Before：2026-08-16 production Chrome full-page capture in the active Codex task.
- Source before：`src/pages/index.astro` contained separate `.symptom-section` and `.method-section`.
- After desktop：`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\desktop-slice.png`。
- After mobile 390：`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\mobile-full-390.png`。
- Chrome 390：`scrollWidth === clientWidth`；Chrome 414：單欄 symptom composition，`scrollWidth === clientWidth`。
- Responsive matrix：320、390、414、600、601、760、761、980、981、1024px 均為 0 page-level horizontal overflow；600／601 與 760／761 的重新構圖邊界符合預期。
- Keyboard：ArrowDown 將選擇從 Context 移到 Skill；原生 radio group 的方向鍵行為維持不變。
- Semantics：3 個 radios 均有 label；只有 1 個 visible trace；hidden traces 內沒有可見且可 Tab 的 control。
- Motion：使用者改選後，panel 180ms、診斷章 260ms、判斷與驗證路徑在 130ms 後進場；完成後仍維持原選項，沒有 autoplay 或 cycle。
- Static：`npm run check` 為 0 errors／0 warnings（15 個既有 hints）；`npm run build` 完成 53 pages，content 與 analytics validators 通過。
- Runtime cost：沒有新增 dependency、client script、request、timer 或 storage。
- Reduced motion：source 中明確移除 transition／trace animation；本次 Chrome 的 OS preference 為 no-preference，真實 reduce preference 尚未 runtime 驗證。
- 2026-08-17 after desktop 1440：裝飾性 symptom labels 與 heading paragraph 數量皆為 0；只有 1 份 trace 可見；page-level horizontal overflow 為 0。
- 2026-08-17 after mobile 390：主標維持 2 行；三個症狀高度約 76／77／77px；可見症狀補充說明為 0；section 高度約 1059px；page-level horizontal overflow 為 0。
- 2026-08-17 interaction：pointer 選取 Harness 後，唯一可見的診斷題為「流程是從哪一步開始斷掉的」；Context／Skill／Harness 的 native radio 結構、name 與 `aria-controls` 未改動。
- 2026-08-17 static：`npm run check` 為 0 errors／0 warnings（15 個既有 hints）；`npm run build` 完成 53 pages，content 與 analytics validators 通過。
- 2026-08-16 section copy revision：移除沒有資訊責任的 eyebrow「先別急著堆更多規則」。
- 2026-08-17 section copy revision：移除標題旁的操作說明；主標改為「AI 又卡住了／先別急著改 Prompt」；三個症狀改為平行兩行短句；診斷紙標題改為讀者真正要確認的問題。
- 2026-08-17 mobile recomposition：移除三個症狀的 `SYMPTOM 01–03` 與原因展開；三個 radio 仍完整可選，選中狀態以紫色 rail 表示，診斷紙沿用同一條 trace 語彙。實測尺寸與 overflow 見本次 after evidence。
- 2026-08-17 heading and action revision：主標改為更口語的「你是不是也遇過／這幾種情況」；診斷切片內的 `/expertise/#workflow-check` 健檢 CTA 已移除，讓這一區只負責辨認與初步診斷。
- 2026-08-17 heading and action runtime：390px 主標為 2 行、section 約 987px、診斷區內 button／CTA 為 0、唯一可見 trace 為 1、page-level horizontal overflow 為 0；1440px section 約 767px，診斷區內 button／CTA 為 0、唯一可見 trace 為 1、page-level horizontal overflow 為 0。
- 2026-08-17 symptom density revision：三個入口改成完整短句；前兩句為「講了很多次 AI 表現仍很差」與「這次明明做出成果 下次又要重來」。移除資料結構與 DOM 中的人工斷行，讓文字只在容器真的不足時自然換行，降低手機選項高度。
- 2026-08-17 symptom density runtime：390px 三個症狀皆為單行，每個入口約 51px，section 約 810px，page-level horizontal overflow 為 0；1440px 三個症狀皆為單行，每個入口約 134px，page-level horizontal overflow 為 0。
- 2026-08-17 trace trim and mobile gutter：移除診斷紙底部「先查，不等於先定罪⋯⋯」整個 footer；手機首頁外層 `<main>` padding 與 `.home-page` 自有 margin 各減半，目標把內容到 viewport 的總邊界由約 28px 降到約 14px。
- 2026-08-17 trace trim and mobile gutter runtime：390px 診斷區左右邊界約 14px、page-level horizontal overflow 為 0；`.trace-panel__footer` 與被移除文字的 DOM 數量皆為 0，沒有殘留 footer 軌道。
- 2026-08-17 trace density revision：移除 `01／定位`、`02／找證據`、`03／留下下一步` 的制式編號與三排表格，但不把診斷縮成單一句子。每份結果保留分類章、大問題、判斷方法，底部再以「要對照的證據 → 如何重跑」形成一條可執行路徑；完整方法仍留給 `/expertise/`。
- 2026-08-17 trace density visual evidence：`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\mobile-trace-balanced-final-settled-focus.png` 與 `D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\desktop-trace-balanced-final-focus.png`。390px 截圖在動畫完成後確認正文對比、兩欄驗證路徑與紙張邊界可讀。
- 2026-08-17 trace paper and wrapping revision：判斷正文改由內容資料指定兩個語意句段，不讓 viewport 在不自然的位置斷句；驗證路徑在桌面以「證據 → 驗證」整組水平置中，390px 則重新構圖為置中的上下因果。結果紙直接使用既有 `--paper-white-image`，紙張本身就是最外層容器與邊界，不再疊加另一個白框。
- 2026-08-17 trace paper and wrapping visual evidence：`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\mobile-trace-paper-centered-focus.png` 與 `D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\desktop-trace-paper-centered-focus.png`。兩個 viewport 均在動畫完成後擷取；紙纖維、自然紙緣、正文換行與置中驗證路徑可見。
- 2026-08-17 copy and hierarchy correction：tab、診斷問題、正文與下一步皆改由內容資料指定語意句段。760px 三欄 tab 依完整片語換成兩行；390px 單欄在容器足夠時維持單行。文案不再對讀者展示「證據 → 驗證」這套內部框架，改為「它可能沒看到／做法沒有留下／流程接不回去」三個可直接辨認的問題。
- 2026-08-17 unboxed paper correction：移除診斷紙內 `.trace-verification` 的邊框、底色與卡片 padding；下一步只用置中文字、留白與箭頭建立層級。同步移除包住選項與紙張的 `.diagnostic-console` 外框，紙張素材本身就是結果區的邊界。
- 2026-08-17 latest visual evidence：`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\mobile-trace-copy-unboxed-390.png`、`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\tablet-trace-copy-unboxed-760.png`、`D:\_CabLate_Agents\coder\artifacts\cablate-home-diagnostic-trace\desktop-trace-copy-unboxed-1440.png`。其中 760px 實測三個 tab 的換行點均落在預先指定的完整片語之間；紙張下半部沒有第二層白框或有色卡片。

## Intentional Changes

- 原本兩個連續 section 合併成一個互動 section。
- 原本方法是固定表列；改為症狀驅動的 Context／Skill／Harness trace。
- 原本 CTA 曾從症狀 paper 移到診斷結果結尾；本次再移除，因為這個切片的任務是辨認與初步診斷，下方 route section 才負責提供下一步選擇。
- 三個症狀不再以裝飾英文編號或手機內嵌說明建立層次；症狀只負責辨認，診斷紙負責分類、判斷方法與驗證路徑。診斷紙內也不使用 `01–03` 製造虛假的流程感。

## Open Questions

- 真實使用成效與選擇分布尚無 analytics；本階段刻意不增加事件。
- Screen reader 需後續以 NVDA／VoiceOver 真人驗證；本階段先驗語意、鍵盤與可見狀態。
- OS `prefers-reduced-motion: reduce` 需在可切換該 preference 的 Chrome 環境補一次 runtime capture。
