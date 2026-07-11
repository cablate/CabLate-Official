# Homepage Content And Header Audit

Date: 2026-07-11

## Audit Scope

Homepage reading journey from the Hero through the final conversion area, plus desktop rail branding and mobile Headbar/menu states.

## User Goal

Understand what CabLate helps with, recognize who is behind the point of view, choose a useful next step, and optionally receive meaningful product or event notifications.

## Evidence

1. `01-desktop-hero-and-diagnosis.png` — homepage entry.
2. `02-desktop-thesis-and-routes.png` — core thesis, identity copy, and visitor routes.
3. `03-desktop-case-and-methods.png` — handbook case and diagnostic methods.
4. `04-desktop-reading-and-newsletter.png` — recommended reading and newsletter ending.
5. `05-mobile-header-closed.png` — mobile Headbar.
6. `06-mobile-menu-open.png` — mobile menu over mid-page content.

## Strengths

- The Hero establishes one clear problem and one next action.
- The diagnosis, thesis, routes, case, and methods now form a coherent explanation from symptom to working method.
- The paper system and restrained purple accents remain consistent across desktop and mobile.
- The handbook case is concrete enough to demonstrate how the stated method is applied.

## UX Risks

### 1. The homepage ending promises activity that no longer exists

The recommended-reading section presents the site as an actively updated publication, while the newsletter copy promises recurring observations in every email. If articles and editorial emails are no longer produced regularly, this ending creates a stale-content and trust problem precisely at the conversion point.

Recommendation: remove the homepage recommended-reading section. Keep articles accessible through navigation as an archive. Replace the newsletter framing with a single full-width update-notification section.

Suggested notification copy:

- Label: `更新通知`
- Heading: `有重要更新時，再寄信告訴你。`
- Body: `新課程、手冊更新或公開活動上線時，我會寄一封通知。沒有固定週期，也不會為了維持更新頻率寄信。`
- Submit action: `加入通知名單`

Remove the dated subscriber proof from this position unless it directly helps a current decision.

### 2. The identity paragraph is visually subordinate to everything around it

`我是 CabLate。` currently begins the second gray body paragraph in the right half of the thesis card. A scanning visitor sees the large thesis, the first explanation paragraph, and the purple link; the author identity does not register as a distinct moment.

Recommendation: split identity from method and promote it to a short dark lead sentence.

Suggested structure:

- Lead: `我是 CabLate，一位從全端工程走進 AI 工作流程設計的實作者。`
- Supporting copy: `我關心的不是 AI 能不能生成，而是成果能不能被採用、驗收與重現。遇到問題時，我會先看系統怎麼失效，再判斷該補資料、工具、流程，還是完成標準。`
- Keep the current About link.

This is a hierarchy correction, not a request for another boxed card or badge.

### 3. The handbook summary panel repeats the case instead of advancing it

The purple `旗艦知識產品` panel repeats the product name and proof already implied by the story and CTA. Its size gives it equal visual weight to the case itself, making the section feel like a product advertisement after an otherwise useful diagnosis.

Recommendation: remove the separate panel. Keep one quiet evidence line near the CTA, such as `整理自半年以上的實作與排錯經驗`, if the case needs reassurance.

### 4. `Open Desk Archive` consumes brand space without helping orientation

The phrase appears in both the desktop rail and mobile Headbar but does not explain the site's topic or provide a useful category. On mobile it also competes with the menu trigger and contributes to the trigger being visually clipped at the right edge.

Recommendation: remove it from both brand lockups. Keep `CabLate` as the complete brand label.

### 5. The mobile menu trigger looks like an unstyled utility control

The outlined rectangle does not share the paper material used by the Headbar and expanded menu. At the captured width, the right edge and label are partially clipped, so it feels accidental rather than designed.

Recommendation: after removing the subtitle, restyle the summary as a compact paper tab using the existing paper background token, no hard rectangular border, a small tinted shadow, and the existing Menu/X icons. Preserve the native `<details>` behavior and visible focus treatment.

## Accessibility Risks

- The clipped mobile menu trigger reduces visible affordance and may reduce the usable target at narrow widths.
- The native `<details>` interaction and visible focus ring are strengths; preserve them through restyling.
- Screenshot evidence cannot confirm screen-reader announcements, full keyboard traversal, zoom behavior, or contrast ratios. These require runtime checks after implementation.

## Recommended Homepage Sequence

1. Hero.
2. Problem diagnosis.
3. Core thesis plus clearly promoted CabLate identity.
4. Three visitor routes.
5. Handbook case without the redundant product-summary panel.
6. Three diagnostic methods.
7. One truthful full-width update-notification section.

## Priority Order

1. Correct the inactive publication/newsletter promise.
2. Promote the CabLate identity sentence.
3. Remove the redundant handbook summary panel.
4. Simplify the brand lockup and redesign the mobile trigger with the existing paper system.

## Evidence Limits

This audit is based on current screenshots and source copy. It does not validate email delivery frequency, list status, analytics performance, or complete WCAG compliance.
