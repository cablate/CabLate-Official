import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';

const isProductionDeploy = process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH === 'master';

// 0. Content validation — fail fast before building
execSync('node scripts/lint-copy.mjs --strict', { stdio: 'inherit' });
execSync('node scripts/validate-content.js', { stdio: 'inherit' });
execSync('node scripts/validate-analytics.mjs', { stdio: 'inherit' });

// 0.5. Invalidate stale Astro content cache — content/config plumbing changes
// must not be served from a previous build's data-store snapshot.
const dataStorePath = join(process.cwd(), 'node_modules', '.astro', 'data-store.json');
if (existsSync(dataStorePath)) {
  const cacheMtime = statSync(dataStorePath).mtimeMs;
  const cacheWatchTargets = [
    'src/plugins/rehype-article-enhance.mjs',
    'src/content/config.ts',
    'astro.config.mjs',
  ];
  const isStale = cacheWatchTargets.some((relativePath) => {
    const fullPath = join(process.cwd(), relativePath);
    return existsSync(fullPath) && statSync(fullPath).mtimeMs > cacheMtime;
  });

  if (isStale) {
    unlinkSync(dataStorePath);
    console.log('[build] Invalidated stale node_modules/.astro/data-store.json');
  }
}

// 1. Astro build
execSync('npx astro build', { stdio: 'inherit' });
execSync('node scripts/validate-svg-diagrams.mjs --built', { stdio: 'inherit' });
execSync('node scripts/validate-analytics.mjs --built', { stdio: 'inherit' });
execSync('node scripts/subset-serif-font.mjs', { stdio: 'inherit' });
execSync('node scripts/validate-seo-output.mjs', { stdio: 'inherit' });
execSync('node scripts/validate-service-application.js', { stdio: 'inherit' });

// 2. IndexNow — only for the Cloudflare Pages production build, never previews or GitHub CI
async function submitIndexNow() {
  if (!isProductionDeploy) {
    console.log('[indexnow] Skipping — not a production deploy');
    return;
  }

  const SITE = 'cablate.com';
  const KEY = 'a1b2c3d4e5f6a7b8';
  const KEY_LOCATION = `https://${SITE}/indexnow-key.txt`;
  const DIST = join(process.cwd(), 'dist');

  // Pages that must never reach IndexNow even if their HTML signals drift.
  const INDEX_NOW_BLOCKED = ['/services/apply/', '/confirm-subscription/', '/subscribe/', '/404'];

  // Walk dist/ and collect all indexable HTML file paths → URLs
  function collectHtmlFiles(dir, baseDir) {
    const entries = readdirSync(dir);
    const urls = [];
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        urls.push(...collectHtmlFiles(fullPath, baseDir));
      } else if (entry === 'index.html') {
        // Convert dist/foo/index.html → https://cablate.com/foo/
        const relative = fullPath
          .replace(baseDir, '')
          .replace(/\\/g, '/')
          .replace(/\/index\.html$/, '/');
        if (INDEX_NOW_BLOCKED.some((blocked) => relative.startsWith(blocked))) continue;

        // Content guard: skip redirect stubs, noindex pages, and pages whose
        // canonical points elsewhere (e.g. /subscribe/ → /newsletter/).
        const html = readFileSync(fullPath, 'utf8');
        if (/<meta[^>]+http-equiv=["']refresh["']/i.test(html)) continue;
        const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? '';
        if (/noindex/i.test(robotsMeta)) continue;
        const canonicalHref = html
          .match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
          ?.match(/href=["']([^"']+)["']/i)?.[1];
        if (canonicalHref && new URL(canonicalHref, `https://${SITE}/`).pathname !== relative) continue;

        const url = `https://${SITE}${relative || '/'}`;
        urls.push(url);
      }
    }
    return urls;
  }

  const urlList = collectHtmlFiles(DIST, DIST);
  console.log(`[indexnow] Submitting ${urlList.length} URLs:`);
  urlList.forEach(u => console.log(`  ${u}`));

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: SITE, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    if (res.ok) {
      console.log(`[indexnow] Submitted successfully (HTTP ${res.status})`);
    } else {
      console.log(`[indexnow] Submission returned HTTP ${res.status} — skipping`);
    }
  } catch (err) {
    console.log(`[indexnow] Submission failed (${err.message}) — skipping`);
  }
}

await submitIndexNow();
