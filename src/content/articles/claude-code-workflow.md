---
title: "Claude Code 實戰：我怎麼用 AI 寫完一整個網站"
description: "分享用 Claude Code 從零建站的真實工作流，包含 SEO 設定、設計改版、內容規劃的完整過程與踩坑經驗。"
publishDate: 2026-02-11T10:00:00+08:00
updatedDate: 2026-04-04
category: "AI工具實戰"
tags: ["Claude Code", "AI 協作", "Astro", "開發實戰", "AI 建站", "Cloudflare Pages"]
ogImage: "/images/articles/claude-code-workflow.webp"
featured: true
readingTime: 8
draft: false
excerpt: "不是叫 AI 寫 code 就好——從架構決策到 SEO 校正，分享我用 Claude Code 建站的完整工作流。"
faq:
  - question: "Claude Code 適合用來建網站嗎？"
    answer: "適合。Claude Code 擅長重複性改動、模板生成、SEO 元件建設和除錯，但架構決策、設計品味和商業判斷仍需要人來做。它是加速器，不是替代品。"
  - question: "用 AI 寫程式需要自己會寫 code 嗎？"
    answer: "不一定要會寫，但需要架構思維——知道要做什麼、怎麼拆解需求、怎麼判斷 AI 產出的品質。沒有這些，AI 給的東西你也判斷不了對不對。"
  - question: "為什麼選 Astro 而不是 Next.js？"
    answer: "Astro 零 JS 預設、原生支援內容集合、學習曲線低、部署到 Cloudflare Pages 幾乎免費。對靜態內容為主的網站，Astro 是效能和成本的最佳選擇。"
---

## 前言：AI 寫 code 不是重點，工作流才是

很多人對「用 AI 寫程式」的想像停在「貼需求、拿 code、複製貼上」。

但真正用 AI 做完一個完整專案後你會發現——**寫 code 只佔 30%，剩下 70% 是決策、架構、除錯和品質校正。**

這篇文章分享我用 Claude Code 從零完成 CabLate 官網的完整過程，包含哪些地方 AI 很強、哪些地方你不能偷懶。如果你還在猶豫要不要用 [Agent 框架還是簡單的 CLI 工具](/articles/blog-writing-openclaw/)，建議先看那篇。

## 技術選型：為什麼選 Astro

在開始之前，我需要決定用什麼框架。需求很明確：

- 靜態內容為主（文章、作品集）
- SEO 要好（SSG 優先）
- 開發體驗要好（支援 component 框架）
- 部署簡單（Cloudflare Pages）

最後選了 **Astro**，原因：

| 考量 | Astro | Next.js | Nuxt |
|------|-------|---------|------|
| SSG 效能 | 零 JS 預設 | 需設定 | 需設定 |
| 學習曲線 | 低 | 中 | 中 |
| 內容集合 | 原生支援 | 需套件 | 需套件 |
| 部署成本 | 幾乎免費 | Vercel 有限制 | 同左 |

## 用 Claude Code 的實際工作流

### 第一步：搭骨架

我不會一開始就叫 AI 寫完整個網站。第一步是建立專案結構和基礎元件：

```
src/
├── components/
│   ├── common/      # 共用元件
│   └── sections/    # 頁面區塊
├── content/
│   └── articles/    # Markdown 文章
├── layouts/         # 版面配置
├── pages/           # 路由
└── styles/          # 全域樣式
```

這個結構是我決定的，不是 AI。**架構決策是人的工作。**

### 第二步：逐區塊開發

每個 section 獨立開發，給 AI 明確的規格：

- 元件名稱、props 介面
- 預期的視覺效果（文字描述即可）
- 要用的 CSS 變數和設計系統

重點是**一次只做一件事**。不要丟一個「幫我做完首頁」的需求，而是「做 Hero section，規格如下...」。

### 第三步：SEO 基礎建設

這部分 AI 幫了很大的忙：

1. **SEO 元件** — 自動處理 meta tags、OG、Twitter Cards、JSON-LD
2. **RSS Feed** — 自動從文章集合生成
3. **Sitemap** — Astro 套件直接搞定
4. **分類頁面** — 動態路由自動建立

但 SEO 策略（寫什麼主題、鎖什麼關鍵字）還是要自己想。

### 第四步：設計改版

原本的深色遊戲風格太厚重，決定改成簡潔淺色主題。這個改動涉及：

- 4 個全域 CSS 檔案重寫
- 7 個元件的 style 區塊更新
- 所有金色/發光/漸層特效移除

AI 在這種「大範圍但規則明確」的改動特別有效率。手動改大概要半天，AI 十分鐘搞定。

## AI 很強的地方

1. **重複性高的改動** — 改 7 個元件的配色，規則一樣，AI 不會漏
2. **模板生成** — SEO meta tags、RSS feed、schema markup
3. **研究整合** — 分析競品 SEO 策略、整理 Google 官方文件
4. **除錯** — 看 build error、找 CSS 衝突

## AI 做不好的地方

1. **設計品味** — AI 會給你「正確」的設計，但不一定是「好」的設計
2. **商業判斷** — 要寫什麼主題、鎖什麼市場，AI 只能建議
3. **上下文遺失** — 長時間對話後 AI 會忘記之前的決策
4. **過度工程** — AI 傾向給你「完整」的方案，但你可能只需要最簡單的

## 結論：判斷力才是真本事

工具會越來越強，但**知道什麼時候該用什麼工具、用到什麼程度**——這個[判斷力不會被取代](/articles/anthropic-radar-ai-cannot-replace/)。

用 AI 建站不是「無腦」的事。你需要：

- 清楚的架構思維（告訴 AI 做什麼）
- 品質標準（判斷 AI 的產出好不好）
- 迭代耐心（第一次不會完美，但方向對就行）

這就是我說的「用架構思維駕馭 AI」。

---

*這篇文章本身也是用 Claude Code 協助完成的——但每一個觀點都是我的。*
