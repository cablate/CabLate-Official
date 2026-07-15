---
schema_version: behavior-contract/v1
id: cablate.site-p1-p2-hardening
title: CabLate site P1/P2 hardening
status: verified
owner_surface: shared
change_context:
  type: bugfix
  reason: 修正 final audit 發現的跨頁裁切、語意與可及性問題。
  non_goals:
    - 不改變既定紫色品牌、紙張主視覺或頁面角色。
    - 不處理 P3 紙面裝飾重複與其他純 polish。
    - 不改稿文章內頁、課程內容頁與搜尋頁的完整內容架構。
---

# CabLate Site P1/P2 Hardening Contract

## Behavior Boundary

### In scope

- `/`、`/about/`、`/expertise/`、`/work/`、`/courses/`、`/services/`、`/articles/` 的桌機／手機可見邊界。
- 共用紙張容器、固定側欄、mobile header、footer 與頁面索引。
- 首頁 landmark 語意、輪播 ARIA 語意與鍵盤操作。
- 主要入口頁標題的人工斷句與不必要空白。
- 主要入口頁的 P2 決策密度與 CTA 層級。

### Out of scope

- P3 紙卡／迴紋針視覺 polish。
- Starter Pack（已移除）的復原。
- 文章內頁、課程內容頁、搜尋頁的完整文案或視覺重構。

## Consumers And Entrypoints

- Browser routes listed above using `BaseLayout.astro` and `ArchiveNavigation.astro`.
- `src/styles/base.css`、`src/styles/global.css`、`src/styles/utilities.css`。
- `src/pages/index.astro`。
- `src/components/sections/HeroCarousel.astro`。
- Assistive technology landmark and carousel navigation consumers.

## Inputs And State

- Desktop CSS viewport: at least `1440 × 900`; mobile CSS viewport: at least `390 × 844`.
- Browser scrollbar may reduce `clientWidth` relative to `innerWidth`.
- Mobile menu open/closed state is represented by native `<details>` state.
- Carousel current slide is represented by the current dot and the visible slide.
- `prefers-reduced-motion` may be enabled.

## Outputs And Side Effects

- All visible headings, labels, indexes, CTAs, footer content and paper edges stay inside the available inline size.
- Removing the redundant homepage landmark does not change visible content or hash targets.
- Carousel state updates `aria-current`, `aria-hidden` and focusable controls without changing slide order.
- CSS changes must not introduce horizontal document scrolling or hide content as a workaround.
- No network, storage or analytics side effect is added by this hardening pass.

## UI States

- **First paint:** paper layout and all primary text are visible without waiting for reveal animation.
- **Ready:** desktop and mobile pages show complete paper boundaries, headings, indexes and CTAs.
- **Mobile menu closed:** header brand and menu trigger fit within the viewport.
- **Mobile menu open:** menu paper and every link remain inside the viewport and are keyboard reachable.
- **Carousel ready:** current slide is exposed, previous slides are hidden from assistive technology, arrows and dots remain operable.
- **Reduced motion:** no content depends on transition or scroll animation; carousel changes are immediate.
- **Teardown/page transition:** no duplicate carousel listeners or stale focus state after Astro navigation.

## Invariants

1. One document-level `<main id="main-content">` exists per page.
2. Page content is never clipped merely because a background image is intentionally oversized.
3. `overflow-x` checks are supplemented by visual viewport evidence.
4. Every primary CTA remains visible and has a specific, non-empty accessible name.
5. DOM order remains the visual reading order; no positive tabindex or CSS reordering is introduced.
6. Existing active navigation, hash-scroll offset, image alt text and mobile menu behavior remain intact.
7. Reduced-motion users can read and operate all content without animation.

## Acceptance Examples

```gherkin
Scenario: desktop page content is not clipped
  Given a 1440 by 900 desktop viewport with a vertical scrollbar
  When I open each of the seven public entry pages
  Then every page title, top-right index, CTA, footer and paper edge is visible
  And no element is cut at the right edge of the capture

Scenario: mobile header and paper content fit
  Given a 390 by 844 mobile viewport
  When I open Home, About, Expertise, Work, Courses, Services and Articles
  Then the brand and menu trigger fit inside the header
  And opening the menu keeps every link inside the menu paper

Scenario: homepage has one main landmark
  Given the homepage is loaded
  When I inspect the document landmarks
  Then exactly one main landmark exists
  And it has id main-content

Scenario: carousel exposes only the current slide
  Given the homepage carousel is ready
  When I activate the next-slide control or press ArrowRight
  Then the current dot has aria-current=true
  And the current slide is exposed as the active slide
  And non-current slides are hidden from the accessibility tree

Scenario: reduced motion remains usable
  Given prefers-reduced-motion is reduce
  When I open the homepage and operate the carousel
  Then content is immediately readable
  And slide changes do not require animation to understand the state
```

