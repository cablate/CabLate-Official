import { siteConfig, withCabAiAttribution } from './siteConfig';

export const authorityProfile = {
  publicName: 'CabLate',
  alternateName: 'Cab',
  claim: '判斷力比執行力值錢。',
  shortBio: '我從全端工程與系統設計出發，現在專注於 AI 應用、Agent 工作流程與數位產品落地。我把複雜技術拆成清楚的步驟，幫助個人、團隊與企業做出能實際運作、也能檢查成果的系統。',
  humanBio: '我把複雜技術講成人話，幫創作者、小團隊和企業釐清問題、設計流程，讓 AI 能穩定完成工作。',
  authorUrl: 'https://cablate.com/about/',
  sameAs: [
    siteConfig.threadsUrl,
    siteConfig.githubUrl,
  ],
} as const;

export const signatureMethods = [
  {
    title: 'Context Engineering',
    definition: 'AI 在需要時拿到正確版本、剛好足夠的資訊，通常比一次塞入更多內容有用。',
    problem: '適合：對話愈長愈混亂，或換人、換回合後容易失去前文。',
  },
  {
    title: 'Skill 路線設計',
    definition: 'Skill 是一套可重複執行的工作方法：何時啟動、先判斷什麼、哪些事不能做、最後怎麼驗收，都要事先說清楚。',
    problem: '適合：AI 每次都重新猜做法，導致產出品質忽好忽壞。',
  },
  {
    title: 'Harness Engineering',
    definition: '模型夠不夠強，只是其中一部分。任務怎麼寫、工具怎麼選、資料怎麼提供、錯誤怎麼發現與復原，合在一起才決定成果是否穩定。',
    problem: '適合：AI 單次表現不錯，放進日常流程後卻經常失控。',
  },
] as const;

export const representativeWork = [
  {
    type: '工程手冊',
    title: 'Agent 深度工程手冊',
    description: '把半年以上的 Claude Code 實作經驗，整理成可查閱、可排錯、方便交接的工程手冊；其中包含 Skill、Memory、Hook、Context 與 Harness 的實際用法。',
    proof: '45 課已發布，截至 2026-06-24',
    href: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'work_handbook'),
  },
  {
    type: '開源工具',
    title: 'mcp-google-map',
    description: '把 Google Maps 能力做成可實際安裝的 MCP 工具，並發布到 GitHub 與 npm，讓其他開發者能直接使用與延伸。',
    proof: '365 stars／75 forks，截至 2026-07-02',
    href: 'https://github.com/cablate/mcp-google-map',
  },
  {
    type: '實作型教學',
    title: '金流串接與產品交付教學',
    description: '從 API 一路做到訂單狀態、Webhook、簽章、權限與錯誤處理，帶學員走完一條可以上線的收款流程。',
    proof: '40+ 位學員，截至 2026-06',
    href: '/courses/',
  },
  {
    type: '資料型產品',
    title: 'banini-tracker',
    description: '整合社群貼文、AI 分析、即時推送與股價驗證，完成一套可部署的開源資料產品。',
    proof: '287 stars／49 forks，截至 2026-07-02',
    href: 'https://github.com/cablate/banini-tracker',
  },
] as const;

export const openSourceProofs = [
  {
    kind: '開源工具',
    title: 'mcp-google-map',
    headline: '把 Google Maps API 做成可以直接安裝使用的 MCP 工具。',
    description: '這個開源專案把 Google Maps 的多項能力整理成 MCP 介面，並公開程式碼、安裝方式與 npm 套件。使用者可以直接接入，也能追查或修改實作。',
    capability: '公開工具介面、安裝文件、npm 套件與可延伸的程式碼。',
    metric: '365 stars／75 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/mcp-google-map',
    sourceLabel: '查看公開程式碼',
  },
  {
    kind: '資料型產品',
    title: 'banini-tracker',
    headline: '從社群貼文分析，一路追蹤到後續股價表現。',
    description: '這套資料產品串接社群貼文、AI 分析、即時推送與後續股價驗證。它不只產生一次分析，而是把訊號來源、判斷與後續結果放進同一條可以持續追蹤的流程。',
    capability: '看得到資料整合、AI 分析、通知與後續驗證如何連接。',
    metric: '287 stars／49 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/banini-tracker',
    sourceLabel: '查看公開程式碼',
  },
  {
    kind: '公開研究',
    title: 'claude-code-research',
    headline: '把 Claude Code 與 Agent 實作研究持續公開。',
    description: '這個研究庫長期整理 Claude Code、Agent 工作流與相關工具的實作紀錄。讀者可以查資料來源、回看方法如何形成，也能追蹤後續更新。',
    capability: '公開研究資料、整理脈絡與持續更新紀錄。',
    metric: '159 stars／67 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/claude-code-research',
    sourceLabel: '查看公開研究',
  },
] as const;

