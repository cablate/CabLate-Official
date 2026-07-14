---
schema_version: behavior-contract/v1
id: site.remaining-primary-pages-cta-and-sequence
title: 剩餘主要頁面 CTA 與閱讀順序契約
status: draft
owner_surface: shared
change_context:
  type: refactor
  reason: About、Work、Courses、Services 已有內容骨架，但重要行動、閱讀順序與 recovery path 在實際畫面上不夠可辨識；需要先建立共用驗收邊界，再逐頁修正。
  non_goals:
    - 不在本契約建立或修改任何 production CSS、頁面文案或 route。
    - 不把四頁抽成共用 layout 或同一種敘事模板。
    - 不修改已驗證的 Home、Expertise、Articles pause、Search removal 或 Starter Pack 狀態。
    - 不新增客戶、成果數字、價格、產品、Email、CabAI campaign 或未核准 CTA。
---

# 剩餘主要頁面 CTA 與閱讀順序契約

## Change Context

這份 contract 是父 Master Plan 的 Foundation slice `F1` 產物。它先鎖定現有行為與預期的可觀察結果，讓後續 F2、About、Work、Courses、Services slices 可以逐段驗證；F1 本身只新增文件，不改 browser-visible runtime。

契約採取兩個保護原則：

1. 「有 `href`、可 Tab、44px」只是底線，不足以證明訪客看得出這是下一步。
2. 共用的是互動狀態與可及性底層，不共用四頁的資訊架構、卡片版型或閱讀節奏。

## Behavior Boundary

### In scope

- 六個主要 route 的重要 CTA 行為與角色：`/`、`/expertise/`、`/about/`、`/work/`、`/courses/`、`/services/`。
- Primary、Secondary、Contextual、Recovery、Navigation 五種 CTA role 的可觀察差異。
- Native anchor、href、target、rel、accessible name、DOM 順序與頁內 anchor offset。
- First paint、ready、hover、active、focus-visible、reduced-motion、forced-colors 與 unavailable status。
- 五種 production viewport：`1440×900`、`1280×720`、`390×844`、`360×800`、`320×568`。
- Home 與 Expertise regression：現有已驗證 CTA、方法順序、route destination、paper safe area 不得退步。

### Out of scope

- F1 不修改 `src/styles/global.css` 或任何頁面 source。
- 不調整四頁的內容重述、標題句組、服務資料、案例限制或 route 文案；各自由 A／W／C／S slices 處理。
- 不恢復 Articles 站內 CTA，不新增 Search、Starter Pack 或 Article detail 導流。
- 不測量或承諾 GA4、Kit、CabAI 外站登入／購買、表單送信或後端資料流。
- 不以本 contract 單獨宣稱完整 WCAG 2.2 AA；完整鍵盤與 forced-colors 仍要在 browser gate 實測。

## Consumers And Entrypoints

| Consumer | Entrypoint | Contract responsibility |
| --- | --- | --- |
| 首次訪客 | 六個主要 route 的首屏與頁尾 action | 能在掃讀時辨識頁面任務與合理下一步 |
| 已理解問題的訪客 | Home／Expertise 的診斷、路線與 recovery CTA | 保留已驗證 destination、順序與語意 |
| About 訪客 | Hero Work、公開輸出敘事、交付經驗 proof、CabAI capability、頁尾學習／服務分流 | 公開輸出與交付經驗分開命名；信任先於商品；Services 是頁尾 Primary，Courses 是 Secondary，Work 承接完整證據 |
| Work 訪客 | Featured handbook、case action、頁尾 Services | 案例證據先於合作；長卡不作唯一 anchor |
| Courses 訪客 | 三條可走 route、unavailable status、CabAI secondary | 路線可獨立進入，不暗示 01→04 必修 |
| Services 訪客 | service options、Email、Threads fallback、process anchor | Email 是唯一 Primary，Threads 是可辨識 Secondary |
| 鍵盤／輔助技術使用者 | Tab、Shift+Tab、Enter、heading／link tree | DOM／visual order 一致，name 與 focus 可理解 |
| reduced-motion／forced-colors 使用者 | CSS media states | 不失去邊界、focus、active 與 role 差異 |

## Inputs And State

