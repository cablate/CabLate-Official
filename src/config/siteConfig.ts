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

  // External service IDs
  ga4Id: 'G-HY45BRFPS6',
  gscVerification: 'JtR8mljV6TbefiOMzYMBg5Lgkv2GLkOkTH9FP5-ZDTA',
  convertKit: {
    formId: '8921948',
    uid: '2fbc45ae53',
  },
} as const;
