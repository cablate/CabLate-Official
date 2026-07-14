# Work strict planning audit — 2026-07-14

> Superseding decision — 2026-07-14：本文件記錄的舊 limited-disclosure 畫面與問題仍是有效 baseline，但該 production direction 已取消。使用者核准以三張不含客戶／公司線索的黃色服務卡與單一 Services CTA 取代；public decision roster 仍依 W0c 另行核准。

## Audit scope

- Surface: `http://127.0.0.1:4321/work/`
- User goal: verify what CabLate has actually made, understand the decisions made under constraints, and move to Services when the visitor has a similar situation.
- Mode: combined UX, visual and accessibility planning audit.
- Capture tool: the existing in-app browser tab.
- Change boundary: fresh screenshots, DOM／computed-style inspection and planning documents only; no Work production code changed.

## Goal model

- **Primary goal G2:** turn public work from a list of outputs into evidence that helps a skeptical visitor decide whether CabLate's judgment is relevant to their situation.
- **Supporting goals:** preserve the featured dossier, make three public records independently readable and operable, keep limited disclosure honest, and make Services the clear decision after trust is earned.
- **Soft goals:** evidence should feel rigorous rather than promotional; rich case context must remain readable on Mobile without being compressed into tiny type.
- **Invariants:** all four case titles, problem／decision text, proof numbers and dates, hrefs, target／rel rules, disclosure records and order remain truthful and traceable.
- **Non-goals:** no new clients, outcomes, testimonials, images, case studies, routes, products or analytics; no Work production implementation in this audit.

## Accepted screenshots

1. `01-desktop-hero.png` — Desktop task entry, evidence index and Hero actions.
2. `02-desktop-featured.png` — Desktop selected-work heading and featured dossier.
3. `03-desktop-public-records.png` — Desktop three-record comparison and disclosure transition.
4. `04-desktop-disclosure.png` — Desktop limited disclosure and final Services link.
5. `05-mobile-hero.png` — 390px Hero, index and action hierarchy.
6. `06-mobile-featured.png` — 390px selected-work heading and featured story body.
7. `07-mobile-featured-evidence.png` — 390px repeated featured proof, handbook action and first public record.
8. `08-mobile-public-records.png` — 390px public-record reading density and action treatment.
9. `09-mobile-disclosure.png` — 390px disclosure heading and record hierarchy.
10. `10-mobile-final-action.png` — 390px trust handoff into the final Services action.

Every accepted file was reopened at original detail after saving. Captures taken at a stale scroll position or before browser paint settled were rejected rather than used as evidence.

## Step health

| Step | Health | Evidence-backed judgment |
| --- | --- | --- |
| 1. Hero／task entry | Mostly good | The page states its reading rule within the first viewport and the filled `#selected-work` action is `52.78px`. The Services shortcut is only `21.75px` high at `12.8px`, so high-intent visitors can miss it. |
| 2. Featured dossier | Needs revision | The story includes problem, decision and proof, and the heading outline is correct. The H2 breaks after 「一」 at 1280／390, Mobile renders the same proof twice, and the handbook action falls to a `20.67px` unbordered text link on Mobile. |
| 3. Public records | Needs revision | All three records preserve problem, decision, evidence and destination. Each whole `416.43px` Mobile card is the only anchor, producing accessible names of `166–192` characters; the text is `13.44px` and proof is `11.2px`. Desktop problem／decision text is only `12.8／12.16px`. |
| 4. Limited disclosure／decision | Needs revision | The disclosure language is honest and avoids unsupported outcomes. The Desktop H2 occupies five lines and `305.26px`; the planned long nowrap phrases cannot fit its current `324.06px` column. After trust is built, the Services action remains a `22.84px` text link on Desktop and Mobile. |

## Confirmed strengths

- The reading sequence is coherent: rule → featured dossier → three public records → limited disclosure → Services.
- H1 and all H2／H3 levels form a sequential heading outline.
- The Hero H1 already uses three stable phrase spans and reads naturally at 1280 and 390.
- `#selected-work` lands at about `83px` on 320／360／390, below the `69.70px` sticky Headbar.
- 320／360／390 and 1280 have no horizontal overflow.
- Internal links stay in the same tab; external CabAI／GitHub links retain `_blank` and `rel="noopener"`.
- The four public work sources, proof strings, dates and limited-disclosure boundaries match current source data; no new claim is required to fix the experience.

## UX risks

