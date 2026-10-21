---
title: "寫了 Skill 卻死都不觸發？拆解 CLAUDE.md、Skill 與 MCP 的分工"
description: "把所有規則塞進 CLAUDE.md 只會每輪白燒 Token；寫了 SKILL.md 卻不觸發，是因為 Claude 預設 untriggering。拆解 CLAUDE.md、AgentSkill 與 MCP 的漸進式揭露機制與 10 秒判斷標準。"
publishDate: 2026-10-19T14:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "AgentSkill", "CLAUDE.md", "MCP", "Context Engineering"]
readingTime: 6
draft: false
excerpt: "把所有規則塞進 CLAUDE.md 會讓每輪對話都在燒 Token；把規則搬去 SKILL.md 卻常常不會觸發。這篇從 Claude 預設的 untriggering 機制出發，拆解 CLAUDE.md、Skill 與 MCP 各自該放什麼，以及怎麼寫出百發百中的觸發條件。"
problemTag: "規則全塞 CLAUDE.md 一直燒額度"
ogHighlight:
  label: "常駐 Context 消耗"
  before: "全塞 CLAUDE.md（每輪 4,500+）"
  after: "三道閘門漸進載入（約 100）"
---

用 Claude Code 一段時間之後，幾乎每個人都會踩進同一個坑：每次 AI 犯了一個錯，你就在 `CLAUDE.md` 加一條規定。

過了兩個月，整份檔案塞滿了寫作排版、API 錯誤處理、Git 格式與資料庫命名，膨脹到好幾千字。這時兩件事會同時發生：第一，就算你只是請它把按鈕間距調大 `4px`，額度也掉得特別快；第二，規則明明寫在裡面，它卻越來越常漏看。

於是你聽說可以把不同任務的 SOP 拆進 `.claude/skills/` 底下的 `SKILL.md`。你花了一個下午把規則分門別類搬進五個資料夾，結果打開新對話怎麼問，**Claude 從頭到尾連一次都沒有主動載入過你的 Skill**。

---

## 明明把規則寫進 SKILL.md 了，為什麼 Claude 當作沒看到？

**因為 Claude 在決定要不要載入 Skill 時，根本看不到 `SKILL.md` 的正文，只看得到頂部短短幾行的 `description`。**

如果把每一次對話想像成一個**固定容量的 Context 預算籃**，`CLAUDE.md` 是每輪對話無條件整包倒進籃子的常駐底線；而 `Skill` 為了幫你省額度，中間設了三道載入閘門。

直接看下面這張比例圖，就能一眼看出「把規則全塞進 `CLAUDE.md`」跟「用三道閘門漸進載入」在每一輪對話裡的空間差距：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="contextGateTitle">
      <title id="contextGateTitle">全塞 CLAUDE.md 與 Skill 三道閘門漸進載入的 Context 佔用比例對比</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">情境：你只請 AI「把按鈕間距調大 4px」，看單輪 Context 預算籃被塞進什麼</text>
      <text x="24" y="60" font-size="12.5" font-weight="700" fill="#b4352f">❌ 做法 A：所有 SOP 全塞 CLAUDE.md（無閘門，每輪先扣 4,500+ tokens）</text>
      <rect x="24" y="72" width="712" height="58" rx="6" fill="#f8f5ed" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="24" y="72" width="96" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="72" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">專案底線</text>
      <text x="72" y="116" text-anchor="middle" font-size="11.5" fill="#26734f" style="font-family:var(--font-mono)">300 tok</text>
      <rect x="120" y="72" width="440" height="58" rx="0" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="340" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">無關規定每輪照常塞入（寫作規範 + DB 遷移 + 金流驗簽）</text>
      <text x="340" y="116" text-anchor="middle" font-size="11.5" fill="#b4352f" style="font-family:var(--font-mono)">白燒 4,200+ tokens / 輪（稀釋注意力）</text>
      <text x="648" y="106" text-anchor="middle" font-size="12" fill="#5f687a">剩餘對話空間</text>
      <line x1="24" y1="154" x2="736" y2="154" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="180" font-size="12.5" font-weight="700" fill="#26734f">✅ 做法 B：CLAUDE.md 只留底線 ＋ Skill 三道閘門（平時僅佔 ~400 tokens，省下 90%）</text>
      <rect x="24" y="192" width="296" height="58" rx="6" fill="#f8f5ed" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="24" y="192" width="72" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="60" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">底線</text>
      <text x="60" y="236" text-anchor="middle" font-size="11.5" fill="#26734f" style="font-family:var(--font-mono)">300</text>
      <rect x="96" y="192" width="64" height="58" rx="0" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="128" y="218" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">L1 索引</text>
      <text x="128" y="236" text-anchor="middle" font-size="11.5" fill="#6248c8" style="font-family:var(--font-mono)">~100</text>
      <text x="240" y="226" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">改 CSS 停在這裡</text>
      <path d="M320 221 H410" stroke="#6248c8" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
      <polygon points="410,216 418,221 410,226" fill="#6248c8"/>
      <text x="369" y="210" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">對上暗號才開</text>
      <rect x="418" y="192" width="146" height="58" rx="6" fill="#f1edff" stroke="#b8afc9" stroke-width="1.5"/>
      <text x="491" y="216" text-anchor="middle" font-size="12.5" font-weight="700" fill="#6248c8">L2：SKILL.md 正文</text>
      <text x="491" y="236" text-anchor="middle" font-size="11.5" fill="#5f687a" style="font-family:var(--font-mono)">800~2,000 tok</text>
      <path d="M564 221 H598" stroke="#26734f" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
      <polygon points="598,216 606,221 598,226" fill="#26734f"/>
      <rect x="606" y="192" width="130" height="58" rx="6" fill="#eef7f1" stroke="#aed7be" stroke-width="1.5"/>
      <text x="671" y="216" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">L3：references/</text>
      <text x="671" y="236" text-anchor="middle" font-size="11.5" fill="#5f687a">畫圖才讀色票</text>
      <text x="24" y="284" font-size="12" fill="#5f687a">⚠️ 為什麼你的 Skill 不觸發？因為 Claude 卡在「L1 索引 → L2 正文」那道虛線門：只要 description 太籠統，它就直接略過。</text>
    </svg>
  </div>
  <figcaption>上方長條直接反映每輪扣除的 Context 比例：拆進 Skill 後，平時只載入極薄的 L1 索引；但也因為 AI 先看 L1 才決定開不開門，description 寫太模糊就會永遠打不開 L2。</figcaption>
