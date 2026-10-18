// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

/** Article URL → last real edit, so sitemap lastmod reflects content instead of build time. */
const articleLastmod = new Map(
  readdirSync('src/content/articles')
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const frontmatter = readFileSync(`src/content/articles/${file}`, 'utf8').split('---')[1] ?? '';
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
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
