import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// 0. Content validation — fail fast before building
execSync('node scripts/validate-content.js', { stdio: 'inherit' });

// 1. Astro build
execSync('npx astro build', { stdio: 'inherit' });

// 2. Sitemap ping
try {
  await fetch('https://www.google.com/ping?sitemap=https://cablate.com/sitemap.xml');
  console.log('[postbuild] Sitemap ping sent');
} catch {
  console.log('[postbuild] Sitemap ping failed (network)');
}

// 3. IndexNow — only runs in CI (Cloudflare Pages or generic CI)
async function submitIndexNow() {
  const isCI = process.env.CF_PAGES || process.env.CI;
  if (!isCI) {
    console.log('[indexnow] Skipping — not in CI environment');
    return;
  }

  const SITE = 'cablate.com';
  const KEY = 'a1b2c3d4e5f6a7b8';
  const KEY_LOCATION = `https://${SITE}/indexnow-key.txt`;
  const DIST = join(process.cwd(), 'dist');

  // Walk dist/ and collect all HTML file paths → URLs
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
