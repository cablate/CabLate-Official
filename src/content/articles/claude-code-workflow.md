---
title: "Claude Code 實戰：我怎麼用 AI 寫完一整個網站"
description: "記錄我用 Claude Code 從零建站的過程：SEO、設計改版、內容規劃，以及哪些地方讓我重做。"
publishDate: 2026-02-11T10:00:00+08:00
updatedDate: 2026-04-04
category: "AI工具實戰"
tags: ["Claude Code", "AI 協作", "Astro", "開發實戰", "AI 建站", "Cloudflare Pages"]
ogImage: "/images/articles/claude-code-workflow.webp"
readingTime: 8
draft: false
excerpt: "記錄我用 Claude Code 從零做完 CabLate 官網的過程：技術選型、元件切分、SEO 建置與改版時重做的教訓。"
---

很多人對「用 AI 寫程式」的想像停在「貼需求、拿 code、複製貼上」。

但實際用 AI 做完一個完整專案就會發現，**寫 code 大概只佔 30%，剩下 70% 都在做架構決策、除錯和品質校正。**

這篇文章分享我用 Claude Code 從零完成 CabLate 官網的完整過程，包含哪些地方 AI 很強、哪些地方你不能偷懶。如果你還在猶豫要不要用 [Agent 框架還是簡單的 CLI 工具](/articles/blog-writing-openclaw/)，建議先看那篇。

## 技術選型：為什麼選 Astro

在開始之前，我需要決定用什麼框架。需求很明確：

- 靜態內容為主（文章、作品集）
- SEO 要好（SSG 優先）
- 開發體驗要好（支援 component 框架）
- 部署簡單（Cloudflare Pages）

最後選了 **Astro**，主要考量如下：

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

1. **SEO 元件**：處理 meta tags、OG、Twitter Cards、JSON-LD
2. **RSS Feed**：從文章集合自動產生
3. **Sitemap**：透過 Astro 套件產生
4. **文章路由**：由內容集合自動建立

但 SEO 策略（寫什麼主題、鎖什麼關鍵字）還是要自己想。

### 第四步：設計改版

原本的深色遊戲風格太厚重，決定改成簡潔淺色主題。這個改動涉及：

- 4 個全域 CSS 檔案重寫
- 7 個元件的 style 區塊更新
- 所有金色/發光/漸層特效移除

AI 在這種「大範圍但規則明確」的改動特別有效率。手動改大概要半天，AI 十分鐘搞定。

## AI 很強的地方

1. **重複性高的改動**：改 7 個元件的配色，規則一致時很快
2. **模板生成**：SEO meta tags、RSS feed、schema markup
3. **資料整理**：對照 Google 官方文件與既有設定
4. **除錯**：看 build error、抓 CSS 衝突

## AI 做不好的地方

1. **設計取捨**：AI 會給出四平八穩的版面，但常常塞滿不必要的功能
2. **定位與內容判斷**：要寫什麼主題、對誰說話，得自己決定
3. **長對話遺忘**：對話拉長後容易漏掉前面的限制條件
4. **過度工程**：只想要一個簡單頁面時，AI 常預設寫成一整套複雜架構

## 最後留下的體會

工具會一直換，但**決定什麼時候用、用到什麼程度、產出算不算過關**，這份[判斷力不會被取代](/articles/anthropic-radar-ai-cannot-replace/)。

用 AI 建站不是「無腦」的事。你需要：

- 清楚的架構思維（告訴 AI 做什麼）
- 品質標準（判斷 AI 的產出好不好）
- 迭代耐心（第一次不會完美，但方向對就行）

如果你同時使用 Codex，不確定日常開發、長任務或高難度推理該選哪個模型，CabAI 也整理了 [Codex 模型與 Fast Mode 的選擇建議](https://cabai.cablate.com/library/codex-model-selection-fast-mode-20260731?utm_source=cablate&utm_medium=article&utm_campaign=codex_model_selection)。
