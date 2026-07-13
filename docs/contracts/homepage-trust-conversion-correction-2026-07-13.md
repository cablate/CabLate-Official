---
schema_version: behavior-contract/v1
id: cablate.homepage-trust-conversion-correction
title: CabLate homepage trust and conversion correction
status: verified
owner_surface: shared
change_context:
  type: bugfix
  reason: 修正首頁已建立認同與信任卻沒有合理下一步，以及 Search 與本版網站策略不一致的問題。
  non_goals:
    - 不重做 Hero、照片輪播、紙張材質、側欄寬度或首頁區塊順序。
    - 不修改 About、Expertise、Work、Courses、Services 或 Articles 的頁面內容。
    - 不恢復 Article 導流，不新增註冊、Discord 或第二個 CabAI 商品 CTA。
    - 不新增動畫套件、圖片素材、替代搜尋或全站 CSS 重構。
---

# Homepage Trust And Conversion Correction Contract

## Change Context

首頁仍是 CabLate.com 的信任與決策中樞。本次變更保留現有紫色紙面視覺與內容順序，只修正六個可觀察問題：移除 Search、讓 Diagnosis 提供合理行動、提高 About 入口辨識度、重寫 Routes 的選擇框架、提升 Case 經驗證據，以及說清楚 CabAI 的平台角色。

使用者已於 2026-07-13 核准 master plan 第 7 節的 12 項可見文案。

## Behavior Boundary

### In scope

- `/` 的 Diagnosis、Core proposition、Routes、Case 與 CabAI 區塊。
- 桌機側欄與手機選單中的 Search 入口。
- Footer 中的 Search 入口。
- `/search/` route、Pagefind build step 與 `pagefind` dev dependency。
- 1440、1280、390、360、320px 寬度下的 CTA 安全內距、斷行與 focus 行為。
- `#diagnosis` hash 到達時的 mobile headbar offset。

### Out of scope

- Hero 文案、CTA、圖片與 carousel 行為。
- 首頁 Newsletter 的內容與送信行為。
- 文章、課程內容頁、搜尋替代方案與 redirect。
- CabAI 外站的註冊、登入、購買或 Discord 功能。
- 其他頁面的文案、版面或 CTA。

## Consumers And Entrypoints

| Consumer | Entrypoint | Expected behavior after change |
| --- | --- | --- |
| 首頁訪客 | `/` | 依問題辨識、人物信任、路徑選擇、經驗證據、CabAI 說明的順序閱讀 |
| 桌機訪客 | `ArchiveNavigation.astro` desktop rail | 不顯示 Search 入口，其他導覽順序與 active state 維持 |
| 手機訪客 | `ArchiveNavigation.astro` mobile menu | 不顯示 Search 入口，選單開關、Escape 與其餘連結維持 |
| Footer 訪客 | `BaseLayout.astro` footer links | 不顯示 Search，CabAI、Email、Threads、GitHub 維持 |
| 舊 Search URL 訪客 | `/search/` | 由既有 404 頁處理，不 redirect、不提供替代搜尋 |
| Production build | `npm run build` | 建置 Astro、IndexNow 與 sitemap ping，不執行 Pagefind |
| 套件管理 | `package.json`、`package-lock.json` | 不再包含 direct `pagefind` dependency |

## Inputs And State

- 首頁內容來源為 `src/pages/index.astro` 與既有 `siteConfig` CabAI URLs。
- CabAI 外部連結繼續透過 `withCabAiAttribution` 產生來源參數。
- Hero 的 `#diagnosis` link 與 Diagnosis 的 `id="diagnosis"` 必須保持一致。
- 桌機導覽與 mobile menu 依目前 pathname 決定 `aria-current`。
- 版面必須支援 1440 × 1000、1280 × 800、390 × 844、360 × 800、320 × 568。
- `prefers-reduced-motion` 可為 reduce；本輪不得新增依賴動畫才能理解的內容。

## Outputs And Side Effects

- Diagnosis 先完整輸出三個問題情境，再在同一張紙的底部輸出兩個語意正確的原生連結：
  - `查看診斷方法` -> `/expertise/`，contextual primary。
  - `討論合作` -> `/services/`，contextual secondary。
- Core proposition 輸出 `認識我的經歷與判斷方式` -> `/about/`，有邊框、底色與箭頭回饋的 trust action。
- Routes 保留 `/expertise/`、`/courses/`、`/services/` 三個 destination 與既有順序，三個入口使用同系 paper button，不再只靠紫色文字表示可點。
- Case 保留手冊商品 URL；H2 下方直接顯示 `Agent 深度工程手冊`，並用正文說清楚半年多的問題追查、排查順序與修正方法。
- CabAI 只輸出一個外部 products CTA：`查看免費試看與學習內容`。
- `/search/` source route 被刪除，production output 不再包含有效 Search 頁面。
- Pagefind index 不再產生，build output 不再出現 Pagefind skipped、built 或 failed 訊息。
- 不新增資料寫入、儲存、analytics event、timer 或 runtime subscription。

