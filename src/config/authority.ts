export const authorityProfile = {
  publicName: 'CabLate',
  alternateName: 'Cab',
  claim: '判斷力比執行力值錢。',
  shortBio: '我從全端工程與系統設計出發，現在專注於 AI 應用、Agent 工作流程與數位產品落地。我把複雜技術拆成清楚的步驟，幫助個人、團隊與企業做出能實際運作、也能檢查成果的系統。',
  humanBio: '我把複雜技術講成人話，幫創作者、小團隊和企業釐清問題、設計流程，讓 AI 不只會聊天，也能穩定完成工作。',
  authorUrl: 'https://cablate.com/about/',
  sameAs: [
    'https://www.threads.net/@cab_late',
    'https://github.com/cablate',
  ],
} as const;

export const publicProofs = [
  { value: '4.59 / 5', label: '講座回饋', detail: '81 筆', asOf: '2026-05' },
  { value: '5.5K+', label: 'Threads 追蹤', detail: '持續分享 AI 與 Agent 實戰', asOf: '2026-05' },
  { value: '500+', label: '電子報訂閱', detail: '長期收到第一手觀察', asOf: '2026-05' },
] as const;

export const visitorPaths = [
  {
    index: '01',
    title: '建立可靠的 AI／Agent 工作流',
    description: '不急著多裝工具，先把任務、Context、Skill、驗收與出錯後的處理方式接成一套流程。',
    href: '/articles/',
    linkLabel: '先讀實戰文章',
  },
  {
    index: '02',
    title: '把想法做成可上線產品',
    description: '從需求拆解、AI 協作、部署到金流，把想法做成能上線、能收款，也能持續維護的產品。',
    href: '/courses/',
    linkLabel: '查看學習路線',
  },
  {
    index: '03',
    title: '讓團隊真正導入 AI',
    description: '先釐清問題與現有流程，再決定該培訓、實作還是自動化，避免工具買了卻用不起來。',
    href: '/services/',
    linkLabel: '查看合作方式',
  },
] as const;

export const signatureMethods = [
  {
    title: 'Harness Engineering',
    definition: '模型夠不夠強，只是其中一部分。任務怎麼寫、工具怎麼選、資料怎麼提供、錯誤怎麼發現與復原，合在一起才決定成果是否穩定。',
    problem: '適合：AI 單次表現不錯，放進日常流程後卻經常失控。',
  },
  {
    title: 'Context Engineering',
    definition: 'Context 不是愈多愈好。關鍵是讓 AI 在需要時，拿到正確版本、剛好足夠的資訊。',
    problem: '適合：對話愈長愈混亂，或換人、換回合後容易失去前文。',
  },
  {
    title: 'Skill 路線設計',
    definition: 'Skill 是一套可重複執行的工作方法：何時啟動、先判斷什麼、哪些事不能做、最後怎麼驗收，都要事先說清楚。',
    problem: '適合：AI 每次都重新猜做法，導致產出品質忽好忽壞。',
  },
] as const;

