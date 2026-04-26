// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
  site: 'https://cablate.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/search/') }),
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