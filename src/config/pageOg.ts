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
    badge: '先從卡點開始',
    eyebrow: '先別急著選服務',
    headline: ['從你現在卡住的事情，', '決定適合的合作方式。'],
    description: '單次諮詢、五週陪跑、企業合作，或講師與內容合作。',
    footer: '四種入口・各有適用情境',
    accent: '#6c4ccf',
    accentSoft: '#d28b63',
    visual: { type: 'none' },
    imageAlt: 'CabLate 合作方式：從你現在卡住的事情，決定適合的合作方式。',
  },
  {
    slug: 'consulting',
    label: 'AI 專案卡關諮詢',
    badge: '一次 60 分鐘',
    eyebrow: '帶一個真的專案來',
    headline: ['已經做了一段時間，', '還是不知道問題在哪？'],
    description: '把做過什麼與反覆出錯的地方攤開，排出真正的下一步。',
    footer: '核心診斷・取捨判斷・行動卡',
    accent: '#b36d45',
    accentSoft: '#6f57b6',
    visual: { type: 'none' },
    imageAlt: 'AI 專案卡關諮詢：已經做了一段時間，還是不知道問題在哪？',
  },
  {
    slug: 'enterprise',
    label: '企業與團隊合作',
    badge: '診斷・工作坊・導入',
    eyebrow: '不先拿課程菜單',
    headline: ['一堂 AI 課，', '不會讓團隊把工作做穩。'],
    description: '先看能力、流程、資料、工具或管理，哪一段真的出了問題。',
    footer: '從真實工作與團隊現況出發',
    accent: '#456861',
    accentSoft: '#d18b5d',
    visual: { type: 'none' },
    imageAlt: '企業與團隊合作：一堂 AI 課，不會讓團隊把工作做穩。',
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
    headline: ['AI 成功做過一次，', '不等於真正完成。'],
    description: '我在意的不只功能能不能跑，而是能不能穩定、檢查與交付。',
    footer: 'CabLate / Work notes',
    accent: '#5f4da1',
    accentSoft: '#c98258',
    visual: { type: 'none' },
    imageAlt: '關於 CabLate：AI 成功做過一次，不等於真正完成。',
  },
];

export const pageOgBySlug = Object.fromEntries(pageOgEntries.map((entry) => [entry.slug, entry]));
