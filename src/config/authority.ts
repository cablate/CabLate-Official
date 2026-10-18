import { siteConfig, withCabAiAttribution } from './siteConfig';

export const authorityProfile = {
  publicName: 'CabLate',
  alternateName: 'Cab',
  claim: '判斷力比執行力值錢。',
  shortBio: '在第一線教 AI 落地的講師：從農會推廣人員教到外商工程團隊。工程師出身，每天用 Claude Code 工作，也做有人在用的開源工具。',
  humanBio: '我教的是判斷：AI 該不該用、怎麼用才划算。教過非技術團隊，也教過工程團隊。',
  authorUrl: 'https://cablate.com/about/',
  sameAs: [
    siteConfig.threadsUrl,
    siteConfig.githubUrl,
  ],
} as const;

/** 全站唯一的作者實體；Article author、ProfilePage mainEntity、Service provider 都用它 */
export const personEntity = {
  '@type': 'Person',
  '@id': `${authorityProfile.authorUrl}#person`,
  name: 'Cab',
  alternateName: 'CabLate',
  url: authorityProfile.authorUrl,
  sameAs: authorityProfile.sameAs,
} as const;

/** 首頁、服務頁與 About 共用的證據數字；更新時連日期一起改 */
export const proofPoints = [
  { value: '500+', unit: '人', label: '上過我的講座、工作坊和企業內訓', asOf: '2026-09' },
  { value: '30+', unit: '場', label: '講座、工作坊與企業內訓', asOf: '2026-09' },
  { value: '4.5+', unit: '/ 5', label: 'AgentSkill 講座與課程評價', asOf: '2026-10' },
  { value: '1 萬+', unit: '人', label: '在 Threads 追蹤我寫 AI', asOf: '2026-10' },
] as const;

export const signatureMethods = [
  {
    title: 'Context Engineering',
    definition: '在 AI 需要的時候，給它對的版本、剛好夠用的資料。一次塞滿通常更糟。',
    problem: '適合：對話越長越亂，或換人、換一輪就忘了前面講過什麼。',
  },
  {
    title: 'Skill 路線設計',
    definition: 'Skill 是一套能重複用的做法：什麼時候用、先判斷什麼、哪些事不能做、做完怎麼檢查，事先寫好。',
    problem: '適合：AI 每次都重新猜做法，品質忽好忽壞。',
  },
  {
    title: 'Harness Engineering',
    definition: '任務怎麼寫、工具怎麼選、資料怎麼給、出錯怎麼接回來，這些加起來決定 AI 能不能穩定做完事。模型強弱只占一部分。',
    problem: '適合：AI 試一次很厲害，放進每天的工作就常出狀況。',
  },
] as const;

export const representativeWork = [
  {
    type: '工程手冊',
    title: 'Claude Code 深度工程手冊',
    description: '把 Claude Code 每天實際在用的設定和踩過的坑整理成手冊，包含 Skill、Memory、Hook、Context 與 Harness。',
    proof: '18 章、46 堂，截至 2026-10',
    href: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'work_handbook'),
  },
  {
    type: '開源工具',
    title: 'mcp-google-map',
    description: '把 Google Maps 做成可以直接裝進 AI 工具的 MCP 套件，發布在 GitHub 和 npm。',
    proof: '465 stars／93 forks，截至 2026-10-06',
    href: 'https://github.com/cablate/mcp-google-map',
  },
  {
    type: '實作型教學',
    title: '金流串接與產品交付教學',
    description: '從 API 做到訂單狀態、Webhook、簽章、權限與錯誤處理，學員最後會走完一條能上線的收款流程。',
    proof: '上線首月售出 42 份（2025-11）',
    href: '/courses/',
  },
  {
    type: '資料型產品',
    title: 'banini-tracker',
    description: '抓社群貼文、用 AI 分析、即時推播，再拿後續股價對照，整套開源可部署。',
    proof: '375 stars／55 forks，截至 2026-10-06',
    href: 'https://github.com/cablate/banini-tracker',
  },
] as const;

