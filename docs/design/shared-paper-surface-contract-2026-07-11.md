---
schema_version: behavior-contract/v1
id: cablate.shared.paper-surface
title: CabLate shared paper surface
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: Move the accepted home paper-card primitives into shared CSS for controlled reuse.
  non_goals:
    - Automatically restyle inner pages.
    - Change homepage spacing, content, or visual hierarchy.
---

# Shared Paper Surface Contract

## Behavior Boundary

The shared stylesheet owns white paper cards, decorative paperclips and their placement variants, paper labels, and mobile shadow behavior. Pages select a shared modifier instead of redefining decorative placement.

## Consumers And Entrypoints

- `src/styles/global.css`
- `src/pages/index.astro`
- Future Astro pages that explicitly add `.paper-card`, `.paper-card--clip`, `.paper-card--clip-left`, or `.paper-label`

## Inputs And State

The classes depend on the paper image custom properties declared in `src/styles/base.css`.

## Outputs And Side Effects

No JavaScript, network, storage, or content behavior changes. A page changes visually only when it explicitly uses a shared paper class.

## UI States

- Desktop paper cards use the accepted contour-following shadow.
- At `900px` and below, paper-card shadows are removed.
- Paperclips and labels remain decorative and non-interactive.

## Invariants

- Homepage appearance remains equivalent before and after extraction.
- Inner pages do not change until a class is deliberately added.
- Paperclip placement variants remain owned by shared CSS; pages only select the appropriate modifier.

## Acceptance Examples

```gherkin
Given the homepage is rendered after the CSS extraction
When the viewport is wider than 900px
Then existing paper cards, clips, and labels retain their accepted appearance
```

```gherkin
Given an inner page does not use a shared paper class
When the shared stylesheet is loaded
Then that page's existing surfaces remain unchanged
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
  source:
    - Confirm paper primitives have one definition in src/styles/global.css
    - Confirm src/pages/index.astro retains only homepage-specific placement rules
```

## Evidence

- `npm run check`
- `npm run build`
- Targeted `rg` search for shared class ownership

## Intentional Changes

The paper primitives are now available globally. No page receives them implicitly.

## Open Questions

Which inner-page surfaces should opt into each shared primitive will be decided page by page.
