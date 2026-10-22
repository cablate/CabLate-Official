import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const publishedArticles = (await getCollection('articles'))
    .filter((a) => !a.data.draft)
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const articleLines = publishedArticles.map(
    (a) =>
      `- [${a.data.title}](https://cablate.com/articles/${a.id}/)：${a.data.description}${a.data.ogHighlight ? `（實測數據：${a.data.ogHighlight.label} ${a.data.ogHighlight.before} → ${a.data.ogHighlight.after}）` : ''}`,
  );

  const body = `# CabLate

> Cab（CabLate）的個人網站。工程師出身，研究 Claude Code、AI Agent 和 Skill 設計，寫課程與手冊、做開源工具，也提供 AI 諮詢、一對一陪跑與企業內訓。

## 合作方式

- [合作方式總覽](https://cablate.com/services/): 三種方式與價格比較
- [專案卡關諮詢](https://cablate.com/services/consulting/): 60 分鐘線上諮詢，NT$5,000，找出卡點並排出下一步
- [AI 應用陪跑](https://cablate.com/services/coaching/): 五週一對一陪跑，NT$39,800，先免費聊 30 分鐘
- [企業合作](https://cablate.com/services/enterprise/): 企業內訓、工作坊與小規模導入，依範圍報價
- [講師與內容合作](https://cablate.com/services/partnerships/): 演講、工作坊、內容與產品合作邀約

## 自己學

- [免費 AI 工作流健檢](https://cablate.com/expertise/): 用五個問題找出 AI 卡在哪一層
- [課程與手冊](https://cablate.com/courses/): AgentSkill 課程、Claude Code 深度工程手冊
- [電子報](https://cablate.com/newsletter/): 每封拆一個 AI 卡點

## 關於

- [關於 Cab](https://cablate.com/about/): 經歷、開源作品與工作原則
- [CabAI](https://cabai.cablate.com/): 課程、手冊與免費文章
- [GitHub](https://github.com/cablate)
- [Threads](https://www.threads.net/@cab_late)

## 技術與實作拆解文章（Articles）

${articleLines.join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
