---
title: Courses 嚴格內容重審
date: 2026-07-15
status: planning_complete
scope: Courses hero, learning map, route copy, route actions, CabAI onboarding
---

# Courses 嚴格內容重審

## 結論

**Needs Revision，但不需要重做整頁。** Hero 的主張與四條 route 骨架成立；真正的問題是內容語意和畫面權重互相打架：`START HERE`、`01–04`、連續 rail 與「卡在哪一層」共同暗示必修順序，三個可走入口卻只是約 `23px` 高的文字連結，最後抽象的 CabAI 帳號反而是約 `53px` 高的深色主按鈕。

本輪是 planning-only audit，沒有修改 production UI。Fresh evidence 來自 2026-07-15 的 in-app browser、Courses runtime DOM／computed rect，以及 AgentSkill、Claude Code 深度工程手冊兩個第一方商品頁。

## 審查目標

Courses 應只回答一個問題：**我現在適合從哪一種投入與學習深度開始？** 訪客先選具體 route，CabAI 只負責試看、購買與已購內容交付；不能把帳號註冊變成頁面的真正終點。

## Flow review

### 1. Hero — Healthy，僅有輕微重述

![Courses hero](./01-courses-hero-current.jpg)

- 「不用一次學完全部」有效降低選擇焦慮，filled anchor 也正確指向 `#learning-map`。
- Intro 已先說「依問題選下一步／不確定先診斷」，Map header 又重講相同判斷，兩區內容責任尚未切乾淨。
- 建議 Hero 只負責降壓與導向比較，例如：「往下對照四種狀況，選一個現在剛好的入口。」

### 2. Map header — Needs Revision

![Courses learning map](./02-learning-map-current.jpg)

- `START HERE`、`01–04`、連續 rail 和「你現在卡在哪一層？」合起來像 `01 → 04` 的課綱，不像四個可獨立選擇的入口。
- 現有 lead「免費內容先幫你看懂問題；需要反覆練習或查閱時，再考慮付費內容」又補上一條 free-to-paid 的先後敘事，沒有說明選擇規則。
- Map header 應負責講清楚：「四條路依投入與深度整理，不用照編號走；還不確定問題在哪，就先從免費診斷開始。」
- H2 建議由「卡在哪一層」改成不帶必修暗示的「先找出最接近你的狀況。」

### 3. 免費診斷與未開放講座 — Mixed

![Courses route 01 and 02](./03-routes-mid-current.jpg)

- `01 免費問題診斷` 的情境、免費狀態與 `/expertise/` destination 都成立，應保留為 recovery route。
- `02 講座與工作坊` 沒有 href、沒有假按鈕，狀態誠實；但它和可開始項目佔相同閱讀重量，需在視覺切片中降級狀態、保留內容類型即可。
- 「先做問題診斷」目前約 `103.6 × 22.8px`，不足以承擔正式 recovery action。

### 4. AgentSkill 與深度工程手冊 — Needs Revision

![Courses paid routes](./04-paid-routes-current.jpg)

- 兩個價格與「免費試看」承諾皆符合第一方商品頁：AgentSkill `NT$1,500`、`1` 堂免費試看；手冊現價 `NT$5,999`、`6` 堂免費試看；兩者試看都不需登入。
- AgentSkill 商品頁明確鎖定「已開始使用 Skill／AI 工具、想理解設計方法」的人，並非純新手教學。Courses 現在只寫「AI 每次都要重新交代」，範圍太廣，可能把不適合的人導進商品頁。
- AgentSkill situation 建議改為：「已經開始用 Skill，卻還是得反覆交代規則與重做成果。」outcome 改為使用者能帶走的能力，而不是「用觀念與案例說明」這種交付描述。
- Courses 顯示「Agent 深度工程手冊」，第一方商品 H1 是「Claude Code 深度工程手冊」。Courses 作為產品 fit／state owner，C1 必須先對齊正式商品名；其他公開頁面的舊名稱列入 cross-page fact gate。
- 手冊目前的「已經在用 Claude Code」適合條件成立，但 outcome 可更具體對應 `CLAUDE.md／Memory／Skill／成本` 的設計與排錯能力。
- 兩個商品 CTA 目前都約 `143.9 × 22.8px`，沒有呈現「這是現在可以走的路」。

### 5. CabAI onboarding — Needs Revision

![Handbook route and CabAI onboarding](./05-handbook-current.jpg)

- 交付平台說明應保留，因為它能回答「買完去哪裡看」。
- 第一方商品頁明確標示免費試看可直接觀看、不需登入；現有「試看與購買內容，都留在 CabAI 帳號裡」與大型「建立 CabAI 免費帳號」容易讓人誤會試看前必須註冊。
- Heading 建議改為：「免費試看不用登入，已購內容留在 CabAI 帳號裡。」Body 再說明準備購買或查看已購內容時才登入、Discord 僅在需要社群權限時連結。
- 帳號 action 保留，但改為 bordered Secondary；它不能壓過三個具體 route。

## Source-backed product facts

| Route | 第一方商品頁事實 | Courses 判定 |
| --- | --- | --- |
| AgentSkill | `NT$1,500`；8 章／9 課；1 堂免費試看；永久觀看；免費試看不需登入；適合已使用 Skill／AI 工具並想理解設計方法的人 | 價格、試看與 destination 正確；situation 太寬，需補已開始使用 Skill 的前提 |
| Claude Code 深度工程手冊 | 正式 H1 為「Claude Code 深度工程手冊」；現價 `NT$5,999`；17 章／45 課；6 堂免費試看；永久觀看；免費試看不需登入 | 價格、試看、fit 與 destination 正確；Courses 商品名需對齊，outcome 可更具體 |

來源：

- `https://cabai.cablate.com/products/agentskill-course`
- `https://cabai.cablate.com/products/cc-deep-engineering`

## Master Plan 修訂結果

原本的 C1–C4 方向正確，但 C1 不能只補「非必修」說明；它還要先修三個內容事實：AgentSkill 的適合前提、手冊正式商品名、免登入試看與 CabAI 帳號的關係。

1. `C1`：切開 Hero／Map header 責任；移除「層」與 free-to-paid 必修暗示；補 AgentSkill prerequisite；對齊手冊正式名稱與 route outcomes。
2. `C2`：三個可走 route 全部升為至少 `48px` 的 bordered paper action；未開放講座維持非互動。
3. `C3`：CabAI 文案先說免登入試看，再說帳號用途；帳號 CTA 降為 Secondary；Mobile map 同步驗證。
4. `C4`：重新核對商品頁 facts、Desktop／Mobile 視覺、anchor、鍵盤與 external URL，再建立 Courses checkpoint。

## Evidence limitation

本輪 fresh visual evidence 為目前 in-app browser 的 `1280px` Desktop。曾嘗試用 viewport capability 取得 fresh Mobile capture，但瀏覽器仍回報 `1280 × 720`，且 screenshot command timeout；因此沒有拿舊截圖冒充本輪 Mobile 證據。Mobile 必須在 C3／C4 另做 fresh gate。

