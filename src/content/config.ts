/**
 * Content Collections Configuration
 * 定義文章和課程的 Frontmatter Schema
 */

import { defineCollection, z } from 'astro:content';

// ═══════════════════════════════════════════════════════════
// Articles Collection - 文章集合
// ═══════════════════════════════════════════════════════════

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    // SEO 基礎
    title: z.string().max(60, '標題不超過 60 字元'),
    description: z.string().max(160, '描述不超過 160 字元'),

    // 發布資訊
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),

    // 分類與標籤
    category: z.string(),
    tags: z.array(z.string()).default([]),

    // 社群媒體
    ogImage: z.string().optional(),
    excerpt: z.string().max(200, '摘要不超過 200 字元').optional(),

    // 內容設定
    readingTime: z.number().optional(),  // 閱讀時間（分鐘）
    featured: z.boolean().default(false),  // 是否精選

    // SEO 強化
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),  // FAQ 結構化資料
  }),
});

// ═══════════════════════════════════════════════════════════
// Courses Collection - 課程集合
// ═══════════════════════════════════════════════════════════

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    // SEO 基礎
    title: z.string().max(60, '標題不超過 60 字元'),
    description: z.string().max(160, '描述不超過 160 字元'),

    // 發布資訊
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),

    // 課程資訊
    price: z.number().nonnegative('價格必須為正數'),
    level: z.enum(['初級', '中級', '高級']),
    duration: z.string(),  // "3 小時" 或 "self-paced"

    // 分類
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),

    // 社群媒體
    ogImage: z.string().optional(),
    excerpt: z.string().max(200).optional(),

    // 課程狀態
    status: z.enum(['draft', 'pre-sale', 'active', 'archived']).default('draft'),

    // 銷售頁：結帳連結（指向 shop.cablate.com）
    checkoutUrl: z.string().url().optional(),

    // 銷售頁：課程包含什麼（3-6 點）
    features: z.array(z.string()).default([]),

    // 銷售頁：適合誰 / 不適合誰
    targetAudience: z.array(z.string()).default([]),
    notFor: z.array(z.string()).default([]),

    // 銷售頁：FAQ 結構化資料
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),

    // 銷售頁：學員見證
    testimonials: z.array(z.object({
      name: z.string(),
      role: z.string(),
      quote: z.string(),
    })).optional(),
  }),
});

// ═══════════════════════════════════════════════════════════
// Export Collections
// ═══════════════════════════════════════════════════════════

export const collections = {
  articles,
  courses,
};
