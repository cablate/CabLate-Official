import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export const prerender = true;

const fontData = fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'NotoSansTC-Bold.ttf'));
const photoData = fs.readFileSync(
  path.join(process.cwd(), 'public', 'images', 'photos', 'cablate-speaking-ai-meetup-refined-v1.webp')
);
const backgroundData = fs.readFileSync(
  path.join(process.cwd(), 'public', 'images', 'concept', 'ai-coaching-editorial-background-v1.webp')
);

export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '38px 0 38px 40px',
          color: '#17233d',
          fontFamily: 'Noto Sans TC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '740px',
                height: '554px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '38px 42px 34px 44px',
                border: '1px solid rgba(108, 76, 207, 0.18)',
                borderRadius: '30px',
                background: 'rgba(250, 247, 240, 0.94)',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', color: '#6c4ccf', fontSize: '24px' },
                          children: 'CabLate',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 15px 9px',
                            borderRadius: '999px',
                            background: 'rgba(108, 76, 207, 0.1)',
                            color: '#6042bd',
                            fontSize: '18px',
                          },
                          children: '1 對 1 · 五週 AI 應用陪跑',
                        },
                      },
                    ],
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
                          style: { color: '#6c4ccf', fontSize: '18px', letterSpacing: '1px' },
                          children: '不是再學一套工具',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '15px',
                            fontSize: '49px',
                            lineHeight: 1.2,
                            letterSpacing: '-2px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: { style: { display: 'flex' }, children: '別再研究更多 AI 了。' },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', marginTop: '5px', color: '#17233d' },
                                children: '先把手上那件事做下去。',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '610px',
                            marginTop: '22px',
                            color: '#596174',
                            fontSize: '23px',
                            lineHeight: 1.45,
                          },
                          children: '先看卡點，再決定要用 AI、改流程，還是先處理別的問題。',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#6d6a66',
                      fontSize: '18px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '8px',
                                  height: '8px',
                                  marginRight: '10px',
                                  borderRadius: '999px',
                                  background: '#e6a56f',
                                },
                              },
                            },
                            { type: 'div', props: { children: '五次會議 · 同時最多三位' } },
                          ],
                        },
                      },
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
      fonts: [{ name: 'Noto Sans TC', data: fontData.buffer as ArrayBuffer, weight: 700, style: 'normal' }],
    }
  );

  const background = await sharp(backgroundData)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
  const portraitMask = Buffer.from(
    '<svg width="382" height="550"><rect width="382" height="550" rx="28" ry="28" fill="white"/></svg>'
  );
  const photo = await sharp(photoData)
    .resize(382, 550, { fit: 'cover', position: 'attention' })
    .composite([{ input: portraitMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const portraitBorder = Buffer.from(
    '<svg width="386" height="554"><rect x="2" y="2" width="382" height="550" rx="30" ry="30" fill="none" stroke="#ffffff" stroke-opacity="0.72" stroke-width="4"/></svg>'
  );
  const png = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: '#f5f0e6',
    },
  })
    .composite([
      { input: background, left: 0, top: 0 },
      { input: Buffer.from(svg), left: 0, top: 0 },
      { input: photo, left: 790, top: 40 },
      { input: portraitBorder, left: 788, top: 38 },
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
