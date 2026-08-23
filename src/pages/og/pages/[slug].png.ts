import type { APIRoute, GetStaticPaths } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { pageOgBySlug, pageOgEntries, type PageOgEntry } from '../../../config/pageOg';

export const prerender = true;

const fontData = fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'NotoSansTC-Bold.ttf'));
const backgroundData = fs.readFileSync(
  path.join(process.cwd(), 'public', 'images', 'concept', 'ai-coaching-editorial-background-v1.webp')
);

export const getStaticPaths: GetStaticPaths = () =>
  pageOgEntries.map((entry) => ({ params: { slug: entry.slug } }));

const makeTextLayer = async (entry: PageOgEntry) => {
  const fullWidth = entry.visual.type === 'none';

  return satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
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
                width: fullWidth ? '1120px' : '740px',
                height: '554px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: fullWidth ? '42px 54px 36px' : '38px 42px 34px 44px',
                borderRadius: '30px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                    children: [
                      { type: 'div', props: { style: { color: entry.accent, fontSize: fullWidth ? '28px' : '23px' }, children: entry.label } },
                      {
                        type: 'div',
                        props: {
                          style: {
                            padding: fullWidth ? '9px 17px 10px' : '8px 15px 9px',
                            borderRadius: '999px',
                            background: `${entry.accent}18`,
                            color: entry.accent,
                            fontSize: fullWidth ? '21px' : '17px',
                          },
                          children: entry.badge,
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
                      ...(entry.eyebrow
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: { color: entry.accent, fontSize: fullWidth ? '24px' : '18px', letterSpacing: '1px' },
                                children: entry.eyebrow,
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: entry.eyebrow ? '15px' : '0',
                            fontSize: fullWidth ? '70px' : '47px',
                            lineHeight: fullWidth ? 1.13 : 1.2,
                            letterSpacing: fullWidth ? '-2.6px' : '-1.8px',
                          },
                          children: entry.headline.map((line, index) => ({
                            type: 'div',
                            props: {
                              style: { display: 'flex', marginTop: index === 0 ? '0' : fullWidth ? '8px' : '5px' },
                              children: line,
                            },
                          })),
                        },
                      },
                      ...(entry.description
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: fullWidth ? '940px' : '620px',
                                  marginTop: fullWidth ? '25px' : '22px',
                                  color: '#596174',
                                  fontSize: fullWidth ? '28px' : '21px',
                                  lineHeight: fullWidth ? 1.4 : 1.5,
                                },
                                children: entry.description,
                              },
                            },
                          ]
                        : []),
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
                      fontSize: fullWidth ? '21px' : '17px',
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
                                  background: entry.accentSoft,
                                },
                              },
                            },
                            { type: 'div', props: { children: entry.footer } },
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
};

const makeIndexVisual = async (entry: PageOgEntry) => {
  if (entry.visual.type !== 'index') return null;
  const visual = entry.visual;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '382px',
          height: '550px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '34px 32px',
          color: '#17233d',
          fontFamily: 'Noto Sans TC',
          background: 'rgba(255,255,255,0.16)',
          border: '2px solid rgba(255,255,255,0.78)',
          borderRadius: '28px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' },
              children: [
                { type: 'div', props: { style: { color: entry.accent, fontSize: '82px', lineHeight: 0.9 }, children: visual.mark } },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: visual.lines.map((line, index) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: index === visual.lines.length - 1 ? 'none' : '1px solid rgba(23,35,61,0.13)',
                    color: index === 0 ? entry.accent : '#3f485a',
                    fontSize: '23px',
                  },
                  children: [
                    { type: 'div', props: { style: { width: '36px', color: '#8d8790', fontSize: '14px' }, children: `0${index + 1}` } },
                    { type: 'div', props: { children: line } },
                  ],
                },
              })),
            },
          },
        ],
      },
    },
    {
      width: 382,
      height: 550,
      fonts: [{ name: 'Noto Sans TC', data: fontData.buffer as ArrayBuffer, weight: 700, style: 'normal' }],
    }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
};

