# Work Public Records cross-page overlap audit — 2026-07-14

> Superseding decision — 2026-07-14：本 audit 對 public decision records 的重疊結論仍有效；「另設 limited-disclosure experience」的建議已由使用者決策取代。Work 頁尾改為不含公司、客戶或合作方線索的三張黃色服務橋接卡，完整規格與證據見 `docs/contracts/work-service-bridge-2026-07-14.md` 與 `docs/design/audits/2026-07-14-work-service-bridge/`。

## Scope

- Surfaces: Home handbook case, About public output and delivery experience, Work selected records, Courses learning map, Services delivery proof, Expertise diagnosis.
- User question: whether Work Public Records should repeat material already used elsewhere, and whether earlier professional experience is being ignored.
- Mode: information-architecture and trust-journey audit. No production UI or copy changed.
- Evidence: fresh 1280px in-app-browser captures plus current source/data inspection.

## Deep intent

The site should not prove the same claim six times. A repeated artifact is useful only when the next page answers a deeper or different visitor question.

- Home answers: “Is there one concrete example that makes this site relevant to me?”
- Expertise answers: “What is likely failing, and what should I check next?”
- About answers: “What do these outputs and delivery experiences reveal about CabLate?”
- Work answers: “Under real constraints, what alternatives and trade-offs led to this decision, and what can I inspect?”
- Courses answers: “Which currently available learning product fits my situation, at what depth and state?”
- Services answers: “Is a paid collaboration appropriate, what will be delivered, and what are the boundaries?”

## Accepted screenshots

1. `01-about-public-output.png` — About turns public artifacts into author-trust signals.
2. `02-about-delivery-experience.png` — About separates courses, handbook and CabAI as delivery proof.
3. `03-work-public-records.png` — Work currently repeats handbook and repository summaries as case files.
4. `04-home-handbook-case.png` — Home already gives the handbook a detailed problem/finding/content story.
5. `05-courses-learning-map.png` — Courses owns learning fit, availability and the next learning action.
6. `06-services-delivery-proof.png` — Services owns collaboration experience, process and fit.
7. `07-expertise-diagnosis.png` — Expertise owns symptom-led diagnosis, not portfolio proof.

The first Services and Expertise captures were rejected because their target headings were clipped at the viewport edge. The accepted replacements were captured after a safe upward offset and reopened at original detail.

## Current overlap map

| Artifact or experience | Current surfaces | What repeats now | Judgment |
| --- | --- | --- | --- |
| `Agent 深度工程手冊` | Home, About delivery, Work featured, Courses | The origin problem, organization into Skill／Memory／Context／Hook, delivery value and `45 課` proof recur across four roles | Overexposed. Courses should own product fit/state; Home keeps one teaser; About keeps concise delivery proof. Remove it from Work Public Records unless Work can add a genuinely different, source-backed decision story. |
| `mcp-google-map` | About public output, Work public record | About and Work both say the API became an installable MCP tool with an interface, GitHub and npm | Reuse is justified only if Work becomes the full dossier: constraints, alternatives, trade-off, decision and verification. The current Work row does not add enough depth. |
| `banini-tracker` | About public output, Work public record | Both pages describe joining social posts, AI analysis, notification and later verification into one flow | Same issue as `mcp-google-map`: acceptable progressive disclosure only after Work adds a deeper decision layer. |
| `金流串接與產品交付教學` | About delivery, Work public record; Work action points to `/courses/` | API／order state／Webhook／signature／error-handling story and `40+ 位學員` proof repeat | Not a valid Public Record destination today. The content entry is `draft: true`, the direct course route returns 404, and `/courses/` does not list this item. Keep it as delivery experience; remove it from Work Public Records until a real public artifact exists. |
| `claude-code-research` | About public output | Public repository and research continuity are present in canonical data but absent from Work | Strong Work candidate because it adds a public research evidence type without mixing courses into作品. It still needs a source-backed Work-specific decision record. |
| Earlier government／enterprise systems and system-design work | About timeline; only later AI training／MCP work appears in Work limited disclosure; Services has broad delivery proof | Career history is visible, but the Work page does not yet show what earlier system work contributes to current judgment | Do not call confidential work a Public Record. Add only a limited-disclosure experience record with role, system type, decision responsibility, public scope and boundary after the exact claim is approved. |