- 頁面是 Astro static output，不依賴登入、遠端資料、hydration、API、timer 或使用者 persisted state。
- 既有 `.btn`、`.btn-primary`、`.btn-ghost` 與 `.text-link` 是實際 source vocabulary；F2 只能整理狀態，不可把所有 `.text-link` 全站轉成按鈕。
- Contact destination 必須從 `src/config/siteConfig.ts` 的 `siteConfig.contactEmail` 產生。
- CabAI destination 必須從 `withCabAiAttribution()` 產生；不可在頁面硬編另一組 campaign。
- 頁內 anchors 依現有 id：Home `#diagnosis`、Expertise `#diagnosis`／`#method-map`／`#next-step`、Work `#selected-work`、Courses `#learning-map`、Services `#service-options`。
- 未開放課程 item 只有 status／說明，不具備 href、button role 或可點游標。
- About 公開輸出與交付經驗的 visible claims 必須來自 `src/config/authority.ts`、既有 Work stories、公開文章／研究或具體外部 URL；不可由 page component 臨時拼湊未驗證敘述。

## Outputs And Side Effects

### F1 actual output

- 新增本 contract 文件。
- 不產生 DOM、CSS、路由、資料寫入、網路呼叫、analytics event、外部導頁或 build artifact 變更。

### Later implementation output

- 重要 action 以 native `<a href>` 輸出，role、邊界、尺寸與文字可在實際畫面辨識。
- 頁內 anchor 到達後，目標 heading／section 不被 sticky Mobile Headbar 遮住。
- 外站連結另開分頁並保留 `rel="noopener"`；站內 route／anchor 不另開分頁。
- unavailable item 保持真實 disabled-like status，不製造假互動。
- active 只造成不超過 1px 的短距離狀態變化，不改變 layout。

## UI States

### First paint

- CTA 文字、邊界、紙張安全內距與主要 heading 首次渲染即可讀；不等待 reveal animation 才看得出 action。
- 不新增 loading、empty、error 或 hydration-dependent state。

### Ready

- Primary／Secondary／Contextual／Recovery／Navigation 的 role 可以只靠文字、邊界、位置與尺寸辨認，不只靠紫色。
- 每個頁面只有一個頁級 Primary 意圖；同區最多一個 filled action。
- CTA accessible name 能說出目的地或結果，避免只用「了解更多」「下一步」。

### Hover／active

- hover 至少改變背景、邊界或文字其中一項，不能只有難察覺色差。
- active 允許最多 1px 位移；不得造成鄰近內容跳動或紙張高度改變。

### Focus-visible

- 所有 native links 可用 Tab 聚焦、Enter 啟動。
- focus ring 至少 2px、高對比、約 3px offset，不被 paper surface、overflow 或 clip 裁切。
- Tab order 依語意與視覺閱讀順序，不因 CSS grid／absolute positioning 反轉。

### Reduced motion

- `prefers-reduced-motion: reduce` 移除非必要 transition／transform；閱讀順序與 role 不依賴動效。

### Forced colors

- `forced-colors: active` 仍保留可見 border、focus、文字與 disabled-like 狀態；不依賴背景圖、陰影或低對比紫色。

### Responsive

- Desktop：action row、紙張安全區與標題句組保持明確層級。
- Mobile：重要 CTA 至少 48px；Navigation 至少 44px；必要時 full width，但不以縮字、fixed height 或 overflow hidden 掩蓋內容。
- 五種 viewport 均須 `scrollWidth === innerWidth`；人工 phrase grouping 不由瀏覽器任意拆開專有名詞、數字與標點。

## CTA Role Contract

| Role | Observable contract | Allowed consumers | Forbidden fallback |
| --- | --- | --- | --- |
| Primary | Filled paper button；Desktop min 52px、Mobile min 48px；一個頁級決策 | 頁面主要 destination：About→Services、Work→Services、Services→Email | 21–23px 紫色小字、同區兩個 filled button |
| Secondary | Bordered paper button；min 48px；權重低於 Primary | 次要但可直接採取的 route／contact | 和 Primary 同權重、只有顏色的 link |
| Contextual | 緊鄰剛建立動機／證據的 bordered action row；min 48px | About CabAI capability、Work case action、Courses route | 只在內文末尾放紫色字＋箭頭 |
| Recovery | 明確說明回到哪裡的 bordered button；Mobile 通常 full width | Expertise 回診斷、Courses 不確定、Services fallback | 低對比「仍不確定？」補充連結 |
| Navigation | 可維持文字／nav row；獨立項 min 44px，非僅顏色提示 | Rail、Footer、跨頁探索 | 冒充頁面 Primary、與正文無法區分 |

## Invariants

