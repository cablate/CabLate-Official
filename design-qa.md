# Route index visual QA

## Target

- Reference: `artifacts/design-proposals/homepage-sections-2026-08-17/proposal-route-index.png`
- Implementation: homepage section anchored by `#route-title`
- Reference dimensions: 1680 × 944
- Browser checks: 1680 × 944, 879 × 818, 390 × 844
- Superseding decision (2026-08-18): remove the health-check destination and reduce the route index to two choices.

## Evidence

- Desktop implementation: `artifacts/homepage-section-review-2026-08-18/route-fidelity-final-1680-centered.png`
- Narrow desktop: `artifacts/homepage-section-review-2026-08-18/route-fidelity-879.png`
- Mobile implementation: `artifacts/homepage-section-review-2026-08-18/route-fidelity-final-390.png`
- Combined reference comparison: `artifacts/homepage-section-review-2026-08-18/route-reference-vs-implementation.png`
- Two-choice narrow desktop: `artifacts/homepage-section-review-2026-08-18/route-two-choice-final-879.png`
- Two-choice mobile: `artifacts/homepage-section-review-2026-08-18/route-two-choice-final-390.png`

## Comparison findings

### Resolved

- Restored the selected warm paper stage instead of the rejected dark decision-stage direction.
- Matched the two-column composition: large left question and a right-side route index.
- Restored the raised first paper strip and used a real transparent image asset for the violet circle and continuation line.
- Removed visible descriptions from the index rows while retaining them for assistive technology.
- Preserved the composition at 879 px instead of collapsing it prematurely.
- Re-composed the section vertically on mobile; measured document `scrollWidth` equals `clientWidth` (375 px inside the 390 px browser viewport), so there is no horizontal overflow.
- Removed the `/expertise/` health-check route. The section now offers only `/courses/` and `/services/`, and its heading and section height were rebalanced for the shorter decision set.

### Intentional adaptations

- The live homepage keeps its persistent desktop navigation, so the content stage is narrower than the standalone proposal image.
- The mobile layout stacks the question above the index because the proposal only specified the desktop composition.
- Link labels and headings remain live HTML; the annotation is decorative and hidden from assistive technology.

## Severity review

- P0: none
- P1: none
- P2: none after the final desktop and mobile comparison

## Result

`passed`
