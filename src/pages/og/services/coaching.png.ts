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
                borderRadius: '30px',
                background: 'transparent',
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
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { color: '#6c4ccf', fontSize: '18px', letterSpacing: '1px' },
                          children: '五週一對一陪跑',
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
                              props: { style: { display: 'flex' }, children: '有件事一直想做？' },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', marginTop: '5px', color: '#17233d' },
                                children: '我陪你把它做下去。',
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
                            children: '每期最多三位，先申請免費聊 30 分鐘。',
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

  const backgroundAccents = Buffer.from(
    '<svg width="1200" height="630"><defs><radialGradient id="violet"><stop offset="0" stop-color="#8d72df" stop-opacity="0.32"/><stop offset="1" stop-color="#8d72df" stop-opacity="0"/></radialGradient><radialGradient id="apricot"><stop offset="0" stop-color="#e6a56f" stop-opacity="0.22"/><stop offset="1" stop-color="#e6a56f" stop-opacity="0"/></radialGradient></defs><ellipse cx="210" cy="520" rx="310" ry="220" fill="url(#violet)"/><ellipse cx="700" cy="155" rx="270" ry="210" fill="url(#violet)" opacity="0.7"/><ellipse cx="555" cy="620" rx="250" ry="170" fill="url(#apricot)"/></svg>'
  );
  const background = await sharp(backgroundData)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([{ input: backgroundAccents }])
    .png()
    .toBuffer();
  const glassMask = Buffer.from(
    '<svg width="740" height="554"><rect width="740" height="554" rx="30" ry="30" fill="white"/></svg>'
  );
  const glassTint = Buffer.from(
    '<svg width="740" height="554"><rect x="1" y="1" width="738" height="552" rx="29" ry="29" fill="#fbf7ef" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.88" stroke-width="2"/><path d="M32 2 H708" stroke="#ffffff" stroke-opacity="0.82" stroke-width="2" stroke-linecap="round"/></svg>'
  );
  const glassPanel = await sharp(background)
    .extract({ left: 40, top: 38, width: 740, height: 554 })
    .blur(6)
    .modulate({ brightness: 1.02, saturation: 0.84 })
    .composite([
      { input: glassTint },
      { input: glassMask, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();
  const glassShadow = await sharp(
    Buffer.from(
      '<svg width="764" height="578"><rect x="12" y="12" width="740" height="554" rx="30" ry="30" fill="#3d3164" fill-opacity="0.18"/></svg>'
    )
  )
    .blur(12)
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
      { input: glassShadow, left: 28, top: 26 },
      { input: glassPanel, left: 40, top: 38 },
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
