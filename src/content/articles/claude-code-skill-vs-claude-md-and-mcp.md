---
title: "寫了 Skill 卻沒觸發？先看 CLAUDE.md、Skill 與 MCP 怎麼分工"
description: "規則放在 CLAUDE.md、Skill 還是 MCP？從各自用途、Skill description 到實際觸發測試，整理可以直接使用的判斷方式。"
publishDate: 2026-10-19T14:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "AgentSkill", "CLAUDE.md", "MCP", "Context Engineering"]
readingTime: 6
draft: false
excerpt: "規則越寫越長，拆成 Skill 後又不確定何時會載入？這篇整理三種機制的分工，並用具體例子檢查 Skill 觸發。"
problemTag: "規則全塞 CLAUDE.md 一直燒額度"
ogHighlight:
  label: "常駐 Context 消耗"
  before: "規則與任務混在一起"
  after: "依用途安排與測試"
---

AI 每犯一次錯，你就在 `CLAUDE.md` 補一條規定；幾個月後連調個按鈕間距，都得帶著寫作與資料庫規定進場。[官方文件](https://code.claude.com/docs/en/memory)建議 `CLAUDE.md` 控制在 200 行內，越長越難照做，多步驟流程應移到 Skill（也稱 AgentSkill）。

於是你把規定拆進五個 `SKILL.md` 資料夾，結果開新對話怎麼問，Claude 都當作沒看到。

## 為甚麼寫進 SKILL.md，它卻當作沒看到？

**Claude 決定要不要自動打開一支 Skill 時，先看到的只有名稱和描述（`description`），完整正文要等呼叫時才會載入。**

Skill 的實現就是 Prompt，在終端機呼叫時雖只顯示一行 `/{skill-name}`，其實是把整份 `SKILL.md` 加進對話。為免預先塞滿空間，系統按圖中 L1、L2、L3 三階段載入，L1 描述常駐供比對、L2 正文呼叫時載入、L3 參考檔（`references/`）用到才讀。

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 760 320" role="img" aria-labelledby="contextGateTitle">
      <title id="contextGateTitle">全塞 CLAUDE.md 與 Skill 三道閘門漸進載入的 Context 佔用比例對比</title>
      <rect x="0" y="0" width="760" height="320" rx="8" fill="#fffdf8" stroke="#d7d1c6" stroke-width="1"/>
      <text x="24" y="30" font-size="14" font-weight="700" fill="#253047">情境：只調整按鈕間距時，哪些指引需要載入？</text>
      <text x="24" y="60" font-size="12.5" font-weight="700" fill="#b4352f">❌ 做法 A：所有 SOP 放進 CLAUDE.md</text>
      <rect x="24" y="72" width="712" height="58" rx="6" fill="#f8f5ed" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="24" y="72" width="96" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="72" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">專案底線</text>
      <text x="72" y="116" text-anchor="middle" font-size="11.5" fill="#26734f" style="font-family:var(--font-mono)">共通規則</text>
      <rect x="120" y="72" width="440" height="58" rx="0" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
      <text x="340" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#b4352f">可能包含這次任務用不到的規定</text>
      <text x="340" y="116" text-anchor="middle" font-size="11.5" fill="#b4352f" style="font-family:var(--font-mono)">例如寫作、資料庫或金流流程</text>
      <text x="648" y="106" text-anchor="middle" font-size="12" fill="#5f687a">剩餘對話空間</text>
      <line x1="24" y1="154" x2="736" y2="154" stroke="#d7d1c6" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="180" font-size="12.5" font-weight="700" fill="#26734f">✅ 做法 B：共通規則留在 CLAUDE.md，任務流程放 Skill</text>
      <rect x="24" y="192" width="296" height="58" rx="6" fill="#f8f5ed" stroke="#d7d1c6" stroke-width="1"/>
      <rect x="24" y="192" width="72" height="58" rx="6" fill="#eef7f1" stroke="#26734f" stroke-width="1.5"/>
      <text x="60" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">底線</text>
      <text x="60" y="236" text-anchor="middle" font-size="11.5" fill="#26734f" style="font-family:var(--font-mono)">共通</text>
      <rect x="96" y="192" width="64" height="58" rx="0" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="128" y="218" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">L1 索引</text>
      <text x="128" y="236" text-anchor="middle" font-size="11.5" fill="#6248c8" style="font-family:var(--font-mono)">描述</text>
      <text x="240" y="226" text-anchor="middle" font-size="12" font-weight="700" fill="#26734f">依任務判斷</text>
      <path d="M320 221 H410" stroke="#6248c8" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
      <polygon points="410,216 418,221 410,226" fill="#6248c8"/>
      <text x="369" y="210" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6248c8">適用時載入</text>
      <rect x="418" y="192" width="146" height="58" rx="6" fill="#f1edff" stroke="#b8afc9" stroke-width="1.5"/>
      <text x="491" y="216" text-anchor="middle" font-size="12.5" font-weight="700" fill="#6248c8">L2：SKILL.md 正文</text>
      <text x="491" y="236" text-anchor="middle" font-size="11.5" fill="#5f687a" style="font-family:var(--font-mono)">任務流程</text>
      <path d="M564 221 H598" stroke="#26734f" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
      <polygon points="598,216 606,221 598,226" fill="#26734f"/>
      <rect x="606" y="192" width="130" height="58" rx="6" fill="#eef7f1" stroke="#aed7be" stroke-width="1.5"/>
      <text x="671" y="216" text-anchor="middle" font-size="12.5" font-weight="700" fill="#26734f">L3：references/</text>
      <text x="671" y="236" text-anchor="middle" font-size="11.5" fill="#5f687a">畫圖才讀色票</text>
      <text x="24" y="284" font-size="12" fill="#5f687a">⚠️ 為甚麼你的 Skill 不觸發？先檢查 Skill 是否可見、描述是否符合任務，再用實際例子測試。</text>
    </svg>
  </div>
  <figcaption>示意共通指引、Skill 描述與任務內容的安排；圖中長度不代表實際 token 比例。</figcaption>
</figure>

## 改描述之前，先查這三件事

遇到 Skill 不觸發，先排除三個設定問題：

1. **在不在清單裡**：打 `/skills` 或問 Claude 有哪些可用。沒出現的話，可能是對話開始後才新增（跑 `/reload-skills`）、從上層目錄啟動尚未讀到子資料夾 `.claude/skills/`，或名稱含非法字元。
2. **開頭設定寫壞或鎖成手動**：`SKILL.md` 開頭 `---` 間的設定（YAML）若格式寫錯，打 `/名稱` 還叫得動，但 Claude 讀不到描述會略過（加 `--debug` 可查錯）；設了 `disable-model-invocation: true` 則只能手動打 `/名稱`。
3. **描述被拿掉**：依[官方文件](https://code.claude.com/docs/en/skills)，描述清單預算為模型 context 的 1%（單支上限 1,536 字元），裝太多時系統會依呼叫頻率從最少用的開始拿掉描述；可用 `/context` 或 `/doctor` 檢查。

## 描述寫開口會講的話，開新對話用三句話測

設定正常卻沒觸發，就把描述（`description`）改成三項：一句話說產出甚麼、平常開口的原話、不處理的情況。

```yaml
# ❌ 功能介紹寫法（沒有指出任務情境）
---
name: article-helper
description: 用於處理部落格文章撰寫、排版優化與品質檢查相關的任務。
---

# ✅ 情境寫法（一句話產出 ＋ 開口原話 ＋ 不處理邊界）
---
name: cablate-article-writer
description: |
  撰寫或改寫 cablate.com 技術文章，套用疑問鏈節奏、SVG 圖解色票與去 AI 味檢查。
  觸發情境：「幫我寫一篇新文章」「把這份筆記改成官網文章」「幫這段加一張 SVG 圖解」。
  不處理：Threads 短貼文、純課程操作手冊（交給 social-post 處理）。
---
```

改完**開新對話用三句話測**（前兩句叫得動、第三句不動才算完）：直接講一句描述裡的原話、換句白話講同一件事、講一個相近但不該觸發的任務。若是組織導入，建議設 hook 記錄所有 Skill 調用狀況，用大量情況調描述（含誤觸發），沒有更好的做法。

## 哪些規則才該放進 Skill？

順著三個問題分流：
- **Q1 下次還會遇到嗎？** 先問「這個知識，我希望 AI 永遠記得嗎？」，單次任務留當下對話。
- **Q2 缺連線還是缺做法？** 缺資料庫等外部連線開 MCP Server，缺步驟往下走。
- **Q3 每輪必守還是特定任務？** 每輪底線放 `CLAUDE.md`，特定任務做法放 Skill。

| 機制 | 用途 | 何時使用 | 適合放甚麼 |
|---|---|---|---|
| **`CLAUDE.md`** | **適用範圍的共通指引** | 依檔案位置與設定載入 | 專案目錄結構、常用測試指令、不可違反的安全紅線 |
| **`AgentSkill`** | **特定任務的做法** | 適用或明確呼叫時載入 | 特定任務的 SOP、檢查清單與 `references/` 範例 |
| **`MCP Server`** | **外部工具與資料的連接方式** | 依工具與設定提供或搜尋 | 真正需要連線的外部服務（如查資料庫、讀行事曆）|

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

只有部分常見功能已被模型內建，用了發現卡手或不如預期，就還需要寫 Skill。寫 `SKILL.md` 時必做事項直接寫在裡面並標清檔案索引；同時要「陳述原則，不要窮舉規則」，窮舉通常只能做好少數情境，任務一變或資訊不足就容易「變智障」，貼太緊案例也難複用。

## 下次 Skill 不觸發，先做這四步

1. 打 `/skills` 確認在不在清單。
2. 查開頭設定有無寫壞或設了 `disable-model-invocation`。
3. 把 `description` 改成開口原話與不處理邊界。
4. 開新對話用三句話測。

**Claude 只先看描述，寫得像說明書它就不會打開。**

想盤點現有專案，貼下面指令就會先在對話列出分類與 `description` 改寫建議，確認後再動檔：

```text
請讀取專案裡的 CLAUDE.md 以及 .claude/skills/ 底下的所有 SKILL.md（先不要修改檔案），幫我分成三類列出：
1. 每輪對話都必須遵守的全域底線（留在 CLAUDE.md，並壓縮成精簡指令）。
2. 只有特定任務（如寫測試、寫文章、發 PR、DB 操作）才用到的 SOP，建議拆成哪幾個 AgentSkill？
3. 檢查現有 SKILL.md 的 description：哪幾支寫得太籠統容易被略過？請直接改寫成「一句話產出＋觸發原話＋不處理邊界」版本。
```

延伸參考：〈[逆向 Claude Agent SDK 的快取成本](/articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/)〉、〈[想在 Claude Code 混用 Gemini 與 GLM，為甚麼一改設定檔就全亂套？](/articles/claude-code-multi-model-routing-and-subagent-relay/)〉、〈[Claude Code 實戰：我怎麼用 AI 寫完一整個網站](/articles/claude-code-workflow/)〉；團隊導入與盤點見 [AgentSkill 實戰課程與工程手冊](/courses/)、[AI 工作流健檢](/expertise/)。
