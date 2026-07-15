---
schema_version: behavior-contract/v1
id: cablate.articles-inbound-discovery-pause
title: Temporarily pause sitewide inbound links to Articles
status: active
owner_surface: shared
change_context:
  type: feature
  reason: Articles 已很少更新，暫時不由個人網站其他頁面主動導流，但文章內容與既有網址繼續保留。
  non_goals:
    - 不關閉或重新導向任何文章、分類與標籤網址。
    - 不刪除文章 Markdown、layout、RSS、sitemap 或 OG 輸出。
    - 不移除文章頁內的上一篇／下一篇、相關文章與商品推薦。
---

# Articles inbound discovery pause contract

## Behavior Boundary

### In scope

- 桌機側欄、手機選單與 Footer 的 Articles 入口。
- Home、Expertise 與 404 中導向文章的 CTA。
- Search、Courses 與 Home 中主動宣稱文章為目前入口的文案。
- `public/llms.txt` 的文章入口與文章清單。

### Out of scope

- `/articles/`、文章內容、分類、標籤與文章 OG 路由。
- RSS endpoint 與 sitemap 中既有文章 URL。
- ArticleLayout、ArticleNav、RelatedArticles、ProductRecommend 與文章 archive 元件。
- `src/content/articles/` 的文章內容。

## Consumers And Entrypoints

- 從 Home、Expertise、Courses、404、桌機側欄、手機選單與 Footer 瀏覽網站的訪客。
- 已持有文章網址、從搜尋引擎／RSS 進站，或正在文章內繼續閱讀的訪客。
- 讀取 `public/llms.txt` 的 AI consumer。

## Inputs And State

- Articles 仍是有效內容類型與有效路由。
- 暫停的是非文章頁面的主動導流，不是文章發布狀態。
- 被暫停的程式入口需留下 `Articles inbound links paused` 註解，方便日後恢復。

## Outputs And Side Effects

- 主要導覽與 Footer 不顯示 Articles。
- Home、Expertise 與 404 不產生 `/articles/` 連結。
- Search 文案不把文章描述為目前主要搜尋入口。
- Courses 的免費起點只承諾問題診斷。
- `llms.txt` 不主動列出文章入口與文章清單。
- 文章、分類、標籤、RSS、sitemap、OG 與文章內部導航維持原行為。

## UI States

- First paint：導覽不短暫顯示 Articles 後再消失。
- Ready：移除 CTA 後不留下空欄、空按鈕或失去意義的文案。
- Direct article visit：文章照常顯示，文章內部閱讀與商品下一步維持可用。
- Re-enable：解除註解並重新檢查各頁 CTA 層級，不需要恢復文章來源檔。

## Invariants

1. 暫停主動導流不等於停止發布。
2. 非文章頁不得留下指向 `/articles/` 的可點擊 CTA。
3. 文章既有 URL、SEO 輸出與文章內閱讀路徑不得回歸。
4. Expertise 保留完整診斷方法，不因移除文章 CTA 而出現空欄。
5. Home 原本由文章承接的訪客意圖改由 Expertise 問題診斷承接。

## Acceptance Examples

```gherkin
Scenario: visitor opens the site navigation
  Given Articles inbound discovery is paused
  When the desktop rail or mobile menu is rendered
  Then no Articles navigation item is present

Scenario: visitor follows an existing article URL
  Given the article is published
  When the visitor opens its existing URL directly
  Then the article renders normally
  And its related reading and product recommendation remain available

Scenario: visitor reads Expertise
  Given article CTAs are paused
  When the diagnosis and method sections render
  Then their diagnostic content remains complete
  And no empty article-action column is present
```

## Test Mapping

```yaml
static:
  - npm run check
  - npm run validate:content
  - npm run build
  - git diff --check
focused:
  - no /articles/ href outside article-owned surfaces
  - an existing article route is still generated
  - RSS and sitemap still contain existing article URLs
browser:
  - desktop and mobile navigation
  - Home diagnosis and visitor routes
  - Expertise diagnosis and method map
  - direct article visit
```

## Evidence

- `npm run check`：0 errors、0 warnings、17 個既有 hints。
- `npm run validate:content`：通過。
- `npm run build`：49 pages built；既有文章索引、文章內容、分類、標籤、RSS 與 OG 都仍產生。
- `git diff --check`：通過。
- Build scan：Home、Expertise、Courses、Work、About、Services、Privacy、Search 與 404 的 `href="/articles/` 數量為 0。
- Build scan：`dist/articles/index.html` 與 `dist/articles/claude-code-workflow/index.html` 仍存在；RSS 與 sitemap 仍包含文章 URL；`llms.txt` 不再列出文章 URL。
- Browser desktop `1440 × 900`：Home 導覽、Footer 與內容區沒有 Articles 入口；Expertise 診斷表改為四欄，三列寬度一致且無水平 overflow。
- Browser mobile `390 × 844`：手機選單沒有 Articles；Expertise 三列完整呈現且 `scrollWidth === clientWidth`。
- Direct article browser QA：`/articles/claude-code-workflow/` 正常顯示文章內容、3 個相關文章入口與 1 個商品推薦；console 0 errors。

## Intentional Changes

- Articles 暫時退出非文章頁面的主動導流。
- Home 的「先把 AI 用穩」改由 Expertise 問題診斷承接。
- Search 只在文案上主打仍持續維護的方法、作品、學習與合作內容。

## Open Questions

- 重新開啟全站導流前，需決定最低更新頻率與舊文章是否仍代表目前觀點。