1. **The evidence itself is harder to read than it should be.** Tiny problem, decision and proof text makes the page look dense even though the content structure is useful.
2. **A record cannot be read without also becoming one giant link.** Visitors may activate a `416px` card while selecting or scanning text, and keyboard／assistive-technology users receive an unnecessarily long link name.
3. **The featured proof is repeated on Mobile.** The same `45 課已發布，截至 2026-06-24` string appears once in the body and once in the evidence footer, adding length without adding trust.
4. **Action hierarchy fades as intent increases.** The early anchor is clear, but handbook, per-record and final Services actions become small purple text when they should become more explicit.
5. **The final disclosure heading dominates its content.** Its current Desktop layout spends more visual area on a broken headline than on the two records that actually build trust.

## Accessibility risks

- The three whole-card anchors have names of `192`, `166` and `183` characters because every title, paragraph, label, proof and action is part of the link.
- Public-record action labels visually occupy about `43.99px` on Mobile, below this plan's `48px` acceptance target; the surrounding `416px` anchor hides rather than solves the control-boundary problem.
- Hero Services, featured Mobile handbook and final Services actions are `21.75px`, `20.67px` and `22.84px` high respectively.
- Global `:focus-visible` exists, and all current actions are native anchors, but full keyboard order／focus screenshots, screen-reader output, forced colors and reduced motion remain page-gate verification rather than claims from this planning audit.

## Runtime facts

| Fact | Result |
| --- | --- |
| Desktop audit viewport | `1280 × 900` |
| Mobile capture viewport | `390 × 844／845` |
| Document height | Desktop `2960px`; Mobile `4612px` at 390 |
| 320／360／390 horizontal overflow | none |
| Fresh `#selected-work` target top | `83.52／83.55／83.10px` |
| Headbar bottom | `69.70px` |
| Hero Primary | `161.97 × 52.78px` |
| Hero Services shortcut | `76.80 × 21.75px`; `12.8px` text |
| Featured handbook action | Desktop box `52.66px` because of top padding but no visible button boundary; Mobile `20.67px` |
| Desktop public-record text | problem `12.8px`; decision `12.16px`; proof `11.2px` |
| Mobile public-record text | problem／decision `13.44px`; proof `11.2px` |
| Mobile public-record cards | `416.43px` each at 390; about `479–484px` at 320 |
| Whole-card accessible-name length | `192／166／183` characters |
| Final Services action | `225.54 × 22.84px`; `13.44px` text |

## Data source map

| Visible content | Current owner | Audit decision |
| --- | --- | --- |
| type／title／description／proof／href | `representativeWork` in `src/config/authority.ts` | Preserve canonical values and order |
| problem／decision for four cases | local `workStories` enrichment in `src/pages/work.astro` | Preserve wording; presentation may change |
| two disclosure records | local `limitedDisclosureWork` in `src/pages/work.astro` | Preserve scope and boundary wording |
| CabAI campaign URL | existing attributed `representativeWork[0].href` | Preserve attribution, target and rel |

No missing data source or spike is required. The problems are DOM ownership, responsive presentation and action hierarchy.

## Planning changes made

- Added a verified planning-only `W0` before Work production changes.
- Split the old three implementation slices into four smaller owners: record semantics, evidence ownership／readability, action hierarchy, and heading／responsive layout.
- Required exactly one visible featured proof per viewport rather than repeating it in Mobile body and evidence footer.
- Added measured type acceptance: problem／decision `>=15px` Desktop and `>=16px` Mobile; proof metadata `>=14px` Desktop and `>=15px` Mobile.
- Replaced impossible long nowrap heading proposals with shorter, reviewable headings that fit 320px without breaking Chinese compounds.
- Kept rich problem／decision context; card height is not reduced by shrinking type or deleting evidence.
- Turned each record destination into a specific independent action and reserved the final filled Primary for Services.

## Evidence limits

- Screenshot and computed DOM evidence confirms hierarchy, dimensions, wrapping, responsive reflow, anchors, hrefs and whole-card accessible names.
- This run did not launch external destinations or claim full WCAG conformance.
- Full Tab／Enter, focus-state capture, screen-reader output, reduced-motion and forced-colors checks remain in `W5` and the cross-page gate.

## Verdict

**Needs Revision before implementation**, based on the visual and interaction baseline. The later cross-page content audit in `docs/design/audits/2026-07-14-work-public-records-overlap-audit/` supersedes the earlier execution-ready assumption: `W1` remains blocked until the case roster, source-backed decision depth and limited-disclosure claims pass `W0c` user review. Work remains unimplemented and its page gate remains pending.
