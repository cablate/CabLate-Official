#!/usr/bin/env node
/**
 * Article SVG & Diagram Validator
 *
 * Mechanically verifies embedded <figure class="article-diagram"> and <svg> blocks
 * in Markdown source files (and built HTML when --built is passed):
 * 1. No blank lines inside <figure> or <svg> blocks in Markdown (prevents CommonMark
 *    from terminating the HTML block and turning indented SVG nodes into <pre><code>)
 * 2. Balanced <figure>/<svg> tags, required <figcaption>, role="img", viewBox="0 0 (720|760) H",
 *    and unique non-empty <title id="..."> matching aria-labelledby
 * 3. Interactive [data-diagram] toggle contract: 1:1 data-mode <-> data-pane match,
 *    exactly one .is-active button, and non-active panes hidden by default
 * 4. Typography & palette guardrails: explicit font-size >= 11.5 on every <text>,
 *    no pure #000/#fff colors
 * 5. Pane-aware geometry & collision checks:
 *    - Estimated <text> width (CJK + ASCII + weight) stays inside viewBox [4, W - 4]
 *    - <text> stays inside its enclosing <rect> [rect.x + 2, rect.x + rect.width - 4]
 *    - No two <text> elements in the same visible pane overlap horizontally & vertically
 * 6. Built HTML (--built): no <pre>, <code>, .article-code, <p>, or escaped SVG tags
 *    inside <figure class="article-diagram">
 *
 * Usage:
 *   node scripts/validate-svg-diagrams.mjs [file1.md ...]
 *   node scripts/validate-svg-diagrams.mjs --built [distDir]
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ARTICLES_DIR = join(root, 'src', 'content', 'articles');

export function estimateTextWidth(text, fontSize, isMono = false, isBold = false) {
  const clean = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
  let ems = 0;
  for (const ch of clean) {
    const code = ch.codePointAt(0);
    if (
      (code >= 0x2e80 && code <= 0x9fff) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe30 && code <= 0xfe4f) ||
      (code >= 0xff00 && code <= 0xffef)
    ) {
      ems += 1.0;
    } else if (/[A-Z]/.test(ch)) {
      ems += isMono ? 0.62 : 0.66;
    } else if (/[a-z0-9]/.test(ch)) {
      ems += isMono ? 0.6 : 0.55;
    } else if (/\s/.test(ch)) {
      ems += 0.3;
    } else {
      ems += isMono ? 0.58 : 0.52;
    }
  }
  return ems * fontSize * (isBold ? 1.03 : 1.0);
}

function getAttr(tagAttrs, name) {
  const m = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(tagAttrs);
  return m ? m[1] : null;
}

function lineNumberAt(source, index) {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i += 1) {
    if (source[i] === '\n') line += 1;
  }
  return line;
}

function stripFencedCodeBlocks(markdown) {
  return markdown.replace(/^```[\s\S]*?^```/gm, (match) => match.replace(/[^\n]/g, ' '));
}

function validateSvgPane(svgChunk, vw, vh, label, failures) {
  if (!/<(?:path|line|polyline|polygon|circle)\b/i.test(svgChunk)) {
    failures.push(
      `${label}: whiteboard_role violation — pane contains only <rect> and <text> without any flow/connector elements (<path>, <line>, <circle>, <polygon>). Draw causal flows, gates, or proportions instead of Bento text cards.`
    );
  }
  const rects = [...svgChunk.matchAll(/<rect\b([^>]*)\/?>/g)]
    .map((rm) => {
      const a = rm[1];
      return {
        x: Number(getAttr(a, 'x') ?? 0),
        y: Number(getAttr(a, 'y') ?? 0),
        w: Number(getAttr(a, 'width') ?? 0),
        h: Number(getAttr(a, 'height') ?? 0),
      };
    })
    .filter((r) => r.w >= 30 && r.h >= 18);

  const texts = [...svgChunk.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)].map((tm) => {
    const a = tm[1];
    const inner = tm[2].replace(/<[^>]+>/g, '').trim();
    const x = Number(getAttr(a, 'x') ?? 0);
    const y = Number(getAttr(a, 'y') ?? 0);
    const rawSize = getAttr(a, 'font-size');
    const fontSize = rawSize ? Number(rawSize) : NaN;
    const fontWeight = getAttr(a, 'font-weight') ?? '400';
    const isBold = fontWeight === 'bold' || Number(fontWeight) >= 600;
    const anchor = getAttr(a, 'text-anchor') ?? 'start';
    const isMono = /font-mono|monospace/i.test(a);
    const estW = Number.isFinite(fontSize) ? estimateTextWidth(inner, fontSize, isMono, isBold) : 0;
    const left = anchor === 'middle' ? x - estW / 2 : anchor === 'end' ? x - estW : x;
    const right = anchor === 'middle' ? x + estW / 2 : anchor === 'end' ? x : x + estW;
    return { x, y, rawSize, fontSize, isBold, anchor, inner, estW, left, right };
  });

  for (const t of texts) {
    if (!t.rawSize || !Number.isFinite(t.fontSize)) {
      failures.push(`${label}: <text> "${t.inner}" is missing an explicit numeric font-size attribute`);
      continue;
    }
    if (t.fontSize < 11.5) {
      failures.push(`${label}: <text> "${t.inner}" has font-size="${t.fontSize}" (minimum is 11.5px)`);
    }
    if (t.left < 4 || t.right > vw - 4) {
      failures.push(
        `${label}: <text> "${t.inner}" horizontal span [${t.left.toFixed(1)}, ${t.right.toFixed(1)}] overflows viewBox width ${vw}`
      );
    }
    if (t.y - t.fontSize * 0.85 < 2 || t.y + t.fontSize * 0.22 > vh - 2) {
      failures.push(
        `${label}: <text> "${t.inner}" (y=${t.y}, font-size=${t.fontSize}) overflows viewBox height ${vh}`
      );
    }

    const enclosing = rects
      .filter((r) => t.x >= r.x && t.x <= r.x + r.w && t.y >= r.y && t.y <= r.y + r.h + 2)
      .sort((a, b) => a.w * a.h - b.w * b.h);
    const box = enclosing[0];
    if (box) {
      if (t.right > box.x + box.w - 4) {
        failures.push(
          `${label}: <text> "${t.inner}" (right=${t.right.toFixed(1)}) overflows enclosing <rect x="${box.x}" width="${box.w}"> (right=${box.x + box.w}) by +${(t.right - (box.x + box.w)).toFixed(1)}px`
        );
      }
      if (t.left < box.x + 2) {
        failures.push(
          `${label}: <text> "${t.inner}" (left=${t.left.toFixed(1)}) overflows enclosing <rect x="${box.x}"> left edge`
        );
      }
    }
  }

  // Extract vertical segments from <path d="M... L..."> and <line> to catch text crossed by connector lines
  const verticalSegments = [];
  for (const pm of svgChunk.matchAll(/<path\b([^>]*)\/?>/g)) {
    const d = getAttr(pm[1], 'd') ?? '';
    const pts = [...d.matchAll(/([ML])\s*(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/gi)].map((m) => ({
      cmd: m[1].toUpperCase(),
      x: Number(m[2]),
      y: Number(m[3]),
    }));
    for (let i = 1; i < pts.length; i += 1) {
      if (pts[i].cmd === 'L' && Math.abs(pts[i].x - pts[i - 1].x) < 0.5 && Math.abs(pts[i].y - pts[i - 1].y) >= 12) {
        verticalSegments.push({
          x: pts[i].x,
          yMin: Math.min(pts[i].y, pts[i - 1].y),
          yMax: Math.max(pts[i].y, pts[i - 1].y),
        });
      }
    }
  }
  for (const lm of svgChunk.matchAll(/<line\b([^>]*)\/?>/g)) {
    const a = lm[1];
    const x1 = Number(getAttr(a, 'x1') ?? NaN);
    const y1 = Number(getAttr(a, 'y1') ?? NaN);
    const x2 = Number(getAttr(a, 'x2') ?? NaN);
    const y2 = Number(getAttr(a, 'y2') ?? NaN);
    if (Number.isFinite(x1) && Math.abs(x1 - x2) < 0.5 && Math.abs(y2 - y1) >= 12) {
      verticalSegments.push({ x: x1, yMin: Math.min(y1, y2), yMax: Math.max(y1, y2) });
    }
  }

  for (const t of texts) {
    if (!Number.isFinite(t.fontSize)) continue;
    const tTop = t.y - t.fontSize * 0.8;
    const tBot = t.y + t.fontSize * 0.15;
    for (const seg of verticalSegments) {
      if (t.left < seg.x - 1 && t.right > seg.x + 1 && tBot > seg.yMin + 1 && tTop < seg.yMax - 1) {
        failures.push(
          `${label}: <text> "${t.inner}" (span [${t.left.toFixed(1)}, ${t.right.toFixed(1)}], y=${t.y}) is crossed by vertical line at x=${seg.x} (y=[${seg.yMin}, ${seg.yMax}])`
        );
      }
    }
  }

  for (let i = 0; i < texts.length; i += 1) {
    for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i];
      const b = texts[j];
      if (!Number.isFinite(a.fontSize) || !Number.isFinite(b.fontSize)) continue;
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      if (overlapX > 10) {
        const minDy = Math.min(a.fontSize, b.fontSize) * 1.1;
        const dy = Math.abs(a.y - b.y);
        if (dy < minDy) {
          failures.push(
            `${label}: <text> collision between "${a.inner}" (y=${a.y}) and "${b.inner}" (y=${b.y}) — vertical gap ${dy}px < ${minDy.toFixed(1)}px`
          );
        }
      }
    }
  }
}

export function validateMarkdownFile(filePath) {
  const failures = [];
  const labelFile = basename(filePath);
  const raw = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  const stripped = stripFencedCodeBlocks(raw);

  const openFigures = (stripped.match(/<figure\b/g) ?? []).length;
  const closeFigures = (stripped.match(/<\/figure>/g) ?? []).length;
  if (openFigures !== closeFigures) {
    failures.push(`${labelFile}: unbalanced <figure> tags (${openFigures} open vs ${closeFigures} close)`);
  }

  const openSvgs = (stripped.match(/<svg\b/g) ?? []).length;
  const closeSvgs = (stripped.match(/<\/svg>/g) ?? []).length;
  if (openSvgs !== closeSvgs) {
    failures.push(`${labelFile}: unbalanced <svg> tags (${openSvgs} open vs ${closeSvgs} close)`);
  }

  const seenIds = new Set();
  const figureMatches = [...stripped.matchAll(/<figure\b([\s\S]*?)<\/figure>/g)];

  // Ensure no standalone <svg> exists outside <figure>
  const svgsInsideFigures = figureMatches.reduce(
    (sum, fm) => sum + (fm[0].match(/<svg\b/g) ?? []).length,
    0
  );
  if (svgsInsideFigures !== openSvgs) {
    failures.push(`${labelFile}: found <svg> outside <figure class="article-diagram">`);
  }

  figureMatches.forEach((fm, fIdx) => {
    const figFull = fm[0];
    const figLine = lineNumberAt(stripped, fm.index ?? 0);
    const figLabel = `${labelFile}:${figLine} (figure #${fIdx + 1})`;

    // 1. Blank line check inside <figure>
    const blankMatch = /\n[ \t]*\n/.exec(figFull);
    if (blankMatch) {
      const blankLine = lineNumberAt(stripped, (fm.index ?? 0) + blankMatch.index + 1);
      failures.push(
        `${labelFile}:${blankLine}: blank line inside <figure> (figure #${fIdx + 1}) breaks CommonMark HTML block parsing and turns indented SVG tags into <pre><code> blocks`
      );
    }

    const openTag = figFull.match(/^<figure\b[^>]*>/)?.[0] ?? '';
    const hasSvg = /<svg\b/.test(figFull);
    if (hasSvg && !/class="[^"]*\barticle-diagram\b[^"]*"/.test(openTag)) {
      failures.push(`${figLabel}: <figure> containing <svg> must have class="article-diagram"`);
    }

    if (hasSvg) {
      const figcaption = figFull.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/)?.[1]?.trim();
      if (!figcaption) {
        failures.push(`${figLabel}: <figure class="article-diagram"> must include a non-empty <figcaption>`);
      }
    }

    // 2. Interactive [data-diagram] toggle check
    if (/\bdata-diagram\b/.test(openTag)) {
      const buttons = [...figFull.matchAll(/<button\b([^>]*)>/g)].map((bm) => ({
        mode: getAttr(bm[1], 'data-mode'),
        active: /\bis-active\b/.test(getAttr(bm[1], 'class') ?? ''),
      }));
      const panes = [...figFull.matchAll(/<(?:div|g)\b([^>]*\bdata-pane="[^"]+"[^>]*)>/g)].map((pm) => ({
        pane: getAttr(pm[1], 'data-pane'),
        hidden:
          /\bhidden\b/.test(pm[1]) || /display\s*:\s*none/i.test(getAttr(pm[1], 'style') ?? ''),
      }));

      if (buttons.length < 2) {
        failures.push(`${figLabel}: [data-diagram] requires at least 2 <button data-mode="..."> buttons`);
      }
      const activeButtons = buttons.filter((b) => b.active);
      if (activeButtons.length !== 1) {
        failures.push(`${figLabel}: [data-diagram] must have exactly 1 .is-active button (found ${activeButtons.length})`);
      }
      const modeNames = buttons.map((b) => b.mode).filter(Boolean);
      const paneNames = panes.map((p) => p.pane).filter(Boolean);
      if (modeNames.join(',') !== paneNames.join(',')) {
        failures.push(
          `${figLabel}: [data-diagram] button data-mode [${modeNames.join(', ')}] does not match data-pane [${paneNames.join(', ')}]`
        );
      }
      if (activeButtons.length === 1) {
        const activeMode = activeButtons[0].mode;
        for (const p of panes) {
          if (p.pane === activeMode && p.hidden) {
            failures.push(`${figLabel}: active data-pane="${p.pane}" must not be hidden initially`);
          }
          if (p.pane !== activeMode && !p.hidden) {
            failures.push(
              `${figLabel}: inactive data-pane="${p.pane}" must have style="display:none" or hidden attribute`
            );
          }
        }
      }
    }

    // 3. Per-SVG checks
    const svgMatches = [...figFull.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)];
    svgMatches.forEach((sm, sIdx) => {
      const svgAttrs = sm[1];
      const svgBody = sm[2];
      const svgLine = lineNumberAt(stripped, (fm.index ?? 0) + (sm.index ?? 0));
      const svgLabel = `${labelFile}:${svgLine} (figure #${fIdx + 1} svg #${sIdx + 1})`;

      const role = getAttr(svgAttrs, 'role');
      if (role !== 'img') {
        failures.push(`${svgLabel}: <svg> must have role="img"`);
      }

      const vb = getAttr(svgAttrs, 'viewBox');
      const vbParts = vb ? vb.trim().split(/\s+/).map(Number) : [];
      if (vbParts.length !== 4 || vbParts.some((n) => !Number.isFinite(n))) {
        failures.push(`${svgLabel}: <svg> must have a valid viewBox="0 0 W H"`);
        return;
      }
      const [vx, vy, vw, vh] = vbParts;
      if (vx !== 0 || vy !== 0 || (vw !== 720 && vw !== 760) || vh < 120 || vh > 800) {
        failures.push(
          `${svgLabel}: viewBox="${vb}" violates spec (expected width 720 or 760 and height 120..800)`
        );
      }

      const labelledBy = getAttr(svgAttrs, 'aria-labelledby');
      const titleMatch = svgBody.match(/<title\b([^>]*)>([\s\S]*?)<\/title>/);
      const titleId = titleMatch ? getAttr(titleMatch[1], 'id') : null;
      const titleText = titleMatch ? titleMatch[2].trim() : '';
      if (!labelledBy || !titleMatch || labelledBy !== titleId || !titleText) {
        failures.push(
          `${svgLabel}: <svg> must have aria-labelledby="<id>" matching a non-empty <title id="<id>">`
        );
      } else if (seenIds.has(titleId)) {
        failures.push(`${svgLabel}: duplicate SVG title id="${titleId}" in ${labelFile}`);
      } else {
        seenIds.add(titleId);
      }

      // Disallow pure #000 / #fff
      const badColors = [...svgBody.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,6})"/g)]
        .map((m) => m[1].toLowerCase())
        .filter((c) => c === '#000' || c === '#000000' || c === '#fff' || c === '#ffffff');
      if (badColors.length > 0) {
        failures.push(
          `${svgLabel}: uses forbidden pure black/white color(s) [${[...new Set(badColors)].join(', ')}] (use editorial tokens like #fffdf8, #253047)`
        );
      }

      // Split into <g data-pane="..."> if present
      const gPanes = [...svgBody.matchAll(/<g\b[^>]*\bdata-pane="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)];
      if (gPanes.length > 0) {
        const sharedBody = svgBody.replace(/<g\b[^>]*\bdata-pane="[^"]+"[^>]*>[\s\S]*?<\/g>/g, '');
        for (const gp of gPanes) {
          validateSvgPane(`${sharedBody}\n${gp[2]}`, vw, vh, `${svgLabel} [pane=${gp[1]}]`, failures);
        }
      } else {
        validateSvgPane(svgBody, vw, vh, svgLabel, failures);
      }
    });
  });

  return failures;
}

export function validateBuiltArticles(distDir = join(root, 'dist')) {
  const failures = [];
  const articlesDist = join(distDir, 'articles');
  if (!existsSync(articlesDist)) return failures;

  for (const entry of readdirSync(articlesDist)) {
    const htmlPath = join(articlesDist, entry, 'index.html');
    if (!existsSync(htmlPath) || !statSync(htmlPath).isFile()) continue;
    const rel = relative(distDir, htmlPath).replaceAll('\\', '/');
    const html = readFileSync(htmlPath, 'utf8');
    const figures = [...html.matchAll(/<figure\b[^>]*class="[^"]*\barticle-diagram\b[^"]*"[^>]*>([\s\S]*?)<\/figure>/g)];
    figures.forEach((fm, idx) => {
      const inner = fm[1];
      const figLabel = `${rel} (article-diagram #${idx + 1})`;
      if (inner.includes('article-code') || /<pre\b/i.test(inner) || /<code\b/i.test(inner)) {
        failures.push(
          `${figLabel}: contains <pre>/<code>/.article-code inside <figure class="article-diagram"> (broken Markdown HTML block!)`
        );
      }
      if (/<p\b/i.test(inner)) {
        failures.push(
          `${figLabel}: contains <p> tag inside <figure class="article-diagram"> (broken Markdown HTML block!)`
        );
      }
      if (/(?:&lt;|&#x3C;)(?:svg|path|rect|text|circle|line|g|div)\b/i.test(inner)) {
        failures.push(`${figLabel}: contains escaped SVG/HTML tags rendered as raw text`);
      }
      if (!/<svg\b[\s\S]*?<\/svg>/i.test(inner)) {
        failures.push(`${figLabel}: missing rendered <svg>...</svg> element`);
      }
    });
  }
  return failures;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const args = process.argv.slice(2);
  const isBuilt = args.includes('--built');
  const targets = args.filter((a) => a !== '--built');
  const allFailures = [];

  if (isBuilt) {
    const distTarget = targets[0] ? resolve(targets[0]) : join(root, 'dist');
    allFailures.push(...validateBuiltArticles(distTarget));
  } else {
    const mdFiles =
      targets.length > 0
        ? targets.map((t) => resolve(t))
        : readdirSync(ARTICLES_DIR)
            .filter((f) => f.endsWith('.md'))
            .map((f) => join(ARTICLES_DIR, f));
    for (const file of mdFiles) {
      allFailures.push(...validateMarkdownFile(file));
    }
  }

  if (allFailures.length > 0) {
    allFailures.forEach((f) => console.error(`  FAIL  ${f}`));
    console.error(`\n[validate-svg-diagrams] ${allFailures.length} violation(s) found.`);
    process.exit(1);
  }
  console.log(
    `[validate-svg-diagrams] ${isBuilt ? 'Built HTML' : 'Markdown source'} SVG & diagram checks passed.`
  );
}
