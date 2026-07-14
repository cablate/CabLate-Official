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
    headline: '把一項 API 能力，整理成別人裝得起來、也接得下去的工具。',
    description: '這個開源工具把 Google Maps 能力整理成可安裝的 MCP 工具，公開程式碼與 npm 套件。別人不只可以看到成果，也能實際使用、追查做法，再從現有介面繼續改。',
    capability: '看得到工具介面、安裝方式與可延伸的公開程式碼。',
    metric: '365 stars／75 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/mcp-google-map',
    sourceLabel: '查看公開程式碼',
  },
  {
    kind: '資料型產品',
    title: 'banini-tracker',
    headline: '把分散的社群訊號，做成能一路追到結果的資料流程。',
    description: '這套資料產品串起社群貼文、AI 分析、即時推送與後續股價驗證。它留下的不是單次分析，而是一條可以部署、檢查與繼續追蹤的流程。',
    capability: '看得到資料整合、AI 分析、通知與後續驗證怎麼接在一起。',
    metric: '287 stars／49 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/banini-tracker',
    sourceLabel: '查看公開程式碼',
  },
  {
    kind: '公開研究',
    title: 'claude-code-research',
    headline: '把實作研究持續公開，讓方法不只停在一篇貼文裡。',
    description: '這個公開研究庫持續整理 Claude Code 與 Agent 工作流的研究。讀者能回頭查資料、看更新，也能檢查方法怎麼形成。',
    capability: '看得到研究資料、整理脈絡與持續更新的紀錄。',
    metric: '159 stars／67 forks',
    asOf: '2026-07-02',
    href: 'https://github.com/cablate/claude-code-research',
    sourceLabel: '查看公開研究',
  },
] as const;

export const deliveryExperienceProofs = [
  {
    kind: '實作型課程',
    headline: '不只講懂概念，也帶人走完一條可以上線的流程。',
    description: '從 API 一路做到訂單狀態、Webhook、簽章、權限與錯誤處理，讓學員實際走完收款流程，而不是只看功能示範。',
    proof: '40+ 位學員',
  },
  {
    kind: '工程手冊',
    headline: '把長期實作整理成能查閱、排錯與交接的內容。',
    description: 'Agent 深度工程手冊把半年以上的 Claude Code 經驗拆成 45 課，整理 Skill、Memory、Hook、Context 與 Harness 的實際用法。',
    proof: '45 課已發布',
  },
] as const;

export const learningPath = [
  {
    stage: '先判斷方向',
    situation: '還不確定問題在哪，也不想先買錯內容',
    title: '免費問題診斷',
    outcome: '先看懂自己卡在哪，再決定需要哪種學習深度。',
    price: '免費',
    href: '/expertise/',
    cta: '先做問題診斷',
  },
  {
    stage: '看清問題全貌',
    situation: '想在短時間內建立共同語言、釐清方向',
    title: '講座與工作坊',
    outcome: '用一個明確主題、實際示範與小型練習，快速掌握全貌並確認下一步。',
    price: null,
    href: null,
    cta: '尚未開放',
  },
  {
    stage: '建立可操作能力',
    situation: 'AI 每次都要重新交代，成果仍然反覆重做',
    title: 'AgentSkill：讓 AI 成為你的協作者',
    outcome: '用觀念與案例說明 Skill 的設計方法，把有效的 AI 協作方式留下來重複使用。',
    price: 'NT$1,500，一次付費',
    href: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'courses_agentskill'),
    cta: '查看課程與免費試看',
  },
  {
    stage: '反覆查閱與診斷',
    situation: '已經在用 Claude Code，但工作流程還不夠穩定',
    title: 'Agent 深度工程手冊',
    outcome: '理解 Agent 系統如何設計、常在哪裡失效，以及該怎麼維護與交接。',
    price: 'NT$5,999，一次付費',
    href: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'courses_handbook'),
    cta: '查看手冊與免費試看',
  },
] as const;

export const serviceTracks = [
  {
    id: 'workflow-diagnosis',
    title: 'AI 工作流診斷',
    outcome: '釐清問題卡在哪裡、找出 AI 適合介入的位置，設計第一條能執行、也能檢查的流程。',
    fit: ['已經在用 AI，但流程反覆失控', '有明確任務、資料或產品情境', '需要外部判斷協助排定優先順序'],
    notFit: '只想取得一個萬用提示詞，或希望在沒有資料與負責人的情況下，讓 AI 自動解決所有問題。',
    deliverables: ['現況與問題地圖', 'AI 可介入點與風險', '第一版工作流與驗收方式', '後續實作或訓練建議'],
  },
  {
    id: 'training',
    title: '企業內訓與工作坊',
    outcome: '團隊會一起練習怎麼分配工作給 AI、怎麼檢查結果，並帶走第一個能實際使用的流程。',
    fit: ['團隊對 AI 的理解落差很大', '需要依職能與情境設計教材', '希望課後能留下可使用的工作方法'],
    notFit: '只想追一輪熱門工具，卻不打算提供團隊情境，也沒有定義課後要留下什麼成果。',
    deliverables: ['課前需求與受眾盤點', '客製課綱與示範情境', '工作坊與實作設計', '課後建議與延伸路線'],
  },
  {
    id: 'agent-adoption',
    title: 'AI 產品與 Agent 導入',
    outcome: '先釐清誰會使用、AI 能讀哪些資料與權限，再設計成團隊能長期維護的產品或 Agent 系統。',
    fit: ['已有明確使用者與流程', '需要從原型走到可維護交付', '團隊願意提供必要資料、內部負責人與驗收條件'],
    notFit: '還沒有明確問題、資料來源與內部負責人，卻期待買一套 AI 平台就能解決所有事情。',
    deliverables: ['需求與風險拆解', '系統與 Agent 工作環境設計', '原型或導入路線圖', '驗收、交接與後續優化方案'],
  },
] as const;

export const primaryNavigation = [
  // Articles inbound links paused: 恢復全站文章導流時再放回主要導覽。
  // { label: '方法與文章', mobileLabel: '文章', railLabel: '文章索引', href: '/articles/' },
  { label: '專業方法', mobileLabel: '方法', railLabel: '診斷方法', href: '/expertise/' },
  { label: '作品', mobileLabel: '作品', railLabel: '公開作品', href: '/work/' },
  { label: '學習', mobileLabel: '學習', railLabel: '學習路線', href: '/courses/' },
  { label: '合作', mobileLabel: '合作', railLabel: '合作方式', href: '/services/' },
  { label: '關於', mobileLabel: '關於', railLabel: '作者檔案', href: '/about/' },
] as const;
