import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export const prerender = true;

const fontData = fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'NotoSansTC-Bold.ttf'));
const photoData = fs.readFileSync(path.join(process.cwd(), 'public', 'images', 'photos', 'cablate-speaking-ai-meetup-april.webp'));

export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '720px',
          height: '100%',
          display: 'flex',
          background: '#f5f0e6',
          color: '#17233d',
          fontFamily: 'Noto Sans TC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '720px',
                height: '630px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '58px 60px 50px 64px',
                borderRight: '1px solid #cfc4b3',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', color: '#6c4ccf', fontSize: '24px' },
                    children: 'CabLate · 1 對 1 客製實作陪跑',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '65px', lineHeight: 1.18, letterSpacing: '-3px' },
                          children: '把 AI 真正用進你的工作。',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { marginTop: '26px', color: '#596174', fontSize: '25px', lineHeight: 1.5 },
                          children: '五週一對一，從真實工作出發，每週一起判斷、實作與調整。',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', justifyContent: 'space-between', color: '#6d6a66', fontSize: '20px' },
                    children: [
                      { type: 'div', props: { children: '五週客製 · 五次會議' } },
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
      width: 720,
      height: 630,
      fonts: [{ name: 'Noto Sans TC', data: fontData.buffer as ArrayBuffer, weight: 700, style: 'normal' }],
    }
  );

  const photo = await sharp(photoData)
    .resize(480, 630, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
  const png = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: '#f5f0e6',
    },
  })
    .composite([
      { input: Buffer.from(svg), left: 0, top: 0 },
      { input: photo, left: 720, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