## Test Mapping

```yaml
static:
  - npm run check
  - npm run validate:content
  - npm run build
  - git diff --check
manual_browser:
  - desktop 1440x900 screenshots for all seven entry pages
  - mobile 390x844 screenshots for all seven entry pages
  - mobile menu open/close and keyboard tab sequence
  - carousel arrows, dots, ArrowLeft/ArrowRight and reduced-motion mode
  - landmark, heading, image-alt and duplicate-id inspection
```

## Evidence

Before evidence: `docs/design/audits/2026-07-12-persona-site-audit/`. Those captures are the pre-hardening baseline and intentionally remain unchanged.

### After evidence — 2026-07-13

The existing seven-page captures in the audit folder cover the release-sized viewports (`1440 × 900` desktop and `390 × 844` mobile). A live browser pass was also run at the available `768 × 900` viewport after the P1/P2 changes:

| Route | `main` count | `scrollWidth` / `clientWidth` | Visible document overflow | Result |
|---|---:|---:|---|---|
| `/` | 1 | 753 / 753 | none | pass |
| `/about/` | 1 | 753 / 753 | none | pass |
| `/expertise/` | 1 | 753 / 753 | none | pass |
| `/work/` | 1 | 753 / 753 | none | pass |
| `/courses/` | 1 | 753 / 753 | none | pass |
| `/services/` | 1 | 753 / 753 | none | pass |
| `/articles/` | 1 | 753 / 753 | none | pass |

The homepage carousel keeps its second slide inside an internal horizontal scroller. Its off-screen slide can have a bounding box beyond the viewport by design, but the scroller owns that overflow and the document remains `scrollWidth === clientWidth`; it is not a page-level clipping workaround.

#### Browser interaction evidence

- Homepage first paint: one `role="region"` labelled `首頁精選圖片`, two `role="group"` slides, first slide exposed and second slide `aria-hidden="true"`; first dot has `aria-current="true"`.
- Next arrow: current dot and `aria-hidden` state move to slide 2; previous arrow returns to slide 1 after the scroll settles.
- `ArrowRight` / `ArrowLeft`: both change the current slide and restore the matching dot/hidden state.
- Dot 2 / dot 1: both select the requested slide and synchronise the same state.
- Mobile menu closed: summary label `開啟網站選單`, `aria-controls="mobile-navigation"`, menu nav remains in the viewport.
- Mobile menu open: summary label changes to `關閉網站選單`; menu bounds and all seven links stay inside the viewport; document `scrollWidth` remains equal to `clientWidth`.
- `Escape`: menu closes and focus returns to the summary element.
- The first previous-arrow check was repeated after waiting for smooth scrolling; the settled result was correct (`scrollLeft = 0`, slide 1 current). This avoids treating an in-flight animation sample as a failure.

#### Static verification

- `npm run check`: passed, 0 errors, 0 warnings, 17 existing hints (Astro inline-script/deprecation hints; no new P1/P2 error).
- `npm run validate:content`: passed — all published course content is clean.
- `npm run build`: passed — 49 pages built. The build still reports 8 existing unresolved public-asset warnings; they are outside this P1/P2 contract.
- `git diff --check`: passed; only the repository's existing LF/CRLF normalization warnings were emitted.

#### Reduced motion and scope note

Reduced-motion behavior is covered by code-level evidence: `src/styles/base.css` disables smooth scrolling and transitions under `prefers-reduced-motion: reduce`, while `HeroCarousel.astro` uses `behavior: 'auto'` and disables carousel transitions in the same mode. The current in-app browser surface does not expose a reliable media-emulation control, so this contract records the implementation evidence rather than claiming a live emulation run. P3 paper decoration/material-density polish was not changed.

## Intentional Changes

- Remove the homepage's nested `<main>` wrapper; visible layout remains unchanged.
- Replace clipping workarounds with bounded, intrinsic sizing and safe overflow behavior.
- Add explicit carousel semantics and non-current slide hiding for assistive technology.
- Normalize title text and only retain deliberate line breaks that improve the rendered reading rhythm.
- Collapse competing secondary content where it prevents the page's primary decision from being obvious.

## Open Questions

- Whether the Newsletter integration is actually sending the promised important-update notifications still requires an owner-side delivery check.
- Focus-visible evidence may require a real keyboard or a browser automation surface that exposes activeElement reliably.
