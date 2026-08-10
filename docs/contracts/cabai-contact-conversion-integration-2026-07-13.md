---
schema_version: behavior-contract/v1
id: cablate.cabai-contact-conversion
title: CabLate contact and CabAI conversion integration
status: active
owner_surface: shared
change_context:
  type: feature
  reason: 讓個人網站的聯絡、更新通知、CabAI 註冊、Discord 社群與商品購買各自形成真實且可辨認的下一步。
  non_goals:
    - 不把每一頁都改成 CabAI 銷售頁。
    - 不建立不存在的 Discord 公開邀請網址。
    - 不以更新通知 Email 取代合作聯絡或 CabAI 帳號。
    - 不修改 CabAI checkout、OAuth 或 Discord API 實作。
---

# CabLate Contact And CabAI Conversion Integration Contract

> 2026-08-10 起，Services 的 Primary conversion 已由 `service-application-and-lead-ledger-v1.md` 接管；本文件的直接 mailto 規則只保留給 footer 與一般 Email 聯絡。

## Behavior Boundary

### In scope

- `/`、`/about/`、`/work/`、`/courses/`、`/services/` 與文章內容頁的聯絡和 CabAI 下一步。
- 共用側欄／footer 的 CabAI 與 Email 入口。
- Kit 更新通知承諾、成功訊息與 privacy 用途描述。
- CabAI 商品、建立帳號與平台導覽的跨站 URL 與來源參數。

### Out of scope

- CabAI `/community` 公開 onboarding 頁、Discord OAuth 與身分組邏輯的程式修改。
- 寄送測試信、Kit 確認信或外部訊息。
- CabAI 商品價格、課綱、付款流程與會員權限規則。

## Consumers And Entrypoints

- 陌生訪客、文章讀者、學習內容買家、合作洽詢者與社群加入者。
- CabLate routes：`/`、`/about/`、`/work/`、`/courses/`、`/services/`、`/articles/[slug]/`、`/privacy/`。
- CabAI routes：`/products`、兩個既有商品詳情與 `/login?callbackUrl=/dashboard`。
- `src/config/siteConfig.ts`、`src/config/authority.ts`、`ProductRecommend.astro`、`KitForm.astro`、`NewsletterCTA.astro`。

## Inputs And State

- 公開聯絡信箱為 `cablate@cablate.com`。
- CabAI 公開站為 `https://cabai.cablate.com`。
- AgentSkill 商品 slug 為 `agentskill-course`；工程手冊 slug 為 `cc-deep-engineering`。
- CabAI 目前透過 Google 登入建立帳號；登入後可在 `/dashboard/profile` 連結 Discord。
- CabAI 尚無公開 `/community` 頁或可確認屬於 CabLate 社群的 Discord invite URL。

## Outputs And Side Effects

- 一般 Email CTA 只產生 `mailto:cablate@cablate.com`；Services 的 Primary conversion 先進入 `/services/apply/`，再由使用者的 Email 應用程式寄出，網站仍不儲存合作資料。
- CabAI CTA 會離開 `cablate.com`，並使用明確目的文字與 UTM query。
- Kit 表單仍只送至既有 Kit subscription endpoint。
- 本輪不會自動建立 CabAI 帳號、加入 Discord、寄信或建立訂單。

## UI States

- First paint：既有紙面視覺、頁面責任與 Primary CTA 不被 CabAI 入口取代。
- Ready：CabAI 入口在訪客已理解內容後出現；Home 只導向內容總覽，商品 CTA 指向具體商品，而非首頁。
- External transition：連結文字先說明會前往 CabAI、建立帳號、連結 Discord 或查看商品。
- Error/Unavailable：不顯示尚未存在的 `/community` 或未驗證 Discord invite。

## Invariants

