---
schema_version: behavior-contract/v1
id: site.courses-decision-flow-consolidation
title: Courses 學習決策流程收斂
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 學習地圖、可開始入口與選擇原則重複呈現相同決策資訊，增加閱讀長度與選擇負擔。
  non_goals:
    - 不變更 /courses/ URL、主要導覽或品牌紙面視覺。
    - 不新增產品、價格、開課日期或未確認成果承諾。
    - 不改變 CabAI 商品與帳號 URL。
---

# Courses 學習決策流程收斂契約

## Behavior Boundary

- `/courses/` 由五個概念區塊收斂為 Hero、統一學習地圖與 CabAI 交付說明。
- 學習地圖完整呈現四段路線；目前可開始的入口提供 CTA。
- 未開放內容保留成果與適合情境，但降低視覺權重且不提供連結。
- 免費與付費的選擇原則併入學習地圖導語。

## Consumers And Entrypoints

- 瀏覽器路由：`/courses/`。
- 內容來源：`src/config/authority.ts` 的 `learningPath`。
- 外部去向：CabAI AgentSkill 商品頁、工程手冊商品頁與帳號登入頁。
- 站內去向：`/expertise/` 免費問題診斷。

## Inputs And State

- `learningPath` 中有 `href` 的項目視為目前可開始。
- `learningPath` 中沒有 `href` 的項目視為尚未開放，但仍呈現為完整路線節點。
- 價格、CTA、適合情境與商品 URL 只從 canonical config 讀取。

## Outputs And Side Effects

- 首屏 CTA 捲動至 `#learning-map`。
- 三個可開始入口各自輸出一次情境、成果、適合對象、價格與 CTA。
- 外部商品與帳號連結維持來源參數，並在新分頁開啟。
- 本頁沒有表單、資料寫入或背景網路請求。

## UI States

- First paint：Hero 清楚呈現頁面目的與一個錨點 CTA。
- Ready：四段學習路線沿同一條縱向路線呈現；未開放項目為低權重節點。
- Empty：若所有項目皆已開放，不再顯示 pending 狀態。
- Error：本頁資料為編譯期設定；型別或模板錯誤由 Astro check/build 阻擋。
- Responsive：桌機維持紙面路線；手機為單欄，情境、解法、價格與 CTA 不產生水平溢位。

## Invariants

- 同一個可開始入口在頁面主要內容中只完整呈現一次。
- 免費問題診斷仍是最低風險入口。
- 尚未開放內容保留完整資訊，但不與可購買項目使用同等視覺權重，也不渲染假連結。
- 狀態不能只靠顏色表達，必須保留文字。
- 焦點順序與視覺順序一致，所有 CTA 保留可見 focus state。

## Acceptance Examples

```gherkin
Given 訪客開啟 Courses 頁面
When 他捲動到學習地圖
Then 他只需閱讀一次三個目前可開始的入口
And 每個入口都能看到卡點、成果、適合情境、價格與一個 CTA
```

```gherkin
Given 講座與工作坊尚未開放
When 訪客閱讀學習地圖
Then 頁面仍顯示講座與工作坊的成果與適合情境
And 以較低權重標示尚未開放
And 不顯示可點擊的假連結
```

## Test Mapping

- Automated：`npm.cmd run check`、`npm.cmd run validate:content`、`npm.cmd run build`、`git diff --check`。
- Browser desktop：確認 Hero、四個路線節點與 CabAI 說明的層級和斷句。
- Browser mobile：確認 390 × 844 無水平溢位，CTA 不超出紙張安全內距。
- DOM：確認三個有效入口各自只出現一個主內容 CTA。

## Evidence

- `npm.cmd run check`：0 errors、0 warnings，17 個既有 hints。
- `npm.cmd run validate:content`：通過。
- `npm.cmd run build`：49 pages built。
- `git diff --check`：通過。
- Browser 1440 × 900：四個路線節點、三個有效 CTA，水平 overflow 為 0。
- Browser 390 × 844：地圖寬 351px，水平 overflow 為 0；講座與工作坊完整呈現且連結數為 0。

## Intentional Changes

- 移除獨立的「現在可以開始」區塊，內容併入學習地圖節點。
- 移除獨立的「選擇原則」區塊，原則併入地圖導語。
- 講座與工作坊保留完整節點，僅降低未開放狀態的視覺權重。
- CabAI 由大型轉換段落縮為交付說明，但保留免費帳號 CTA。

## Open Questions

- 無。