export const openSourceProofs = [
  {
    kind: '開源工具',
    title: 'mcp-google-map',
    headline: '把 Google Maps 做成 AI 可以直接用的工具。',
    description: '裝起來之後，Claude 這類 AI 就能查地點、算路線、排行程。程式碼、安裝說明和 npm 套件都公開，要改要查都可以。',
    capability: 'MCP 工具介面、安裝文件、npm 套件。',
    metric: '465 stars／93 forks',
    asOf: '2026-10-06',
    href: 'https://github.com/cablate/mcp-google-map',
    sourceLabel: '去 GitHub 看',
  },
  {
    kind: '資料型產品',
    title: 'banini-tracker',
    headline: '抓社群貼文、AI 分析，再對照後來的股價。',
    description: '一條流程串起貼文抓取、AI 分析、Telegram／Discord／LINE 推播和後續股價驗證。分析完不是就結束，之後真的漲跌也會記下來對照。',
    capability: '資料抓取、AI 分析、通知和事後驗證怎麼接在一起。',
    metric: '375 stars／55 forks',
    asOf: '2026-10-06',
    href: 'https://github.com/cablate/banini-tracker',
    sourceLabel: '看程式碼',
  },
  {
    kind: '公開研究',
    title: 'claude-code-research',
    headline: '拆 Claude Code 和 Agent SDK 內部怎麼運作。',
    description: '我自己研究 Claude Code 時的筆記，持續公開更新。想知道某個行為為什麼會這樣，可以來這裡查來源。',
    capability: '研究筆記、資料來源、更新紀錄。',
    metric: '171 stars／72 forks',
    asOf: '2026-10-06',
    href: 'https://github.com/cablate/claude-code-research',
    sourceLabel: '看研究',
  },
] as const;

/** 教過的對象類型；客戶名稱未授權，一律寫產業與職能 */
export const audienceTypes = [
  '農會推廣人員',
  '證券業 PM、QA、維運',
  '外商前端、後端、QA 工程師',
  '物流與行銷團隊',
  '地方工作者與基金會',
  '想把 AI 用進工作的創作者與工程師',
] as const;

/** 精選場次；數字口徑依講師與企業培訓經歷主檔，未核實的不放 */
export const teachingSessions = [
  { id: 'invited', time: '2025.07', title: '第一次受邀分享', audience: '開發者社群', format: '講座', detail: '分享 AI 怎麼用在真實工作上。', tags: ['開發者社群'] },
  { id: 'security', time: '2025.10', title: '自辦網站資安入門講座', audience: '想自己做網站的人', format: '線上', detail: '200 多人報名。', tags: ['200+ 報名', '自辦'] },
  { id: 'agentskill', time: '2026.02', title: 'AgentSkill 講座', audience: '已經在用 AI 的人', format: '線上', detail: '售出 146 份，問卷平均 4.59 / 5（74 份）。後來整理成線上課。', tags: ['146 份', '4.59 / 5'] },
  { id: 'logistics', time: '2026.04', title: '企業 Claude 內訓', audience: '物流與行銷團隊', format: '實體約 6 小時', detail: '讓沒寫過程式的人也能用 Claude 處理自己的工作。', tags: ['企業內訓', '非技術'] },
  { id: 'securities', time: '2026.08', title: '非工程職 Claude Agent 內訓', audience: '證券業 PM、QA、維運', format: '線上 4 小時', detail: '用他們自己的業務案例，現場做出自己業務用的 Agent。', tags: ['企業內訓', '非工程職'] },
  { id: 'association', time: '2026.09', title: 'AI Codex 兩日班', audience: '全國性協會的推廣人員', format: '實體 16 小時', detail: '從整理資料走到做出網站，兩天課堂上做出 23 個網站。', tags: ['16 小時', '23 個網站'] },
  { id: 'engineering', time: '2026.09', title: 'Claude Code 系統化開發', audience: '外商前端、後端、QA 工程師', format: '實體 6 小時', detail: '課前收 31 筆需求，現場以實作、講評和問答為主。', tags: ['工程團隊', '29 人出席'] },
] as const;

