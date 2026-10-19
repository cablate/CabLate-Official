---
title: "寫了 Skill 卻死都不觸發？拆解 CLAUDE.md、Skill 與 MCP 的分工"
description: "把所有規則塞進 CLAUDE.md 只會每輪白燒 Token；寫了 SKILL.md 卻不觸發，是因為 Claude 預設 untriggering。拆解 CLAUDE.md、AgentSkill 與 MCP 的漸進式揭露機制與 10 秒判斷標準。"
publishDate: 2026-10-19T14:00:00+08:00
category: "AI工具實戰"
tags: ["Claude Code", "AgentSkill", "CLAUDE.md", "MCP", "Context Engineering"]
readingTime: 9
draft: false
excerpt: "把所有規則塞進 CLAUDE.md 會讓每輪對話都在燒 Token；把規則搬去 SKILL.md 卻常常不會觸發。這篇從 Claude 預設的 untriggering 機制出發，拆解 CLAUDE.md、Skill 與 MCP 各自該放什麼，以及怎麼寫出百發百中的觸發條件。"
problemTag: "規則全塞 CLAUDE.md 一直燒額度"
ogHighlight:
  label: "常駐 Context 消耗"
  before: "全塞 CLAUDE.md（每輪必燒）"
  after: "漸進載入（約 100 tokens）"
---

用 Claude Code 一段時間之後，幾乎每個人都會踩進同一個坑：每次 AI 犯了一個錯，你就在 `CLAUDE.md` 加一條規定。

一開始只有二十行，寫著專案目錄跟測試指令，用起來很順。過了兩個月，裡面塞滿了寫文章的排版規矩、API 錯誤處理、Git 提交格式、資料庫命名習慣，整份檔案膨脹到好幾千字。這時你會發現兩件事同時發生：第一，不管你只是問它一個變數名還是改一行字，額度都掉得特別快；第二，規則明明寫在裡面，它卻越來越常漏看。

於是你聽說 Claude 有 `AgentSkill`（放在 `.claude/skills/` 底下的 `SKILL.md`），可以把不同任務的 SOP 拆開存放。你花了一個下午把規則分門別類搬進五個 Skill 資料夾，滿懷期待打開新對話，結果不管你怎麼問，**Claude 從頭到尾連一次都沒有主動載入過你的 Skill**。

我在 Threads 與 AgentSkill 課程裡看過太多人卡在這一步，最後氣得把東西全部搬回 `CLAUDE.md`。下面順著我們排錯的順序，把「為什麼寫了卻不觸發」跟「這三種機制到底怎麼分工」一次拆開。

---

## 明明把規則寫進 SKILL.md 了，為什麼 Claude 當作沒看到？

因為 Claude 對 Skill 的預設策略是「能不觸發就不觸發（untriggering）」，而且它在決定要不要載入前，根本看不到 `SKILL.md` 的正文。

很多人以為把規則存進 `.claude/skills/my-skill/SKILL.md`，AI 就會自動讀到裡面的內容。實際上，為了避免你的二十個 Skill 把對話視窗塞爆，Claude 採用了「漸進式揭露（Progressive Disclosure）」架構：

1. **第一層（常駐索引）**：對話剛開始時，系統只會把每個 Skill 頂部 YAML 裡的 `name` 與 `description` 抽出來放進 Context。所有 Skill 共用約 15,000 字元的全局預算，平均一支 Skill 只佔約 100 tokens。
2. **第二層（按需載入正文）**：只有當 AI 看完那短短幾行 `description`，判斷「現在這句話非用這個 Skill 不可」時，它才會呼叫工具把整份 `SKILL.md`（通常 500 到 2,000 tokens）讀進來。
3. **第三層（外部參考檔）**：如果 `SKILL.md` 裡面又提到需要某份範例或長篇規範，AI 才會再去讀同資料夾下的 `references/` 或執行 `scripts/`。

問題就出在第一層跳第二層的那個瞬間。Claude 內部對 Skill 設有一道省成本門檻：只要你的 `description` 寫得像「處理文件與內容整理」或「協助檢查程式碼品質」這種籠統的功能說明，模型會認為靠它自己的內建能力就能應付，特地多發一次工具呼叫去讀 `SKILL.md` 反而浪費時間與額度，於是直接略過。

> [!NOTE]
> 不管你的 `SKILL.md` 正文寫得多精采，只要頂部的 `description` 沒寫出明確的觸發情境，那份檔案對 AI 來說就跟不存在一樣。

