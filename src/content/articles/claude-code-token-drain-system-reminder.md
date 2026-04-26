---
title: "我逆向了 Claude Code v2.1.71，找到 token 消耗暴增的根因"
description: "Claude Code v2.1.71 的 system-reminder 機制有個嚴重問題：每次對話都在偷偷注入被修改檔案的完整 diff。我逆向了原始碼找到根因，附上 CLI 緩解方法與 Agent SDK 的無解現況。"
publishDate: 2026-03-10T10:00:00+08:00
updatedDate: 2026-04-04
category: 技術觀點
tags: [Claude Code, token 消耗, system-reminder, Agent SDK, AI 工具, 逆向工程, readFileState]
featured: false
readingTime: 7
draft: false
excerpt: "逆向 Claude Code v2.1.71 原始碼後找到根因——system-reminder 每次都在偷偷注入 diff，吃掉你看不見的 token，Agent SDK 用戶情況更慘。"
ogImage: "/images/articles/claude-code-token-drain-system-reminder.webp"
faq:
  - question: "為什麼 Claude Code 的 token 消耗比預期快很多？"
    answer: "Claude Code 會在每次對話中透過 system-reminder 注入被編輯過的檔案 diff，這些注入不會出現在 JSONL 紀錄中，導致你以為沒有消耗多少，實際上每次對話都在吃額度。"
  - question: "Claude Code 的 readFileState 是什麼？"
    answer: "readFileState 是 Claude Code 內部的追蹤表，記錄「我知道的檔案長什麼樣」。每次你發訊息，Claude Code 會比對表中的檔案是否有變動，有的話就把 diff 注入進 system-reminder。"
  - question: "如何減少 Claude Code token 被 diff 注入消耗？"
    answer: "每次 Edit 或 Update 之後，主動做一次 Read，觸發 readFileState 的狀態更新，讓後續對話不會繼續注入同一個 diff。這個方法適用於 Claude Code CLI，Agent SDK 目前無解。"
  - question: "Agent SDK 用戶的 token 消耗問題更嚴重嗎？"
    answer: "是的。Agent SDK 的持續對話以 resume 為主，每次送訊息都會重建 readFileState，導致每次都重新注入所有追蹤中的檔案 diff，加上快取機制失效和 TTL 設定問題，情況比 CLI 用戶嚴重許多。"
  - question: "Claude Code system-reminder 注入的內容會顯示在 JSONL 裡嗎？"
    answer: "不會。這是這個問題最坑爹的地方——所有 system-reminder 注入的內容，包括完整 diff，都不會出現在 JSONL 對話紀錄中，你沒有辦法直接觀測到底注入了什麼、注入了多少。"
---

這個月 token 額度燒得特別快。

我有注意到，但一直說服自己是因為最近做的事情比較多。直到上週開始認真懷疑，仔細回想又沒多做什麼事情，才決定認真查這件事。

查完之後，我的結論是：不是你的錯覺，也不是你真的多做了多少事，是 Claude Code 的 system-reminder 在坑你。

以下分析是基於 Claude Code **v2.1.71** 的逆向結果，不同版本行為可能有差異，之後的版本可能修了，也可能沒有。

## Claude Code 的 system-reminder 究竟注入了什麼

先說我怎麼確認這件事的。

我在對話過程中要求 Claude Code 輸出當次 system-reminder 的完整內容，看看裡面塞了什麼。幾次下來觀察到幾個共同現象：

- 變更檔案的**完整 diff** 被注入進去
- 注入的內容被明確標記「不要主動告知使用者」
- Skill 和 Plugin 的 metadata 每次對話都會重新注入
- 以上所有內容，**不會出現在 JSONL 裡**，你沒辦法直接觀測

最後一點是關鍵。你以為的對話成本只有你看得到的那些，實際上每次背後還夾帶著你看不到的東西——而且 Claude 被明確要求不要主動告訴你。

結果就是：根本沒聊多少內容，但只要編輯過任何檔案，哪怕只是一句簡單的請求與回應，就直接吃掉 2%-3% 的五小時額度。

翻了一下 GitHub，這個狀況半年前就有災情了。

在反覆觀察這個行為的過程中，我注意到一個規律：

- 已知編輯過檔案的情況下，發一次訊息 → diff 被注入
- 接著先做一次 Read，再發訊息 → diff 沒有被注入

推測內部應該有個東西在管理這個狀態，但不知道為什麼在某些情況下亂掉了。於是我讓 Claude Code 去逆向 v2.1.71 的原始碼，搞清楚背後到底是什麼機制。

## 每次發訊息，Claude Code 都做了這件事：readFileState 機制

逆向出來的結果，印證了先前的猜測。