export const representativeWork = [
  {
    type: '旗艦知識產品',
    title: 'Claude Code 深度工程手冊',
    description: '把半年以上的 Skill、Memory、Hook、Context 與 Harness 實作經驗，整理成可查閱、可排錯，也方便交接的工程手冊。',
    proof: '45 課已發布，截至 2026-06-24',
    href: 'https://cabai.cablate.com',
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

export const beliefs = [
  'AI 讓執行愈來愈便宜，但錯的方向只會被執行得更快。',
  '工具會過時，Context、任務拆解與驗收能力會留下。',
  '不懂原理的 Vibe Coding，最後會在真實使用者面前還債。',
] as const;

export const expertiseAreas = [
  {
    id: 'harness-engineering',
    title: 'Harness Engineering',
    summary: '設計 Agent 執行任務時需要的工具、權限、記憶、Context、驗收、復原與交接方式。',
    proof: '相關實作：Claude Code 深度工程手冊、Harness Engineering 研究與多套 Agent 工作流程。',
  },
  {
    id: 'context-engineering',
    title: 'Context Engineering',
    summary: '不追求塞入最多資料，而是在適當時機，以合理成本提供剛好足夠、版本正確的資訊。',
    proof: '相關研究：Context、Memory、Session handoff、Prompt Cache 與失效診斷。',
  },
  {
    id: 'skill-design',
    title: 'Skill 設計與治理',
    summary: '把啟動條件、處理順序、限制與驗收方式，整理成 AI 可以重複執行的工作方法。',
    proof: '相關實作：AgentSkill 講座、Claude Code 手冊與實際 workspace skills。',
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding 與產品落地',
    summary: '把 AI 寫程式從展示原型往前推進，補齊需求、架構、測試、部署、金流與交付。',
    proof: '相關實作：四週 VibeCoding 課、金流串接課、Interactive Engine 與 cabai。',
  },
  {
    id: 'teaching-design',
    title: 'AI 教學與課程設計',
    summary: '依照受眾與課程目標，調整互動方式、安裝門檻、示範難度與課堂產出。',
    proof: '相關經驗：公開講座、四週陪跑、企業內訓、工作坊與線上大班。',
  },
  {
    id: 'claude-code-agent-workflows',
    title: 'Claude Code 與 Agent 工作流',
    summary: '把任務、工具、Context、記憶、權限與驗收方式接起來，形成可長期維護的工程流程。',
    proof: '相關實作：Claude Code 深度工程手冊、公開研究與多套 Agent 工作流程。',
  },
] as const;

export const openSourceProofs = [
  {
    title: 'mcp-google-map',
    description: '把 Google Maps 能力包成 Agent 可使用的 MCP 工具。',
    metric: '365 stars／75 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/mcp-google-map',
  },
  {
    title: 'banini-tracker',
    description: '把社群貼文、AI 分析、即時推送與股價驗證串成可部署的資料產品。',
    metric: '287 stars／49 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/banini-tracker',
  },
  {
    title: 'claude-code-research',
    description: '持續整理 Claude Code 與 Agent 工作流的公開研究。',
    metric: '159 stars／67 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/claude-code-research',
  },
] as const;

export const learningPath = [
  {
    stage: '先判斷方向',
    title: '免費內容與 Starter Pack',
    outcome: '先看懂自己卡在哪，安全地開始第一個 Claude Code 與 AI 協作流程。',
    fit: '適合剛開始使用，還不確定是否需要完整課程的人。',
    href: '/starter-pack/',
    cta: '從免費資源開始',
  },
  {
    stage: '看清問題全貌',
    title: '講座與工作坊',
    outcome: '用一個明確主題、實際示範與小型練習，快速掌握全貌並確認下一步。',
    fit: '適合想在短時間內建立共同語言、釐清行動方向的人。',
    href: null,
    cta: '目前未開放公開報名',
  },
  {
    stage: '建立可操作能力',
    title: '系統課程',
    outcome: '透過課綱、範例、實作與問答，把一項能力練到可以獨立使用。',
    fit: '適合已有明確題目，想完成作品或商業流程的人。',
    href: null,
    cta: '目前未開放公開報名',
  },
  {
    stage: '反覆查閱與診斷',
    title: 'Claude Code 深度工程手冊',
    outcome: '理解 Agent 系統如何設計、常在哪裡失效，以及該怎麼維護與交接。',
    fit: '適合已經在使用 Claude Code，希望把工作流程做得更穩定的人。',
    href: 'https://cabai.cablate.com',
    cta: '查看深度手冊',
  },
] as const;

export const serviceTracks = [
  {
    id: 'workflow-diagnosis',
    title: 'AI 工作流診斷',
    outcome: '釐清問題真正卡在哪、找出 AI 適合介入的位置，設計第一條能執行、也能檢查成果的流程。',
    fit: ['已經在用 AI，但流程反覆失控', '有明確任務、資料或產品情境', '需要外部判斷協助排定優先順序'],
    notFit: '只想取得一個萬用提示詞，或希望在沒有資料與負責人的情況下，讓 AI 自動解決所有問題。',
    deliverables: ['現況與問題地圖', 'AI 可介入點與風險', '第一版工作流與驗收方式', '後續實作或訓練建議'],
  },
  {
    id: 'training',
    title: '企業內訓與工作坊',
    outcome: '讓團隊建立共同語言，並透過示範與實作，理解 AI 適合做什麼、不能做什麼，以及該如何開始。',
    fit: ['團隊對 AI 的理解落差很大', '需要依職能與情境設計教材', '希望課後能留下可使用的工作方法'],
    notFit: '只想追一輪熱門工具，卻不打算提供團隊情境，也沒有定義課後要留下什麼成果。',
    deliverables: ['課前需求與受眾盤點', '客製課綱與示範情境', '工作坊與實作設計', '課後建議與延伸路線'],
  },
  {
    id: 'agent-adoption',
    title: 'AI 產品與 Agent 導入',
    outcome: '把需求、資料、工具、權限、Context 與驗收方式接起來，做成可以持續運作的產品或 Agent 系統。',
    fit: ['已有明確使用者與流程', '需要從原型走到可維護交付', '團隊願意提供必要資料、內部負責人與驗收條件'],
    notFit: '還沒有明確問題、資料來源與內部負責人，卻期待買一套 AI 平台就能解決所有事情。',
    deliverables: ['需求與風險拆解', '系統與 Agent 工作環境設計', '原型或導入路線圖', '驗收、交接與後續優化方案'],
  },
] as const;

export const primaryNavigation = [
  { label: '方法與文章', mobileLabel: '文章', railLabel: 'Field Notes', href: '/articles/' },
  { label: '專業方法', mobileLabel: '方法', railLabel: 'Methods', href: '/expertise/' },
  { label: '作品', mobileLabel: '作品', railLabel: 'Projects', href: '/work/' },
  { label: '學習', mobileLabel: '學習', railLabel: 'Learn', href: '/courses/' },
  { label: '合作', mobileLabel: '合作', railLabel: 'Work Together', href: '/services/' },
  { label: '關於', mobileLabel: '關於', railLabel: 'About', href: '/about/' },
] as const;
