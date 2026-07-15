---
schema_version: behavior-contract/v1
id: work.service-bridge
title: Work 作品證據到服務方式橋接區
status: active
owner_surface: shared
change_context:
  type: feature
  reason: 使用者選定黃色紙張服務卡方案，取代無法公開客戶細節的合作紀錄，讓作品頁在累積信任後自然導向付費服務。
  non_goals:
    - 不重寫 Work 的 Hero、代表作品或公開作品內容。
    - 不改動 Services 頁的完整服務、交付與合作流程。
    - 不新增客戶名稱、公司名稱、Logo、合作成果、推薦語或成效數字。
    - 不把三張服務卡做成三個互相競爭的 CTA。
---

# Work 作品證據到服務方式橋接區

## Change Context

目前 `/work/` 頁尾以「有限揭露的合作紀錄」說明企業 AI 導入與 MCP 合作測試。這些敘述必須反覆解釋不能公開的資訊，也和 `/services/` 的合作經驗內容重疊。核准方向改為：公開作品負責證明判斷力，頁尾只用三張黃色紙卡說明可提供的服務，再以一個共用 CTA 導向完整服務頁。

## Behavior Boundary

### In scope

- `/work/` 的最後一個內容區塊。
- 三種既有服務的 Work 頁短版投影。
- 黃色紙張素材、桌機雙欄構圖、手機單欄閱讀與共同 CTA。
- Work 對應 Master Plan 與執行切片狀態。

### Out of scope

- Work 公開案例 roster、案例深度與各案例 action row。
- `/services/` 的服務詳情、流程、邊界與聯絡方式。
- 全站紙張元件或色彩 token 重構。

## Consumers And Entrypoints

- Browser route：`/work/`。
- Section anchor：`/work/#service-bridge`。
- Primary downstream route：`/services/`。
- Content owner：`src/config/authority.ts` 的 `serviceTracks` 標題；Work 只擁有較短的情境摘要。

## Inputs And State

- 頁面以 Astro 首次渲染，不依賴 client-side JavaScript。
- 三張卡依 `serviceTracks` 的既有 DOM 順序顯示：工作流診斷、企業內訓與工作坊、AI 產品與 Agent 導入。
- 卡片背景使用既有 `--paper-reading-card-image`，來源為 `/images/paper-ui/paper-reading-card-*.webp`。

## Outputs And Side Effects

- 移除 `limitedDisclosureWork` 與其可見客戶／合作情境敘述。
- 產生三個非互動 `<article>` 服務卡與一個 `/services/` 連結。
- 不產生資料寫入、網路請求、計時器或 client-side state。

## UI States

- First paint／ready：標題、三張服務卡與 CTA 直接可見；紙張圖片未載入時仍有取自素材中心色的暖黃色背景，文字與連結不被材質載入阻塞。
- Loading：無獨立 loading state；背景材質不得阻塞文字與連結。
- Error／empty：`serviceTracks` 是 build-time authority；Astro check 或 build 失敗即不交付，不以空卡 fallback 掩蓋內容錯誤。
- Desktop：左側標題與說明，右側三張微幅錯落的橫式黃色紙卡；CTA 位於卡片下方。
- Mobile：標題、說明、三張卡與 CTA 依 DOM 順序單欄堆疊；取消橫向位移與旋轉，CTA 滿寬。
- Focus：唯一 CTA 使用至少 2px 高對比 outline，不被紙張邊界裁切。

## Invariants

- 頁面不出現公司、客戶、Logo、合作方身分或保密範圍敘述。
- 三張卡只介紹服務情境，不假裝是作品證據或案例。
- 三張卡不可各自成為連結；整個區塊只有一個前往 `/services/` 的主要行動。
- Work 公開作品區與 `/services/` 既有內容、連結和順序不因本切片回歸。
- 320、360、390、1280、1440px 不出現水平 overflow、裁切、縮字或固定高度文字容器。

## Acceptance Examples

```gherkin
Given 訪客讀完 Work 的公開作品
When 訪客進入 service bridge
Then 先看到三種可以購買或洽談的服務情境
And 看不到任何公司、客戶或保密合作紀錄
And 只看到一個「查看完整服務與合作方式」行動
```

```gherkin
Given viewport 為 390 x 844
When service bridge 顯示
Then 標題、三張黃色紙卡與 CTA 依序單欄排列
And 每張卡文字完整換行
And document.scrollWidth 等於 document.clientWidth
And CTA 高度至少 48px
```

## Test Mapping

```yaml
test_mapping:
  static:
    - npm run check
    - npm run build
    - git diff --check
  browser:
    - 1280x900 /work/#service-bridge screenshot and DOM measurement
    - 390x845 /work/#service-bridge screenshot and overflow measurement (requested 390x844; browser inner viewport rounded to 845)
    - CTA destination and focus-visible check
  visual:
    - Compare selected option 2 source image with 1280x900 implementation capture
```

## Evidence

- Baseline：`docs/design/audits/2026-07-14-work-public-records-overlap-audit/03-work-public-records.png`。
- Selected visual truth：`C:/Users/User/.codex/generated_images/019f5dfa-f4ec-7012-8453-21d555901f17/exec-a3fb69ab-0d33-4a96-b81e-3b0e7bcd75e3.png`。
- Implementation evidence：`docs/design/audits/2026-07-14-work-service-bridge/14-desktop-1280x900-final.png`、`12-mobile-390x845-final.png` 與 `15-source-vs-implementation-1280x900.png`。

## Intentional Changes

- 刪除「有限揭露的合作紀錄」與兩筆合作情境，依使用者核准改成三種服務卡。
- 頁尾行動由條件句文字連結改為單一深色實體 CTA。
- 黃色紙張由小標籤材質升級為此區塊的語意素材：代表可採取的下一步，不作全站隨機裝飾。

## Open Questions

- 無；視覺方案 2 與不揭露客戶細節的內容方向已由使用者核准。
