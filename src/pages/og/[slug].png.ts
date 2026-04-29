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
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          fontFamily: 'Noto Sans TC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                color: '#a78bfa',
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '16px',
              },
              children: category || 'CabLate',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                color: '#ffffff',
                fontSize: title.length > 30 ? '48px' : '56px',
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: '40px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { color: '#94a3b8', fontSize: '20px' },
                    children: 'cablate.com',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { color: '#6d28d9', fontSize: '24px', fontWeight: 700 },
                    children: 'CabLate',
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
