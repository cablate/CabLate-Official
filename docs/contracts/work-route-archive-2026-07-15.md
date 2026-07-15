---
schema_version: behavior-contract/v1
id: site.work-route-archive
title: Work 頁面暫時下架
status: active
owner_surface: shared
change_context:
  type: feature
  reason: Work 尚未形成相對於 Home 與 About 的獨立任務，暫時下架可減少重複閱讀與錯誤導流。
  non_goals:
    - 刪除作品資料或已完成的 Work 視覺原始碼。
    - 改寫 About 的公開輸出內容。
    - 在其他頁面立即套用黃色紙張素材。
---

# Work 頁面暫時下架契約

## Change Context

Work 的案例內容與 Home、About 重疊，而且尚未有足夠的 source-backed decision records 支撐獨立頁面。本次只做可逆下架；未來若重新定義 Work 的獨占任務，可從封存原始碼恢復。

## Behavior Boundary

### In scope

- Work 不再出現在桌機、手機與 Footer 導覽。
- About 不再提供前往 Work 的 CTA 或 utility link。
- 舊 `/work/` 網址安全轉向 About 的公開輸出區。
- Work 不進 sitemap。
- 原始頁面移到 `src/archive/work.astro`，不再產生正式內容頁。

### Out of scope

- Home、Expertise、Courses、Services、Articles 的內容與版面。
- About 公開輸出的三個作品敘事與外部來源。
- `representativeWork`、`openSourceProofs` 等內容資料清理。
- 黃色紙張候選位置的正式施工。

## Consumers And Entrypoints

- `primaryNavigation`：桌機側欄與手機選單。
- `BaseLayout` Footer 的「探索」導覽。
- About Hero、公開輸出 actions、頁尾 utility links。
- 舊書籤與外部連結：`/work/`。
- sitemap 產生器。

## Inputs And State

- Astro 靜態輸出，`trailingSlash: 'always'`。
- About 的 `#public-output-title` 仍是穩定且可見的公開證據入口。
- Work 原始碼必須留在 repo 內，且不能位於 `src/pages/`。

## Outputs And Side Effects

- 全站可見導航不再包含「作品」。
- About Hero 改為同頁「先看公開輸出」。
- About 公開輸出只保留 GitHub 與 Threads profile actions。
- `/work/` 產生靜態 client redirect，目的地為 `/about/#public-output-title`。
- sitemap 不包含 `/work/`。

## UI States

- First paint：導覽直接呈現「專業方法／學習／合作／關於」，不先顯示再隱藏 Work。
- Ready：About 的公開輸出外連與下一步 Services／Courses 仍可操作。
- Redirect：舊 Work URL 不顯示封存內容，直接落在 About 公開輸出。
- Error：不新增 JavaScript loading、disabled 或錯誤狀態。

## Invariants

- 不使用 CSS、`aria-hidden` 或 client-side JavaScript 隱藏仍可聚焦的 Work 入口。
- About 的 GitHub、Threads、Services、Courses、Expertise 與 Email 目的地不變。
- 封存不等於刪除；Work 程式與黃色服務橋接仍可追溯。
- 導覽 DOM 順序與視覺順序一致。

## Acceptance Examples

```gherkin
Given 訪客開啟任一公開頁面
When 桌機側欄、手機選單或 Footer 顯示
Then 不存在標籤為「作品」或 href 為 `/work/` 的導航連結
```

```gherkin
Given 訪客開啟 About
When 點擊 Hero 的「先看公開輸出」
Then 瀏覽器停在同一頁的 `#public-output-title`
And 公開輸出 actions 只保留 GitHub 與 Threads
```

```gherkin
Given 訪客使用舊書籤開啟 `/work/`
When 靜態 redirect 執行
Then 最終網址是 `/about/#public-output-title`
And 不顯示封存的 Work 案例內容
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run build
    - npm run validate:content
    - rg production sources for /work/ links
    - inspect dist/sitemap-0.xml and dist/work/index.html
  manual:
    - In-app browser desktop navigation and About CTA verification
    - In-app browser direct /work/ redirect verification
    - Mobile navigation DOM verification；visual breakpoint 留待 final page gate
```

## Evidence

- Before screenshots：`docs/design/audits/2026-07-15-work-archive-yellow-paper-audit/01-work-before-archive.jpg`、`02-about-work-cta-before.jpg`。
- After screenshots：`03-work-redirect-after.jpg`、`04-about-hero-after.jpg`、`05-about-public-actions-after.jpg`、`06-about-profile-actions-after-final.jpg`。
- 完整命令結果與黃色紙張跨頁審查：`docs/design/audits/2026-07-15-work-archive-yellow-paper-audit/README.md`。

## Intentional Changes

- 使用者於 2026-07-15 決定 Work 暫時 archive，所有公開入口同步撤下或改寫。
- 舊 URL 不回傳 Work 內容，改轉向 About 公開輸出以保留訪客脈絡。

## Open Questions

- 已由跨頁畫面審查確認 Services 是唯一明確適配頁面；Courses 只保留條件式候選。正式施工另拆 `S2a` 小切片，不納入 WA0。
