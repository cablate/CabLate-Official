// Asserts what crawlers and link unfurlers read from the built site in dist/.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const PERSON_ID = 'https://cablate.com/about/#person';
const ROBOTS_DIRECTIVES = /^(user-agent|allow|disallow|sitemap|crawl-delay):/i;
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const isRedirectStub = (html) => /<meta http-equiv="refresh"/i.test(html);
const jsonLdNodes = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  .flatMap(([, body]) => {
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [parsed];
  });
const collectTyped = (node, type, found = []) => {
  if (Array.isArray(node)) node.forEach((item) => collectTyped(item, type, found));
  else if (node && typeof node === 'object') {
    if (node['@type'] === type) found.push(node);
    Object.values(node).forEach((value) => collectTyped(value, type, found));
  }
  return found;
};

const sitemap = existsSync(join(dist, 'sitemap-0.xml')) ? readFileSync(join(dist, 'sitemap-0.xml'), 'utf8') : '';

const publicDir = resolve('public');
for (const file of walk(dist).filter((path) => path.endsWith('.html'))) {
  const route = relative(dist, file).replaceAll('\\', '/');
  if (existsSync(join(publicDir, route))) continue;
  const html = readFileSync(file, 'utf8');
  if (isRedirectStub(html)) continue;

  const nodes = jsonLdNodes(html);
  const websites = collectTyped(nodes, 'WebSite');
  if (route === 'index.html') assert(websites.length === 1, `${route}: expected one WebSite node, found ${websites.length}`);
  else assert(websites.length === 0, `${route}: WebSite node belongs only on the home page`);

  for (const person of collectTyped(nodes, 'Person')) {
    assert(person['@id'] === PERSON_ID, `${route}: Person node has @id ${person['@id'] ?? '(none)'} instead of ${PERSON_ID}`);
  }

  if (route.startsWith('articles/')) {
    assert(collectTyped(nodes, 'FAQPage').length === 0, `${route}: article pages carry no FAQPage (decision D3)`);
    assert(!html.includes('giscus.app'), `${route}: comments were removed from article pages (decision D3)`);
  }
  assert(!/<meta name="article:/i.test(html), `${route}: article:* meta uses name= instead of property=`);
  assert((html.match(/<main[\s>]/gi) ?? []).length === 1, `${route}: expected exactly one <main>`);
  assert((html.match(/<h1[\s>]/gi) ?? []).length === 1, `${route}: expected exactly one <h1>`);
}

const apply = readFileSync(join(dist, 'services/apply/index.html'), 'utf8');
assert(/<meta name="robots" content="noindex/i.test(apply), 'services/apply: form page must be noindex');
assert(!sitemap.includes('/services/apply/'), 'services/apply: form page must not be in the sitemap');

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
for (const line of robots.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  assert(ROBOTS_DIRECTIVES.test(trimmed), `robots.txt: non-standard directive "${trimmed}"`);
}

if (failures.length) {
  console.error(`[validate-seo-output] ${failures.length} failure(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('[validate-seo-output] structured data, meta and robots contracts passed');