1. Home／Expertise 已驗證的 route、方法順序、CTA、paper surface 與 heading 不因 F2 或後續頁面 slice 回歸。
2. 四頁保留各自資訊語法：About 是工作筆記／時間軸，Work 是案例檔案，Courses 是選擇地圖，Services 是服務／合作 brief。
3. 重要行動同時滿足「存在、可聚焦、尺寸底線、畫面可辨識、目的地正確」五項，不以其中一項代替全部。
4. All route／anchor links 使用 native `<a>`；不以 `div`、JS click 或假 button 模擬導覽。
5. `siteConfig.contactEmail` 是公開聯絡信箱唯一來源；不在 page source 另寫不同 Email。
6. CabAI link 維持 `withCabAiAttribution()` 與既有 campaign；不因 CTA upgrade 變更商品、帳號或購買語意。
7. unavailable course 不產生 href、假 disabled button、pointer cursor 或可誤觸的空 action。
8. 外部連結維持 target／rel 安全規則；站內連結不另開分頁。
9. anchor 目標在 sticky Headbar 存在時仍可見；`scroll-margin-top` 必須以實際 scroll 結果驗證。
10. CTA／heading／sequence 的 DOM order 與視覺閱讀順序一致；不能靠視覺位置掩蓋語意順序。
11. Mobile 不靠縮小字級、固定高度、裁切或白色遮罩解決紙張安全區問題。
12. F1 不改 runtime；任何未列入後續 slice 的 visible、routing、data 或 analytics 差異都是 regression。
13. About 的公開輸出不是 repo／stars／forks 索引；stars／forks 不在 About 顯示。區塊先呈現問題、判斷與可查驗來源，再由單一 Work contextual CTA 承接完整案例，並以 GitHub／Threads profile links 提供繼續認識作者的入口。
14. About 的交付經驗不是作品 repo；課程、教學、內訓、產品交付與 CabAI proof 必須保持獨立語意與既有揭露邊界。
15. About 每項公開輸出的 repo 名稱在卡片內只顯示一次；外部來源連結以動作文字承接，並維持可辨識的唯一 accessible name。交付成果只顯示成果本身，不顯示「截至」日期。

## Acceptance Examples

```gherkin
Scenario: F1 changes no runtime behavior
  Given the current Home and Expertise runtime is open
  When F1 is completed
  Then both routes, headings, CTA hrefs and visual states remain unchanged
  And only the behavior-contract document is added
```

```gherkin
Scenario: a page-level action is visually identifiable
  Given a visitor reaches a page's primary decision section
  When the visitor scans the heading, supporting copy and actions
  Then exactly one action is visually Primary
  And its accessible name describes the destination or result
  And its rendered height is at least 48px on Mobile
```

```gherkin
Scenario: About hands trust into the right paid path
  Given a visitor reaches the About next-step section
  When the visitor scans the heading, supporting copy and actions
  Then the Services action is the only filled Primary and links to `/services/`
  And the Courses action is a bordered Secondary and links to `/courses/`
  And Work remains available as a utility evidence link rather than a second filled Primary
```

```gherkin
Scenario: About distinguishes public output from delivery experience
  Given a visitor reaches the About evidence section
  When the visitor scans the section
  Then public outputs are labelled as externally checkable work such as GitHub, articles, research or social posts
  And delivery experience is labelled separately as teaching, courses, training, product delivery or CabAI content delivery
  And raw stars／forks are not rendered in the About evidence section
  And each repository name appears exactly once within its output card
  And source links do not visibly repeat repository names while their accessible names remain unique
  And delivery proof labels contain no visible as-of date
  And exactly one contextual Work action links to `/work/#selected-work`
  And profile actions link to the canonical GitHub and Threads accounts with safe external-link attributes
  And the page footer still owns the Services Primary and Courses Secondary choice
```

```gherkin
Scenario: an unavailable course remains honest
  Given a course route is marked not yet open
  When the visitor reaches that route item
  Then the status is readable as status text
  And the item has no href, button role or misleading pointer affordance
```

```gherkin
Scenario: native links preserve destination rules
  Given a visitor uses Tab and Enter on a CTA
  When the CTA is an internal route or page anchor
  Then it navigates in the same tab
  When the CTA is an external CabAI or Threads link
  Then it uses the existing attributed URL and safe external-link attributes
```

```gherkin
Scenario: anchor navigation respects the mobile headbar
  Given a visitor opens a page at a supported mobile viewport
  When the visitor activates a page anchor
  Then the target heading is visible below the sticky Headbar
  And the page has no horizontal overflow
```

```gherkin
Scenario: Home and Expertise regressions are caught before page work continues
  Given F2 has changed shared CTA states
  When Home and Expertise are checked at 1440px and 390px
  Then their accepted CTA roles, destinations and method sequence remain intact
  And any failure blocks the first four-page slice
```

## Test Mapping

```yaml
static:
  - git diff --check
  - npm run check
  - npm run validate:content
  - npm run build
source_inspection:
  - rg -n "withCabAiAttribution|contactEmail|target=|rel=|href=|scroll-margin" src/pages src/config src/styles
  - verify all twelve required repo paths from P1 evidence