---

## 既然 Skill 會漏觸發，我乾脆全塞回 CLAUDE.md 不就好了？

全塞進 `CLAUDE.md` 最省事，但代價是每一輪不相關的對話都在替那些規則付 Token 稅，還會稀釋 AI 對當前任務的注意力。

你可以把這幾種設定想像成帶一個新進助理的方式。公司的通用底線（例如絕對不能刪正式資料庫、預設講繁體中文）當然要第一天就印在員工手冊裡讓他隨身帶著；但如果你連「年底報稅的表格格式」「每季發電子報的 HTML 模板」都強迫他每分每秒背在腦袋裡，他去幫你買杯咖啡時腦容量也被佔滿了一半。

把 System Prompt、Custom Instructions、`CLAUDE.md` 與 `AgentSkill` 攤開來對照，各自的位置就很清楚了：

| 機制 | 設定位置 | 作用範圍 | 載入時機與 Token 消耗 | 適合放什麼 |
|---|---|---|---|---|
| **System Prompt** | 應用程式底層 | 該軟體的所有對話 | 永遠全量載入（使用者無法直接改） | 工具本身的系統行為與安全邊界 |
| **Custom Instructions** | 帳號全域設定 | 你個人的所有對話 | 永遠全量載入（每輪必消耗） | 跨專案的個人偏好（語氣、語言、回覆長短） |
| **`CLAUDE.md`** | 專案根目錄或 `.claude/` | 該專案的所有對話 | 專案啟動即全量載入（每輪必消耗） | 專案架構、常用測試指令、全專案不可違反的紅線 |
| **`AgentSkill`** | `.claude/skills/<name>/` | 僅限命中情境的任務 | 平時只載入 `description`（約 100 tokens），觸發才載入全文 | 特定任務的完整 SOP、判斷標準、檢查清單與範例 |

你可以點開下面這張切換圖，直接看「把所有規則全塞進 `CLAUDE.md`」跟「用 `CLAUDE.md` 守底線＋用 `Skill` 漸進載入」在每一輪對話裡的實際差異：

