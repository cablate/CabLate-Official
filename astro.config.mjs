// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
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
        !page.includes('/articles/category/') &&
        !page.includes('/articles/tag/') &&
        !page.includes('/articles/tags/') &&
        !page.includes('/404'),
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
