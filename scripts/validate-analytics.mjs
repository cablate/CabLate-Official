import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const layout = read('src/layouts/BaseLayout.astro');
const head = read('src/components/analytics/AnalyticsHead.astro');
const consent = read('src/components/analytics/AnalyticsConsent.astro');
const client = read('src/lib/analytics-client.ts');
const application = read('src/pages/services/apply.astro');
const privacy = read('src/pages/privacy.astro');
const servicePages = [
  'src/pages/services.astro',
  'src/pages/services/coaching.astro',
  'src/pages/services/consulting.astro',
  'src/pages/services/enterprise.astro',
  'src/pages/services/partnerships.astro',
  'src/pages/services/apply.astro',
];

assert(head.includes("analytics_storage: 'denied'"), 'analytics consent does not default to denied');
assert(head.includes('PRODUCTION_HOSTS'), 'GA network loading is not production-host gated');
assert(head.includes('safePath(window.location.href)'), 'page URL is not stripped to origin and path');
assert(head.includes('allow_google_signals: false'), 'Google signals are not explicitly disabled');
assert(head.includes('allow_ad_personalization_signals: false'), 'ad personalization signals are not explicitly disabled');
assert(!layout.includes('<script async src={`https://www.googletagmanager.com'), 'layout still eagerly loads GA4');
assert(consent.includes('允許網站分析') && consent.includes('只使用必要功能'), 'consent UI does not offer equally clear allow and decline choices');
assert(layout.includes('data-analytics-settings'), 'footer has no persistent analytics preference entry');
assert(privacy.includes('姓名、Email、表單自由文字、申請編號與你貼上的連結不會送進 GA4'), 'privacy page does not state the analytics data boundary');

for (const eventName of ['service_cta_click', 'form_start', 'form_submit_attempt', 'form_submit_invalid', 'form_submit_error', 'generate_lead']) {
  assert(client.includes(`name: '${eventName}'`), `typed analytics contract is missing ${eventName}`);
  assert(head.includes(`${eventName}:`), `runtime analytics allowlist is missing ${eventName}`);
}
for (const forbiddenKey of ['applicant_name', 'email_address', 'free_text', 'lead_id', 'submission_id']) {
  assert(!head.includes(`${forbiddenKey}:`), `runtime analytics contract admits sensitive key ${forbiddenKey}`);
  assert(!client.includes(`${forbiddenKey}:`), `typed analytics contract admits sensitive key ${forbiddenKey}`);
}

for (const page of servicePages) {
  assert(!read(page).includes('analytics="disabled"'), `${page} still disables analytics`);
}
assert(application.includes("name: 'form_start'") && application.includes("name: 'generate_lead'"), 'application funnel events are not connected');
for (const page of servicePages.slice(0, 5)) {
  assert(read(page).includes('data-analytics-placement'), `${page} has no attributed service CTA or route`);
}

if (process.argv.includes('--built')) {
  const pages = [
    'dist/services/index.html',
    'dist/services/coaching/index.html',
    'dist/services/consulting/index.html',
    'dist/services/enterprise/index.html',
    'dist/services/partnerships/index.html',
    'dist/services/apply/index.html',
    'dist/privacy/index.html',
  ];
  for (const page of pages) assert(existsSync(join(root, page)), `built analytics route is missing: ${page}`);
  const builtService = read('dist/services/index.html');
  assert(builtService.includes('data-analytics-consent'), 'built service page has no consent UI');
  assert(!/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com/i.test(builtService), 'built service page eagerly loads GA4 before consent');
}

if (failures.length) {
  console.error('[validate-analytics] failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('[validate-analytics] consent, privacy and funnel contracts passed');