<figure class="article-diagram" data-diagram>
  <div class="article-diagram__head">
    <button type="button" class="diagram-mode is-active" data-mode="all-in-claudemd">做法 A：全部塞進 CLAUDE.md（每輪全載入）</button>
    <button type="button" class="diagram-mode" data-mode="progressive-skill">做法 B：CLAUDE.md 底線 ＋ Skill 漸進載入</button>
  </div>
  <div class="article-diagram__scroll">
    <div data-pane="all-in-claudemd">
      <svg viewBox="0 0 720 310" role="img" aria-labelledby="allInTitle">
        <title id="allInTitle">把所有 SOP 全塞進 CLAUDE.md 時，即使只改一行 CSS 也會每輪載入數千 tokens 的無關規則</title>
        <text x="24" y="28" font-size="13" font-weight="700" fill="#5f687a">情境：你只請 AI「幫我把按鈕間距調大 4px」</text>
        <rect x="24" y="46" width="210" height="224" rx="8" fill="#fff1ef" stroke="#efb4ae" stroke-width="1.5"/>
        <text x="40" y="74" font-size="14" font-weight="700" fill="#b4352f">臃腫的 CLAUDE.md</text>
        <text x="40" y="96" font-size="12" fill="#5f687a">每輪對話強制全量塞入：</text>
        <rect x="40" y="108" width="178" height="26" rx="4" fill="#eef7f1" stroke="#aed7be"/>
        <text x="50" y="125" font-size="12" fill="#26734f">✓ 專案目錄與建置指令</text>
        <rect x="40" y="140" width="178" height="26" rx="4" fill="#fffdf8" stroke="#efb4ae"/>
        <text x="50" y="157" font-size="12" fill="#b4352f">✗ 長文寫作與去 AI 味規範</text>
        <rect x="40" y="172" width="178" height="26" rx="4" fill="#fffdf8" stroke="#efb4ae"/>
        <text x="50" y="189" font-size="12" fill="#b4352f">✗ 資料庫 Migration SOP</text>
        <rect x="40" y="204" width="178" height="26" rx="4" fill="#fffdf8" stroke="#efb4ae"/>
        <text x="50" y="221" font-size="12" fill="#b4352f">✗ 金流 Webhook 驗簽步驟</text>
        <text x="40" y="252" font-size="12" font-weight="700" fill="#b4352f" style="font-family:var(--font-mono)">常駐消耗：4,500+ tokens / 輪</text>

        <path class="flow-edge" d="M234 158 H298" stroke="#b4352f" stroke-width="2" fill="none"/>
        <path d="M298 152 L310 158 L298 164 Z" fill="#b4352f"/>

        <rect class="pulse-node" x="314" y="64" width="382" height="188" rx="8" fill="#fff1ef" stroke="#b4352f" stroke-width="1.5"/>
        <text x="334" y="94" font-size="15" font-weight="700" fill="#b4352f">Context Window 被無關規定塞滿</text>
        <text x="334" y="124" font-size="13" fill="#253047">1. 改一行 CSS 也要替寫作與金流規範付錢</text>
        <text x="334" y="150" font-size="13" fill="#253047">2. 規則互相干擾，真正重要的紅線反而被漏看</text>
        <text x="334" y="176" font-size="13" fill="#253047">3. 改動單一流程時，整份 CLAUDE.md 越來越難維護</text>
        <rect x="334" y="198" width="342" height="34" rx="6" fill="#fffdf8" stroke="#efb4ae"/>
        <text x="348" y="220" font-size="12.5" font-weight="700" fill="#b4352f">結果：額度掉得快，AI 卻還是常常忘記你寫過的規定</text>
      </svg>
    </div>
    <div data-pane="progressive-skill" style="display:none">
      <svg viewBox="0 0 720 310" role="img" aria-labelledby="progSkillTitle">
        <title id="progSkillTitle">用 CLAUDE.md 放通用底線，搭配 Skill 三層漸進式揭露，平時只佔約 100 tokens，命中情境才載入完整 SOP</title>
        <text x="24" y="28" font-size="13" font-weight="700" fill="#5f687a">情境：平時只載入極薄索引，說出「幫我寫新文章」才展開對應 SOP</text>
        <rect x="24" y="46" width="200" height="224" rx="8" fill="#eef7f1" stroke="#aed7be" stroke-width="1.5"/>
        <text x="40" y="74" font-size="14" font-weight="700" fill="#26734f">常駐 Context（極輕量）</text>
        <rect x="40" y="90" width="168" height="58" rx="6" fill="#fffdf8" stroke="#aed7be"/>
        <text x="50" y="112" font-size="12.5" font-weight="700" fill="#253047">精簡 CLAUDE.md</text>
        <text x="50" y="132" font-size="11.5" fill="#5f687a">架構、測試指令、安全底線</text>
        <rect x="40" y="160" width="168" height="68" rx="6" fill="#f1edff" stroke="#b8afc9"/>
        <text x="50" y="182" font-size="12.5" font-weight="700" fill="#6248c8">Level 1：Skill 索引</text>
        <text x="50" y="200" font-size="11.5" fill="#5f687a">只載入 name + description</text>
        <text x="50" y="217" font-size="11.5" font-weight="700" fill="#6248c8" style="font-family:var(--font-mono)">每支約 100 tokens</text>
        <text x="40" y="252" font-size="12" font-weight="700" fill="#26734f">改 CSS 時完全不載入寫作規範</text>

        <path class="flow-edge" d="M224 194 H276" stroke="#6248c8" stroke-width="2" fill="none"/>
        <path d="M276 188 L288 194 L276 200 Z" fill="#6248c8"/>

        <rect x="292" y="56" width="194" height="204" rx="8" fill="#f1edff" stroke="#b8afc9" stroke-width="1.5"/>
        <text x="308" y="84" font-size="14" font-weight="700" fill="#6248c8">Level 2：SKILL.md</text>
        <text x="308" y="106" font-size="12" fill="#253047">命中「寫文章」情境才讀取：</text>
        <text x="308" y="132" font-size="12" fill="#5f687a">• Frontmatter 欄位契約</text>
        <text x="308" y="154" font-size="12" fill="#5f687a">• 疑問鏈與問句小標規則</text>
        <text x="308" y="176" font-size="12" fill="#5f687a">• 禁用詞與發布前檢查</text>
        <text x="308" y="236" font-size="11.5" font-weight="700" fill="#6248c8" style="font-family:var(--font-mono)">按需載入：約 800 tokens</text>

        <path class="flow-edge" d="M486 158 H526" stroke="#26734f" stroke-width="2" fill="none"/>
        <path d="M526 152 L538 158 L526 164 Z" fill="#26734f"/>

        <rect x="542" y="76" width="154" height="164" rx="8" fill="#eef7f1" stroke="#aed7be" stroke-width="1.5"/>
        <text x="556" y="104" font-size="13.5" font-weight="700" fill="#26734f">Level 3：附屬檔案</text>
        <text x="556" y="130" font-size="12" fill="#253047" style="font-family:var(--font-mono)">references/</text>
        <text x="556" y="148" font-size="11.5" fill="#5f687a">需要畫圖才讀色票表</text>
        <text x="556" y="176" font-size="12" fill="#253047" style="font-family:var(--font-mono)">scripts/</text>
        <text x="556" y="194" font-size="11.5" fill="#5f687a">直接執行驗證腳本</text>
      </svg>
    </div>
  </div>
  <figcaption>點上方按鈕切換：把所有任務 SOP 拆進 Skill 之後，一般對話只會常駐極薄的索引，真正動手做該任務時才把完整規矩展開。</figcaption>