</figure>

問題就出在圖中 **L1 跳 L2 的那道虛線門**。Claude 預設有「能不觸發就不觸發（untriggering）」的省成本門檻：只要你的 `description` 寫得像「協助檢查程式碼品質」或「處理文件整理」這種籠統介紹，模型會覺得靠它內建能力就能應付，特地讀 `SKILL.md` 反而浪費額度，於是直接略過。

---

## 那 CLAUDE.md、Skill 跟 MCP 到底怎麼分工？

回到同一個 Context 預算籃，這三樣東西管的是完全不同的層次，收費方式也截然不同：

| 機制 | 在預算籃裡的角色 | 何時扣額度 | 只放什麼 |
|---|---|---|---|
| **`CLAUDE.md`** | **每輪必守的全域底線** | 每一輪對話固定全量扣除 | 專案目錄結構、常用測試指令、不可違反的安全紅線 |
| **`AgentSkill`** | **抽屜裡的任務手冊** | 平時只扣 `~100 tokens` 索引；命中才讀正文 | 特定任務的 SOP、檢查清單與 `references/` 範例 |
| **`MCP Server`** | **接外部系統的硬體插座** | 啟動時將整排工具與 JSON 參數一次塞入 | 真正需要連線的外部服務（如查資料庫、讀行事曆） |

看懂這張表，就能順手避開兩個最常見的錢坑：

第一是**一口氣掛了十幾個 MCP Server**。多數 MCP 工具沒有像 Skill 那樣的三層漸進載入，每多開一個包含二、三十支 API 的 MCP，啟動時就會把整串工具定義全塞進預算籃（底層計算方式見〈[逆向 Claude Agent SDK：找出每則訊息 2-3% 額度消耗的根因與解法](/articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/)〉），工具一多還會讓模型亂呼叫。

第二是**以為 Skill 平時只佔 100 tokens 就狂裝五、六十支**。我們實測裝入 63 支 Skill 的大型套件時發現，所有 Skill 的 L1 索引共用約 `15,000 字元`的系統上限；一旦超標，**排在後面的 18 支 Skill 連 L1 `description` 都會被靜默截斷，永遠不會自動觸發**。

---

## 怎麼在十秒內決定：一條規則該放哪裡？