export const GET: APIRoute = async ({ params }) => {
  const entry = pageOgBySlug[params.slug ?? ''];
  if (!entry) return new Response('Not found', { status: 404 });
  const fullWidth = entry.visual.type === 'none';
  const panelWidth = fullWidth ? 1120 : 740;

  const backgroundAccents = Buffer.from(
    `<svg width="1200" height="630"><defs><radialGradient id="primary"><stop offset="0" stop-color="${entry.accent}" stop-opacity="0.28"/><stop offset="1" stop-color="${entry.accent}" stop-opacity="0"/></radialGradient><radialGradient id="secondary"><stop offset="0" stop-color="${entry.accentSoft}" stop-opacity="0.22"/><stop offset="1" stop-color="${entry.accentSoft}" stop-opacity="0"/></radialGradient></defs><ellipse cx="210" cy="520" rx="310" ry="220" fill="url(#primary)"/><ellipse cx="700" cy="155" rx="270" ry="210" fill="url(#primary)" opacity="0.72"/><ellipse cx="555" cy="620" rx="250" ry="170" fill="url(#secondary)"/></svg>`
  );
  const background = await sharp(backgroundData)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([{ input: backgroundAccents }])
    .png()
    .toBuffer();
  const glassMask = Buffer.from(`<svg width="${panelWidth}" height="554"><rect width="${panelWidth}" height="554" rx="30" fill="white"/></svg>`);
  const glassTint = Buffer.from(
    `<svg width="${panelWidth}" height="554"><rect x="1" y="1" width="${panelWidth - 2}" height="552" rx="29" fill="#fbf7ef" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.88" stroke-width="2"/><path d="M32 2 H${panelWidth - 32}" stroke="#ffffff" stroke-opacity="0.82" stroke-width="2" stroke-linecap="round"/></svg>`
  );
  const glassPanel = await sharp(background)
    .extract({ left: 40, top: 38, width: panelWidth, height: 554 })
    .blur(6)
    .modulate({ brightness: 1.02, saturation: 0.84 })
    .composite([{ input: glassTint }, { input: glassMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const glassShadow = await sharp(
    Buffer.from(`<svg width="${panelWidth + 24}" height="578"><rect x="12" y="12" width="${panelWidth}" height="554" rx="30" fill="#3d3164" fill-opacity="0.18"/></svg>`)
  )
    .blur(12)
    .png()
    .toBuffer();
  const visualMask = Buffer.from('<svg width="382" height="550"><rect width="382" height="550" rx="28" fill="white"/></svg>');
  const textSvg = await makeTextLayer(entry);
  let visual: Buffer | null = null;

  if (entry.visual.type === 'photo') {
    const photoData = fs.readFileSync(path.join(process.cwd(), entry.visual.src));
    const photo = await sharp(photoData)
      .resize(382, 550, { fit: 'cover', position: entry.visual.position ?? 'attention' })
      .modulate({ brightness: 1.01, saturation: 0.88 })
      .composite([{ input: visualMask, blend: 'dest-in' }])
      .png()
      .toBuffer();
    const note = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '382px',
            height: '550px',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '26px',
            fontFamily: 'Noto Sans TC',
          },
          children: {
            type: 'div',
            props: {
              style: {
                padding: '10px 16px 11px',
                color: '#ffffff',
                background: 'rgba(23,35,61,0.74)',
                border: '1px solid rgba(255,255,255,0.42)',
                borderRadius: '999px',
                fontSize: '16px',
              },
              children: entry.visual.note,
            },
          },
        },
      },
      {
        width: 382,
        height: 550,
        fonts: [{ name: 'Noto Sans TC', data: fontData.buffer as ArrayBuffer, weight: 700, style: 'normal' }],
      }
    );
    visual = await sharp(photo).composite([{ input: Buffer.from(note) }]).png().toBuffer();
  } else if (entry.visual.type === 'index') {
    visual = (await makeIndexVisual(entry)) as Buffer;
  }

  const visualBorder = Buffer.from(
    '<svg width="386" height="554"><rect x="2" y="2" width="382" height="550" rx="30" fill="none" stroke="#ffffff" stroke-opacity="0.72" stroke-width="4"/></svg>'
  );
  const png = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: '#f5f0e6' },
  })
    .composite([
      { input: background, left: 0, top: 0 },
      { input: glassShadow, left: 28, top: 26 },
      { input: glassPanel, left: 40, top: 38 },
      { input: Buffer.from(textSvg), left: 0, top: 0 },
      ...(visual
        ? [
            { input: visual, left: 790, top: 40 },
            { input: visualBorder, left: 788, top: 38 },
          ]
        : []),
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
