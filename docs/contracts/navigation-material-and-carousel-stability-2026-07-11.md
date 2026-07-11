---
schema_version: behavior-contract/v1
id: cablate.navigation-material-and-carousel-stability
title: Navigation material and carousel indicator stability
status: active
owner_surface: shared
change_context:
  type: bugfix
  reason: The desktop rail is visually cramped, the mobile menu does not share its paper material, and the carousel indicator appears to shift during slide changes.
  non_goals:
    - Change navigation labels, destinations, or DOM order.
    - Move the desktop main-content column.
    - Add carousel autoplay or new animation.
---

# Navigation Material And Carousel Stability Contract

## Behavior Boundary

This change adjusts the desktop rail width, the mobile Headbar and menu surfaces, and the fixed layout allocation of the hero carousel pagination.

## Consumers And Entrypoints

- All desktop routes using `.site-rail`.
- All mobile routes using `.site-mobile-menu`.
- Homepage hero carousel at `/`.

## Inputs And State

- Desktop navigation remains active above the existing `900px` breakpoint.
- Mobile navigation remains the native `<details>` interaction below that breakpoint.
- Carousel state remains the existing zero-based slide index.

## Outputs And Side Effects

- The desktop rail becomes one rem wider without changing the main-content offset.
- The open mobile menu uses the same paper texture token as the desktop rail.
- Carousel page count and dots retain fixed inline allocations while the active slide changes.
- No storage, network, timer, or analytics behavior changes.

## UI States

- First paint: navigation and carousel positions are stable before interaction.
- Mobile menu closed: header and summary button remain unchanged.
- Mobile Headbar: the shared paper image covers the complete header bounds without exposing the page background at its edges.
- Mobile menu open: navigation links appear on a paper-textured sheet with the existing link order.
- Carousel ready: controls remain usable by pointer and keyboard; changing slides does not resize the pagination container.

## Invariants

- Main content does not move horizontally on desktop.
- Navigation link order, labels, URLs, and current-page indication remain unchanged.
- The mobile menu remains keyboard-operable through native `<details>` behavior.
- The homepage has no horizontal page overflow at desktop or mobile widths.

## Acceptance Examples

Given the homepage is shown at 1280 by 900, when the second carousel slide is selected, then the pagination container keeps the same bounds and the desktop rail is wider without overlapping the main content.

Given the homepage is shown at 390 by 844, when the user opens the menu, then the link panel uses the paper texture and all links remain visible and focusable.

## Test Mapping

- Automated: `git diff --check`, `npm run check`.
- Manual browser: compare carousel pagination bounds before and after slide change at 1280 by 900.
- Manual browser: open the mobile menu and inspect material, overflow, and link visibility at 390 by 844.

## Evidence

- Desktop 1280 by 900: rail width `152px`; visible hero content starts `8px` after the rail edge; no horizontal overflow.
- Desktop carousel: pagination bounds remained at the same `left` coordinate and `118.53px` width before and after changing from slide 1 to slide 2.
- Mobile 390 by 844: open menu rendered the shared `paper-white` image-set, displayed all 7 navigation links, and caused no horizontal overflow.
- Mobile Headbar at 390 by 844: header bounds span the full `374.55px` document width, paper background renders at `115.2%` to crop transparent source edges, and no horizontal overflow occurs.
- `npm run check`: 0 errors and 0 warnings; repository-existing hints remain.

## Intentional Changes

- Desktop rail width changes from `8.5rem` to `9.5rem`.
- Mobile menu panel changes from a generic soft background to the shared paper texture.
- Mobile Headbar paper image is enlarged beyond its transparent source edges and uses an opaque paper-color fallback.

## Open Questions

- None.
