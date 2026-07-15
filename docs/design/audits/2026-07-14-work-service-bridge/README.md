# Work service bridge implementation audit — 2026-07-14

## Decision

實作使用者核准的 visual option 2：Work 的公開作品證據之後，不再列公司、客戶或有限揭露紀錄；改用左側 editorial heading、右側三張黃色服務紙卡與一個前往 Services 的共同 CTA。

- Source truth：`C:/Users/User/.codex/generated_images/019f5dfa-f4ec-7012-8453-21d555901f17/exec-a3fb69ab-0d33-4a96-b81e-3b0e7bcd75e3.png`
- Behavior contract：`docs/contracts/work-service-bridge-2026-07-14.md`
- Implementation：`src/pages/work.astro`
- Route／state：`/work/#service-bridge`

## Accepted evidence

- `14-desktop-1280x900-final.png`：Desktop 最終畫面；完整區塊與 CTA 都在 viewport 內。
- `12-mobile-390x845-final.png`：Mobile 最終畫面；瀏覽器要求 390 × 844，實際 inner viewport 為 390 × 845。
- `15-source-vs-implementation-1280x900.png`：左側 source truth、右側 production implementation 的同畫面比較。

`01`、`04`、`06` 是 stale CSS 或透明 WebP paint artifact，`10` 是錯誤捲動位置；這些檔案只保留除錯歷史，不可當成核准證據。`11` 與 `13` 是 1280 × 720 的中間驗證，已由 `14` 與 `15` 取代。

## Browser facts

### Desktop — 1280 × 900

- Section top `87.95px`、height `705.04px`，CTA bottom `729.01px`，沒有裁切。
- `document.scrollWidth === document.clientWidth === 1265`。
- 三張卡 body computed font size 均為 `15.04px`；背景使用真實 `--paper-reading-card-image` image-set。
- CTA height `52.78px`、href `/services/`；區塊只有一個 focusable control。
- 卡片 `filter: none`，以 opaque fallback 與 box-shadow 避免透明 WebP 的黑色 paint artifact。
- 禁止字串（企業名稱、合作方身分、有限揭露、電商平台 MCP 合作測試）均不存在。

### Mobile — 390 × 845

- `document.scrollWidth === document.clientWidth === 375`，沒有水平 overflow。
- Section width `350.57px`；三張卡與 CTA width `310.57px`。
- 卡片 body computed font size `16px`；所有卡片 `transform: none`。
- CTA height `52.78px`、href `/services/`；標題與卡片自然換行，沒有 fixed height 或內容裁切。

## Visual judgment

- Typography：三個核准句組維持同一 editorial 節奏；卡片標題與內文層級清楚，Desktop／Mobile 可讀字級成立。
- Spacing：Desktop 左文右卡、Mobile 依 DOM 順序單欄；紙卡錯落幅度輕，不影響邊界或閱讀。
- Colors／material：沿用既有黃色紙張素材與全站紫色／深墨色系，沒有新增孤立 palette。
- Image quality：材質用 1x／2x WebP image-set，沒有拉伸成低解析占位或黑色殘影。
- Copy：卡片是服務情境，不是案例、推薦語或客戶紀錄；完整服務內容仍由 Services 擁有。
- Interaction：三張卡為非互動 `<article>`；唯一 filled CTA 可前往 `/services/`，並有高對比 `:focus-visible` outline。

P0／P1／P2 findings：無。Source 與 implementation 的卡片實際寬度、頁面上方露出範圍略有差異，屬於套入真實 Work 頁與可用 viewport 後的合理結果，不改變核准構圖與資訊層級。

## Master Plan alignment

- 對應 incremental plan `W0d：作品證據後的黃色服務橋接（verified）`；production、internal QA 與 2026-07-15 user visual confirmation 均已通過。
- 對應 Master Plan `5.0b`、`5.3`、`5.4`、`5.6` 與 `5.9`：三張服務卡、零客戶線索、唯一 Services Primary、Desktop／Mobile 可讀性都成立。
- 此切片獨立完成，不代表 `W0c` 的 public decision roster／source-backed decision depth 已核准；後者仍是下一個 Work blocker。

## Yellow paper reuse rule

黃色紙張在這裡代表「可以採取的下一步」，不是裝飾。後續只建議在同一語意下少量重用：

1. Services 的「開始前要準備什麼」或合作 brief checklist。
2. Expertise 每個主題的 minimum next check／下一個驗證動作。
3. Courses 的 Start Here／目前推薦路徑，但必須先有真實可購買內容。

About 的公開輸出與 Work 的作品證據不建議改黃，避免證據與行動語意混在一起。

## Verification

- `npm run check`
- `npm run build`
- `npm run validate:content`
- `git diff --check`
- In-app browser Desktop／Mobile visual inspection and DOM measurement

Final result: passed
