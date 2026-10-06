/**
 * 網站數字與連結集中管理
 * 所有需要動態更新的數字、連結都在這裡修改，不要 hardcode 在頁面裡。
 */

export function withCabAiAttribution(url: string, campaign: string) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}utm_source=cablate&utm_medium=personal_site&utm_campaign=${encodeURIComponent(campaign)}`;
}

export const siteConfig = {
  /** 社群 */
  threadsUrl: 'https://www.threads.net/@cab_late',
  githubUrl: 'https://github.com/cablate',

  /** 公開聯絡方式 */
  contactEmail: 'cablate@cablate.com',

  /** CabAI 學習、商品與社群入口 */
  cabAi: {
    homeUrl: 'https://cabai.cablate.com/',
    productsUrl: 'https://cabai.cablate.com/products',
    libraryUrl: 'https://cabai.cablate.com/library',
    agentSkillUrl: 'https://cabai.cablate.com/products/agentskill-course',
    handbookUrl: 'https://cabai.cablate.com/products/cc-deep-engineering',
    accountUrl: 'https://cabai.cablate.com/login?callbackUrl=%2Fdashboard',
  },

  /** 電子報對外說法；訂閱頁、確認頁、隱私權政策都引用這裡 */
  newsletter: {
    promise: '每封拆一個真實的 AI 卡點：我怎麼判斷、哪裡容易出錯、什麼時候不該用 AI。',
    cadence: '有值得寫的才寄，不會天天寄。新課程和講座開放時也會通知你。',
    privacyUse: '寄送電子報內容，以及新課程、手冊更新或公開活動的通知',
  },

  // External service IDs
  ga4Id: 'G-HY45BRFPS6',
  gscVerification: 'JtR8mljV6TbefiOMzYMBg5Lgkv2GLkOkTH9FP5-ZDTA',
  convertKit: {
    formId: '8921948',
    uid: '2fbc45ae53',
  },
} as const;