</figure>

我自己在整理完這套分工後，幾乎捨棄了以前把所有說明文件塞在 `docs/` 叫 AI 自己去翻的做法。因為遵循標準的 Skill 結構，不但好拔插、能跨專案複用，新開一個對話也不用先貼一大串前情提要。

---

## 那 MCP 跟 AgentSkill 又有什麼不一樣？我該裝哪一個？

這兩個根本不在同一個層次：MCP 是幫 AI 接上外部工具的「硬體轉接頭」，AgentSkill 則是教 AI 怎麼把事做對的「工作手冊」。

常有人問我：「現在有了 AgentSkill，是不是就不用裝 MCP 了？」或者反過來問哪個比較強。把兩者放在一起比，就像在問「USB 轉接頭跟食譜哪個比較好用」。

| 比較維度 | MCP（Model Context Protocol） | AgentSkill（`SKILL.md`） |
|---|---|---|
| **解決什麼問題** | 讓 AI 能呼叫外部服務（查資料庫、讀行事曆、操作瀏覽器） | 讓 AI 記住你的做事步驟、判斷標準與驗收方式 |
| **所在層次** | 技術接口層（決定 AI **能不能碰到**那個工具） | 思維與流程層（決定 AI **拿到工具後怎麼用**） |
| **Context 載入方式** | 啟動時把所有工具與參數 schema 一次塞進 Context | 漸進式揭露，平時只放約 100 tokens 的 `description` |
| **裝太多的後果** | 每輪白燒大量額度，且工具名稱相近時容易亂呼叫 | 共用 15,000 字元索引預算，但未觸發的正文完全不耗額度 |

這裡有一個很多人踩過的隱形錢坑：**因為覺得好玩，一口氣裝了十幾個 MCP Server**。

要注意，多數 MCP 工具並沒有像 Skill 那樣的三層漸進揭露。你每多掛一個包含二、三十支 API 的 MCP Server，那些工具的名稱、描述跟 JSON 參數格式就會在對話剛啟動時整包塞進 Context（如果你好奇底層是怎麼算這筆帳的，可以看我之前寫的〈[逆向 Claude Agent SDK：找出每則訊息 2-3% 額度消耗的根因與解法](/articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/)〉）。更慘的是，當 Context 裡同時躺著八十支長得很像的工具時，模型會開始出現 Context Confusion，明明該查 A 系統卻跑去呼叫 B 工具。

我自己現在的原則很簡單：需要碰外部資料庫或 API 時，只開當下那一個必要的 MCP；至於「先查哪張表、哪些欄位不能改、查完怎麼核對」這些經驗，全部封裝成 AgentSkill。

---

## 怎麼在十秒內決定：一條規則該放 CLAUDE.md、寫成 Skill，還是直接對話講？

不要問這件事「常不常用」，要問自己：「這套判斷標準，我希望 AI 下個月、甚至半年後還記得嗎？」

很多人卡在不知道該不該寫 Skill，是因為拿「使用頻率」當標準，覺得「這個月報表我一個月才跑一次，寫成 Skill 太花時間了吧？」結果下個月要跑的時候，早就忘了上個月踩過哪個欄位的坑，又重頭跟 AI 鬼打牆一小時。

反過來說，也不要看到別人分享「必裝 Top 20 神級 Skill 排行榜」就全部下載回來塞滿資料夾，然後才開始想自己有什麼工作可以用（這跟[為了養龍蝦而硬找排程任務](/articles/blog-writing-openclaw/)是一模一樣的陷阱）。

你手上有一個需求或一條規則時，照下面這張圖問自己三個問題，十秒鐘就能決定它該去哪裡：

