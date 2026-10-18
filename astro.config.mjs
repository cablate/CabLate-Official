// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { rehypeArticleEnhance } from './src/plugins/rehype-article-enhance.mjs';

/** Article URL → last real edit, so sitemap lastmod reflects content instead of build time. */
const articlesDir = new URL('./src/content/articles/', import.meta.url);
const articleLastmod = new Map(
  readdirSync(articlesDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const frontmatter = readFileSync(new URL(file, articlesDir), 'utf8').split('---')[1] ?? '';
      const date = (/** @type {string} */ key) => frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1];
      const lastmod = date('updatedDate') ?? date('publishDate');
      return [`https://cablate.com/articles/${file.replace(/\.md$/, '')}/`, lastmod && new Date(lastmod).toISOString()];
    }),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://cablate.com',
  trailingSlash: 'always',
  redirects: {
    '/work': '/about/#public-output-title',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/confirm-subscription/') &&
        !page.includes('/subscribe/') &&
        !page.includes('/services/apply/') &&
        !page.includes('/404'),
      serialize: (item) => {
        const lastmod = articleLastmod.get(item.url);
        // Articles keep their real edit date; core pages (services, courses,
        // about…) have no article date, so fall back to build time — every
        // sitemap entry still carries a valid lastmod.
        return { ...item, lastmod: lastmod || new Date().toISOString() };
      },
    }),
  ],
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
    rehypePlugins: [rehypeArticleEnhance],
  },
});
