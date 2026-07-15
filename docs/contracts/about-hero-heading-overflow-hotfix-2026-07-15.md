---
schema_version: behavior-contract/v1
id: cablate.about.hero-heading-overflow
title: About hero heading overflow hotfix
status: active
owner_surface: shared
change_context:
  type: bugfix
  reason: The current longer About hero phrase is constrained to its grid column but still paints as nowrap text into the adjacent summary column at common desktop widths.
  non_goals:
    - Change About copy, information order, columns, spacing, or CTA behavior.
    - Change the desktop rail implementation or its geometry.
    - Change heading behavior on any route other than About.
    - Redesign another About section or breakpoint.
---

# About Hero Heading Overflow Hotfix Contract

## Behavior Boundary

Only the About hero heading size may respond to its existing headline grid track so the authored nowrap phrases stop before the adjacent summary column. No other visual or content behavior is in scope.

## Consumers And Entrypoints

- Browser route: `/about/`.
- Scoped style entrypoint: the component-local styles in `src/pages/about.astro`.
- Shared desktop shell and rail remain consumers but must not change.

## Inputs And State

- Current About hero copy and its existing `.heading-phrase` markup.
- Existing two-column desktop grid and single-column `800px` breakpoint.
- Existing global display-heading rule, which defaults phrase spans to `white-space: nowrap`.

## Outputs And Side Effects

- The About heading derives its bounded display size from the existing headline track rather than the full viewport.
- The authored phrase boundaries remain nowrap.
- No DOM, copy, route, navigation, network, storage, analytics, or timer behavior changes.

## UI States

- First paint and ready: the title remains readable, keeps its authored phrase lines, and does not paint across the right summary column.
- Narrow desktop: the existing two-column layout remains intact until its existing breakpoint.
- Mobile: the current single-column About layout remains unchanged.

## Invariants

- The About hero grid columns, gap, padding, type size, and right-column position remain unchanged.
- The desktop rail width, content offset, labels, and states remain unchanged.
- The document has no horizontal overflow.
- No selector from this hotfix matches another page.

## Acceptance Examples

Given `/about/` is open at `1280 x 720`, when the current long third phrase renders, then its text ink does not enter the summary column beginning near `790px`.

Given `/about/` is open above the mobile breakpoint, when the hotfix is active, then the existing two-column grid and summary-column position remain unchanged.

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
    - git diff --check
  browser:
    - 1280 x 720 text-range and summary-column geometry
    - 1280 x 720 screenshot
    - document horizontal-overflow check
```

## Evidence

- Before at `1280 x 720`: the third phrase box is `444.40px` wide, while its nowrap text range is `641.93px` wide and paints `107.94px` into the summary column; `white-space` computes to `nowrap`.
- After at `1280 x 720`: the heading computes to `57.77px` from its `444.40px` container; the long phrase keeps `white-space: nowrap`, its text ink ends at `755.47px`, the summary column still begins at `789.97px`, and the remaining gap is `34.50px`; document overflow remains `0px`.

## Intentional Changes

- The About hero headline becomes an inline-size container, and its existing bounded display size is calculated from that component width instead of the viewport width.

## Open Questions

- None. This is a scoped regression hotfix, not a design-direction decision.
