# 2026-04-29 Commit Quality Review & Improvement Plan

## Scope

Reviewed commits made on 2026-04-29, from `67977b514ac244f1f20e2e425531279e274b79af` through `9697c8ea5d4fd078bab49356af9dddb208588889`.

Main areas changed:

- Course content collection schema and two new course markdown entries.
- Course sales-page layout.
- SEO component with Course and FAQ JSON-LD support.
- Course index badge styling.
- Shared CSS status colors and badge utilities.
- CSS architecture plan documentation.

## Verification Performed

- `git status --short`: clean worktree before review.
- `npm run build`: build completed successfully.
- `npx astro check`: not completed because the project does not currently include `@astrojs/check` and `typescript`; the command prompts for interactive install.

Known build caveat:

- The build currently logs Pagefind failure on Windows: `pagefind` cannot be installed/run for `windows-x64` through the current wrapper. The build script appears to continue, but local build output is noisy and search indexing is skipped.

## Quality Summary

Overall, the commits are directionally coherent: they add a real course sales-page capability, centralize badge/status styling, and improve SEO schema coverage. The implementation builds, and the commit sequence is reasonably atomic.

The main quality gap is that production-facing content and metadata are not guarded from test data. The new course markdown files are published pre-sale pages but still contain `[TEST]`, placeholder FAQs/testimonials, fake checkout URLs, and one replacement-character corruption. There are also maintainability issues around repeated course status/badge mappings, weak Course schema semantics, and missing non-interactive type/schema validation.

## Findings

### P0 - Published Course Pages Contain Test Sales Copy

Files:

- `src/content/courses/vibe-coding.md`
- `src/content/courses/payment-integration.md`

Problem:

- Both course files are not drafts and use `status: "pre-sale"`, so they are included in `/courses/` and generated as public pages.
- They contain `[TEST DATA]`, placeholder module descriptions, fake testimonials, and unresolved FAQ answers.
- `payment-integration.md` includes a fake checkout URL despite status being pre-sale.

Impact:

- Users and crawlers can see incomplete sales pages.
- FAQ JSON-LD will expose placeholder answers to search engines.
- Fake testimonials create trust and compliance risk.

Required fix:

- Either set `draft: true` until final content is ready, or replace all placeholders with production copy before publishing.
- Remove testimonials unless they are real and approved.
- Do not provide `checkoutUrl` until checkout is actually live and verified.

### P1 - Replacement Character Corruption Exists in Source Content/CSS Comment

Files:

- `src/content/courses/vibe-coding.md`
- `src/content/courses/payment-integration.md`
- `src/layouts/CourseLayout.astro`

Problem:

- `vibe-coding.md` line around the value proposition has `���`.
- `payment-integration.md` has a corrupted bullet before `Portaly Payment API`.
- `CourseLayout.astro` has a corrupted decorative CSS comment in the mobile section.

Impact:

- Visible content corruption can ship to production pages.
- Source quality degrades and future edits become harder to review.

Required fix:

- Replace corrupted characters with valid text or plain ASCII comments.
- Add a lightweight source scan in CI or build script that fails on `�` and `[TEST]` under production content paths.

### P1 - Course Status and CTA Semantics Are Not Strict Enough

File:

- `src/layouts/CourseLayout.astro`

Problem:

- Active courses without `checkoutUrl` fall back to Threads with text `聯繫購買`.
- Pre-sale courses with a `checkoutUrl` still route to Threads, but SEO Offer availability is based only on `checkoutUrl`, not status.
- `statusMap` and badge behavior are duplicated across course layout and course index.

Impact:

- UI and structured data can disagree.
- Future course statuses will require repeated edits and may silently render undefined labels.

Required fix:

- Extract a shared course display config helper, for example `src/config/courseDisplay.ts`.
- Drive CTA and schema availability from both `status` and `checkoutUrl`.
- Recommended behavior:
  - `active + checkoutUrl`: buy CTA, Offer `InStock`, Offer URL present.
  - `active + no checkoutUrl`: contact CTA, no Offer URL, consider `PreOrder` or omit Offer until checkout exists.
  - `pre-sale`: pre-sale/contact CTA, Offer `PreOrder`, no checkout URL unless pre-sale checkout is intentionally live.
  - `draft/archived`: no CTA and no public course page unless intentionally visible.

### P1 - Course JSON-LD Is Useful But Under-Specified

File:

- `src/components/SEO.astro`

Problem:

- Course schema uses `courseWorkload` with human text such as `4 週` or `自主學習`. Schema.org commonly expects workload-like duration text, but it is not validated here.
- Offer availability is inferred from `checkoutUrl`, not course status.
- FAQ JSON-LD is emitted for any FAQ, including placeholder test answers.

Impact:

- Structured data may be accepted syntactically but remain semantically weak.
- Placeholder FAQ data can be indexed.

Required fix:

