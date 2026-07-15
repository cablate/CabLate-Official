# Services strict planning audit — 2026-07-14

## Scope

- Surface: `http://127.0.0.1:4321/services/`
- Task: determine whether a visitor can identify the right service, trust the stated experience, understand process and boundaries, then start contact.
- Mode: combined UX／visual／accessibility planning audit.
- Change boundary: browser inspection and planning documents only; no Services production code changed.

## Accepted screenshots

1. `01-desktop-top.png` — Desktop Hero and entry into service comparison.
2. `02-desktop-options.png` — Desktop service option density and repeated field structure.
3. `03-desktop-proof-process-content.png` — Delivery proof and four-step process.
4. `04-desktop-boundaries-contact.png` — Desktop boundary heading and Email／Threads hierarchy.
5. `05-mobile-top.png` — 390px Hero phrase grouping.
6. `06-mobile-options-content.png` — 390px option header and first service card.
7. `07-mobile-process.png` — 390px vertical process rail.
8. `08-mobile-boundaries.png` — 390px boundary structure.
9. `09-mobile-contact.png` — 390px final contact actions.

Each accepted file was reopened after saving. A broken stitched full-page capture and screenshots containing browser paint artifacts were rejected rather than used as evidence.

## Step health

| Step | Health | Evidence-backed judgment |
| --- | --- | --- |
| 1. Hero／entry | Good with copy polish needed | One clear promise and one filled anchor. Mobile H1 uses six short spans and breaks the sentence into unnatural units. |
| 2. Service options | Needs revision | Three services are distinguishable, but each repeats 3 fit + 4 deliverables. Mobile cards are about 573／573／601px tall and body text is 13.12px. Raw English slugs add metadata without aiding selection. |
| 3. Experience proof | Needs revision | Honest disclosure is a strength. The aside has no heading and the visible claim directly supports training／workshop／course delivery only, not all three service tracks. |
| 4. Process | Mostly good | The rail and order are visible on Desktop and Mobile. “推進” is abstract and Mobile process text is 13.44px. |
| 5. Boundaries | Needs revision | The section improves trust, but its Desktop H2 breaks awkwardly. The “熱門名詞” row repeats the Hero principle instead of defining a concrete shared boundary. |
| 6. Contact | Needs revision | Email is a correct 52.8px `mailto:` Primary. Threads is only 22.84px with no border; neither action is full width on Mobile. |

## Runtime facts

| Fact | Result |
| --- | --- |
| Desktop audit viewport | 1280 × 900 |
| Mobile capture viewport | 390 × 844／845 |
| 320／360／390 horizontal overflow | none (`scrollWidth <= innerWidth`) |
| Mobile document height | 6316／6070／5778px |
| `#service-options` top after activation | about 83px at all three widths |
| Mobile Headbar height | about 69.7px |
| Service option body size | 13.12px |
| Process body size | 13.44px |
| Email action | 193.98 × 52.78px; correct config-backed `mailto:` |
| Threads action | 176.58 × 22.84px; `_blank` + `rel="noopener"`, but no button boundary |
| Proof heading count | 0 |

## Planning changes made

- Added the measured baseline and planning-only verdict to Master Plan 7.0.
- Assigned one content owner to each repeated field: service cards own problem signals／deliverables; boundaries own shared prerequisites and commitments.
- Removed raw service slug from the intended visible UI without deleting the id data.
- Added minimum readable type acceptance: 15px Desktop and 16px Mobile for option lists; 16px Mobile for process text.
- Limited the cooperation proof claim to what current evidence supports.
- Replaced the five-step Services sequence with a verified S0 audit plus S1–S6 implementation／gate slices.
- Converted the Threads issue from general polish into an exact 48px, bordered, full-width Mobile acceptance condition.

## Evidence limits

- Screenshot and computed DOM evidence can confirm visual hierarchy, dimensions, links, heading presence, reflow and overflow.
- This run did not claim full WCAG conformance, screen-reader output, complete keyboard order, hover／focus contrast, forced-colors or reduced-motion behavior; those remain in the Services L2 and cross-page gates.
- External Email and Threads destinations were inspected but not launched.
