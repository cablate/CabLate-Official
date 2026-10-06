export type PageOgVisual =
  | {
      type: 'none';
    }
  | {
      type: 'photo';
      src: string;
      position?: string;
      note: string;
    }
  | {
      type: 'index';
      mark: string;
      lines: string[];
    };

export interface PageOgEntry {
  slug: string;
  label: string;
  badge: string;
  eyebrow: string;
  headline: string[];
  description: string;
  footer: string;
  accent: string;
  accentSoft: string;
  visual: PageOgVisual;
  imageAlt: string;
}

export const pageOgEntries: PageOgEntry[] = [
  {
    slug: 'home',
    label: 'CabLate',
    badge: 'AI 協作・工作流程設計',
    eyebrow: '嗨，我是 Cab',
    headline: ['我在第一線教 AI 落地，', '自己也每天用它工作。'],
    description: '從農會推廣人員教到外商工程團隊。教的是判斷：AI 該不該用、怎麼用才划算。',
    footer: '企業內訓・講座・工作坊',
    accent: '#6c4ccf',
    accentSoft: '#e6a56f',
    visual: { type: 'none' },
    imageAlt: 'CabLate：我在第一線教 AI 落地，自己也每天用它工作。',
  },
  {
    slug: 'expertise',
    label: 'AI 工作流健檢',
    badge: '免費健檢',
    eyebrow: '先別急著改 Prompt',
    headline: ['AI 一直鬼打牆，', '先找出該修哪一層。'],
    description: '五個問題：題目、資料、工具、進度、驗收。',
    footer: '五個問題・一個下一步',
    accent: '#466a62',
    accentSoft: '#d49a67',
    visual: { type: 'none' },
    imageAlt: 'AI 工作流健檢：AI 一直鬼打牆，先找出該修哪一層。',
  },
  {
    slug: 'courses',
    label: '學習內容與課程',
    badge: '課程與手冊',
    eyebrow: '不用照順序學',
    headline: ['卡在哪，', '就先補哪。'],
    description: '免費健檢、講座、AgentSkill 課程和 Claude Code 手冊。',
    footer: '每一門都有免費試看',
    accent: '#7653bd',
    accentSoft: '#d39162',
    visual: { type: 'none' },
    imageAlt: 'CabLate 課程與手冊：卡在哪，就先補哪。',
  },
  {
    slug: 'services',
    label: '合作方式',
    badge: '合作方式',
    eyebrow: '價格都寫清楚',
    headline: ['AI 用到卡住了？', '先看卡在哪。'],
    description: '60 分鐘諮詢 NT$5,000、五週陪跑 NT$39,800，或企業內訓與導入。',
    footer: '諮詢・陪跑・企業合作',
    accent: '#6c4ccf',
    accentSoft: '#d28b63',
    visual: { type: 'none' },
    imageAlt: 'CabLate 合作方式：AI 用到卡住了？先看卡在哪。',
  },
  {
    slug: 'consulting',
    label: '專案卡關諮詢',
    badge: '一次 60 分鐘',
    eyebrow: '帶一個真的專案來',
    headline: ['已經做了一段時間，', '還是不知道問題在哪？'],
    description: '把做過什麼、一直出錯的地方攤開，排出下一步。',
    footer: '核心診斷・取捨判斷・行動卡',
    accent: '#b36d45',
    accentSoft: '#6f57b6',
    visual: { type: 'none' },
    imageAlt: '專案卡關諮詢：已經做了一段時間，還是不知道問題在哪？',
  },
  {
    slug: 'enterprise',
    label: '企業與團隊合作',
    badge: '內訓・工作坊・導入',
    eyebrow: '從農會推廣人員教到外商工程團隊',
    headline: ['團隊用 AI 做出來的東西，', '要別人接得住。'],
    description: '先看分工、資料和誰來檢查，再決定上課、改流程或試做。',
    footer: '診斷・工作坊・小型試點',
    accent: '#456861',
    accentSoft: '#d18b5d',
    visual: { type: 'none' },
    imageAlt: '企業合作：團隊用 AI 做出來的東西，要別人接得住。',
  },
  {
    slug: 'partnerships',
    label: '講師・內容・產品合作',
    badge: '講師與內容合作',
    eyebrow: '從開發者社群講到企業內訓',
    headline: ['想邀演講、辦工作坊，', '或一起做內容？'],
    description: '告訴我聽眾、形式、時間和預算，我會直接回你適不適合。',
    footer: '演講・工作坊・內容・產品',
    accent: '#8b5b43',
    accentSoft: '#6c58ad',
    visual: { type: 'none' },
    imageAlt: '講師、內容與產品合作：想邀演講、辦工作坊，或一起做內容？',
  },
  {
    slug: 'about',
    label: '關於 CabLate',
    badge: '工程師・講師',
    eyebrow: '工程師出身',
    headline: ['AI 做出來一次，', '我會再問下次還做得出來嗎？'],
    description: '做過政府標案系統，現在研究 AI、寫課、做開源工具。',
    footer: '工程・教學・開源',
    accent: '#5f4da1',
    accentSoft: '#c98258',
    visual: { type: 'none' },
    imageAlt: '關於 Cab：AI 做出來一次之後，我會再問下次還做不做得出來。',
  },
  {
    slug: 'subscribe',
    label: 'CabLate',
    badge: '電子報',
    eyebrow: '',
    headline: ['每封信，拆一個 AI 卡點'],
    description: '',
    footer: '免費訂閱',
    accent: '#6c4ccf',
    accentSoft: '#e6a56f',
    visual: { type: 'none' },
    imageAlt: '訂閱 Cab 的電子報：每封拆一個 AI 卡點',
  },
];

export const pageOgBySlug = Object.fromEntries(pageOgEntries.map((entry) => [entry.slug, entry]));
