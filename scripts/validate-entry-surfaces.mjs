import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const count = (source, pattern) => [...source.matchAll(pattern)].length;

const homeSource = read('src/pages/index.astro');
const expertiseSource = read('src/pages/expertise.astro');
const worksheetSource = read('src/components/sections/WorkflowDiagnostic.astro');
const layerSource = read('src/config/workflowDiagnostic.ts');
const eventSource = read('src/lib/entry-surface-events.ts');
const navigationSource = read('src/config/authority.ts');
const headerSource = read('src/components/ArchiveNavigation.astro');
const layoutSource = read('src/layouts/BaseLayout.astro');
const notFoundSource = read('src/pages/404.astro');

assert(count(homeSource, /<h1\b/g) === 1, 'home source must contain exactly one H1');
assert(count(expertiseSource, /<h1\b/g) === 1, 'expertise source must contain exactly one H1');
assert(homeSource.includes('aria-label="開始 AI 工作流健檢"') && homeSource.includes('href="/expertise/"'), 'home Hero CTA contract is missing');
assert(expertiseSource.includes('aria-label="開始檢查一個真實 AI 工作任務"') && expertiseSource.includes('href="#workflow-check"'), 'expertise Hero CTA contract is missing');
assert(!homeSource.includes('給還在觀望的你'), 'retired anxiety section is still present');
assert(!homeSource.includes('代表案例') && !homeSource.includes('stars／') && !homeSource.includes('位學員'), 'unapproved proof is rendered on home');

const navBlock = navigationSource.match(/export const primaryNavigation = \[([\s\S]*?)\] as const;/)?.[1] ?? '';
assert(count(navBlock.replace(/^\s*\/\/.*$/gm, ''), /href:/g) === 4, 'primary navigation must contain exactly four active links');
for (const label of ['專業方法', '學習', '合作', '關於']) assert(navBlock.includes(`label: '${label}'`), `navigation label missing: ${label}`);
assert(!headerSource.includes('site-rail__social'), 'header still renders external/social links');
for (const label of ['專業方法', '學習', '合作', '關於', 'CabAI 學習平台', 'Email', 'Threads', 'GitHub', '隱私權政策']) assert(layoutSource.includes(label), `footer label missing: ${label}`);
assert(!layoutSource.includes('>RSS<') && !layoutSource.includes('>Articles<'), 'footer exposes a paused RSS or Articles entry');

assert(count(worksheetSource, /<fieldset class="layer-check"/g) === 1 && worksheetSource.includes('diagnosticLayers.map'), 'worksheet must render the five data-driven fieldsets');
for (const code of ['task_contract', 'context_data', 'tools_permissions', 'memory_state', 'acceptance_recovery']) assert(layerSource.includes(`code: '${code}'`), `diagnostic result code missing: ${code}`);
assert(count(layerSource, /code: '/g) === 5, 'diagnostic config must contain exactly five result codes');
assert(!/<textarea[^>]*\bname=/i.test(worksheetSource), 'diagnostic free-text textarea has a network-submittable name');
for (const call of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest']) assert(!worksheetSource.includes(call), `diagnostic client persists or transmits content through ${call}`);
for (const forbidden of ['task:', 'answer:', 'evidence:', 'correction:', 'expected:', 'next:']) assert(!eventSource.includes(forbidden), `event schema admits diagnostic body field: ${forbidden}`);
assert(eventSource.includes('no-op until the A04 consent gate is approved'), 'event sink is not explicitly no-op');
assert(expertiseSource.includes('analytics="disabled"'), 'expertise route does not explicitly disable existing analytics');

assert(notFoundSource.includes('noindex, follow'), '404 robots contract is missing');
for (const href of ['/expertise/', '/courses/']) assert(notFoundSource.includes(`href="${href}"`), `404 link missing: ${href}`);
assert(notFoundSource.includes('CabLate 失效連結'), '404 report subject is missing');

if (existsSync(join(root, 'dist'))) {
  const homeHtml = read('dist/index.html');
  const expertiseHtml = read('dist/expertise/index.html');
  const notFoundHtml = read('dist/404.html');
  assert(count(homeHtml, /<h1\b/g) === 1, 'built home must contain exactly one H1');
  assert(count(expertiseHtml, /<h1\b/g) === 1, 'built expertise must contain exactly one H1');
  assert(count(expertiseHtml, /<fieldset class="layer-check"/g) === 5, 'built expertise must contain five check fieldsets');
  assert(!expertiseHtml.includes('googletagmanager.com'), 'built expertise contains an outbound analytics script');
  assert(notFoundHtml.includes('noindex, follow'), 'built 404 robots contract is missing');
  for (const route of ['', 'expertise', 'courses', 'services', 'about', 'privacy']) {
    const path = route ? join(root, 'dist', route, 'index.html') : join(root, 'dist', 'index.html');
    assert(existsSync(path), `built internal route is missing: /${route}`);
  }
}

if (failures.length) {
  console.error('[validate-entry-surfaces] failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('[validate-entry-surfaces] all entry-surface contracts passed');
