import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

type OgHighlight = {
  label: string;
  before: string;
  after: string;
};

type OgProps = {
  title: string;
  category: string;
  readingTime?: number;
  excerpt?: string;
  description: string;
  problemTag?: string;
  ogHighlight?: OgHighlight;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');
  return articles
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({
      params: { slug: entry.id },
      props: {
        title: entry.data.title,
        category: entry.data.category,
        readingTime: entry.data.readingTime,
        excerpt: entry.data.excerpt,
        description: entry.data.description,
        problemTag: entry.data.problemTag,
        ogHighlight: entry.data.ogHighlight,
      },
    }));
};

const fontData = fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'NotoSansTC-Bold.ttf'));
const backgroundData = fs.readFileSync(
  path.join(process.cwd(), 'public', 'images', 'concept', 'ai-coaching-editorial-background-v1.webp')
);

const ink = '#17233d';
const bodyMuted = '#596174';
const accent = '#5b46b8';
const accentSoft = '#d48a4e';
const green = '#1f6f50';

export const GET: APIRoute = async ({ props }) => {
  const { title, category, readingTime, excerpt, description, problemTag, ogHighlight } = props as OgProps;

  const panelWidth = 1120;
  const titleFontSize = title.length > 34 ? '48px' : title.length > 26 ? '52px' : '58px';
  const summaryText = excerpt || description;
  const trimmedSummary = summaryText.length > 64 ? `${summaryText.slice(0, 63)}…` : summaryText;
  const footerLeft = readingTime ? `Cab 的實作筆記 · ${readingTime} 分鐘閱讀` : 'Cab 的實作筆記';

  const totalHighlightChars = ogHighlight
    ? ogHighlight.label.length + ogHighlight.before.length + ogHighlight.after.length
    : 0;
  const hiLabelSize = totalHighlightChars > 36 ? '19px' : '21px';
  const hiBeforeSize = totalHighlightChars > 36 ? '20px' : '23px';
  const hiAfterSize = totalHighlightChars > 36 ? '22px' : '25px';

  const subContentNode = ogHighlight
    ? {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            maxWidth: '1000px',
            marginTop: '28px',
            padding: '14px 22px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.56)',
            border: '1px solid rgba(23, 35, 61, 0.1)',
            gap: '16px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  color: bodyMuted,
                  fontSize: hiLabelSize,
                },
                children: ogHighlight.label,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  width: '1px',
                  height: '24px',
                  background: 'rgba(23, 35, 61, 0.18)',
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  color: '#7a6c75',
                  fontSize: hiBeforeSize,
                },
                children: ogHighlight.before,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  color: accent,
                  fontSize: hiBeforeSize,
                },
                children: '→',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  color: green,
                  fontSize: hiAfterSize,
                },
                children: ogHighlight.after,
              },
            },
          ],
        },
      }
    : {
        type: 'div',
        props: {
          style: {
            width: '960px',
            marginTop: '24px',
            color: bodyMuted,
            fontSize: '25px',
            lineHeight: 1.45,
          },
          children: trimmedSummary,
        },
      };

  const textSvg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          padding: '38px 40px',
          color: ink,
          fontFamily: 'Noto Sans TC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: `${panelWidth}px`,
                height: '554px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '42px 54px 36px',
                borderRadius: '30px',
              },
              children: [
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
                          style: { color: accent, fontSize: '26px' },
                          children: 'CabLate',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            padding: '8px 18px 9px',
                            borderRadius: '999px',
                            background: 'rgba(91, 70, 184, 0.11)',
                            color: accent,
                            fontSize: '20px',
                          },
                          children: category || '技術觀點',
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
                      alignItems: 'flex-start',
                    },
                    children: [
                      ...(problemTag
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: accent,
                                  fontSize: '23px',
                                  letterSpacing: '0.5px',
                                  marginBottom: '14px',
                                },
                                children: problemTag,
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '1000px',
                            color: ink,
                            fontSize: titleFontSize,
                            lineHeight: 1.22,
                            letterSpacing: '-1.5px',
                          },
                          children: title,
                        },
                      },
                      subContentNode,
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
                      fontSize: '20px',
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
                                  background: accentSoft,
                                },
                              },
                            },
                            { type: 'div', props: { children: footerLeft } },
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
    `<svg width="1200" height="630"><defs><radialGradient id="primary"><stop offset="0" stop-color="${accent}" stop-opacity="0.26"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient><radialGradient id="secondary"><stop offset="0" stop-color="${accentSoft}" stop-opacity="0.2"/><stop offset="1" stop-color="${accentSoft}" stop-opacity="0"/></radialGradient></defs><ellipse cx="210" cy="520" rx="310" ry="220" fill="url(#primary)"/><ellipse cx="700" cy="155" rx="270" ry="210" fill="url(#primary)" opacity="0.72"/><ellipse cx="555" cy="620" rx="250" ry="170" fill="url(#secondary)"/></svg>`
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

  const png = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: '#f5f0e6' },
  })
    .composite([
      { input: background, left: 0, top: 0 },
      { input: glassShadow, left: 28, top: 26 },
      { input: glassPanel, left: 40, top: 38 },
      { input: Buffer.from(textSvg), left: 0, top: 0 },
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
