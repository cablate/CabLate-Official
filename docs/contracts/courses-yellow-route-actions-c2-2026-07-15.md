---
schema_version: behavior-contract/v1
id: courses.learning-map.yellow-route-actions-c2
title: Courses learning map yellow recommendation notes and route actions
status: active
owner_surface: shared
change_context:
  type: feature
  reason: 將四條學習路線中的具體建議與狀況描述分層，並讓可採取的下一步具備足夠的可見性與操作尺寸。
  non_goals:
    - 不改動四條路線的文案、順序、價格、href 或 CabAI campaign。
    - 不調整 CabAI onboarding 區塊與帳號按鈕，該範圍留給 C3。
    - 不調整其他頁面或新增紙張素材。
---

# Courses C2 Yellow Route Actions Contract

## Change Context

本輪延續已完成的 C1 選路語意。白色主紙張負責描述訪客狀況，現有黃色閱讀紙負責承接「建議從這裡開始」、商品或入口、預期結果、價格與下一步。三條可走路線的文字連結升為正式 contextual 或 recovery action；尚未開放的講座維持純狀態提示。

## Behavior Boundary

### In scope

- `/courses/#learning-map` 的四個 `.learn-map__solution` 使用既有 `--paper-reading-card-image`。
- 有 href 的三條路線使用有邊界、至少 48px 高的原生 `<a>` action。
- 無 href 的第二條路線保留相同黃色建議紙，但只顯示不可互動的更新狀態。
- Desktop 與 Mobile 均維持自然內容高度、可讀文字與不溢出的紙張安全區。

### Out of scope

- Hero、Map heading、route situation、title、outcome、price、href、campaign 與排序。
- CabAI onboarding 的文案、版型、帳號 action 與權重。
- 全站共用 paper primitive 或其他頁面黃色紙張配置。

## Consumers And Entrypoints

- Browser route: `http://127.0.0.1:4321/courses/#learning-map`
- Source: `src/pages/courses/index.astro`
- Asset token: `--paper-reading-card-image` from `src/styles/base.css`
- Consumers: 想找免費診斷、等待講座、購買 AgentSkill 或購買工程手冊的訪客。

## Inputs And State

- `learningRoutes` 仍由 `src/config/authority.ts` 提供。
- `item.href` 是否存在決定 route 是可導航 action 或純狀態。
- `item.price` 可選顯示，沒有價格時不產生空白佔位。
- 外部 href 保留 `_blank` 與 `rel="noopener"`；站內 href 保留同頁導航語意。

## Outputs And Side Effects

- 四個 recommendation surface 呈現黃色紙張材質與一致的內容安全內距。
- 三個可用 route 產生原生連結，可由鍵盤聚焦並保留原 destination。
- 第二條 route 不產生 `<a>`、`<button>`、pointer cursor 或 disabled fake button。
- 不新增 JavaScript、網路請求、storage、analytics event 或資料寫入。

## UI States

- First paint / ready: 黃色紙張與內容同時由 Astro HTML 和 CSS 呈現，不依賴 client hydration，不發生狀態閃爍。
- Interactive: 三個 action 具 hover、active 與清楚的 `:focus-visible`，文字在桌機不刻意換行，窄螢幕可自然換行但 target 不低於 48px。
- Unavailable: 第二條 route 以安靜的狀態文字呈現，保留黃色建議紙但不模仿按鈕。
- Loading / error / empty: 此靜態區塊沒有 runtime loading 或 error state；若 route 沒有 href，即依 unavailable state 呈現。
- Teardown: 無事件監聽或 client state，不需要 teardown。

## Invariants

- DOM 順序仍為 01、02、03、04，不以 CSS `order` 改寫閱讀順序。
- 黃色紙只承接具體建議，不取代外層白紙的狀況描述。
- 所有 route title、outcome、price、href 與 campaign 保持 C1 完成後的值。
- 三個可用 action 的 computed block size 均至少 48px。
- 第二條 route 的 solution subtree 中沒有 link 或 button。
- Focus outline 不被紙張背景或 overflow 裁切。
- `.learn-map.scrollWidth === .learn-map.clientWidth`，C2 內容與按鈕不超出 learning map 或紙張安全區；320px 的既有 Hero phrase overflow 由 C3 負責。

## Acceptance Examples

```gherkin
Given 訪客閱讀 Courses 的第一條免費診斷路線
When 畫面完成第一輪繪製
Then 狀況描述留在白色主紙張
And 具體建議出現在黃色紙張上
And 「先做免費診斷」是至少 48px 高的可聚焦連結
And destination 仍為 /expertise/
```

```gherkin
Given 訪客閱讀尚未開放的第二條講座路線
When 指標移到更新狀態或用鍵盤巡覽
Then 畫面不出現可點擊游標、link 或 button
And 黃色紙只說明建議與更新狀態
```

```gherkin
Given 訪客閱讀第三或第四條付費路線
When 點擊 route action
Then 外部 destination 與既有 CabAI campaign 不變
And action 以新分頁安全屬性開啟
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run validate:content
    - npm run build
    - git diff --check
  runtime:
    - Inspect all .learn-map__solution computed background images.
    - Measure three .learn-map__route-action block sizes and href values.
    - Assert pending solution has zero a/button descendants and default cursor.
    - Assert document scrollWidth equals clientWidth.
  manual:
    - Inspect the learning map in the in-app browser at 1280px desktop width.
    - Confirm yellow notes clarify hierarchy without making all four routes feel like competing product cards.
    - Confirm focus, hover and unavailable state remain visually distinct.
```

## Evidence

- Before: `docs/design/audits/2026-07-15-courses-c1/`
- After: `docs/design/audits/2026-07-15-courses-c2/`
- 1280px：三個 route action computed height 皆為 `48px`，document horizontal overflow 為 `0`。
- 390px：第一個 action computed height `48px`，solution 與 action 均留在 viewport 內，horizontal overflow 為 `0`。
- 320px：較長的付費 action 只在 `max-width: 340px` 自然換行，route title 維持 `20px` 避免英文複合名稱與全形冒號拆壞，learning map horizontal overflow 為 `0`；document 仍有既有 Hero H1 phrase 造成的 `5px` overflow，明列交給 C3，不把它誤寫成 C2 通過。
- Pending route：solution subtree 中 `a === 0`、`button === 0`，solution 與 status cursor 均為 `auto`。
- 四個 solution computed background 均為 `--paper-reading-card-image` 的 `image-set(...)`。
- Automated：`npm run check`、`npm run validate:content`、`npm run build`、`git diff --check` 全通過。

## Intentional Changes

- 四個淡紫或灰色 suggestion block 改為既有黃色紙張材質，建立「狀況在白紙、建議在黃紙」的固定角色。
- 三個小型 text link 改為至少 48px 高的 bordered paper action。
- Pending route 的 suggestion block 也使用黃色紙張，但其狀態維持非互動。

## Open Questions

- 黃色紙張的視覺份量與三個 action 的按鈕權重由本輪瀏覽器畫面交由使用者確認。
- CabAI onboarding 的 secondary action 規格留待 C3，不在本輪決定。
