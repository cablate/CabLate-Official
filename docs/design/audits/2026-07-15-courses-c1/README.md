---
title: Courses C1 非必修選擇語意實作
date: 2026-07-15
status: complete
scope: Courses hero intro, map choice semantics, AgentSkill and handbook route copy
---

# Courses C1 非必修選擇語意實作

## Outcome

C1 已完成。Hero 現在只負責邀請訪客往下比較；Map header 明說四條路不用照編號走；AgentSkill 補上「已開始用 Skill」的前提；第四條 route 對齊第一方正式商品名「Claude Code 深度工程手冊」。

這一段沒有處理 route CTA 尺寸或 CabAI account CTA。畫面下方仍可看到約 `23px` 的 route text link 與大型深色帳號按鈕，那是已知的 C2／C3 工作，不是本段漏修。

## Visual evidence

### Hero 與選擇規則

![Courses hero after C1](./00-hero-c1.jpg)

- Hero intro：`往下對照四種狀況，從最接近你的那一種開始。`
- Hero 不再提前重講「不確定先診斷」；這項 recovery 規則只留在 Map header。

![Courses learning map after C1](./01-learning-map-c1.jpg)

- Map H2：`先找出最接近你的狀況。`
- Lead：`四條路依投入與深度整理，不用照編號走。還不確定問題在哪，就先做免費診斷。`
- 紙張標籤由 `START HERE` 改為 `CHOOSE ONE`。
- 畫面仍保留 `01–04` 作為深度索引，但 DOM 已由 ordered list 改成 unordered list。

### 付費內容適合條件

![AgentSkill route after C1](./02-paid-routes-c1.jpg)

- AgentSkill situation 明確包含已開始使用 Skill 的前提。
- Outcome 改成訪客能帶走的能力，不再只描述課程「用觀念與案例說明」。
- `NT$1,500，一次付費`、CTA 與 CabAI campaign 未變。

![Handbook route after C1](./03-handbook-c1.jpg)

- Route title 對齊第一方 H1：`Claude Code 深度工程手冊`。
- Situation 與 outcome 具體對應設定、記憶、Skill 與成本的設計／排查。
- `NT$5,999，一次付費`、CTA 與 CabAI campaign 未變。
- CabAI onboarding 仍是 C3 baseline，本段沒有順手修改。

## Runtime facts

- Viewport：`1280 × 720`；`scrollWidth === clientWidth === 1265`，沒有水平 overflow。
- Route container：`UL[role="list"]`，直接包含 `4` 個 route items。
- Route 01：`免費`，仍前往 `/expertise/`。
- Route 02：仍無 link，顯示「有新場次時會在這裡更新」。
- Route 03：`NT$1,500，一次付費`，仍前往 `courses_agentskill` campaign，`target="_blank" rel="noopener"`。
- Route 04：`NT$5,999，一次付費`，仍前往 `courses_handbook` campaign，`target="_blank" rel="noopener"`。

## Speak-human application summary

使用者已在上一輪逐項看過審查結論，並以「開始，請仔細處理」授權套用 C1。本次共套用 9 處公開文字修正：

1. Hero intro：移除和 Map header 重複的 recovery 說明，改成邀請比較四種狀況。
2. Map H2：移除「哪一層」的必修暗示。
3. Map lead：以白話說清楚不必照編號走。
4. Paper label：`START HERE` 改成 `CHOOSE ONE`。
5. AgentSkill situation：補上已開始使用 Skill 的前提。
6. AgentSkill outcome：由教學形式改成可帶走的能力。
7. 手冊 situation：由籠統的流程不穩，改成設定、記憶或成本問題。
8. 手冊 title：對齊第一方正式商品名。
9. 手冊 outcome：具體列出能理解與排查的範圍。

保真回讀通過：沒有新增價格、數字、見證或來源；三個 route href、兩個 CabAI campaign、CTA labels、免費試看承諾與未開放狀態都維持原值。

## Verification

- `npm run check`：通過，`0 errors`；現有專案共 `18 hints`，C1 沒有新增 diagnostics。
- `npm run validate:content`：通過。
- `npm run build`：通過，Courses 靜態路由成功產生。
- `git diff --check`：通過。
- Fresh in-app browser：Hero、Map、AgentSkill、手冊 route 均已人工開圖；沒有文字重疊、裁切或水平 overflow。

## Master Plan alignment

本段對應 Master Plan `6.0／6.1／6.3／6.5／6.7／6.8` 與 incremental plan `C1`。C1 的內容與原生 list semantics 已完成；C2 的三個 48px route CTA、C3 的 CabAI secondary／Mobile map、C4 page gate 仍維持 pending。

