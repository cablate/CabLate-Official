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
    eyebrow: '不只把事情做快',
    headline: ['AI 已經做得很快了，', '難的是把事情真的做完。'],
    description: '先找出真正失效的一層，再決定 AI 該怎麼進來。',
    footer: '方法・課程・合作',
    accent: '#6c4ccf',
    accentSoft: '#e6a56f',
    visual: { type: 'none' },
    imageAlt: 'CabLate：AI 已經做得很快了，難的是把事情真的做完。',
  },
  {
    slug: 'expertise',
    label: 'AI 工作流健檢',
    badge: '免費診斷入口',
    eyebrow: '先別只改 Prompt',
    headline: ['AI 一直鬼打牆，', '先找出最值得修的一層。'],
    description: '依序檢查題目、資料、工具、狀態與驗收。',
    footer: '五層診斷・一個下一步',
    accent: '#466a62',
    accentSoft: '#d49a67',
    visual: { type: 'none' },
    imageAlt: 'AI 工作流健檢：AI 一直鬼打牆，先找出最值得修的一層。',
  },
  {
    slug: 'courses',
    label: '學習內容與課程',
    badge: '依卡點選擇',
    eyebrow: '不用照順序學',
    headline: ['先補你現在', '真正缺的那一塊。'],
    description: '免費診斷、講座、課程與工程手冊，缺哪一塊就先補哪一塊。',
    footer: '先找到真正缺的那一塊',
    accent: '#7653bd',
    accentSoft: '#d39162',
    visual: { type: 'none' },
    imageAlt: 'CabLate 學習內容與課程：先補你現在真正缺的那一塊。',
  },
  {
    slug: 'services',
    label: '合作方式',
    badge: '四種合作入口',
    eyebrow: '一次看懂或一起做',
    headline: ['卡住時，分清楚要一次看懂，', '還是找人一起做。'],
    description: '60 分鐘諮詢、五週陪跑、企業合作，或講師與內容合作。',
    footer: '個人・團隊・邀約',
    accent: '#6c4ccf',
    accentSoft: '#d28b63',
    visual: { type: 'none' },
    imageAlt: 'CabLate 合作方式：卡住時，分清楚要一次看懂，還是找人一起做。',
  },
  {
    slug: 'consulting',
    label: '專案卡關諮詢',
    badge: '一次 60 分鐘',
    eyebrow: '帶一個真的專案來',
    headline: ['已經做了一段時間，', '還是不知道問題在哪？'],
    description: '把做過什麼與反覆出錯的地方攤開，排出真正的下一步。',
    footer: '核心診斷・取捨判斷・行動卡',
    accent: '#b36d45',
    accentSoft: '#6f57b6',
    visual: { type: 'none' },
    imageAlt: '專案卡關諮詢：已經做了一段時間，還是不知道問題在哪？',
  },
  {
    slug: 'enterprise',
    label: '企業與團隊合作',
    badge: '診斷・工作坊・導入',
    eyebrow: '不先拿課程菜單',
    headline: ['讓團隊不只會用 AI，', '也知道怎麼把結果做穩。'],
    description: '把工作、角色、資料、安全與驗收接在一起。',
    footer: '診斷・工作坊・小型試點',
    accent: '#456861',
    accentSoft: '#d18b5d',
    visual: { type: 'none' },
    imageAlt: '企業與團隊合作：讓團隊不只會用 AI，也知道怎麼把結果做穩。',
  },
  {
    slug: 'partnerships',
    label: '講師・內容・產品合作',
    badge: '邀約入口',
    eyebrow: '先把合作條件說清楚',
    headline: ['想邀演講、辦工作坊，', '或一起做內容？'],
    description: '先對齊受眾、成果、形式、時程、預算與使用範圍。',
    footer: '適合才往下談',
    accent: '#8b5b43',
    accentSoft: '#6c58ad',
    visual: { type: 'none' },
    imageAlt: '講師、內容與產品合作：想邀演講、辦工作坊，或一起做內容？',
  },
  {
    slug: 'about',
    label: '關於 CabLate',
    badge: '工程・教學・產品',
    eyebrow: '從工程出發',
    headline: ['我從工程出發，', '所以不把 AI 成功一次當成完成。'],
    description: '我在意的不只功能能不能跑，而是能不能穩定、檢查與交付。',
    footer: 'CabLate / Work notes',
    accent: '#5f4da1',
    accentSoft: '#c98258',
    visual: { type: 'none' },
    imageAlt: '關於 CabLate：我從工程出發，所以不把 AI 成功一次當成完成。',
  },
  {
    slug: 'subscribe',
    label: 'CabLate',
    badge: '電子報',
    eyebrow: '',
    headline: ['訂閱 CabLate 的電子報'],
    description: '',
    footer: '免費訂閱',
    accent: '#6c4ccf',
    accentSoft: '#e6a56f',
    visual: { type: 'none' },
    imageAlt: '訂閱 CabLate 的電子報',
  },
];

export const pageOgBySlug = Object.fromEntries(pageOgEntries.map((entry) => [entry.slug, entry]));