## UI States

### First paint

- 首頁所有區塊與 CTA 直接可見，不等待 reveal animation。
- 原有 Hero、carousel、照片、紙張材質與區塊順序維持。
- Search 不出現在桌機 rail、mobile menu 或 Footer。

### Ready

- Diagnosis 的 primary 與 secondary action 可辨識為不同權重。
- About action 不小於正文，與 identity copy 形成清楚 action row。
- Routes 的說明文字在三條路徑之前，箭頭與文字基線一致。
- Case proof 緊鄰標題並在步驟之前可見。
- CabAI 在 CTA 前已交代平台內容與付費決策方式。

### Focus and active

- 所有 CTA 為原生 `<a>`，Tab 順序與 DOM／視覺閱讀順序一致。
- `:focus-visible` 有清楚 outline 或等價指示，不能只靠紫色文字。
- Mobile 可點目標至少 44px 高。
- Active feedback 只使用短距離 transform 或 opacity，不產生 layout shift。

### Responsive wrapping

- 1440px 與 1280px：Diagnosis actions 留在左側 intro，Routes action 不斷成兩行。
- 390px、360px 與 320px：Diagnosis actions 垂直排列，About action 可滿寬，所有文字與按鈕留在 `.paper-card__inner`。
- 320px：CabAI CTA 維持單行且不縮小字級、不造成水平捲動。
- 所有人工標題斷句維持閱讀節奏，`text-wrap` 只作輔助。

### Hash navigation

- 開啟 `/#diagnosis` 時，Diagnosis 標題與 section label 不被 mobile headbar 遮住。

### Search not found

- `/search/` 使用既有 404 頁與全站導覽。
- 不顯示 Pagefind UI、Search input、載入或 error state。

## Invariants

1. 首頁頁級 Primary CTA 意圖仍是從問題出發選擇適合路徑。
2. Diagnosis 最多一組兩層 CTA，不為三個診斷 row 各加連結。
3. 同一區最多一個 filled button，合作 action 不得與診斷 action 同權重。
4. About 是信任補強，不變成頁級 Primary CTA。
5. Routes destination、順序與 H2 `你現在最想改善哪一件事？` 維持。
6. Case 的半年以上經驗聲稱不改數字、不改強、不新增成果。
7. Case 手冊 CTA 仍直達既有商品頁。
8. CabAI 只保留 products URL 一個外部 CTA，不新增註冊、Discord、Article 或第二商品 CTA。
9. 外部連結維持 `target="_blank"` 與 `rel="noopener"`。
10. H1/H2/H3 階層、原生連結語意、focus-visible 與現有 reduced-motion 支援不退步。
11. Search 移除不得刪除文章正文中一般「搜尋」用語，也不得移除 IndexNow 或 sitemap ping。
12. 不改 Hero、carousel、照片、側欄寬度、紙張材質與首頁 section order。

## Acceptance Examples

```gherkin
Scenario: a visitor who recognizes the diagnosis can act immediately
  Given the homepage is ready
  When the visitor has read all three Diagnosis situations
  Then the next focusable link is "查看診斷方法" pointing to /expertise/
  And an equally sized lower-weight button "討論合作" points to /services/

Scenario: the core proposition introduces the person behind it
  Given the visitor reaches the proposition section
  When they scan the section label and action
  Then the label reads "我是 CabLate"
  And the action "認識我的經歷與判斷方式" points to /about/

Scenario: route choice is framed as problem solving
  Given the visitor reaches the Routes section
  Then the label reads "從最接近你的問題開始"
  And the supporting sentence explains diagnosis, learning and cooperation
  And the existing three route destinations remain /expertise/, /courses/ and /services/

Scenario: experience proof is part of the case claim
  Given the Case heading is visible
  Then "Agent 深度工程手冊" is visible immediately below the heading
  And the accompanying normal-size copy explains that the handbook comes from more than half a year of repeated implementation and debugging
  And the primary action reads "查看工程手冊"

Scenario: CabAI has one clear role and one exit
  Given the visitor reaches the CabAI section
  Then the heading explains that courses, handbooks and free previews are collected there
  And the body says the visitor can inspect current content before deciding whether to pay
  And exactly one CabAI products link is present in the section

Scenario: Search is fully removed
  Given the site is built after the change
  When I inspect the desktop rail, mobile menu and Footer
  Then none contains a /search/ link
  And opening /search/ renders the normal 404 page
  And the build output contains no Pagefind execution message

Scenario: the smallest supported viewport stays usable
  Given a 320 by 568 viewport
  When I scroll through the homepage
  Then no CTA or text exceeds the paper safe padding
  And the document has no horizontal overflow
  And every CTA remains keyboard focusable and at least 44px high where used on mobile
```

