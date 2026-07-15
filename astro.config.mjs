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
    sitemap({ filter: (page) => !page.includes('/search/') && !page.includes('/work/') }),
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