- Pass `courseStatus` into SEO or pass an explicit `offerAvailability`.
- Emit FAQ JSON-LD only for production-ready FAQ items, or block `[TEST]` content from build.
- Consider supporting `priceCurrency`, `provider` config, and a dedicated `schemaDuration`/`courseWorkload` field rather than reusing display `duration`.

### P2 - Type Checking Is Not Enforced

Files:

- `package.json`
- `tsconfig.json`

Problem:

- The repo extends Astro strict tsconfig, but there is no non-interactive `check` script.
- `npx astro check` cannot run without installing `@astrojs/check` and `typescript`.

Impact:

- Astro prop/type regressions can pass `npm run build`.
- Collection schema and component prop mismatches are harder to catch before commit.

Required fix:

- Add dev dependencies `@astrojs/check` and `typescript`.
- Add script: `"check": "astro check"`.
- Run `npm run check` in CI or before release.

### P2 - Pagefind Failure Should Be Normalized

Files:

- `scripts/build.js`
- `package.json`

Problem:

- On Windows, build completes but logs Pagefind install/run failure after route generation.

Impact:

- Developers may miss real build warnings because expected local noise is mixed into output.
- Search indexing behavior differs by platform.

Required fix:

- Make Pagefind behavior explicit by platform.
- Either skip Pagefind before invoking unsupported binaries on Windows, or document and gate it behind an env var such as `ENABLE_PAGEFIND=1`.

### P2 - CSS Utility Extraction Is Good But Incomplete

Files:

- `src/styles/base.css`
- `src/styles/utilities.css`
- `src/layouts/CourseLayout.astro`
- `src/pages/courses/index.astro`

Problem:

- Status colors and badge utilities were extracted, which is good.
- Course layout still has hardcoded success/error audience card colors.
- Course index uses scoped `:global(.badge)` sizing override, which works but is less explicit than a reusable small badge modifier.

Impact:

- Design tokens are partially centralized but not consistently consumed.

Required fix:

- Add `.badge-sm` or `.badge-compact` utility.
- Replace audience card hardcoded colors with status variables.
- Keep decorative CSS comments simple to avoid encoding artifacts.

## Implementation Plan

### Phase 1 - Production Safety Guards

1. Decide whether the two new course pages should be public now.
2. If not public, add `draft: true` to both course markdown files.
3. Remove or replace all `[TEST]` content before any page is published.
4. Remove fake testimonials unless they are real, approved, and attributable.
5. Remove or disable checkout URLs until they are verified.
6. Add a script that scans `src/content/courses` for `�` and `[TEST]`, failing the build for non-draft entries.

### Phase 2 - Clean Source Corruption

1. Replace `���` in `src/content/courses/vibe-coding.md`.
2. Replace the corrupted bullet in `src/content/courses/payment-integration.md`.
3. Replace the corrupted decorative mobile comment in `src/layouts/CourseLayout.astro` with a plain ASCII or clean UTF-8 comment.
4. Re-run `npm run build`.

### Phase 3 - Centralize Course Display Rules

1. Create `src/config/courseDisplay.ts`.
2. Move status labels, badge variants, and CTA derivation into this helper.
3. Update `src/layouts/CourseLayout.astro` and `src/pages/courses/index.astro` to use the helper.
4. Ensure unknown statuses fail loudly at type level instead of rendering undefined labels.

### Phase 4 - Strengthen SEO Schema

1. Add course status awareness to `SEO.astro`, either through `courseStatus` or explicit `offerAvailability`.
2. Avoid emitting Offer URL for pre-sale pages unless the checkout is intentionally live.
3. Add optional `schemaDuration` or `courseWorkload` frontmatter field if display duration is not suitable for schema.
4. Block FAQ JSON-LD when FAQ contains placeholders.

### Phase 5 - Add Non-Interactive Validation

1. Install dev dependencies: `@astrojs/check` and `typescript`.
2. Add `"check": "astro check"` to `package.json`.
3. Run:
   - `npm run check`
   - `npm run build`
4. If CI exists, add both commands there.

### Phase 6 - Normalize Local Build Output

1. Inspect `scripts/build.js`.
2. Make Pagefind skip behavior explicit on unsupported platforms before attempting the wrapper.
3. Keep the existing CI behavior if production indexing works there.

## Suggested Acceptance Criteria

- `npm run build` completes without visible source corruption in generated course pages.
- `npm run check` exists and passes.
- No non-draft course content contains `[TEST]` or `�`.
- Course CTA and JSON-LD availability agree for `draft`, `pre-sale`, `active`, and `archived`.
- Course status labels and badge variants are defined in one shared module.
- Windows local build output no longer prints Pagefind failure as an expected warning.

## Claude Code Instruction

Read `plans/2026-04-29-commit-quality-review-plan.md`, then implement the improvements in priority order from Phase 1 through Phase 6. Preserve existing behavior unless the plan explicitly says to change it, run `npm run build` and any new validation script/check you add, and summarize the changed files plus remaining risks.
