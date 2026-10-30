---
title: "Claude Code 額度燒太快？我從重複出現的檔案 diff 查起"
description: "2026 年 3 月，我察覺簡短對話仍耗掉大量額度，逆向 Claude Code v2.1.71 追到 system-reminder 與 readFileState。保留當時的異常觀察，也說明今天排查時哪些證據才足夠。"
publishDate: 2026-03-10T10:00:00+08:00
updatedDate: 2026-10-29
category: 技術觀點
tags: [Claude Code, token 消耗, system-reminder, Agent SDK, AI 工具, 逆向工程, readFileState]
readingTime: 6
draft: false
excerpt: "我原本以為只是最近做太多，直到短訊息也持續吃額度，才開始查畫面以外的輸入。這是 Claude Code v2.1.71 的歷史排查紀錄。"
ogImage: "/images/articles/claude-code-token-drain-system-reminder.webp"
problemTag: "短訊息仍持續大量耗額度"
ogHighlight:
  label: "v2.1.71 歷史觀察"
  before: "編輯後反覆看見 diff"
  after: "用對照觀察縮小範圍"
---

2026 年 3 月，我發現 Claude Code 的 token 額度燒得特別快。一開始還說服自己只是最近做的事比較多，直到回想那週根本沒多做甚麼，才發覺不對勁，因為編輯檔案之後，就算只送一句簡單請求，也會吃掉 2–3% 的五小時額度。

後來我逆向 Claude Code v2.1.71，抓到檔案 diff 重複塞進請求的線索，也才開始追查**畫面上那一句話以外，執行環境到底還送了哪些東西**。

> 這是 2026 年 3 月、Claude Code v2.1.71 時的排查紀錄；2–3% 是我當時訂閱方案的五小時額度。

## 我怎麼察覺請求裡多了內容？

**先請模型回述 system-reminder 當線索，再比對操作前後的差異。**

當時我請 Claude Code 回述收到的 system-reminder，幾次下來，看到修改檔案的 diff，以及 Skill、Plugin 等資訊，有些模板還寫著不要主動向使用者提起。這很容易讓人火大，畫面上沒聊幾句，背後卻可能塞了大段我沒算進去的內容。

為了確認，我改用兩次操作對照：

| 當時操作 | 我的觀察 |
|---|---|
| 編輯過檔案，再送訊息 | 看見檔案 diff 注入 |
| 補做一次 Read，再送訊息 | 那次沒再看見相同 diff |

這讓我懷疑系統追蹤檔案的狀態出了問題。於是我逆向 v2.1.71，追到負責這件事的 `readFileState`。

## readFileState 在追蹤甚麼？

**它記錄執行環境讀過的檔案內容，用來比對磁碟上的檔案後來有沒有改過。**

逆向看到的流程，是拿記錄裡的檔案去比對修改時間，必要時重讀、算出差異，再把變動塞給模型。這機制原本是為了讓 AI 知道人或其他程式有沒有在外部改過檔案，問題出在狀態有沒有跟著更新。

當對話 resume 時，部分檔案追蹤狀態會從 JSONL 重建，未必跟持續運作中的記憶體狀態一致。當時逆向也懷疑過路徑字串對不起來會卡住更新。**看到重複 diff，就值得順著檔案追蹤與 resume 狀態往下查**。

## 那每次 Edit 後都 Read，可以省嗎？

**當時補讀確實少看過 diff，但現在不適合當成每次必做。**

Read 本身會把檔案內容帶進上下文，大檔案每改一次就重讀，反而可能增加消耗；況且工具版本與狀態更新機制變了以後，多讀這一次未必還有原來的用途。

如果你懷疑遇到相同問題，可以先拿小檔案，在同一個 session 記下修改後幾輪的用量，再補讀一次看是否恢復。只有結果支持這個方向，才值得繼續追。

同理，也別只為了省額度就關掉對話重開。新對話雖少帶歷史，卻會失去原本的脈絡；resume 也可能因快取過期或輸入變動而重算大量內容。要比較的是完成同一件工作的總消耗；若改用 SDK 串接，情況又不同。

## SDK 用戶也只能一直補 Read 嗎？

**不一定，要先看你的程式怎麼維持多輪對話。**

我當時的 SDK 程式每則訊息重新呼叫 `query()` 並 resume，每輪又走到狀態重建，CLI 觀察到的緩解方式搬過去未必成立。

後來我先改 JSONL 擋住部分 diff 注入（見〈[Agent SDK 的 diff 注入怎麼繞過：逆向 C26 函數與 JSONL 預處理](/articles/agent-sdk-system-reminder-diff-fix/)〉），仍沒量到期待的快取改善；再換當時的 V2 常駐 session，數字才明顯變化。這段失敗很能說明，**找到一個異常機制，還不等於找到了全部成本**。

2026-10-29 查閱 [官方 SDK 文件](https://code.claude.com/docs/en/agent-sdk/typescript-v2-preview)，V2 已在 0.3.142 移除，官方建議 `query()` 的串流輸入或 `options.resume`，原文的「SDK 無解」已不適合留作現況判斷。相關問題可接著看〈[Claude Code 實戰：我怎麼用 AI 寫完一整個網站](/articles/claude-code-workflow/)〉與〈[你可能不需要龍蝦：自動化跟 Agent 是兩件事](/articles/blog-writing-openclaw/)〉；若要把本文判準用在自己的工作，可參考[課程與工程手冊](/courses/)的適用範圍。

## 遇到額度突然變重，先留下哪幾個證據？

**留下版本、前後操作，以及連續幾輪的實際用量。**

下次覺得額度掉得不尋常，先從這三項留底：

1. 記下 CLI／SDK 版本、模型和對話長度，標出剛才是否修改檔案、resume、切換工具或長時間閒置。
2. 有明細就記錄普通輸入、建立快取、讀取快取和輸出；只有訂閱百分比就記百分比，別換算成 API 費用。
3. 一次只改一個條件，再看後續幾輪是否下降，別讓「剛好變好了」直接變成根因證明。

回頭看，最初懷疑「是不是自己做太多」很合理；只是多了證據，才能把使用量、系統附加內容和快取分開看。想看這條線索最後怎麼被數據修正，接著看〈[Agent SDK 每句吃 2–3% 額度：我怎麼從失敗修法追到快取問題](/articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/)〉，那篇保留了擋掉可疑來源後仍沒改善的實驗。