不要問這件事「每天用不用得到」，要問：**「下次再遇到這件事，我還想不想重講一遍？」** 順著下面三個問題走，十秒鐘就能分流：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="decisionTreeTitle">
      <title id="decisionTreeTitle">十秒判斷一條需求該放對話、MCP、CLAUDE.md 還是 AgentSkill 的決策樹</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="20" y="24" width="210" height="50" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="125" y="54" text-anchor="middle" font-size="13.5" font-weight="700" fill="#6248c8">Q1：下次還會遇到嗎？</text>
      <path d="M230 49 H330" stroke="#9b6017" stroke-width="2" fill="none"/>
      <polygon points="330,44 338,49 330,54" fill="#9b6017"/>
      <text x="280" y="40" text-anchor="middle" font-size="11.5" font-weight="700" fill="#9b6017">單次任務</text>
      <rect x="338" y="24" width="398" height="50" rx="8" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="356" y="54" font-size="13.5" font-weight="700" fill="#9b6017">直接留在當下對話講（做完就丟，不塞設定檔）</text>
      <path d="M125 74 V110" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="120,110 125,118 130,110" fill="#6248c8"/>
      <text x="166" y="98" font-size="11.5" font-weight="700" fill="#6248c8">會重複遇到</text>
      <rect x="20" y="118" width="210" height="50" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="125" y="148" text-anchor="middle" font-size="13.5" font-weight="700" fill="#6248c8">Q2：缺連線還是缺做法？</text>
      <path d="M230 143 H330" stroke="#5f687a" stroke-width="2" fill="none"/>
      <polygon points="330,138 338,143 330,148" fill="#5f687a"/>
      <text x="280" y="134" text-anchor="middle" font-size="11.5" font-weight="700" fill="#253047">缺外部連線</text>
      <rect x="338" y="118" width="398" height="50" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="356" y="148" font-size="13.5" font-weight="700" fill="#253047">開對應的 MCP Server 或本地 CLI 腳本（用完即關）</text>
      <path d="M125 168 V204" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="120,204 125,212 130,204" fill="#6248c8"/>
      <text x="166" y="192" font-size="11.5" font-weight="700" fill="#6248c8">缺做事步驟</text>
      <rect x="20" y="212" width="210" height="72" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="125" y="253" text-anchor="middle" font-size="13.5" font-weight="700" fill="#6248c8">Q3：每輪必守或特定任務？</text>
      <path d="M230 230 H330" stroke="#26734f" stroke-width="2" fill="none"/>
      <polygon points="330,225 338,230 330,235" fill="#26734f"/>
      <text x="280" y="222" text-anchor="middle" font-size="11.5" font-weight="700" fill="#26734f">每輪必守</text>
      <rect x="338" y="196" width="398" height="44" rx="8" fill="#eef7f1" stroke="#aed7be" stroke-width="1.5"/>
      <text x="356" y="223" font-size="13" font-weight="700" fill="#26734f">放 CLAUDE.md（目錄結構、測試指令、安全紅線）</text>
      <path d="M230 268 H330" stroke="#6248c8" stroke-width="2" fill="none"/>
      <polygon points="330,263 338,268 330,273" fill="#6248c8"/>
      <text x="280" y="260" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">特定任務</text>
      <rect x="338" y="252" width="398" height="44" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="356" y="279" font-size="13" font-weight="700" fill="#6248c8">封裝成 AgentSkill（寫作規範、PR 審查、固定月報）</text>
    </svg>
  </div>
  <figcaption>十秒分流：單次任務留對話、外部連線靠 MCP、每輪紅線放 CLAUDE.md、特定任務 SOP 封裝成 Skill。</figcaption>
</figure>

---

## 決定寫成 Skill 之後，description 怎麼寫才會準確觸發？

**戒掉「產品說明書」寫法，直接寫出你平常開口會講的那幾句原話，以及什麼情況不要觸發。**

直接對比下面兩種寫法，就知道為什麼上面那種永遠打不開 L2 的門：

```yaml
# ❌ 功能介紹寫法（太模糊，Claude 預設 untriggering 直接跳過）
---
name: article-helper
description: 用於處理部落格文章撰寫、排版優化與品質檢查相關的任務。
---

# ✅ 情境暗號寫法（一句話產出 ＋ 開口原話 ＋ 不處理邊界）
---
name: cablate-article-writer
description: |
  撰寫或改寫 cablate.com 技術文章，套用疑問鏈節奏、SVG 圖解色票與去 AI 味檢查。
  觸發情境：「幫我寫一篇新文章」「把這份筆記改成官網文章」「幫這段加一張 SVG 圖解」。
  不處理：Threads 短貼文、純課程操作手冊（交給 social-post 處理）。
---
```

寫完不用盲猜，開一個新對話花 30 秒測三句話就能驗收：講一句 `觸發情境` 原話看它讀不讀、換句白話描述問題看語義通不通、再講一句 `不處理` 的任務確認它不會亂載入。

---

## 現在就能拿去幫 CLAUDE.md 減肥的體檢指令

如果你手上的 `CLAUDE.md` 已經塞了好幾百行，直接把下面這段話貼給 Claude Code，讓它先幫你列出一份拆分清單：

```text
請讀取專案裡的 CLAUDE.md 以及 .claude/skills/ 底下的所有 SKILL.md（先不要修改檔案），幫我分成三類列出：
1. 每輪對話都必須遵守的全域底線（留在 CLAUDE.md，並壓縮成精簡指令）。
2. 只有特定任務（如寫測試、寫文章、發 PR、DB 操作）才用到的 SOP，建議拆成哪幾個 AgentSkill？
3. 檢查現有 SKILL.md 的 description：哪幾支寫得太籠統容易被略過？請直接改寫成「一句話產出＋觸發原話＋不處理邊界」版本。
```

等它列出清單，你花五分鐘看過點頭再讓它動手拆。如果你想進一步把日常讀檔與子代理雜活分流給 Gemini、GLM 或 DeepSeek 等不同模型，可以接著看〈[想在 Claude Code 混用 Gemini 與 GLM，為什麼一改設定檔就全亂套？](/articles/claude-code-multi-model-routing-and-subagent-relay/)〉與〈[Claude Code 實戰：我怎麼用 AI 寫完一整個網站](/articles/claude-code-workflow/)〉；完整的 Skill 拆解範例與 18 章 Claude Code 配置實務都在 [AgentSkill 實戰課程與工程手冊](/courses/)裡，也可以先用[免費的 AI 工作流五層健檢](/expertise/)測測看你手上的流程現在卡在哪一層。