<figure class="article-diagram">
  <div class="article-diagram__scroll">
    <svg viewBox="0 0 720 350" role="img" aria-labelledby="decisionTreeTitle">
      <title id="decisionTreeTitle">十秒判斷一條需求該放對話、MCP、CLAUDE.md 還是 AgentSkill 的決策樹</title>
      <rect x="24" y="20" width="200" height="58" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="40" y="45" font-size="13.5" font-weight="700" fill="#6248c8">Q1：這件事下次還會遇到嗎？</text>
      <text x="40" y="65" font-size="11.5" fill="#5f687a">（我希望 AI 永遠記得這個做法嗎？）</text>

      <path d="M224 49 H292" stroke="#5f687a" stroke-width="1.5" fill="none"/>
      <text x="236" y="42" font-size="11.5" font-weight="700" fill="#9b6017">不會（一次性）</text>
      <rect x="296" y="22" width="396" height="54" rx="8" fill="#fff7e8" stroke="#e7c58f"/>
      <text x="314" y="45" font-size="13.5" font-weight="700" fill="#9b6017">直接在當下對話講清楚就好</text>
      <text x="314" y="64" font-size="12" fill="#5f687a">例如：今天會議的臨時議程、單次活動的促銷文案，做完就丟，別塞進設定檔。</text>

      <path d="M124 78 V122" stroke="#6248c8" stroke-width="1.5" fill="none"/>
      <text x="134" y="104" font-size="11.5" font-weight="700" fill="#6248c8">會（需要長期記住）</text>

      <rect x="24" y="124" width="200" height="58" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="40" y="149" font-size="13.5" font-weight="700" fill="#6248c8">Q2：是欠缺外部工具權限，</text>
      <text x="40" y="169" font-size="13.5" font-weight="700" fill="#6248c8">還是欠缺做事步驟與判斷？</text>

      <path d="M224 153 H292" stroke="#5f687a" stroke-width="1.5" fill="none"/>
      <text x="232" y="146" font-size="11.5" font-weight="700" fill="#253047">欠外部連線</text>
      <rect x="296" y="126" width="396" height="54" rx="8" fill="#f8f5ed" stroke="#d7d1c6"/>
      <text x="314" y="149" font-size="13.5" font-weight="700" fill="#253047">接上對應的 MCP Server（或 CLI 腳本）</text>
      <text x="314" y="168" font-size="12" fill="#5f687a">例如：讀取 Supabase 資料表、查 Google 行事曆。只開必要的工具，用完即關。</text>

      <path d="M124 182 V226" stroke="#6248c8" stroke-width="1.5" fill="none"/>
      <text x="134" y="208" font-size="11.5" font-weight="700" fill="#6248c8">欠做事步驟／判斷標準</text>

      <rect x="24" y="228" width="200" height="58" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="40" y="253" font-size="13.5" font-weight="700" fill="#6248c8">Q3：每一輪對話都必須遵守，</text>
      <text x="40" y="273" font-size="13.5" font-weight="700" fill="#6248c8">還是特定任務才用得到？</text>

      <path d="M224 246 H292" stroke="#26734f" stroke-width="1.5" fill="none"/>
      <text x="232" y="239" font-size="11.5" font-weight="700" fill="#26734f">每輪必守底線</text>
      <rect x="296" y="212" width="396" height="52" rx="8" fill="#eef7f1" stroke="#aed7be"/>
      <text x="314" y="234" font-size="13.5" font-weight="700" fill="#26734f">寫進 CLAUDE.md（控制在精簡行數）</text>
      <text x="314" y="253" font-size="12" fill="#5f687a">例如：專案目錄結構、禁止碰的分支、執行測試的指令、預設語言。</text>

      <path d="M224 272 H292" stroke="#6248c8" stroke-width="2" fill="none"/>
      <text x="232" y="290" font-size="11.5" font-weight="700" fill="#6248c8">特定任務才用</text>
      <rect class="pulse-node" x="296" y="274" width="396" height="58" rx="8" fill="#f1edff" stroke="#6248c8" stroke-width="1.5"/>
      <text x="314" y="298" font-size="14" font-weight="700" fill="#6248c8">封裝成 AgentSkill（.claude/skills/）</text>
      <text x="314" y="318" font-size="12" fill="#253047">例如：文章寫作與圖解規範、PR 安全審查清單、報表清理步驟（哪怕一季只用一次）。</text>
    </svg>
  </div>
  <figcaption>不要用「每天用不用得到」決定要不要寫 Skill；只要那個流程下次再做時你不想重講一遍，就值得收進 Skill。</figcaption>
