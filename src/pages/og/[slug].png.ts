import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');
  return articles
    .filter(entry => !entry.data.draft)
    .map(entry => ({
      params: { slug: entry.slug },
      props: { title: entry.data.title, category: entry.data.category },
    }));
};

// Load font once, reuse across all OG image generations
const fontData = fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'NotoSansTC-Bold.ttf'));

// Same paper palette as the site and the page OG cards (src/styles/base.css)
const ink = '#17233d';
const muted = '#5f687a';
const accent = '#6248c8';

export const GET: APIRoute = async ({ props }) => {
  const { title, category } = props as { title: string; category: string };

  const fonts = [{ name: 'Noto Sans TC', data: fontData.buffer as ArrayBuffer, weight: 700 as const, style: 'normal' as const }];

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          padding: '38px 40px',
          background: '#eeeae2',
          fontFamily: 'Noto Sans TC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px 56px 40px',
                borderRadius: '30px',
                border: '2px solid #b8afc9',
                background: '#fffdf8',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { color: accent, fontSize: '26px' },
                    children: category || '文章',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: ink,
                      fontSize: title.length > 30 ? '52px' : '60px',
                      lineHeight: 1.3,
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', justifyContent: 'space-between', color: muted, fontSize: '22px' },
                    children: [
                      { type: 'div', props: { children: 'Cab 的實作筆記' } },
                      { type: 'div', props: { children: 'cablate.com' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
