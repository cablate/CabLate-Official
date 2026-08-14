---
title: "OpenClaw 讓 AI Agent 重新受到注意：五層架構其實早就存在"
description: "李宏毅教授用 OpenClaw 拆解 AI Agent 的五層架構；我把每一層對照到自己做過的實作，說明哪些是既有概念、哪些只是新的包裝。"
publishDate: 2026-03-10T18:00:00+08:00
updatedDate: 2026-04-04
category: 技術觀點
tags: [OpenClaw, AI Agent, Claude Code, MCP, Agent 架構, 李宏毅]
featured: false
readingTime: 6
draft: false
excerpt: "OpenClaw 的五層架構我一年前就做過。不是新技術，是舊觀念被講清楚了。你該學的是 Agent，不是龍蝦。"
ogImage: "/images/articles/openclaw-agent-fundamentals.webp"
faq:
  - question: "OpenClaw 是什麼新技術嗎？"
    answer: "不是。OpenClaw 的底層架構（身份注入、工具調用、記憶系統、Context 壓縮、自主排程）都是 AI Agent 領域一年多前就存在的成熟概念，只是被包裝成一個開源專案後才被廣泛關注。"
  - question: "AI Agent 真的有智慧嗎？"
    answer: "沒有。語言模型唯一的功能是預測下一個 Token。所有看起來像智慧的表現，包括記得你的偏好、主動執行任務、有個性，都是外層系統的設計，不是模型本身更聰明。"
  - question: "想用 OpenClaw 做東西，應該先學什麼？"
    answer: "先學 Agent 的底層概念：System Prompt 怎麼組裝身份、工具調用的運作原理、記憶系統的設計、Context Window 的限制與壓縮策略。搞懂這些，你用什麼框架都能上手。"
  - question: "OpenClaw 跟自己搭建 Agent 有什麼差別？"
    answer: "本質上沒有差別。OpenClaw 把 System Prompt 管理、工具調用、記憶讀寫、Context 壓縮等功能包裝成開箱即用的介面，但底層做的事情跟你自己用 API 搭建的 Agent 是一樣的。"
  - question: "AI Agent 的五層架構是什麼？"
    answer: "李宏毅教授歸納的五層架構：身份注入（System Prompt 組裝人設與規則）、工具調用（語言模型輸出指令由外層系統執行）、記憶系統（短期靠對話歷史，長期寫入檔案）、Context 壓縮（修剪與摘要過長對話）、自主排程（Heartbeat 定時喚醒）。這些概念不是 OpenClaw 獨有的，是所有 Agent 框架共通的底層原理。"
---

OpenClaw 爆火的時候，我的反應不是興奮，是略為不解。

不是說這個專案不好，它把很多概念整合得很完整，社群也經營得不錯。但很多人把它當作「此時此刻的新技術」在追，這讓我有點困惑。

因為這些東西不是新的。

## 我為什麼覺得 OpenClaw 不是新東西

在 ChatGPT 推出 Deep Research 之前，我就自己做過一個 Deep Research。用語言模型拆解問題、呼叫搜尋工具、整合結果、再讓模型歸納，整個流程跟現在大家在講的 Agent 架構一模一樣。

後來 MCP 出來之後，我基於同樣的原理做了一套多代理架構的 Telegram Bot，叫 ClaudeCab。裡面有秘書、有寫手、有工程師，每個 Agent 有自己的人設、自己的工具、自己的記憶，這套系統到現在還在跑。

所以當我看到 OpenClaw 的架構介紹，第一個想法是：「這不就是我在做的東西嗎？」

## 李宏毅把底層講清楚了