/** Threads 原句；逐字引用，附日期與貼文 */
export const threadsQuotes = [
  { text: 'AI 很會拆工作，但不一定拆得划算。', date: '2026-07-13', postId: 'DaurrciFNfm' },
  { text: '不要為了自動化，延伸出一個原本讓你做自動化的痛點。', date: '2026-08-26', postId: 'Dcf9y11FHt1' },
  { text: '不然你用的永遠只是 AI，不是「你的 AI」', date: '2026-07-08', postId: 'Dah4EYOFFyb' },
  { text: '如果它說『完成了』但沒有附上驗證或說明，請不要相信，它很可能在騙你。', date: '2026-05-04', postId: 'DX60sO6FOfY' },
  { text: '很多時候並非模型要變聰明，更重要的是會復盤自己怎麼用 AI 的。', date: '2026-02-05', postId: 'DUXdXMUEnBX' },
] as const;

/** 可以上的主題與形式 */
export const teachingTopics = [
  { title: 'Claude 實戰入門', fit: '非技術團隊', note: '從聊天走到讓 AI 處理自己的工作' },
  { title: '做一個自己業務用的 Agent', fit: '非工程職、PM、營運', note: '用你們自己的案例現場做' },
  { title: 'Claude Code／Codex 系統化開發', fit: '工程團隊', note: '實作、講評、問答為主' },
  { title: 'Agent Skill 設計', fit: '已經在用 AI 的人', note: '把做對一次的方法留下來' },
  { title: 'Vibe Coding 做出第一個網站', fit: '完全新手', note: '兩天內做出能上線的成果' },
  { title: '網站資安入門', fit: '自己做網站的人', note: '常見的坑和最低限度的防護' },
] as const;

export const teachingFormats = ['演講 30–60 分鐘', '半日工作坊 4 小時', '全日 6–7 小時', '兩日班 16 小時', '線上直播'] as const;

/** About 頁作品清單的補充項目（不放大卡） */
export const moreOpenSource = [
  { title: 'Claude-Code-Board', description: '用看板介面操作 Claude Code', metric: '156 ★', href: 'https://github.com/cablate/Claude-Code-Board' },
  { title: 'llm-atomic-wiki', description: '延伸 Karpathy 的 LLM Wiki 做法，實際跑過一輪整理出來', metric: '149 ★', href: 'https://github.com/cablate/llm-atomic-wiki' },
] as const;

export const deliveryExperienceProofs = [
  {
    kind: '實作型課程',
    headline: '帶學員從 API 做到真的能收錢。',
    description: '訂單狀態、Webhook、簽章、權限、錯誤處理都要自己接一次。課程結束時，學員手上有一條跑得動的收款流程。',
    proof: '上線首月售出 42 份',
  },
  {
    kind: '工程手冊',
    headline: 'Claude Code 深度工程手冊，18 章 46 堂。',
    description: '把 CLAUDE.md、Memory、Skill、Hook、Context 和 Harness 的實際用法寫下來。遇到問題時翻得到，不用每次重新猜。',
    proof: '18 章、46 堂',
  },
  {
    kind: '線上課程',
    headline: 'AgentSkill：教你設計自己的 Skill。',
    description: '講 Skill 為什麼要這樣寫、怎麼拆、怎麼檢查。從講座整理成課，首場講座問卷平均 4.59 / 5（74 份）。',
    proof: '200+ 人購買，4.6 / 5',
  },
] as const;

export const learningPath = [
  {
    stage: '還不知道卡在哪',
    situation: '不知道問題出在 Prompt、資料、Skill 還是流程',
    title: '免費 AI 工作流健檢',
    outcome: '拿一件最近做壞的任務，照五個問題檢查一遍。做完會知道先修哪一層，和下一個可以馬上試的動作。',
    price: '免費',
    href: '/expertise/',
    cta: '開始健檢',
  },
  {
    stage: '想快速入門一個主題',
    situation: '想一兩個小時搞懂一件事，或讓團隊有共同說法',
    title: '講座與工作坊',
    outcome: '現場示範加實作。個人會知道怎麼開始，團隊會有一套一起用的判斷方式。',
    price: null,
    href: 'https://tbr.digital/claude',
    cta: '看近期講座',
  },
  {
    stage: '做對一次，下次又不對',
    situation: '已經在用 Skill，還是要一直重講規則',
    title: 'AgentSkill：讓 AI 成為你的協作者',
    outcome: '拿你現有的任務或 Skill 找出哪裡失效，把有用的判斷、順序和限制寫進去。200 多人買過，評價 4.6 / 5。',
    price: 'NT$1,500，一次付費',
    href: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'courses_agentskill'),
    cta: '看課程，有免費試看',
  },
  {
    stage: '天天用 Claude Code，常出狀況',
    situation: '天天用 Claude Code，設定、記憶、成本常出問題',
    title: 'Claude Code 深度工程手冊',
    outcome: '18 章、46 堂。遇到問題先翻到對應章節：CLAUDE.md、Memory、Skill、Hook、Harness，一章一章排錯。',
    price: 'NT$5,999，一次付費',
    href: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'courses_handbook'),
    cta: '看手冊，有免費試看',
  },
] as const;

