---
schema_version: behavior-contract/v1
id: cablate.desktop-rail.visual-index-refinement
title: CabLate desktop rail visual index refinement
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: The shared desktop rail already uses the paper surface, but its typography, interaction states, and material details still read as a small legacy text menu rather than an intentional working index.
  non_goals:
    - Change navigation labels, order, destinations, or analytics attribution.
    - Move the desktop main-content column or change the existing 9.5rem rail width.
    - Change the mobile header or mobile details menu.
    - Apply the experimental typography, color, or button direction to other components before human review.
    - Add generated imagery or a new frontend dependency.
---

# CabLate Desktop Rail Visual Index Refinement Contract

## Behavior Boundary

This slice changes only the desktop rail shown above the existing `900px` breakpoint. It strengthens the existing Open Desk Archive paper language through typographic hierarchy, a restrained material detail, and recognizable current, hover, focus, and press states.

## Consumers And Entrypoints

- Shared component: `src/components/ArchiveNavigation.astro`.
- Shared styles: `.site-rail`, `.site-rail__brand`, `.site-rail__nav`, and `.site-rail__social` in `src/styles/global.css`.
- Every route rendered with `BaseLayout` and `shell="desk"` above `900px`.

## Inputs And State

- `Astro.url.pathname` remains the source for current-route matching.
- `primaryNavigation` remains the source for primary labels, descriptions, order, and destinations.
- Existing paper and paperclip tokens remain the only material assets used by this slice.
- Existing Noto Serif TC, Noto Sans TC, and shared color tokens remain available at first paint.

## Outputs And Side Effects

- The home brand link exposes `aria-current="page"` only at `/`.
- Primary destinations use serif display type while their existing descriptions remain supporting sans text.
- Each primary navigation link has a desktop target height of at least `48px`.
- Current and hover states gain a paper-index wash in addition to color; keyboard focus remains independently visible.
- The existing silver paperclip asset appears as a decorative, non-interactive rail detail.
- No storage, network, timer, analytics, or route behavior changes.

## UI States

- First paint: the rail, text, and navigation remain readable before the material images finish loading.
- Ready: the white paper rail and silver clip are visible without covering the brand or navigation.
- Current route: exactly one primary destination, or the brand on `/`, exposes the current location without relying on color alone.
- Hover: a destination receives a restrained index-paper wash without shifting neighboring layout.
- Focus: the existing focus outline remains visible and is not replaced by hover styling.
- Active press: feedback is limited to a small transform and is disabled under reduced motion.
- Mobile: no visual or interaction change below or at `900px`.

## Invariants

- Rail width remains `9.5rem`; desktop main-content and footer offsets remain unchanged.
- Navigation labels, descriptions, order, hrefs, targets, and rel attributes remain unchanged.
- No rail decoration enters the accessibility tree or intercepts pointer events.
- The rail does not overlap page content at `901px`, `1280px`, or `1440px`.
- Document `scrollWidth` does not exceed `clientWidth` because of this slice.

## Acceptance Examples

Given the homepage is open at `1440 x 900`, when the rail is ready, then the CabLate brand is marked current, the silver paperclip is visible, all four destinations remain readable, and the main content starts at the same inline position as before.

Given `/about/` is open at `1280 x 900`, when the rail is ready, then only About is marked current and its state remains recognizable without color alone.

Given the homepage is open at `901px` wide, when the rail is ready, then the paper-index state remains inside the available gutter and does not cover the first content paper.

Given a keyboard user tabs through the rail, when each link receives focus, then its focus indicator is visible and the DOM focus order remains brand, four primary destinations, then four external destinations.

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
    - git diff --check
  browser:
    - 1440 x 900 homepage rail visual and geometry check
    - 1280 x 900 About current-route state check
    - 901 x 716 homepage overlap and horizontal-overflow check
    - keyboard focus walk through the desktop rail
```

## Evidence

- Before browser measurement at `1425 x 900`: rail width `151.99px`; primary link height `36.43px`; primary label computed size `12.16px`; supporting label computed size `9.28px`; current state is color-only; no material detail is attached to the rail.
- After browser measurement at `1440 x 900`: rail width remains `151.99px`; primary link height is `48.00px`; primary label size is `14.08px`; supporting label size is `10.56px`; the silver paperclip resolves through the existing 1x/2x token; document overflow remains `0px`.
- On `/about/` at `1280 x 900`, exactly one destination exposes `aria-current="page"`; its state combines an ink rule, restrained wash, and page-edge index tab rather than color alone. The main content offset remains unchanged and document overflow is `0px`.
- At the desktop edge (`901px` CSS override, measured viewport `902px`), the rail ends at `167.98px`, the index tab ends at `167.99px`, and the first content paper begins at `191.99px`, leaving approximately `24px` without horizontal overflow.
- At `900px`, the desktop rail remains hidden and the existing mobile header remains visible.
- Browser focus inspection shows the shared violet outline remains visible; DOM link order remains brand, four primary destinations, then CabAI, Email, Threads, and GitHub.
- `npm run check` passes with `0 errors` and the repository's existing `17 hints`; `npm run build` and `git diff --check` pass.

## Intentional Changes

- Desktop primary navigation becomes easier to scan and target.
- Active location becomes a material index state instead of a color-only state.
- The rail gains one existing silver clip asset as a restrained physical detail.

## Open Questions

- Whether the resulting serif/sans hierarchy and index-wash state should later inform buttons, section labels, or other navigation surfaces remains a human-review decision after this slice.