最近李宏毅教授出了一支[影片](https://youtu.be/2rcJdFuNbZQ?si=ZYmGUdN8jHn3ZM11)，用 OpenClaw 當解剖對象，把 AI Agent 的運作原理從底層講了一遍。他歸納出五層架構：

1. **身份注入**：每次對話前組裝 System Prompt，包含人設、記憶、行為規則
2. **工具調用**：語言模型輸出特定格式的文字，外層系統偵測到後執行動作
3. **記憶系統**：短期記憶靠對話歷史，長期記憶寫進檔案每次重讀
4. **Context 壓縮**：對話太長就修剪、摘要，但 System Prompt 永遠不壓縮
5. **自主排程**：用 Heartbeat 定時喚醒，讓語言模型看起來能「主動行動」

影片講得很清楚，推薦想理解 Agent 的人去看。但我想補一個影片沒有強調的角度。

## 這些 Agent 架構從頭到尾沒有變過

我一年多前做的東西，跟影片裡拆解的五層架構一模一樣。身份注入、工具調用、記憶讀寫、Context 管理、排程喚醒，全部都有，做法也幾乎一樣。

那變了什麼？模型更聰明了，工具鏈更方便了，MCP 讓工具管理標準化了，向量資料庫讓記憶檢索更精準了。但這些都是「讓整體管理更輕鬆」的改善，不是架構層面的突破。

從手排車到自排車，駕駛體驗差很多，但引擎原理沒有變。OpenClaw 就是一台包裝好的自排車，好開，但它沒有重新發明引擎。

## AI Agent 不是真的有智慧

影片裡有一個觀點我非常同意：**AI Agent 不是真的有智慧，它是一套精心設計的「文字把戲」。**

語言模型唯一的功能就是給一段不完整的文字，預測下一個 Token。它沒有記憶，不會主動行動，也無法執行系統操作。你覺得它記得你的偏好？那是因為每次對話前系統都把你的偏好重新塞進去了。你覺得它在你睡覺的時候還在工作？那是排程器定時把它叫醒的。

「AI 越來越懂你」的真相是：你可以讓 AI 把你這個人分析成一段文字，你的偏好、說話方式、決策邏輯，全部寫進一份檔案，然後每次對話前系統把這份檔案塞給語言模型。它不是真的懂你，它是每次都重新讀一遍「你是誰」。

李宏毅用了一個很到位的比喻：電影《我的失憶女友》。女友每天記憶重啟，靠日記維持關係。Agent 的 `memory.md` 就是那本日記。

這就是 OpenClaw 在做的事，也是我在 ClaudeCab 裡做的事，也是任何 Agent 框架在做的事。差別不在框架，在你對這套機制理解多深。

## 你要搞懂的不是龍蝦，是 Agent

這是我最想講的事。

如果你今天想用 OpenClaw 做任何東西，你要搞懂的不是 OpenClaw 的介面怎麼操作，而是 Agent 的底層邏輯：System Prompt 怎麼組裝、工具調用怎麼運作、記憶放在哪裡才不會被壓縮掉、Context Window 滿了怎麼辦。

搞懂這些，你用 OpenClaw 可以，用 [Claude Code 搭工作流](/articles/claude-code-workflow/)也可以，自己從 API 寫一個也可以。搞不懂這些，換什麼框架都會遇到一樣的問題。

我之前寫過一篇[自動化跟 Agent 的差別](/articles/blog-writing-openclaw/)，很多人對龍蝦的需求其實只是自動化，根本不需要 Agent 框架，這件事到現在沒有變。

## 不是 OpenClaw 不好，是方向要對

我不是在說 OpenClaw 不值得用，它把很多繁瑣的事情包裝好了，降低了入門門檻，這很有價值。

但如果你只是跟著潮流裝了一個龍蝦，不理解它底下在做什麼，那你遇到問題的時候不會排查，想客製化的時候不知道改哪裡，別的框架出來的時候又要重新學一次。

李宏毅在影片裡給了一個排查順序，我覺得很實用：

1. System Prompt 有沒有正確組裝？
2. 工具的說明有沒有在 Prompt 裡？
3. 關鍵指令有沒有寫進 `memory.md`？
4. Context 有沒有被壓縮掉重要內容？

這四步跟你用什麼框架無關，它測試的是你對 Agent 運作原理的理解程度。

下一個爆火的框架一定會來。到時候你是又要從頭學一次，還是看一眼就知道它在做什麼，取決於你現在花時間搞懂的是工具還是概念。

如果你想繼續思考 Agent 不只「做任務」，還能怎麼替人持續接收、整理與重新使用內容，可以接著看 CabAI 的公開文章：[未來追蹤一個創作者，可能不再需要你一直回來找他](https://cabai.cablate.com/library/creator-agent-information-channel?utm_source=cablate&utm_medium=article&utm_campaign=creator_agent_channel)。
