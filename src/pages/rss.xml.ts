import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import type { APIContext } from 'astro';

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const published = articles
    .filter(entry => !entry.data.draft)
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: 'CabLate',
    description: 'CabLate 關於 AI 協作、Agent 工作流程與產品實作的研究和經驗整理。',
    site: context.site ?? 'https://cablate.com',
    items: published.map(entry => ({
      title: entry.data.title,
      pubDate: entry.data.publishDate,
      description: entry.data.description,
      link: `/articles/${entry.slug}/`,
      categories: [entry.data.category, ...entry.data.tags],
      content: sanitizeHtml(parser.render(entry.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }).replace(/src="\/(?!\/)/g, `src="${context.site?.href || 'https://cablate.com/'}`),
    })),
    customData: '<language>zh-TW</language>',
  });
}
