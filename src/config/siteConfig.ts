/**
 * 網站數字與連結集中管理
 * 所有需要動態更新的數字、連結都在這裡修改，不要 hardcode 在頁面裡。
 */

export const siteConfig = {
  /** 社群 & 訂閱 */
  threadsFollowers: '5K+',
  threadsUrl: 'https://www.threads.net/@cab_late',
  newsletterSubscribers: '500+',

  /** 課程 */
  vibeCodingStudents: '',      // 待填
  paymentCourseStudents: '',   // 待填
  vibeCodingUrl: '/courses/vibe-coding/',
  paymentCourseUrl: '/courses/payment-integration/',

  /** 講座 */
  lectureFeedbackScore: '4.59',
  lectureFeedbackCount: '81',

  /** 諮詢 */
  consultingSessions: '',      // 待填

  /** 內容 */
  totalViews: '1000 萬+',
  yearsExperience: '5',

  /** Lead Magnet */
  starterPackUrl: '/starter-pack/',

  /** 服務頁 */
  servicesUrl: '/services/',

  // External service IDs
  ga4Id: 'G-HY45BRFPS6',
  gscVerification: 'JtR8mljV6TbefiOMzYMBg5Lgkv2GLkOkTH9FP5-ZDTA',
  convertKit: {
    formId: '8921948',
    uid: '2fbc45ae53',
  },
} as const;
