---
schema_version: behavior-contract/v1
id: cablate.homepage.typography-pilot
title: Homepage-only typography pilot
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: The homepage currently assigns the same heavy serif voice to nearly every heading, so hierarchy depends mostly on size and retains the previous Claude-like visual language.
  non_goals:
    - Change typography on About, Expertise, Services, Courses, Articles, or shared navigation.
    - Change homepage copy, information architecture, links, analytics, images, colors, buttons, paper assets, spacing system, or section layout.
    - Add a new font dependency or external font request.
---

# Homepage Typography Pilot Contract

## Behavior Boundary

Only typography declarations scoped inside `src/pages/index.astro` may change. The pilot uses the already self-hosted Noto Sans TC and Noto Serif TC families.

## Consumers And Entrypoints

- Browser route `/` at desktop and mobile widths.
- Homepage headings, body copy, section labels, list titles, and button labels.
- Existing shared layout and paper components remain consumers but are not modified.

## Inputs And State

- Existing Traditional Chinese and mixed Latin copy.
- Existing local `@fontsource/noto-sans-tc` and `@fontsource/noto-serif-tc` imports.
- Existing responsive layout and author-selected heading phrase wrappers.

## Outputs And Side Effects

- Functional and navigational headings use the sans family for a clearer technical structure.
- The central thesis statement retains the serif family as the single editorial emphasis.
- Body, label, and button typography receive homepage-scoped size, line-height, weight, or tracking calibration.
- No DOM, content, navigation, storage, network, timer, analytics, or dependency behavior changes.

## UI States

- First paint: locally hosted font files continue to load through the existing layout imports.
- Ready: heading levels are visibly distinct without clipping, awkward single-character lines, or button wrapping.
- Responsive: the hero remains at most two lines on desktop and readable in the default narrow in-app browser viewport.
- Error or fallback: the existing system sans and serif fallback stacks remain readable if the preferred local font is unavailable.

## Invariants

- All text strings, link labels, URLs, section order, IDs, images, buttons, and paper treatments remain unchanged.
- The pilot cannot match selectors outside the homepage component stylesheet.
- The page has no horizontal overflow at `1280 x 720` or the default narrow browser viewport.
- CTA labels remain on one line at desktop.
- No new font or runtime dependency is added.

## Acceptance Examples

Given `/` is open at `1280 x 720`, when fonts are ready, then the hero and functional section headings use Noto Sans TC while the thesis statement uses Noto Serif TC.

Given `/` is open in the default narrow in-app browser viewport, when the hero is visible, then the title, paragraph, and CTA remain readable without horizontal overflow or clipped glyphs.

Given another primary route is opened, when its content renders, then its page-specific typography remains unchanged by this pilot.

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
    - git diff --check -- src/pages/index.astro docs/contracts/homepage-typography-pilot-2026-07-15.md
  browser:
    - Homepage before and after viewport screenshot at 1280 x 720
    - Homepage after screenshot in the default narrow in-app browser viewport
    - Computed font family, size, line height, wrapping, and overflow measurements
```

## Evidence

- Before at `1280 x 720`: the hero H1 is Noto Serif TC 700 at `43.52px`; the first four H2 elements are also Noto Serif TC 700 at `38.4px` to `57.6px`.
- Before: body text is Noto Sans TC at `16px / 27.2px`; document horizontal overflow is `0`.
- Before screenshot: captured from the real localhost homepage in the in-app browser.
- After at `1280 x 720`: the hero H1 uses Noto Sans TC 700 at `43.52px / 49.61px` and remains two lines inside its existing `380.33px` content width.
- After: functional H2 headings use Noto Sans TC while the central thesis heading uses Noto Serif TC at `57.6px / 70.27px`, providing one deliberate editorial exception.
- After: homepage buttons use Noto Sans TC at `14.4px`; the measured desktop CTA labels remain single-line within `48px`-high controls.
- After in the default narrow viewport (`512 x 716`): the hero title remains two lines, the copy and CTA remain visible, and document horizontal overflow is `0`.
- Browser evidence: stable desktop hero, diagnosis, thesis, route, case, and CabAI sections were inspected in the real localhost runtime; stable narrow hero screenshot was also inspected after fonts reported `loaded`.
- Project evidence: `npm run check`, `npm run build`, and scoped `git diff --check` all pass. Existing Astro and deprecation warnings are unrelated to this pilot.

## Intentional Changes

- Heading family assignment and typographic metrics change only on the homepage to test a clearer modern technical voice with one deliberate editorial exception.

## Open Questions

- Whether this typography direction should later become the shared site system depends on user approval of the homepage pilot.
