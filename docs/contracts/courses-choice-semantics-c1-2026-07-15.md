---
schema_version: behavior-contract/v1
id: courses.choice-semantics-c1
title: Courses 非必修選擇語意
status: active
owner_surface: shared
change_context:
  type: bugfix
  reason: Courses 目前以文字、標籤與 ordered-list 語意暗示 01→04 必修，且兩個付費內容的適合條件與正式商品名稱未完全對齊第一方商品頁。
  non_goals:
    - 不調整 route CTA 尺寸、邊框或 filled／secondary 層級。
    - 不調整 CabAI onboarding 文案與帳號 CTA。
    - 不修改 Home、About、Expertise、Services 或已封存 Work 的內容。
    - 不處理 Mobile rail、anchor offset 或完整 Courses page gate。
---

# Courses 非必修選擇語意

## Behavior Boundary

本切片只修正 `/courses/` Hero intro、learning map header、route list 語意，以及 `learningPath` 內 AgentSkill／Claude Code 深度工程手冊的適合條件與 outcome。畫面結構、route 數量、route 狀態與所有 destination 維持不變。

## Consumers And Entrypoints

- Browser route：`/courses/`、`/courses/#learning-map`。
- Canonical route data：`src/config/authority.ts` 的 `learningPath`。
- DOM projection：`src/pages/courses/index.astro`。
- 訪客：還不確定問題、想找講座、已開始使用 Skill、已在用 Claude Code 的四種學習需求。
- Assistive technology：透過 list semantics 與 heading outline 讀取四個可獨立選擇的項目。

## Inputs And State

- `learningPath` 固定有四個項目，順序依投入與深度排列。
- 項目 01、03、04 有真實 href；項目 02 的 `href` 與 `price` 為 `null`。
- AgentSkill 第一方商品頁目前顯示 `NT$1,500`，適合已開始使用 Skill／AI 工具並想理解設計方法的人。
- 手冊第一方商品頁正式 H1 為「Claude Code 深度工程手冊」，現價 `NT$5,999`。

## Outputs And Side Effects

- Hero 只邀請訪客往下對照四種狀況，不提前重講 recovery 規則。
- Map H2 與 lead 明說四條路不用照編號走，不再使用「卡在哪一層」與 free-to-paid 的先後敘事。
- 紙張標籤由 `START HERE` 改為 `CHOOSE ONE`。
- route container 由 `<ol>` 改為 `<ul>`；畫面上的 `01–04` 保留且維持 `aria-hidden="true"`。
- AgentSkill situation 明確包含「已開始用 Skill」；outcome 說明能帶走的 Skill 設計能力。
- 手冊 route 使用第一方正式商品名，並具體說明可理解與排查的系統範圍。
- 不新增網路請求、狀態、儲存、事件或第三方依賴。

## UI States

- First paint／ready：維持既有 SSR 畫面；Hero、四個 route、CabAI onboarding 依原順序顯示。
- Available：01、03、04 維持「目前可開始」與原連結。
- Unavailable：02 維持「尚未開放」、無 href、無互動元素。
- Loading／error／empty／teardown：本頁沒有新增 client state；既有行為不變。
- Layout：C1 不改 CSS，文字變更不得造成 Desktop 水平 overflow 或明顯破壞 route 閱讀層級。

## Invariants

- 四個 route 的 stage、price、href、cta、availability 與 CabAI campaign 不變。
- 價格逐字保留：`免費`、`NT$1,500，一次付費`、`NT$5,999，一次付費`。
- AgentSkill、手冊與 CabAI account 仍使用 `withCabAiAttribution()` 產生既有 campaign。
- 項目 02 不得出現 href、button、pointer-like fake action。
- Hero CTA 仍連到 `#learning-map`。
- C1 不修改 route CTA 與 CabAI account CTA 的視覺層級；這些留給 C2／C3。

## Acceptance Examples

```gherkin
Given 訪客開啟 /courses/#learning-map
When 他只讀 Map H2、lead 與四個 route 標題
Then 他會看到四條路可依目前狀況選擇
And 不會被文字或 ordered-list 語意告知必須從 01 依序完成到 04
```

```gherkin
Given 訪客已開始使用 Skill，但仍反覆交代規則與重做成果
When 他讀到 AgentSkill route
Then situation 會明確描述這個前提
And title、價格、CTA、URL 與 campaign 維持原值
```

```gherkin
Given 訪客讀到第四條 route
Then 商品名為「Claude Code 深度工程手冊」
And 價格仍為「NT$5,999，一次付費」
And CTA 仍前往既有 CabAI 手冊商品網址
```

## Test Mapping

```yaml
test_mapping:
  automated:
    - npm run check
    - npm run validate:content
    - npm run build
    - git diff --check
  structural:
    - 搜尋 Courses DOM 為 ul.learn-map__list 且共有四個直接 li
    - 核對三個 href、target、rel、價格與 unavailable state
  manual:
    - 以 in-app browser 檢查 Hero、Map header、AgentSkill 與手冊 route 的 fresh 畫面
    - 確認 1280px 沒有水平 overflow，文字沒有不自然孤行或互相覆蓋
```

## Evidence

- Before：`docs/design/audits/2026-07-15-courses-strict-content-reaudit/`。
- After：`docs/design/audits/2026-07-15-courses-c1/`（實作完成後建立）。

## Intentional Changes

- Hero intro、Map H2／lead 與 paper label 改寫，切開 Hero 降壓與 Map 選擇規則的責任。
- ordered list 改為 unordered list，修正「獨立選擇」的原生語意。
- AgentSkill situation／outcome 與手冊 situation／title／outcome 依第一方商品頁修正。

## Open Questions

- 無。CTA 尺寸與 CabAI onboarding 已明確留給 C2／C3，不阻擋本切片。

