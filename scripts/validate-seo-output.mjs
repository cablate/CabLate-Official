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

const publicDir = resolve(dist, '../public');
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
  assert(!/href="\/articles\/(?:tag|tags|category)\//.test(html), `${route}: links to a removed tag or category page (decision D2)`);
  assert((html.match(/<main[\s>]/gi) ?? []).length === 1, `${route}: expected exactly one <main>`);
  assert((html.match(/<h1[\s>]/gi) ?? []).length === 1, `${route}: expected exactly one <h1>`);

  // seo-coach W5 / 04-on-page checks: no heading level skips (e.g. H1 -> H3) and every <img> has an alt attribute
  const headingLevels = [...html.matchAll(/<(h[1-6])[\s>]/gi)].map(([, tag]) => Number.parseInt(tag[1], 10));
  for (let i = 1; i < headingLevels.length; i += 1) {
    assert(
      headingLevels[i] <= headingLevels[i - 1] + 1,
      `${route}: heading hierarchy skipped from H${headingLevels[i - 1]} to H${headingLevels[i]}`
    );
  }
  const missingAltImages = [...html.matchAll(/<img\b[^>]*>/gi)].filter(([tag]) => !/\balt=/i.test(tag));
  assert(missingAltImages.length === 0, `${route}: found ${missingAltImages.length} <img> tag(s) without alt attribute`);
}

const apply = readFileSync(join(dist, 'services/apply/index.html'), 'utf8');
assert(/<meta name="robots" content="noindex/i.test(apply), 'services/apply: form page must be noindex');
assert(!sitemap.includes('/services/apply/'), 'services/apply: form page must not be in the sitemap');

const jsonLdTypes = (html) => {
  const found = new Set();
  const visit = (node) => {
    if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === 'object') {
      const type = node['@type'];
      if (typeof type === 'string') found.add(type);
      else if (Array.isArray(type)) type.forEach((t) => found.add(t));
      Object.values(node).forEach(visit);
    }
  };
  visit(jsonLdNodes(html));
  return found;
};

const expectJsonLdTypes = (route, expected) => {
  const path = join(dist, route);
  if (!existsSync(path)) {
    assert(false, `${route}: expected a built page for JSON-LD checks, but it is missing from dist`);
    return;
  }
  const found = jsonLdTypes(readFileSync(path, 'utf8'));
  for (const type of expected) {
    assert(found.has(type), `${route}: expected JSON-LD type "${type}", found [${[...found].sort().join(', ')}]`);
  }
};

expectJsonLdTypes('services/consulting/index.html', ['Service', 'FAQPage', 'BreadcrumbList']);
expectJsonLdTypes('services/enterprise/index.html', ['Service', 'FAQPage', 'BreadcrumbList']);
expectJsonLdTypes('services/partnerships/index.html', ['Service', 'FAQPage', 'BreadcrumbList']);
expectJsonLdTypes('courses/index.html', ['BreadcrumbList', 'ItemList']);
expectJsonLdTypes('services/index.html', ['BreadcrumbList', 'ItemList']);

// seo-coach 04-on-page / 40-chinese-seo-specifics: core commercial/hub pages must include descriptive topic keywords in <title>
const expectTitleKeywords = (route, keywords) => {
  const html = readFileSync(join(dist, route), 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/i) ?? [])[1] ?? '';
  for (const kw of keywords) {
    assert(title.includes(kw), `${route}: expected <title> ("${title}") to include "${kw}"`);
  }
};
expectTitleKeywords('articles/index.html', ['AI Agent', 'Claude Code']);
expectTitleKeywords('courses/index.html', ['Claude Code', 'AgentSkill']);
expectTitleKeywords('expertise/index.html', ['AI 工作流']);
expectTitleKeywords('services/consulting/index.html', ['AI', '諮詢']);
expectTitleKeywords('services/partnerships/index.html', ['AI', '工作坊']);

const llmsPath = join(dist, 'llms.txt');
const llms = existsSync(llmsPath) ? readFileSync(llmsPath, 'utf8') : '';
assert(llms.length > 0, 'llms.txt: dynamic endpoint output must exist in dist');
assert(llms.includes('/articles/ai-tests-false-safety-six-phase-overhaul/'), 'llms.txt: must list /articles/ai-tests-false-safety-six-phase-overhaul/');
assert(llms.includes('/articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/'), 'llms.txt: must list /articles/reverse-engineer-claude-agent-sdk-hidden-token-cost/');

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
