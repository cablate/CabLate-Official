# Homepage heading audit — 2026-07-11

## Scope

- Surface: homepage `/`
- Viewports: 1280×900 and 390×844
- Focus: H1, H2 and prominent H3 line breaks, semantic phrase integrity, paper-card containment and responsive reflow

## Confirmed issues and resolutions

1. `判斷力比執行力值錢。` split `執行力` between lines. It now uses the intentional two-line structure `判斷力比` / `執行力值錢。`.
2. The mobile routes heading split `改善`. It now renders as `你現在最想改善` / `哪一件事？`.
3. The third diagnosis heading split `原因`. It now renders as `一出錯就找不到原因，` / `只能從頭再來。`.
4. The case heading split differently at unstable semantic positions. Desktop now uses two intentional lines; mobile uses three.
5. The recommended-reading heading split `遇到`. It now uses `先從你現在遇到的` / `問題讀起。` on mobile.
6. Curated article titles split `怎麼`, `自動化`, and `每則訊息`. Their mobile lines are now curated with the article selection, and the longest title uses explicit three-line phrasing on both viewports.
7. The newsletter title split `新工具` and `留下`. It now uses semantic lines, with a smaller desktop size appropriate to the narrow column.

## Acceptance evidence

- `01-desktop-top.png`: desktop Hero and diagnosis entry.
- `14-desktop-thesis-fixed.png`: desktop thesis heading.
- `15-desktop-newsletter-fixed.png`: desktop reading and newsletter headings.
- `17-mobile-diagnosis-final.png`: mobile diagnosis heading and rows.
- `18-mobile-thesis-routes-final.png`: mobile routes heading.
- `19-mobile-reading-newsletter-final.png`: mobile recommended-reading heading and primary article.
- `20-mobile-newsletter-final.png`: mobile secondary article and newsletter headings.

## Verification notes

- All homepage H1–H3 elements were measured by their actual rendered line boxes at both viewports.
- Document scroll width equals client width on mobile (`375px`), with no horizontal overflow.
- Intentional `<br>` elements change only visual phrasing; heading text remains one continuous accessible name in the DOM.
- Screenshot review cannot prove complete WCAG conformance; keyboard and assistive-technology behavior were not changed by this typography pass.
