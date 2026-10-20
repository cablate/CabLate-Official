---
title: "想在 Claude Code 混用 Gemini 與 GLM，為什麼一改設定檔就全亂套？"
description: "手上有 Claude、Gemini、GLM、DeepSeek 多家額度，直接改 settings.json 卻會把所有視窗一起換掉。拆解如何用開源外掛 model-relay 搭配 magpie 單視窗秒切模型、免寫設定檔直接指派各家子代理，並保留 Artifact 與 Chrome 工具。"
publishDate: 2026-10-20T15:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "model-relay", "Subagent", "Multi-Model", "Agent Engineering"]
readingTime: 6
draft: false
excerpt: "手上有 Claude、Gemini、GLM、DeepSeek 好幾家額度，想放進 Claude Code 混著用，一改 settings.json 卻把所有開著的視窗全部換掉。這篇拆解我們如何用開源外掛 model-relay 搭配 magpie，做到單視窗熱切換、免寫檔直接指派各家模型當子代理，同時保住 Artifact、Chrome 與手機遙控。"
problemTag: "改設定檔換模型卻把所有視窗全換掉"
ogHighlight:
  label: "多模型切換與派工"
  before: "改全域設定＋手寫 Agent 檔"
  after: "單視窗熱切＋自動註冊子代理"
---

重度用 Claude Code 寫程式的人，手上通常不只一家模型的額度：除了 Claude 訂閱之外，多半還備著 Gemini、GLM 或 DeepSeek 的 API，再搭配 `magpie` 這類本機入口服務。

原本的想法很單純：架構決策交給主線模型，前端掃描、讀大檔案或跑批次測試就切給其他模型分擔。但只要你動手去改 `~/.claude/settings.json`，馬上就會發現所有開著的終端機視窗全部跟著被換掉；想派別家模型當子代理，又得手寫一堆設定檔並重開對話。為了不再每天手改設定，我把這套分流機制整理成開源外掛 **`model-relay`**。

---

## 為什麼改 settings.json 會把所有視窗一起拖下水？

**因為 `~/.claude/settings.json` 是所有終端機共用的全域設定，而 Claude Code 預設沒有「只切換單一視窗」與「動態掛載外廠子代理」的路由層。**