browser_dom:
  - six route heading／link／href／accessible-name inventory
  - CTA rect height and native-anchor checks
  - unavailable item has no href or interactive role
  - DOM order for CTA and sequence sections
browser_interaction:
  - Tab／Shift+Tab／Enter through each role
  - internal route／anchor same-tab behavior
  - external target／rel behavior without submitting forms
visual:
  - 1440x900 and 390x844 targeted CTA／sequence captures for each page
  - five viewport page-gate captures after each page slice group
  - reduced-motion and forced-colors state captures at cross-page gate
```

## Evidence

### About evidence wording refinement, 2026-07-14

- Browser DOM at 1280px, 675px and 390px reports zero horizontal overflow.
- Each public-output card contains exactly one visible repo-name occurrence.
- Source-link accessible names remain unique: `查看公開程式碼：mcp-google-map`、`查看公開程式碼：banini-tracker`、`查看公開研究：claude-code-research`.
- About delivery proof labels render as `40+ 位學員` and `45 課已發布`; the trust section contains no visible `截至`.
- `npm run check` passes with 0 errors and 0 warnings; existing Astro hints remain unchanged.

### Baseline evidence

- `docs/design/audits/2026-07-14-incremental-execution/README.md`：P1 repo facts、Home／Expertise live URL、H1、route、action rect 與 zero-overflow baseline。
- `docs/design/audits/2026-07-14-remaining-primary-pages-plan/README.md`：About、Work、Courses、Services production baseline 與待修問題。
- `docs/contracts/homepage-trust-conversion-correction-2026-07-13.md`：Home verified CTA、route、Search removal 與 evidence boundary。
- `docs/contracts/expertise-first-destination-correction-2026-07-13.md`：Expertise verified method order、route、keyboard、anchor 與 five viewport boundary。

### Required future evidence

- F2：`docs/design/audits/2026-07-14-shared-action-regression/`。
- About：`docs/design/audits/2026-07-14-about-implementation/`。
- Work：`docs/design/audits/2026-07-14-work-implementation/`。
- Courses：`docs/design/audits/2026-07-14-courses-implementation/`。
- Services：`docs/design/audits/2026-07-14-services-implementation/`。
- Final cross-page gate：`docs/design/audits/2026-07-14-primary-pages-production-gate/`。

## Intentional Changes

### Approved About evidence wording refinement

- Remove visible as-of dates from About delivery proof labels while preserving the outcome counts.
- Reduce each public-output repo name to one visible occurrence per card; descriptions use the content type as subject, and source links use action wording with unique hidden context for assistive technology.
- Do not alter Work proof strings or any destination URL in this slice.

### F1 actual change

- Add this contract as a planning／verification artifact.
- No browser-visible behavior, route, copy, CSS, data, analytics or external navigation changes.

### Approved follow-up: About route chooser

- About 的頁尾由重複 Work Primary 改為 Services Primary、Courses Secondary、Work utility。
- 這是使用者核准的 A3 follow-up；保留 Hero Work、CabAI capability、Courses／Services 真實 destinations 與所有 shared CTA invariants。

### Later intentional changes governed by this contract

- Promote specified important small-text actions to bordered／filled paper action states.
- Give each page a single clear page-level Primary destination and preserve lower-weight contextual／recovery actions.
- Split long-card／whole-card anchors into semantic content plus explicit action rows where the page-specific slice requires it.
- Clarify sequence／route meaning without changing the approved destinations, product state, price, date or public evidence.

### Proposed follow-up: About evidence narrative（pending user review）

- Replace the current About `openSourceProofs` row presentation with two evidence groups: public outputs and delivery experience.
- Keep concrete GitHub／article／research／Threads sources as secondary evidence while making problem、insight、and capability the primary reading order.
- Add one contextual bordered Work CTA to `/work/#selected-work`; do not repeat the same Work action on every item.
- Omit stars／forks from About and add canonical GitHub／Threads profile actions as lower-priority author navigation.
- Keep Services／Courses as the final paid-path chooser in the existing About footer; do not turn the evidence section into a product wall.
- Migrate data responsibility through `src/config/authority.ts`; remove `openSourceProofs` only after its sole About consumer is replaced and source coverage is verified.

Any visible, routing, content, data or analytics difference not listed above is a regression and must stop the current slice.

## Open Questions

1. User review is still required for the role assignment of each page-specific CTA before F2 changes shared states.
2. If a page-specific visual request conflicts with Home／Expertise regression evidence, the conflict must be resolved before global CSS changes.
3. Existing Astro hints and Vite asset placeholder warnings remain technical observations, not F1 behavior changes; they are re-evaluated at G1.
4. The exact public-output source set (specific posts／articles／repositories) and the delivery-proof copy still need content review before A3b-1 is marked verified.
