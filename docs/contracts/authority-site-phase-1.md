---
schema_version: behavior-contract/v1
id: cablate.authority-site.phase-1
title: CabLate authority site foundation
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: Rebuild the public site around a canonical author identity, dated proof, original methods, representative work, and clear visitor paths.
  non_goals:
    - Rebuild course sales pages.
    - Change Kit, cabai, shop, or paid-service-site behavior.
    - Publish unverified testimonials, customer identities, or revenue.
---

# CabLate Authority Site Phase 1 Contract

## Behavior Boundary

In scope: global navigation and footer, design tokens, home page, about page, canonical identity data, public proof data, and first-stage analytics attributes.

Out of scope: checkout, account delivery, course availability decisions, testimonial authorization, enterprise lead processing, and content migration beyond Home and About.

## Consumers And Entrypoints

- Browser routes: `/`, `/about/`.
- Shared shell: `src/layouts/BaseLayout.astro`.
- Public configuration: `src/config/authority.ts`, `src/config/siteConfig.ts`.
- Search engines and AI crawlers reading HTML, JSON-LD, canonical links, sitemap, and robots policy.
- Keyboard and assistive-technology users.

## Inputs And State

- Public A-level identity, positioning, methods, work, and proof copy from the Content OS snapshot.
- Existing article collection and site configuration.
- Existing uncommitted work is preserved and integrated; unrelated files are not reverted.
- Dynamic proof values are explicitly dated and must be refreshed before expiry.

## Outputs And Side Effects

- Server-rendered HTML with a single page H1 and sequential heading hierarchy.
- Crawlable anchor navigation to existing routes and future route placeholders only when the destination exists.
- `ProfilePage` and `Person` structured data on About; `WebSite` and `Person` on Home.
- No persistence, API writes, account state, or third-party mutations.

## UI States

- First paint: identity, main claim, description, and primary CTA remain readable without JavaScript.
- Ready: navigation, links, and newsletter form are interactive.
- Reduced motion: reveal and hover movement are disabled or reduced.
- Mobile: content order matches DOM order and no horizontal overflow is introduced.
- Error/empty: not applicable to static sections; existing Kit form owns its submission states.

## Invariants

- CabLate remains the public brand; `/about/` is the canonical author page.
- No revenue figures, unapproved customer names, logos, photos, or testimonial quotes.
- Proof always includes an `asOf` date.
- Existing article, course, service, search, RSS and privacy routes remain reachable; the retired `/starter-pack/` route is not part of the public site.
- Core content is readable with JavaScript disabled.
- One primary CTA intent per major page section.

## Acceptance Examples

```gherkin
Given a first-time visitor opens the home page
When the first viewport is rendered
Then CabLate, the claim "判斷力比執行力值錢", the audience outcome, and a guide-or-work next step are visible
```

```gherkin
Given a visitor opens the About page
When they inspect the page and structured data
Then the same public name, alternate name, positioning, biography, and sameAs links are used consistently
```

```gherkin
Given a visitor navigates using only a keyboard
When they tab through the global shell
Then the skip link, navigation, primary links, and footer are reachable with visible focus
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run validate:content
    - npm run check
    - npm run build
  browser:
    - Home desktop screenshot and DOM check
    - Home mobile screenshot and overflow check
    - About desktop and mobile DOM check
    - Keyboard navigation and reduced-motion inspection
  manual:
    - Verify proof dates and public-safe claims against Content OS
    - Verify structured data visible copy parity
```

## Evidence

- Baseline on 2026-07-11: content validation passed.
- Baseline dirty files were recorded before implementation.
- `npm run validate:content`: passed on 2026-07-11.
- `npm run check`: 0 errors, 0 warnings; existing Astro hints remain.
- `npm run build`: 48 pages built successfully on 2026-07-11.
- Home desktop browser check: one H1, no missing image alt, `scrollWidth === clientWidth` at 1265px.
- Home mobile browser check: one H1 and no horizontal overflow at 375px.
- About mobile browser check: one H1, sequential H2/H3 outline, `ProfilePage` JSON-LD, and no horizontal overflow at 375px.

## Intentional Changes

- Homepage shifts from role cards and latest-content emphasis to an authority spine.
- Global navigation labels shift from implementation categories to visitor decisions.
- Display typography shifts from default serif headings to a modern sans-led system.
- About expands from a short biography into the canonical author identity page.

## Open Questions

- Final public headshot and image ratios.
- First canonical Harness Engineering guide URL.
- Which three projects receive full Case Study status after outcome verification.
- Method and hero imagery is intentionally deferred until the final headshot and asset dimensions are available; no synthetic person or fake product proof will be generated.