1. 合作聯絡、更新通知、CabAI 註冊、Discord 社群與商品購買是五種不同意圖。
2. `cablate@cablate.com` 是唯一公開聯絡 Email source of truth。
3. 商品推薦必須對應文章或頁面脈絡，不以全站相同商品 CTA 覆蓋所有內容。
4. Services 的 Primary conversion 仍是提交合作情境，不是購買 CabAI 商品。
5. About 只把 CabAI 當成產品與交付能力證據，不變成商品牆。
6. 外部連結使用 `target="_blank"` 時必須有 `rel="noopener"`。
7. 更新通知只承諾重要更新，不能承諾固定電子報或第一手觀察寄送頻率。
8. Home 的 CabAI 區塊只有一個內容總覽 CTA，不同時放帳號與 Discord。
9. Courses 的「現在可以開始」需交代適合對象、預期收穫、免費或價格，再導向具體商品。
10. About 必須用 CabAI 證明內容交付能力，不能只把平台名稱放進外部連結列。
11. Discord 公開 Community 頁尚未存在時，只說明帳號之後可以連結 Discord，不新增會與帳號競爭的社群 CTA。

## Acceptance Examples

```gherkin
Scenario: visitor contacts CabLate by email
  Given the visitor is reading Services or the site footer
  When they activate the email contact action
  Then the href begins with mailto:cablate@cablate.com
  And the action is not a Kit subscription form

Scenario: reader opens the matching CabAI product
  Given the reader finishes a Claude Code or Context-related article
  When they activate the contextual product recommendation
  Then the destination is the CabAI Claude Code handbook detail page
  And the URL records cablate personal-site attribution

Scenario: visitor learns how the CabAI account connects to Discord
  Given CabAI does not yet expose a public community landing page
  When the visitor reads the Courses account section
  Then the copy explains that the account preserves preview and purchased content
  And it explains that Discord can be connected later from the profile
  And the page does not add a competing Discord CTA before a public community page exists

Scenario: visitor joins update notifications
  Given the visitor enters an email in the Kit form
  When they submit the form
  Then the surrounding copy calls it an important update notification
  And it does not claim the email will be used for contact, CabAI registration or Discord
```

## Test Mapping

```yaml
static:
  - npm run check
  - npm run validate:content
  - npm run build
  - git diff --check
manual_browser:
  - desktop and mobile Home CabAI section with one content CTA
  - Courses product and account route
  - Services mailto and Threads hierarchy
  - article contextual recommendation links
  - footer Email and CabAI links
```

## Evidence

- Before: `docs/design/audits/2026-07-13-current-persona-review.md`。
- After evidence: `docs/design/audits/2026-07-13-cabai-contact-integration/`，包含 Home、Courses、Services、About 與文章推薦的桌機／手機畫面。
- CabAI public routes and product details were live-checked on 2026-07-13 before implementation。
- `npm run check`：0 errors、0 warnings、17 個既有 hints。
- `npm run validate:content`：通過。
- `npm run build`：49 pages built；8 個既有 public asset warnings 保留。
- `git diff --check`：通過。
- Desktop `1440 × 900` 與 mobile `390 × 844` 的目標區塊皆 `scrollWidth === clientWidth`；手機的標題、CabAI／Email／Discord CTA 無可見 clipping。
- CabAI 商品、帳號與平台導覽 URL 皆在 DOM 中保留 placement-specific UTM；Services、footer、rail 與 Privacy 的 Email 皆解析為 `mailto:cablate@cablate.com`。

## Intentional Changes

- 公開合作 Email 從「沒有」改成 `cablate@cablate.com`。
- Work 與 Courses 的工程手冊連結由 CabAI 首頁改成具體商品頁。
- 文章訂閱文案由固定「電子報」語意改成重要更新通知。
- 加入 CabAI 商品與免費帳號入口，但不改變各頁原本的唯一責任；Home 不放帳號或 Discord CTA，About 只把 CabAI 當作交付能力證據。
- 跨站 attribution 依 `home_learning`、`courses_*`、`work_handbook`、`article_*`、`about_platform` 與 `site_navigation` 區分實際放置位置。

## Open Questions

- CabAI `/community` 上線後，個人網站應把暫時的 profile-login route 替換成公開 onboarding 頁。
- Kit 表單仍需要使用受控 Email 完成確認信與名單寫入的 owner-side 測試。