## Test Mapping

```yaml
static:
  - npm run check
  - npm run build
  - git diff --check
  - rg -n -i "pagefind|/search/" src scripts package.json package-lock.json
browser_dom:
  - homepage heading, label, accessible link name and href assertions
  - desktop rail, mobile menu and footer search absence
  - /search/ normal 404 title and content
  - document scrollWidth equals clientWidth at five required viewports
manual_browser:
  - 1440x1000 and 1280x800 visual hierarchy review
  - 390x844, 360x800 and 320x568 safe-padding and wrapping review
  - Tab, Shift+Tab and Enter through homepage CTAs
  - /#diagnosis mobile headbar offset
```

## Evidence

### Before

- Baseline checkpoint: `9abd3ca chore: checkpoint site redesign before homepage conversion pass`.
- Approved plan: `docs/content/homepage-trust-conversion-correction-master-plan-2026-07-13.md`.
- Earlier screenshots: `docs/design/audits/2026-07-13-site-goal-reaudit/`.

### After

- Search removal checkpoint：`00e9432 refactor: remove site search and pagefind`。
- 首頁實作：`src/pages/index.astro` 已套用 12 項核准文案與 scoped responsive styles，沒有修改 Hero、carousel、照片、紙張材質、section order 或其他頁面。
- 人工複核修正：Diagnosis 的雙 CTA 已移到三個情境之後並改成 `查看診斷方法`／`討論合作`；About 與 Routes 入口已改成可辨識的 paper button；Case 已把手冊名稱與半年多經驗直接放進主要閱讀層級。
- 最終命名確認：站內公開名稱統一為 `Agent 深度工程手冊`；既有商品 URL、CabAI attribution 與針對 Claude Code／Agent 內容的推薦條件維持不變。
- Screenshot evidence：`docs/design/audits/2026-07-13-homepage-trust-conversion/`，包含 1280／1440 desktop 與 320／390 mobile 的 top、Diagnosis、Routes、Case、CabAI 畫面；360px 另以 DOM geometry 完成壓力測試。
- 人工複核後的 v2 evidence：`docs/design/audits/2026-07-13-homepage-trust-conversion-v2/`，包含 desktop Diagnosis、desktop handbook、mobile Diagnosis actions 與 mobile handbook；用來確認 CTA 順序、按鈕辨識度、手冊名稱與 safe padding。
- `npm run check`：通過，0 errors、0 warnings、17 個既有 hints。
- `npm run build`：通過，共 48 pages；build output 沒有 Pagefind 步驟，`dist/search` 不存在。
- `git diff --check`：通過。
- `rg -n -i "pagefind|/search/" src scripts package.json package-lock.json`：沒有命中。
- `/search/`：HTTP 404；瀏覽器顯示既有 `找不到頁面 | CabLate`／`404` 畫面，桌機 rail、mobile menu 與 Footer 均無 Search。
- 1440 × 1000、1280 × 800、390 × 844、360 × 800、320 × 568：`scrollWidth === clientWidth`，新增 CTA 均在 `.paper-card__inner` 內。
- 320px：CabAI CTA 的 client／scroll width 相等並維持單行；mobile CTA computed `min-height` 為 44px，CabAI CTA 為 48px；Case proof 為 16px。
- Mobile hash：390px 與 320px 點擊 Hero CTA 後，`#diagnosis` section top 約 83px、heading top 約 137px，均低於約 70px 的 fixed headbar，不被遮蔽。
- Keyboard：所有行動均維持原生 `<a href>`；八個首頁 CTA 依視覺閱讀順序連續出現在 DOM tab order，逐一聚焦時 `:focus-visible` 皆為 true。

## Intentional Changes

- Remove Search from desktop navigation, mobile navigation and Footer.
- Remove `/search/` as a valid content route; the URL now resolves to the existing 404 experience.
- Remove Pagefind build logic and direct dependency.
- Add two contextual Diagnosis actions with unequal visual weight.
- Place both Diagnosis actions after all three situations and use concise, non-duplicated labels.
- Promote the About and Routes links into bordered paper buttons without changing their destinations.
- Promote the handbook's product identity and evidence without changing its destination or factual claim.
- Reframe Routes and CabAI with the 12 user-approved copy changes.

Any visible, behavioral or routing difference not listed above is a regression.

## Open Questions

- None. The copy, destinations, Search removal scope and visual boundaries were approved before implementation.
