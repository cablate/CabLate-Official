---
schema_version: behavior-contract/v1
id: cablate.desktop-rail.utility-links
title: Desktop rail utility link styling
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: The four desktop rail utility links are currently rendered as small fit-content text lines with weak affordance and very small pointer targets.
  non_goals:
    - Change the rail brand, primary navigation, width, position, or paper decoration.
    - Change any label, destination, target, rel attribute, or analytics attribution.
    - Change the mobile header or mobile navigation.
    - Change site typography, colors, buttons, cards, page content, or page layout.
    - Change About or any page-specific style.
---

# Desktop Rail Utility Link Styling Contract

## Behavior Boundary

Only `.site-rail__social` and its four existing anchors on desktop are restyled. The result remains a compact utility group at the bottom of the existing paper rail.

## Consumers And Entrypoints

- Shared rail on every route above the existing `900px` breakpoint.
- Existing markup in `src/components/ArchiveNavigation.astro`.
- Scoped shared CSS in `src/styles/global.css`.

## Inputs And State

- Existing ordered links: CabAI, Email, Threads, GitHub.
- Existing href, target, rel, and CabAI attribution values.
- Existing shared focus outline and color tokens.

## Outputs And Side Effects

- Each utility link becomes a full-width row with a minimum `44px` target height.
- External destinations show a decorative external arrow; Email shows a forward arrow.
- CabAI receives restrained typographic emphasis without changing its text or destination.
- No DOM, content, navigation, storage, network, analytics, or timer behavior changes.

## UI States

- Ready: all four labels and arrow markers are visible without wrapping.
- Hover: the hovered row gains a restrained ink wash and stronger text without shifting the rail or page.
- Focus: the existing global focus outline remains visible around the full row.
- Press: the existing reduced-motion policy remains sufficient; this slice adds no animation.
- Mobile: unchanged.

## Invariants

- Rail width remains `9.5rem` and main content geometry remains unchanged.
- Link order, accessible names, hrefs, targets, rel values, and attribution remain unchanged.
- The group stays inside the rail at `1280 x 720` and does not create horizontal overflow.
- No selector introduced by this slice matches page content or the primary navigation.

## Acceptance Examples

Given `/about/` is open at `1280 x 720`, when the rail is ready, then CabAI, Email, Threads, and GitHub each occupy a full-width target of at least `44px` and remain inside the rail.

Given a pointer hovers one utility row, when its visual state changes, then neighboring rows and page content do not move.

Given a keyboard user focuses a utility link, when focus is visible, then the outline surrounds the whole row rather than only the text width.

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
    - git diff --check
  browser:
    - 1280 x 720 About rail screenshot and geometry
    - full-row target height and width measurements
    - hover and focus visual checks
    - document horizontal-overflow check
```

## Evidence

- Before at `1280 x 720`: each link is a fit-content block only `15.44px` high; widths range from `29.11px` to `76.65px`; the utility group is `124.80px` wide and `98.82px` high.
- After at `1280 x 720`: the group remains `124.80px` wide and inside the rail; each anchor occupies the full group width and measures `43.99px` because of device-pixel rounding from the CSS `2.75rem` (`44px`) minimum height.
- After: CabAI, Threads, and GitHub display `↗`; Email displays `→`; labels, order, destinations, and markup remain unchanged.
- Keyboard verification: focus moves to the Email anchor and the existing purple focus outline surrounds the full `124.80 x 43.99px` row.
- Layout verification: document horizontal overflow remains `0`; the group bottom remains above the rail bottom.
- Static hover verification: only `color`, `background-color`, and the decorative arrow transform change, so the row and neighboring layout geometry remain stable.
- Project verification: `npm run check`, `npm run build`, and scoped `git diff --check` all pass. Existing Astro/deprecation warnings remain unrelated to this slice.

## Intentional Changes

- The four utility destinations become recognizable full-row controls instead of underlined-on-hover text fragments.

## Open Questions

- None. Homepage typography exploration is explicitly deferred to the next user-approved slice.