</figure>

---

## 決定寫成 Skill 之後，description 怎麼寫才會準確觸發？

把 `description` 當成給 AI 看的「情境索引」，直接寫出你平常開口會講的那幾句原話，以及哪些情況不要觸發。

既然 AI 在決定要不要載入 Skill 時只看得到 `description`，而且它做的是「語義情境匹配」而非死板的字串比對，你在寫 YAML 頂部時就要戒掉「寫產品說明書」的習慣，改成寫這四樣東西：

1. **一句話核心產出**：這個 Skill 最後會交出什麼結果。
2. **觸發情境（使用者原話）**：你平常要它做這件事時，嘴裡實際會講哪幾句話。
3. **不處理的邊界（排除條件）**：防止它在相近的任務裡誤觸發。
4. **檔案分工索引（放在 `SKILL.md` 內文）**：告訴它什麼時候才去讀 `references/` 裡的細節。

對照下面這兩段 YAML 設定，就能看出哪一種才會被載入。

```yaml
# ❌ 功能導向寫法（太模糊，Claude 預設 untriggering 直接跳過）
---
name: article-helper
description: 用於處理部落格文章撰寫、排版優化與品質檢查相關的任務。
---

# ✅ 情境導向寫法（清楚標示開口原話與排除邊界，準確觸發）
---
name: cablate-article-writer
description: |
  撰寫或改寫 cablate.com 技術文章，套用疑問鏈節奏、SVG 圖解色票與去 AI 味檢查。
  觸發情境：「幫我寫一篇新文章」「把這份筆記改成官網文章」「幫這段加一張 SVG 圖解」
  「檢查這篇草稿有沒有 AI 腔」。
  不處理：Threads 短貼文、純課程操作手冊（那些交給 social-post 處理）。
---
```

> [!TIP]
> 寫完 `description` 不用瞎猜它會不會動，直接開一個新對話做三次十秒鐘測試：
> 1. **直接觸發測試**：講一句你寫在 `觸發情境` 裡的話，看它有沒有去讀 `SKILL.md`。
> 2. **換句話說測試**：不講關鍵字，改用描述問題的方式（例如「我剛逆向完一個 bug，想整理放到網站上給大家看」），測試語義匹配過不過得去。
> 3. **負面排除測試**：講一句你在 `不處理` 裡排除的事（例如「幫我發一篇五百字的 Threads」），確認它不會亂載入。

---

## 現在就能拿去清 CLAUDE.md 的體檢指令

如果你手上的 `CLAUDE.md` 已經塞了好幾百行，或者寫了幾個 `SKILL.md` 卻總覺得 AI 愛理不理，不用自己一行一行慢慢搬。

直接把下面這段話貼給你的 Claude Code，讓它幫你先盤點出一份拆分清單：

```text
請幫我讀取專案裡的 CLAUDE.md 以及 .claude/skills/ 底下的所有 SKILL.md，但先不要修改檔案。
請幫我把目前的規則分成三類列出來讓我確認：
1. 每一輪對話都必須遵守的全域底線（留在 CLAUDE.md，並壓縮成精簡指令）。
2. 只有特定任務（例如寫測試、寫文章、發 PR、資料庫操作）才用得到的 SOP，建議拆成哪幾個獨立的 AgentSkill？
3. 檢查我現有的 SKILL.md description：哪幾支寫得太像籠統的功能介紹，容易因為預設 untriggering 而沒被載入？請直接幫我改寫成包含「一句話產出＋觸發原話＋不處理邊界」的版本。
```

等它列出清單，你花五分鐘看過、點頭確認後再讓它動手拆。如果你想看我是怎麼把這套方式用在整座網站的開發與五層架構上，可以接著讀〈[Claude Code 實戰：我怎麼用 AI 寫完一整個網站](/articles/claude-code-workflow/)〉與〈[OpenClaw 讓 AI Agent 重新受到注意：五層架構其實早就存在](/articles/openclaw-agent-fundamentals/)〉；想直接看完整的 Skill 拆解範例與 18 章 Claude Code 配置實務，都在 [AgentSkill 實戰課程與 Claude Code 深度工程手冊](/courses/)裡，也可以先用[免費的 AI 工作流五層健檢](/expertise/)測測看你手上的流程現在卡在哪一層。
