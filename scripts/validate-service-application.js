import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const application = read('src/pages/services/apply.astro');
const endpoint = read('functions/api/service-application.js');
const config = read('src/config/serviceApplication.ts');
const styles = read('src/styles/service-application.css');
const privacy = read('src/pages/privacy.astro');
const contract = read('docs/contracts/service-application-and-lead-ledger-v1.md');

const failures = [];
const expectText = (source, text, label) => {
  if (!source.includes(text)) failures.push(`${label}: missing ${JSON.stringify(text)}`);
};
const rejectText = (source, text, label) => {
  if (source.includes(text)) failures.push(`${label}: must not contain ${JSON.stringify(text)}`);
};

expectText(application, 'noindex={true}', 'application privacy');
expectText(application, 'analytics="disabled"', 'application privacy');
expectText(application, 'action="/api/service-application"', 'form endpoint');
expectText(application, 'method="post"', 'form method');
expectText(application, 'name="situation"', 'compressed situation question');
expectText(application, 'name="focus"', 'route focus question');
expectText(application, 'application-optional', 'optional details disclosure');
expectText(application, 'consent" value="agreed" required', 'consent');
expectText(application, 'application-honeypot', 'honeypot');
expectText(application, 'cf_turnstile_response', 'turnstile token submission');
expectText(application, '申請已送達', 'truthful receipt state');
expectText(application, '免費訪談不是縮短版的付費諮詢', 'free and paid boundary');
expectText(application, '^[A-Za-z0-9._~-]{1,100}$', 'attribution allowlist');
rejectText(application, 'current_work', 'removed duplicate question');
rejectText(application, 'main_blocker', 'removed duplicate question');
rejectText(application, 'desired_change', 'removed duplicate question');
rejectText(application, 'cab_help', 'removed duplicate question');
rejectText(application, 'mailto.length', 'legacy mailto guard');
rejectText(application, 'localStorage', 'PII persistence');
rejectText(application, 'sessionStorage', 'PII persistence');
rejectText(application, 'gtag(', 'PII analytics');

expectText(endpoint, 'onRequestGet', 'public Turnstile config');
expectText(endpoint, 'onRequestPost', 'application endpoint');
expectText(endpoint, 'sameOrigin(request)', 'same-origin gate');
expectText(endpoint, 'verifyTurnstile', 'server-side Turnstile');
expectText(endpoint, 'TURNSTILE_VERIFY_URL', 'Turnstile Siteverify');
expectText(endpoint, "'Idempotency-Key'", 'email idempotency');
expectText(endpoint, 'SERVICE_APPLICATION_DRY_RUN', 'local delivery test mode');
expectText(endpoint, 'reply_to: data.email', 'reply route');
expectText(endpoint, 'payload.consent !== true', 'server consent validation');
rejectText(endpoint, 'RESEND_API_KEY =', 'hard-coded Resend key');
rejectText(endpoint, 'TURNSTILE_SECRET_KEY =', 'hard-coded Turnstile secret');

expectText(styles, '@media (max-width: 760px)', 'mobile layout');
expectText(styles, 'grid-template-columns: 1fr;', 'mobile single-column layout');
expectText(styles, 'min-block-size: 3.25rem;', 'form control target size');
expectText(styles, 'font-size: 1rem;', 'mobile form font size');

for (const service of ['consulting', 'coaching', 'enterprise', 'partnerships']) {
  const page = read(`src/pages/services/${service}.astro`);
  expectText(config, `id: '${service}'`, `${service} config`);
  expectText(config, 'focusOptions:', `${service} focus options`);
  expectText(page, `getServiceApplicationHref('${service}', '${service}_page')`, `${service} source route`);
  rejectText(page, `const ${service === 'partnerships' ? 'partnership' : service}Mailto`, `${service} legacy mailto`);
}

expectText(config, 'service-application-v2', 'application schema version');
expectText(config, '30 分鐘免費陪跑訪談', 'coaching interview route');
expectText(config, '60 分鐘付費諮詢', 'paid consulting route');
expectText(privacy, '<h2>服務申請與 Email</h2>', 'privacy disclosure');
expectText(privacy, 'Cloudflare Turnstile', 'Turnstile disclosure');
expectText(privacy, 'Resend', 'Resend disclosure');
expectText(privacy, '不會因此自動加入電子報', 'purpose separation');
expectText(contract, 'revenue-pipeline-ledger.md', 'unique ledger authority');
expectText(contract, '`received`', 'honest state contract');
expectText(contract, '只有後端確認成功後', 'backend receipt gate');

if (failures.length > 0) {
  console.error('Service application validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Service application validation passed.');