## Key finding

The problem is not repeated names. Repeating a canonical artifact can help recognition. The problem is **semantic duplication**: the visitor reaches Work and receives another summary instead of a deeper decision record.

The previous W1 plan treated this as a link-boundary issue. That is insufficient. It would make the same duplicate summaries more operable without giving Work a stronger reason to exist.

## Cross-page content ownership contract

| Layer | Canonical owner | Allowed consumers | Rule |
| --- | --- | --- | --- |
| Artifact identity and immutable facts | `src/config/authority.ts` | About, Work, Home, Courses | Share ID, public name, type, URL, public proof and date. Do not copy the same fact into multiple independently maintained arrays. |
| Author signal | About projection | About only | Explain what a pattern of outputs reveals about CabLate. Do not become a miniature case study. |
| Decision record | Work projection | Work only | Add context, real constraint, alternatives considered, trade-off, decision, resulting artifact and verification path. A paraphrased About summary does not qualify. |
| Learning offer | `learningPath`／Courses | Courses and short Home teaser | Own availability, price, fit and product CTA. Draft content cannot be presented as a public Work destination. |
| Delivery experience | About delivery and Services proof | About／Services | Show ability to teach, lead and deliver with disclosure boundaries; do not label it as an open-source work item. |
| Earlier confidential experience | Work limited disclosure | Work, with About timeline as context | Show only approved role, scope, responsibility and disclosure boundary. No client identity or unsupported outcome. |

Narrative copy remains page-specific. Only canonical facts are shared. This prevents both factual drift and generic copy that makes every page sound alike.

## Repetition rules

1. The same artifact name may recur when it helps recognition.
2. The same canonical fact may appear once per page when required for trust or product state.
3. The same problem／decision paragraph cannot be reused across About and Work.
4. Every downstream page must add one new layer of useful information; otherwise it should link forward instead of repeating.
5. An item without a real public destination cannot be labelled `PUBLIC RECORD`.
6. Earlier professional experience is not discarded because it is confidential; it belongs in a clearly labelled limited-disclosure record.
7. Stars, forks, lesson counts and learner counts are corroborating metadata, not the main story and not business outcomes.

## Recommended Work roster

### Public decision records

1. **Featured: `mcp-google-map`** — the strongest public, inspectable candidate for a full constraint／trade-off／decision dossier.
2. **`banini-tracker`** — a smaller data-product decision record.
3. **`claude-code-research`** — a public research and knowledge-maintenance decision record.

### Not in Work Public Records

- `Agent 深度工程手冊`: Home teaser + About delivery proof + Courses definitive product route are enough for the current journey.
- `金流串接與產品交付教學`: remains delivery experience until a real public destination and product state exist.

### Earlier experience

Keep a separate limited-disclosure section. Candidate scope includes government／enterprise system analysis and design, enterprise AI training, and the existing MCP collaboration test. Exact role, scope and boundary must be approved before production copy is written.

## Required source pass before implementation

The current canonical data supports identity, public URL and proof metadata. It does not yet support the deeper Work fields. Before UI work, each proposed public record needs a source-backed content matrix:

| Required Work field | Evidence requirement |
| --- | --- |
| Context／problem | Public README, release note, issue, documentation or an approved first-party account |
| Real constraint | Source-backed technical, product, maintenance or delivery constraint; not a generic pain point |
| Alternatives／trade-off | Approved explanation of what was considered and why it was rejected |
| Decision | The actual choice and the principle behind it |
| Resulting artifact | Inspectable repository, package, documentation or public sample |
| Verification | A specific place the visitor can inspect; metrics are secondary |

If a field cannot be supported, the record stays a short About signal and is not promoted into a Work dossier.

## Verdict

**Needs Revision.** The visual Work audit remains valid, but W1 is not implementation-ready. The case roster, source depth and cross-page ownership contract must be approved first. The recommended direction is to make Work a deeper decision archive, not another public-output summary and not a learning-product list.