export const serviceTracks = [
  {
    id: 'workflow-diagnosis',
    title: 'AI 工作流診斷',
    outcome: '找出問題卡在哪一段、AI 適合幫哪一段，整理出第一條可以試的流程。',
    fit: ['已經在用 AI，但流程常常出錯或要重做', '手上有明確的任務、資料或產品', '需要外部的人幫忙排先後'],
    notFit: '只想要一個萬用 Prompt，或沒有資料和負責人，卻希望 AI 自己把事情做完。',
    deliverables: ['現況和主要問題', 'AI 適合幫忙的位置和風險', '第一版流程和完成標準', '後續要實作、上課還是換工具的建議'],
  },
  {
    id: 'training',
    title: '企業內訓與工作坊',
    outcome: '團隊用同一套說法理解 AI，拿自己的工作練習怎麼分配任務、給資料、檢查結果。',
    fit: ['團隊裡每個人用 AI 的方式差很多', '需要依職務和產業設計內容', '不想上完課只剩一疊筆記'],
    notFit: '只想追一輪熱門工具，沒打算提供團隊的實際工作，也沒想好課後要留下什麼。',
    deliverables: ['課前需求和學員盤點', '客製課綱、示範案例和練習題', '工作坊和學員練習成果', '課後改善建議'],
  },
  {
    id: 'agent-adoption',
    title: 'AI 產品與 Agent 導入',
    outcome: '把一個明確的使用情境，做成團隊能天天用、也能維護的 AI 工具或 Agent。',
    fit: ['已經有明確的使用者、資料和工作流程', '要從原型走到真的有人在用', '團隊願意提供資料、內部窗口和完成標準'],
    notFit: '還沒想清楚要解決什麼、資料在哪、誰負責，就期待買一套 AI 平台解決所有事。',
    deliverables: ['需求、使用者和風險拆解', '系統架構和 Agent 環境設計', '原型、技術方案或導入計畫', '測試、交接和後續改善'],
  },
] as const;

export const primaryNavigationGroups = [
  // Exploration routes are temporarily hidden from the primary navigation.
  {
    label: '合作方式',
    overviewHref: '/services/',
    items: [
      { label: '專案諮詢', railLabel: '60 分鐘，看清楚卡在哪', href: '/services/consulting/' },
      { label: 'AI 應用陪跑', railLabel: '五週一對一，一起做下去', href: '/services/coaching/' },
      { label: '企業合作', railLabel: '內訓、工作坊、導入', href: '/services/enterprise/' },
      { label: '講師與內容', railLabel: '演講、共創、產品合作', href: '/services/partnerships/' },
    ],
  },
  {
    label: '自己來',
    items: [
      { label: '免費健檢', railLabel: '五個問題找出 AI 卡在哪', href: '/expertise/' },
      { label: '課程與手冊', railLabel: 'AgentSkill、Claude Code 手冊', href: '/courses/' },
      { label: '電子報', railLabel: '每封拆一個 AI 卡點', href: '/newsletter/' },
    ],
  },
  {
    label: '關於',
    items: [
      { label: '作品與經歷', railLabel: '開源工具、手冊、講座', href: '/about/#public-output-title' },
      { label: '關於 Cab', railLabel: '從工程師到 AI 講師', href: '/about/' },
    ],
  },
] as const;
