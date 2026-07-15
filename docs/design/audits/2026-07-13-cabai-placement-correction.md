---
status: verified
date: 2026-07-13
scope: CabAI 在個人網站的敘事角色、CTA 放置與跨站 attribution
---

# CabAI placement correction

## Why this correction exists

前一版程式雖然接上 CabAI、商品、帳號與 Discord，實際放置方式卻沒有完整遵循已確認的頁面策略。問題不是連結能不能開，而是 CabAI 在不同頁面扮演了錯誤角色。

本輪以「CabLate 建立理解與信任，CabAI 承接試看、註冊、購買與交付」為唯一邊界，重新對照每一頁。

## Placement result

| Page | Required role | Verified implementation |
|---|---|---|
| Home | 訪客理解問題後的低壓力內容入口 | 頁尾附近只有「看目前可以開始的內容」，沒有帳號或 Discord 競爭 CTA |
| Courses | 主要商品與帳號入口 | 三個可開始項目說明適合對象、收穫與免費／價格；商品直達詳情，帳號 CTA 說明試看、購買內容與 Discord 後續用途 |
| Articles | 依文章問題推薦 | Skill／AI Agent 導向 AgentSkill；Claude Code、Context、Harness、Memory 導向工程手冊；不符合時回學習路線 |
| Work | 從公開證據延伸到商品內容 | 工程手冊案例直達商品詳情，CTA 使用「查看試看與完整章節」，不先要求購買 |
| About | 內容交付能力證據 | 在公開作品之後明確說明「我也把教學、試看、購買與內容交付整理成 CabAI 平台」，只連平台首頁，不推商品 |
| Services | 合作判斷與提交 | 不加入 CabAI 商品、帳號或 Discord CTA |
| Footer／側欄 | 低權重生態導覽 | 統一標示「CabAI 學習平台」，不作 Primary CTA |

## Attribution result

跨站 campaign 現在依放置位置區分：

- `home_learning`
- `home_case_handbook`
- `courses_agentskill`
- `courses_handbook`
- `courses_account`
- `work_handbook`
- `article_agentskill`
- `article_handbook`
- `article_learning`
- `about_platform`
- `site_navigation`

## Browser evidence

- Desktop About `1440 × 900`：CabAI 能力證據位於公開作品之後，連結在敘事內，不在頁尾雜項連結列；沒有水平 overflow。
- Mobile Home `390 × 844`：CabAI 區塊只有一個 CTA，紙張與按鈕未超出可見寬度。
- Mobile Courses `390 × 844`：帳號區塊只有一個 CTA，Discord 是帳號用途說明，不是競爭按鈕；沒有水平 overflow。
- Mobile About `390 × 844`：能力證據標題、說明與平台連結都在紙張內完整換行；沒有水平 overflow。

## Remaining cross-repo work

CabAI 公開 `/community`、平台信箱統一、Discord onboarding 狀態與 attribution ingestion 仍屬 `F:/_Program/OwnProject/paid-service-site`，規格位於 `docs/contracts/public-community-contact-attribution.md`。在 `/community` 上線前，個人網站不宣稱已有公開社群頁。
