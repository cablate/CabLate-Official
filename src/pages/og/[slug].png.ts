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
  problemTag?: string;
  ogHighlight?: OgHighlight;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');
  return articles
    .filter(entry => !entry.data.draft)
    .map(entry => ({
      params: { slug: entry.slug },
      props: {
        title: entry.data.title,
        category: entry.data.category,
        problemTag: entry.data.problemTag,
        ogHighlight: entry.data.ogHighlight,
      },
    }));
};

// Load font once, reuse across all OG image generations
const fontData = fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'NotoSansTC-Bold.ttf'));

// Same paper palette as the site and the page OG cards (src/styles/base.css)
const ink = '#17233d';
const muted = '#5f687a';
const accent = '#6248c8';
const green = '#26734f';
const dangerMuted = '#b4352f';

export const GET: APIRoute = async ({ props }) => {
  const { title, category, problemTag, ogHighlight } = props as OgProps;

  const fonts = [{ name: 'Noto Sans TC', data: fontData.buffer as ArrayBuffer, weight: 700 as const, style: 'normal' as const }];

  const topNode = problemTag
    ? {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  background: '#f1edff',
                  border: `2px solid ${accent}`,
                  color: accent,
                  fontSize: '22px',
                  lineHeight: 1.2,
                },
                children: problemTag,
              },
            },
            {
              type: 'div',
              props: {
                style: { color: muted, fontSize: '22px' },
                children: category || '文章',
              },
            },
          ],
        },
      }
    : {
        type: 'div',
        props: {
          style: { color: accent, fontSize: '26px' },
          children: category || '文章',
        },
      };

  const highlightTextLen = ogHighlight ? ogHighlight.before.length + ogHighlight.after.length : 0;
  const highlightFontSize = highlightTextLen > 28 ? '23px' : '26px';

  const middleNode = ogHighlight
    ? {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  color: ink,
                  fontSize: title.length > 34 ? '44px' : title.length >= 24 ? '46px' : '52px',
                  lineHeight: 1.28,
                },
                children: title,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '18px 24px',
                  borderRadius: '18px',
                  background: '#f6f2e9',
                  border: '1.5px solid #d7d1c6',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        color: muted,
                        fontSize: '18px',
                        lineHeight: 1.2,
                      },
                      children: ogHighlight.label,
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '14px',
                        fontSize: highlightFontSize,
                        lineHeight: 1.25,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              color: dangerMuted,
                              background: '#fff1ef',
                              border: '1.5px solid #efb4ae',
                              padding: '4px 14px',
                              borderRadius: '10px',
                            },
                            children: ogHighlight.before,
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              color: accent,
                              fontSize: highlightFontSize,
                            },
                            children: '→',
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              color: green,
                              background: '#eef7f1',
                              border: '1.5px solid #aed7be',
                              padding: '4px 14px',
                              borderRadius: '10px',
                            },
                            children: ogHighlight.after,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      }
    : {
        type: 'div',
        props: {
          style: {
            color: ink,
            fontSize: title.length > 30 ? '52px' : '60px',
            lineHeight: 1.3,
          },
          children: title,
        },
      };

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
                padding: ogHighlight ? '42px 56px 36px' : '48px 56px 40px',
                borderRadius: '30px',
                border: '2px solid #b8afc9',
                background: '#fffdf8',
              },
              children: [
                topNode,
                middleNode,
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
