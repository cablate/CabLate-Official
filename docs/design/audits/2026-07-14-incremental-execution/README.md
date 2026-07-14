---
slice: P1
status: verified
date: 2026-07-14
parent_plan: docs/content/remaining-primary-pages-visual-conversion-master-plan-2026-07-14.md
execution_plan: docs/content/remaining-primary-pages-incremental-execution-plan-2026-07-14.md
evidence_type: repo-facts-and-browser-baseline
---

# P1：Repo facts refresh

## Slice result

P1 已完成。這一段只讀取 repo、確認目前 working tree 與用內部瀏覽器重建 Home／Expertise 基線，沒有修改 production code。

瀏覽器目前保留兩個可繼續使用的分頁：

- `http://127.0.0.1:4321/` — Home
- `http://127.0.0.1:4321/expertise/` — Expertise

測試使用瀏覽器當下 viewport `1265 × 720`；這不是五 viewport production gate，只是 P1 的 live baseline。

## Repo facts

| Fact | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `c9aafa5 docs: plan remaining primary page refinements` |
| Working tree | 只有父 Master Plan 的修改與本次 execution plan 未追蹤檔；沒有不明 production code 變更 |
| Required production paths | 12／12 存在：global CSS、Home、Expertise、About、Work、Courses、Services、authority、siteConfig 與兩份 canonical docs |
| Local runtime | `127.0.0.1:4321` 回應 Home／Expertise |
| Contact source | `src/config/siteConfig.ts` 的 `cablate@cablate.com` |
| CabAI attribution | `src/config/siteConfig.ts` 的 `withCabAiAttribution()` |

## Browser baseline facts

### Home

- H1：`讓 AI 把工作做完，成果也能放心交付。`
- Runtime scroll size：`1265 × 3875`，目前沒有水平溢位。
- 9 個主要 action 都已是 48px 高的 `.btn`，包含：Home Hero、診斷、About、Courses、Services、工程手冊與 CabAI。
- Home 主要 route 仍是 `/expertise/`、`/courses/`、`/services/`、`/about/`；外部 CabAI URL 帶既有 campaign。

### Expertise

- H1：`AI 一直鬼打牆，先別只改 Prompt。`
- Runtime scroll size：`1265 × 3885`，目前沒有水平溢位。
- 方法順序在 DOM／畫面中仍是 `Context → Skill → Harness`。
- 4 個主要 action 都已是 48px 高的 `.btn`：Hero 診斷、回到診斷表、學習路線、實際情境。
- Hero、diagnosis、method map、next-step 的 route／anchor 仍存在。

## P1 judgement

P1 沒有發現需要先修正父 Master Plan 的 repo fact。下一段可進入 `F1：建立 CTA 與 sequence behavior contract`；F1 仍是文件與 baseline contract，不修改四頁 production code。

## Open risks carried forward

1. P1 的 viewport 是瀏覽器當下 `1265 × 720`，不能替代 1440／390 或五 viewport gate。
2. Home／Expertise 的 48px `.btn` 只證明已驗證頁面目前健康，不能推論 About／Work／Courses／Services 的小字 CTA 已修好。
3. Build 曾有既有 Vite public asset placeholder warnings；在各頁 L2 與最終 G1 重新判斷是否為本輪回歸。

## Evidence boundary

本紀錄證明 repo reality、live URL、DOM route／heading／action 尺寸與 zero-overflow baseline；不宣稱完整 WCAG、forced-colors、reduced-motion、五 viewport 或四頁完成。