直接看下面這張同屏對照，就能看出「手改全域設定檔」跟「用 `model-relay` 搭配 `magpie` 分流」的差異：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="relayCompareTitle">
      <title id="relayCompareTitle">傳統修改全域 settings.json 與使用 model-relay 搭配 magpie 的同屏工作流對照</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">同樣想在 Claude Code 混用多家模型：全域硬改 vs 本機分流工作台</text>
      <text x="24" y="58" font-size="12.5" font-weight="700" fill="#b4352f">❌ 傳統做法：手改全域 settings.json ＋ 手寫 .claude/agents/*.md（全視窗陪葬、需重開對話）</text>
      <rect x="24" y="70" width="180" height="62" rx="6" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="114" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">改全域 settings.json</text>
      <text x="114" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">所有視窗共用同一份設定</text>
      <path d="M204 101 H242" stroke="#b4352f" stroke-width="2" fill="none"/>
      <polygon points="242,96 250,101 242,106" fill="#b4352f"/>
      <rect x="250" y="70" width="260" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="380" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">視窗 1、視窗 2、視窗 3 全部被換掉</text>
      <text x="380" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">隔壁正在跑的長對話跟著中斷或換腦</text>
      <rect x="526" y="70" width="210" height="62" rx="6" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
      <text x="631" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">派子代理需手寫設定檔</text>
      <text x="631" y="116" text-anchor="middle" font-size="11.5" fill="#5f687a">每加一家都要建檔並重開對話</text>
      <line x1="24" y1="154" x2="736" y2="154" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="180" font-size="12.5" font-weight="700" fill="#26734f">✅ model-relay ＋ magpie：單視窗獨立切換、接進來自動變子代理、官方三大神器全保留</text>
      <rect x="24" y="192" width="180" height="72" rx="6" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="114" y="218" text-anchor="middle" font-size="13" font-weight="700" fill="#6248c8">輸入框上方 /provider</text>
      <text x="114" y="238" text-anchor="middle" font-size="11.5" fill="#253047">按熱鍵 1~9 只切當前視窗</text>
      <text x="114" y="254" text-anchor="middle" font-size="11.5" fill="#5f687a">其他視窗照跑原本任務</text>
      <path d="M204 228 H242" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="242,223 250,228 242,233" fill="#6248c8"/>
      <rect x="250" y="192" width="236" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="368" y="218" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">model-relay ↔ 本機 magpie</text>
      <text x="368" y="238" text-anchor="middle" font-size="11.5" fill="#253047">收攏 Claude / Gemini / GLM / DeepSeek</text>
      <text x="368" y="254" text-anchor="middle" font-size="11.5" fill="#26734f">自動註冊為可派子代理（免寫檔）</text>
      <path d="M486 228 H520" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="520,223 528,228 520,233" fill="#26734f"/>
      <rect x="528" y="192" width="208" height="72" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="632" y="218" text-anchor="middle" font-size="13" font-weight="700" fill="#26734f">官方原生工具照常運作</text>
      <text x="632" y="238" text-anchor="middle" font-size="11.5" fill="#253047">✓ Artifact ✓ Chrome 操控</text>
      <text x="632" y="254" text-anchor="middle" font-size="11.5" fill="#26734f">✓ 手機 Remote Control 並存</text>
      <text x="24" y="294" font-size="12" fill="#5f687a">💡 本機 magpie 若連接埠未開，model-relay 還能透過 launch 設定在背景自動幫你拉起，開終端機就能直接用。</text>
    </svg>
  </div>
  <figcaption>上方是直接改全域設定檔的連鎖副作用；下方透過 model-relay 依對話 Session ID 獨立路由，單視窗切換與子代理派工互不干擾。</figcaption>
</figure>

因為 `model-relay` 在本機（`127.0.0.1:8950`）會認得每個對話視窗自己的 `x-claude-code-session-id`，當你在對話裡打 `/provider` 叫出輸入框上方的互動面板、按下熱鍵 `1–9` 切去 `GLM` 或 `Gemini` 時，它只會把**眼前這一個視窗**固定到該模型，隔壁視窗完全不受影響。

---

## 怎麼不用寫設定檔，就把別家模型直接當成子代理派出去？

**只要把模型接進 `model-relay`，外掛會在執行期自動幫每一家註冊專屬的 `model-relay:<名稱>` 子代理型別，並繼承主線的全套工具。**

以前想在同一個任務裡混用不同模型，最煩的就是維護一堆靜態設定檔。現在我們把「切換與派工」拆成三個互不打架的層級，讓你可以像調度團隊一樣把各家 Token 額度榨到最滿：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 280" role="img" aria-labelledby="subagentDispatchTitle">
      <title id="subagentDispatchTitle">用 model-relay 混搭主線、各家子代理與 haiku 別名分流的三層調度圖</title>
      <rect x="0" y="0" width="760" height="280" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">把各家 Token 資源榨乾的三層調度：主線控場 ＋ 點名派子代理 ＋ 日常雜活自動分流</text>
      <rect x="24" y="86" width="190" height="116" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="119" y="118" text-anchor="middle" font-size="14" font-weight="700" fill="#6248c8">① 當前對話主線</text>
      <text x="119" y="142" text-anchor="middle" font-size="12" fill="#253047">用 /provider 隨切隨用</text>
      <text x="119" y="164" text-anchor="middle" font-size="11.5" fill="#5f687a">負責架構判斷與最終整合</text>
      <text x="119" y="184" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8" style="font-family:var(--font-mono)">Claude / Gemini / GLM</text>
      <path d="M214 106 H292" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="292,101 300,106 292,111" fill="#6248c8"/>
      <text x="256" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">點名派工</text>
      <rect x="300" y="52" width="436" height="68" rx="8" fill="#f1edff" stroke="#b8afc9" stroke-width="1.5"/>
      <text x="318" y="78" font-size="13.5" font-weight="700" fill="#6248c8">② 動態子代理：model-relay:gemini / deepseek / glm</text>
      <text x="318" y="102" font-size="12" fill="#253047">免寫 .claude/agents/*.md、免重開，繼承全套工具平行掃前端、查邏輯</text>
      <path d="M214 176 H292" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="292,171 300,176 292,181" fill="#26734f"/>
      <text x="256" y="166" text-anchor="middle" font-size="11.5" font-weight="700" fill="#26734f">自動轉彎</text>
      <rect x="300" y="140" width="436" height="68" rx="8" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="318" y="166" font-size="13.5" font-weight="700" fill="#26734f">③ 別名自動分流：/provider alias haiku glm</text>
      <text x="318" y="190" font-size="12" fill="#253047">把高頻率的讀檔、搜尋與摘要雜活，全交給百萬上下文的高性價比模型</text>
      <rect x="24" y="224" width="712" height="38" rx="6" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="380" y="248" text-anchor="middle" font-size="12" font-weight="700" fill="#253047">🛡️ 雙重防呆：子代理啟動與結束時自動核對實際模型，若被 settings.json 的 availableModels 白名單偷換會立即警告</text>
    </svg>
  </div>
  <figcaption>主線可隨時用 `/provider` 切換，底下同時支援點名派出 `model-relay:<名稱>` 子代理，或用 `alias` 把預設 `haiku` 雜活導給百萬上下文模型。</figcaption>
</figure>

這裡有一個我們自己踩過才補上的細節：如果使用者的 `settings.json` 設了 `availableModels` 白名單，卻忘了把外廠模型名字列進去，Claude Code 會在底下偷偷把子代理換回主線模型，表面上完全看不出來。所以我們在 `model-relay` 加了雙重核對，子代理啟動時看回報模型、結束時看轉發站實際收到的請求，只要不一致就立刻跳出提示，叫你跑 `/provider doctor` 一鍵抓出來。

---

## 換成跑 GLM 或 Gemini 之後，為什麼 Artifact、Chrome 跟手機遙控還能照常開？

**因為 `model-relay` 會在轉發時自動幫第三方端點清洗不支援的欄位，並提供不改動官方 API 位址的本機 HTTPS 代理模式。**

很多人不敢在 Claude Code 切去別家模型，是怕一換過去就變成「半殘版」。我們搭配 `magpie` 實測時特別把三個最常壞掉的地方補齊了：

| 以前換模型常壞掉的地方 | 為什麼會壞 | `model-relay` 怎麼保住它 |
|---|---|---|
| **工具整批消失或報 HTTP 400** | 第三方端點或轉接層看不懂 Claude Code 的 `ToolSearch` 與 `cache_control` 標記 | 內建供應商預設集（`/provider setup` 自動帶入），送出前自動洗掉不支援欄位 |
| **Claude Artifact 與 Chrome 自動化** | 以為換了模型就用不到官方外掛與 MCP 工具 | 工具呼叫仍由 Claude Code 宿主執行，切到 GLM 或 Gemini 照樣能開 Artifact 與操控 Chrome 分頁 |
| **手機 Remote Control 拒絕啟動** | 官方限制只有 API 位址是 `api.anthropic.com` 時才准開手機遙控 | 打 `/provider rc on`（或按面板熱鍵 `x`）開啟本機代理模式：位址維持官方不變，憑證私鑰簽完即毀、不碰系統憑證庫 |

---

## 現在怎麼裝起來、讓 AI 帶你一次設定好？

不用自己翻文件手改 JSON，也不用把 API 金鑰貼進對話框。先在終端機把你手上的金鑰設進環境變數（或開好本機 `magpie`），接著跑這兩行安裝外掛：

```bash
claude plugin marketplace add cablate/model-relay
claude plugin install model-relay@model-relay
```

裝好後打開 Claude Code，直接輸入下面這三個指令就能上手：

```text
/provider setup                  # 讓 Claude 帶你新增供應商或設定 haiku 別名分流（改設定前會先預覽）
/provider doctor --ping          # 檢查設定並送出 1-token 請求，實測每家模型的首字反應速度
/provider                        # 在輸入框上方開啟互動控制面板（熱鍵 1-9 切換單一視窗、p 測速）
```

開源專案與完整中英文說明都在 GitHub（[`cablate/model-relay`](https://github.com/cablate/model-relay)）。如果你想看怎麼把省下來的額度搭配三層 Skill 與子代理分工，可以接著讀〈[寫了 Skill 卻死都不觸發？拆解 CLAUDE.md、Skill 與 MCP 的分工](/articles/claude-code-skill-vs-claude-md-and-mcp/)〉與〈[逆向 Claude Agent SDK：找出每則訊息 2-3% 額度消耗的根因與解法](/articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/)〉；也可以先用[免費的 AI 工作流五層健檢](/expertise/)看看你目前的開發配置還卡在哪一層。