export const deliveryExperienceProofs = [
  {
    kind: '實作型課程',
    headline: '帶學員從 API 一路完成真正的收款流程。',
    description: '內容涵蓋訂單狀態、Webhook、簽章、權限與錯誤處理。學員不是只看功能示範，而是實際把一條收款流程走完。',
    proof: '40+ 位學員',
  },
  {
    kind: '工程手冊',
    headline: '把半年以上的實作經驗整理成 45 課工程手冊。',
    description: 'Agent 深度工程手冊整理 Claude Code、Skill、Memory、Hook、Context 與 Harness 的實際用法，讓使用者遇到問題時有地方可以查，而不是重新猜一次。',
    proof: '45 課已發布',
  },
] as const;

export const learningPath = [
  {
    stage: '先找出問題',
    situation: '還不知道問題出在 Prompt、資料、Skill 還是整個流程，也不想先買錯內容',
    title: '免費問題診斷',
    outcome: '先看懂自己真正卡在哪裡，再決定需不需要繼續學習或調整工具。',
    price: '免費',
    href: '/expertise/',
    cta: '先做問題診斷',
  },
  {
    stage: '快速建立共同理解',
    situation: '想在短時間內理解一個主題，或讓團隊先建立共同語言',
    title: '講座與工作坊',
    outcome: '透過明確主題、實際示範與小型練習，快速掌握問題全貌，並知道下一步該做什麼。',
    price: null,
    href: 'https://tbr.digital/claude',
    cta: '查看講座與工作坊',
  },
  {
    stage: '把有效方法留下來',
    situation: '已經開始用 Skill，卻還是得反覆交代規則，或做對一次之後無法穩定重現',
    title: 'AgentSkill：讓 AI 成為你的協作者',
    outcome: '理解 Skill 為什麼有效、何時該使用，以及如何把真正有用的判斷與規則整理成可以重複使用的方法。',
    price: 'NT$1,500，一次付費',
    href: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'courses_agentskill'),
    cta: '查看課程與免費試看',
  },
  {
    stage: '持續查閱與排錯',
    situation: '已經在使用 Claude Code，但設定、記憶、Context、成本或 Agent 工作流常常出問題',
    title: 'Claude Code 深度工程手冊',
    outcome: '理解 CLAUDE.md、Memory、Skill、Hook、Context 與 Harness 背後的設計邏輯，遇到問題時知道該從哪裡查。',
    price: 'NT$5,999，一次付費',
    href: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'courses_handbook'),
    cta: '查看手冊與免費試看',
  },
] as const;

export const serviceTracks = [
  {
    id: 'workflow-diagnosis',
    title: 'AI 工作流診斷',
    outcome: '找出問題真正卡在哪裡，判斷 AI 適合介入的範圍，並整理出第一條可以測試的工作流程。',
    fit: ['已經在用 AI，但流程常常失控或重做', '手上有明確任務、資料或產品情境', '需要外部判斷協助排出先後順序'],
    notFit: '只想取得一個萬用提示詞，或希望在沒有資料與負責人的情況下，讓 AI 自動解決所有問題。',
    deliverables: ['現況與主要問題地圖', 'AI 適合介入的位置與主要風險', '第一版工作流與完成條件', '後續實作、訓練或工具選擇建議'],
  },
  {
    id: 'training',
    title: '企業內訓與工作坊',
    outcome: '讓團隊用共同語言理解 AI，並針對真實工作練習如何分配任務、提供資料與檢查結果。',
    fit: ['團隊對 AI 的理解與使用方式落差很大', '需要依職能、產業與實際情境設計內容', '不希望課程結束後只留下一堆筆記'],
    notFit: '只想追一輪熱門工具，卻不打算提供團隊情境，也沒有定義課後要留下什麼成果。',
    deliverables: ['課前需求與受眾盤點', '客製課綱、示範案例與實作題目', '工作坊流程與學員練習成果', '課後改善建議與後續學習方向'],
  },
  {
    id: 'agent-adoption',
    title: 'AI 產品與 Agent 導入',
    outcome: '把明確的使用情境，設計成可以放進團隊工作、持續維護的 AI 產品或 Agent 系統。',
    fit: ['已經有明確使用者、資料來源與工作流程', '需要從原型推進到實際使用', '團隊願意提供必要資料、內部負責人與完成條件'],
    notFit: '還沒有明確問題、資料來源與內部負責人，卻期待買一套 AI 平台就能解決所有事情。',
    deliverables: ['需求、使用者與主要風險拆解', '系統架構與 Agent 工作環境設計', '原型、技術方案或導入路線圖', '測試、交接與後續改善方案'],
  },
] as const;

export const primaryNavigation = [
  // Articles inbound links paused: 恢復全站文章導流時再放回主要導覽。
  // { label: '方法與文章', mobileLabel: '文章', railLabel: '文章索引', href: '/articles/' },
  { label: '專業方法', mobileLabel: '方法', railLabel: '診斷 AI 工作流程', href: '/expertise/' },
  { label: '學習', mobileLabel: '學習', railLabel: '課程與手冊', href: '/courses/' },
  { label: '合作', mobileLabel: '合作', railLabel: '顧問、內訓與導入', href: '/services/' },
  { label: '關於', mobileLabel: '關於', railLabel: '經歷與公開作品', href: '/about/' },
] as const;