逆向出來是這樣的：Claude Code 內部有一張叫 `readFileState` 的表，記錄「我知道的每個檔案長什麼樣」。

每次你發訊息，Claude Code 會遍歷這張表裡的每個檔案，走一套判斷流程：

1. 這個檔案是「完整讀取」的嗎？→ 不是就跳過
2. 檔案的修改時間比我記錄的新嗎？→ 沒有就跳過
3. 重新讀一次，跟記錄的內容比對 → 沒差異就跳過
4. **有差異，或 Offset 沒有狀態** → 把 diff 當 system-reminder 塞進你的訊息

這裡的「Offset 狀態」是 Claude Code 用來記錄「我已經比對過這個版本了」的標記。有這個標記，後續就不會重新注入；沒有這個標記，每次都走注入流程。

到這裡邏輯看起來沒問題，有差才注入，沒差跳過。

但接著我看到建表的部分，嗅到問題了。

## Token 消耗無法收斂的根因：路徑 key 對不起來

這張追蹤表存在記憶體裡，關掉就沒了。

Resume 一段對話之後，Claude Code 會從 JSONL 把這張表還原出來。還原之後，表格裡最多有 10 筆追蹤中的檔案，但這些還原回來的記錄，都**沒有 Offset 狀態**。

沒有 Offset 狀態，回到第 4 條：觸發注入。

照理說應該是這樣的流程：Resume 後的第一句話觸發注入，注入完畢更新狀態，後續對話就正常了。消耗一次，之後沒事。

但問題在這張表是用**路徑字串當 key** 的。

只要 JSONL 裡記錄的路徑，跟實際讀取時的路徑這兩串字對不起來，追蹤表上那筆記錄永遠不會被更新成功。明明注入了，但表格認不出來，下次還是從頭來。

那就是每次都走注入流程，永遠不會停。

## 如何減少 Claude Code token 消耗（CLI 用戶）

根據 readFileState 的機制，緩解方法也就跑出來了。

**任何 Edit 或 Update 之後，主動做一次 Read**。Read 會強迫更新表的狀態，讓後續對話認為已經同步、不需要再注入了。先多燒一次 Read 的成本，但總比後續每次對話都在注入要好。

另外，**避免頻繁 Resume**。每次 Resume 都會重建這張表，觸發一輪注入。如果不需要接續之前的對話脈絡，直接開新的 Session 更划算。

最後，**整理你的 `CLAUDE.md`**。`CLAUDE.md` 和 `MEMORY.md` 這類基礎設定檔是預設永遠追蹤的，每次都在清單裡沒辦法跳過。官方後來越來越強調「CLAUDE.md 不要塞太多東西」，我現在終於理解原因了——不是設計哲學，是 token 成本。如果你在用 [Claude Code 建站或管理專案](/articles/claude-code-workflow/)，這點格外重要。

## Agent SDK 用戶的 token 問題為什麼特別嚴重

CLI 用戶至少有緩解方法，[用 Agent SDK 搭建自動化流程](/articles/blog-writing-openclaw/)的用戶是另一個等級的問題。

Agent SDK 的架構決定了持續對話必須以 Resume 為主。每次送一筆訊息進去，就是走一次 Resume——重建 readFileState、判斷哪些檔案要注入、注入、送訊息。

然後下一筆訊息，再來一次。

不管這段對話裡你讀了幾百次，每次都重建這張表，每次都觸發注入，每次都吃。Agent SDK 設計上就是拿 resume 來維持對話連續性，這個機制根本繞不過去。

這個問題目前無解。

偏偏還有兩個問題跑出來讓事情更不好看：

**快取命中失效**：照理說，相同內容反覆注入應該要命中 prompt cache 來省 token。但有回報指出 SDK 的 cache 運作不正常，反覆注入的內容根本沒有命中快取，每次都是新的費用。

**TTL 比官方文件寫的貴 50%**：SDK 執行快取的 TTL 被挖出來是 1 小時留存，比官方文件寫的 5 分鐘版本貴了約 50%。跟快取失效連動起來，是雪上加霜。

如果你是 Agent SDK 用戶，目前能做的大概只有：**主動讓 AI 輸出當前 system-reminder 中 Data Modified 的篇幅，如果太長，就重開對話**。沒有比這更好的辦法了。

## Anthropic 的回應：GitHub issue 半年了還沒動靜

GitHub 上的相關 issue 已經存在半年了。

目前看起來官方是一副「誰理你」的樣子。

我自己是 Agent SDK 的用戶，這個問題對我的影響直接。研究完這些之後，大概得自己去動 source code 來緩解，等官方修是等不住的。

如果你用 Claude Code 有遇到類似的額度問題，或是對 system-reminder 的注入機制有更多觀察，歡迎留言。
