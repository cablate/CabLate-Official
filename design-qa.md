# CabLate Full-site Design QA

Date: 2026-07-11

## Visual contract

- Desktop: fixed Open Desk Archive rail, warm external background, `#fffdf8` paper surfaces, `#8064ea` accent, serif headings, fine borders and restrained shadow.
- Mobile: CabLate brand header with a native disclosure menu; all six primary destinations plus Search remain reachable.
- Home remains the visual master. Inner pages may change composition by task but not navigation, typography, palette, surface or footer language.
- Approved baseline references: `docs/design/references/open-desk-archive-desktop-reference.png` and `open-desk-archive-mobile-reference.png`.

## Content and behavior review

- Home has one main landmark, one shared navigation and one shared footer. Its primary action routes visitors by problem.
- About proof includes detail and date; the expertise section is described as six supported research/practice topics; the final section has one primary CTA.
- Articles uses a manually featured recommendation as the starting point instead of labeling the newest post as the best entry.
- Expertise exposes real fragment targets for all six topics.
- Courses does not render links for unavailable items. Shared `.btn` styles are restored for future published course pages.
- Services has explicit fit, non-fit, deliverables, process, boundary and Threads inquiry instructions.
- Starter Pack has been retired; no production page or recommendation should link to `/starter-pack/`.
- Article recommendations only point to public routes. No recommendation points to draft course URLs.
- Search, privacy, article detail, tag and category routes use the same paper shell.

## Runtime evidence

- `npm run validate:content`: passed.
- `npm run check`: 0 errors; existing non-blocking Astro/TypeScript hints only.
- `npm run build`: passed; 49 pages generated after retiring Starter Pack.
- 1440 × 900: `/`, `/about/`, `/articles/`, `/courses/`, `/services/`, `/work/`, `/expertise/`, an article detail, Search, Privacy and Tags all showed the desktop rail and footer with `scrollWidth === clientWidth`; `/starter-pack/` is intentionally retired.
- 390 × 844: the same main reading routes had no horizontal overflow; content starts directly below the 70px mobile header.
- Mobile disclosure menu exposes seven links: Articles, Expertise, Work, Courses, Services, About and Search.
- Article detail correctly marks Articles as the active parent route.
- Clicking Articles → Context Engineering navigated to `/expertise/#context-engineering`, scrolled to the real target (`targetTop ≈ 96px`) and marked Expertise active.
- The local Windows build skips Pagefind generation by default; this is the only expected missing build-time `href` asset during the static target audit.

## Captured references

- Eight desktop full-page screenshots and eight 390 × 844 mobile top screenshots: `docs/design/references/current-pages/`.
- Per-page paper translation specification: `docs/design/cablate-paper-ui-page-translation-plan-2026-07-11.md`.

## Remaining gates before production asset insertion

- Formal headshot and its approved crops.
- Final product availability and deliverability matrix.
- Newsletter cadence and representative issues if a frequency promise is desired.
- Case-study/testimonial authorization.
- Review generated page proposals before extracting any raster assets into `public/`.

Final result: content and shared-shell baseline passed; image-generation proposal phase may begin.

## Work service bridge Design QA — 2026-07-14

- Source truth：`C:/Users/User/.codex/generated_images/019f5dfa-f4ec-7012-8453-21d555901f17/exec-a3fb69ab-0d33-4a96-b81e-3b0e7bcd75e3.png`
- Implementation screenshot：`docs/design/audits/2026-07-14-work-service-bridge/14-desktop-1280x900-final.png`
- Viewport／state：1280 × 900，`/work/#service-bridge`，section top `87.95px`；Mobile evidence 為 390 × 845。
- Full-view comparison：`docs/design/audits/2026-07-14-work-service-bridge/15-source-vs-implementation-1280x900.png`
- Focused responsive evidence：`docs/design/audits/2026-07-14-work-service-bridge/12-mobile-390x845-final.png`

Required fidelity surfaces：

- Typography：核准三行標題節奏成立；card body Desktop `15.04px`、Mobile `16px`。
- Spacing：Desktop 左文右卡與三張錯落紙卡成立；Mobile 改為單欄並取消 transform。
- Colors：沿用 CabLate 紙張、紫色與深墨色 token；黃色 fallback 為素材中心色 `#f5ebd5`。
- Image quality：使用真實 1x／2x paper WebP image-set；移除會造成黑色 paint artifact 的 CSS filter。
- Copy：三個 canonical service titles 與 Work 專用摘要完整；沒有公司、客戶、有限揭露或假案例語言。

Interaction／runtime：區塊只有一個 focusable CTA，href `/services/`、Desktop／Mobile 高度 `52.78px`，`focus-visible` outline 規則存在；Desktop 與 Mobile 均 zero horizontal overflow，console 無 runtime error。

Comparison history：先排除 stale HMR capture，再修正透明 WebP 黑色 paint artifact、標題斷行與 Mobile body 字級；最終 source／implementation 同畫面比較沒有 P0、P1 或 P2 mismatch。卡片實際寬度與上方頁面露出量的差異，是套入 production Work layout 與真實 viewport 後的可接受變化。

Final result: passed
