/**
 * Content Collections Configuration
 * 定義文章的 Frontmatter Schema
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
    problemTag: z.string().max(24, '問題標籤不超過 24 字元').optional(),
    ogHighlight: z
      .object({
        label: z.string(),
        before: z.string(),
        after: z.string(),
      })
      .optional(),

    // 內容設定
    readingTime: z.number().optional(),  // 閱讀時間（分鐘）
    featured: z.boolean().default(false),  // 是否精選
  }),
});

// ═══════════════════════════════════════════════════════════
// Export Collections
// ═══════════════════════════════════════════════════════════

export const collections = {
  articles,
};
