---
schema_version: behavior-contract/v1
id: site.speak-human-cleanup
title: CabLate 全站對外文案清洗
status: active
owner_surface: shared
change_context:
  type: refactor
  reason: 七個主要入口頁使用過多相同反轉句、排比與內部術語，單頁正確但全站閱讀顯得模板化。
  non_goals:
    - 不改文章內頁、課程內容頁與 Search。
    - 不改頁面 URL、Primary CTA 意圖、產品狀態或視覺系統。
    - 不新增作者經歷、客戶成果、數字或立場。
---

# CabLate 全站對外文案清洗契約

## Behavior Boundary

- 清洗共用 Footer、Home、About、Expertise、Work、Courses、Services 與 Articles index 的 40 組核准句子。
- 只修改可見文案與因欄位刪除而成為 dead code 的局部模板／CSS。
- Articles 保持公開但不恢復站內導流。

## Consumers And Entrypoints

- `/`、`/about/`、`/expertise/`、`/work/`、`/courses/`、`/services/`、`/articles/`。
- 共用 Footer 與 `src/config/authority.ts` 的方法、學習路線資料。
- CabAI 商品與帳號、Email、Threads、GitHub 等既有外部去向。

## Inputs And State

- 核准來源：`docs/content/site-speak-human-cleanup-master-plan-2026-07-13.md` 第 1-40 項，作者指示全部修正。
- 產品狀態、價格、數字與 URL 以現有 config 為準。
- Courses 的 situation 已承擔適合對象判斷，因此移除重複 fit 文字。

## Outputs And Side Effects

- 對外文案更直接，減少公式反轉、重複導引與抽象名詞。
- 所有連結去向、UTM、mailto 與 target 行為保持不變。
- 不產生資料寫入、表單行為或外部 API 變化。

## UI States

- First paint：各頁 Hero 的主張與 CTA 意圖不變。
- Ready：核准文案呈現，Courses 四個節點與 Services 合作選項維持完整。
- Responsive：長標題與 CTA 在桌機、手機都留在紙張安全範圍，無水平 overflow。
- Error：模板或型別錯誤由 Astro check/build 阻擋。

## Invariants

- 「判斷力比執行力值錢。」保持原文。
- CabLate、CabAI、AgentSkill、Agent 深度工程手冊與其他專名不改名。
- NT$1,500、NT$5,999、45 課、40+ 位學員、stars／forks 與截至日期不漂移。
- 未授權案例說明、合作邊界、隱私與退出通知的意思不變。
- CTA URL 與每頁 Primary CTA 任務不變。
- 不替作者增加未提供的第一人稱故事或立場。

## Acceptance Examples

```gherkin
Given 訪客依序閱讀 Home、About、Expertise、Work、Courses 與 Services
When 他比較各頁的開場與段落
Then 不會連續看到相同的「不是 A，而是 B」或三項排比模板
And 每頁仍能完成原本的主要決策
```

```gherkin
Given 訪客開啟 Courses
When 他閱讀四個學習節點
Then 每個節點只呈現一次適合情況
And 價格、開放狀態與 CTA 仍正確
```

## Test Mapping

- Automated：`npm.cmd run check`、`npm.cmd run validate:content`、`npm.cmd run build`、`git diff --check`。
- Mechanical：黑話、公式句型、中國用語、半形標點與核准原句掃描。
- Browser：1440 × 900 與 390 × 844 逐頁檢查文字、CTA、overflow 與 console。
- Protection：產品名、價格、數字、日期、Email 與外部 URL 比對。

## Evidence

- `npm.cmd run check`：0 errors、0 warnings，17 個既有 hints。
- `npm.cmd run validate:content`：通過。
- `npm.cmd run build`：49 pages built。
- `git diff --check`：通過。
- Browser 1440 × 900 與 390 × 844：七個入口頁水平 overflow 皆為 0，主要文字元素沒有超出 viewport。
- Courses DOM：四個路線節點、三個有效連結；每個節點只保留一段 outcome。
- Services DOM：合作 Email 為 `mailto:cablate@cablate.com`，三個核准標題均已呈現。
- Articles DOM：四張問題卡的 description 各自使用不同句型。
- Browser console：0 errors。

## Intentional Changes

- 套用 Human Speaker 清單第 1-40 項。
- Courses 移除四個重複 fit 句與對應模板／CSS。
- Work 移除與 Hero 重複的 RECORD NOTE 內文。
- Follow-up 審查將 Services 合作證據縮成一句，只證明已有企業 AI 導入與內訓的實際交付經驗。
- 七個主要入口頁 H1 與 Services 主要 H2 改為作者指定的語意片語斷行，避免桌機／手機任意逐字換行。
- Services 手機版 `.process__header` 納入單欄規則，確保標題使用完整紙張內容寬度。

## Follow-up Evidence

- Services 合作證據不含日期、授權細節、案例或方法導流。
- `display-heading`／`heading-phrase` 僅控制換行邊界，不改標題內容、DOM 層級或 CTA 行為。
- 390 × 844：七個入口頁沒有 heading phrase 或頁面水平溢位。
- 1440 × 900：七個入口頁沒有 heading phrase 或頁面水平溢位。

## Open Questions

- 無。
