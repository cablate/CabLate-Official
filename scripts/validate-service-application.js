import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const application = read('src/pages/services/apply.astro');
const endpoint = read('functions/api/service-application.js');
const config = read('src/config/serviceApplication.ts');
const consultingPage = read('src/pages/services/consulting.astro');
const coachingPage = read('src/pages/services/coaching.astro');
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
rejectText(application, 'analytics="disabled"', 'application consent-aware analytics');
expectText(application, "name: 'generate_lead'", 'application conversion event');
expectText(application, 'action="/api/service-application"', 'form endpoint');
expectText(application, 'method="post"', 'form method');
expectText(application, 'novalidate={true}', 'consistent client validation');
expectText(application, 'name="situation"', 'compressed situation question');
expectText(application, 'name="focus"', 'route focus question');
expectText(application, 'application-optional', 'optional details disclosure');
rejectText(application, '送出前確認', 'removed pre-submit confirmation block');
rejectText(application, 'application-consent', 'removed consent checkbox');
rejectText(application, '不自動加入電子報', 'removed newsletter reassurance');
rejectText(application, '請不要貼密碼、Token、未遮蔽的客戶資料或公司機密原文。', 'removed sensitive-data warning');
expectText(application, 'application-honeypot', 'honeypot');
expectText(application, 'cf_turnstile_response', 'turnstile token submission');
expectText(application, '申請已送出', 'truthful submission state');
expectText(application, 'data-error-list', 'actionable error summary');
expectText(application, 'data-ready-email', 'submission email confirmation');
expectText(application, 'data-route-summary', 'nearby service-change feedback');
expectText(application, 'aria-live="polite"', 'service-change announcement');
expectText(application, '<script is:inline>', 'early route bootstrap');
expectText(application, 'group.hidden = !active;', 'preselected focus reveal before module initialization');
expectText(application, 'input.required = active;', 'preselected focus requirement before module initialization');
expectText(config, '送出陪跑申請', 'coaching message match');
expectText(config, '你目前手上已經有什麼？', 'coaching readiness focus');
expectText(config, '如果這五週有進展，你最希望看到什麼？', 'coaching desired progress');
expectText(config, 'active_work_in_progress', 'coaching readiness options');
expectText(config, '談完確認合作，會收到本期專屬優惠', 'coaching invitation offer');
expectText(config, '14 天內加入仍可全額折抵', 'coaching consultation credit');
if (application.indexOf('data-selected-service') > application.indexOf('data-hero-title')) {
  failures.push('mobile service selector: preselected service control must appear before dynamic hero copy');
}
expectText(application, '你想找人陪著做五週', 'free and paid boundary');
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
expectText(endpoint, 'html: buildEmailHtml(data, leadId)', 'scannable HTML owner email');
expectText(endpoint, 'escapeHtml', 'HTML email escaping');
rejectText(endpoint, 'payload.consent !== true', 'removed server consent validation');
rejectText(endpoint, 'consent：agreed', 'removed false consent audit claim');
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

expectText(config, 'service-application-v4', 'application schema version');
expectText(config, "label: '專案卡關諮詢'", 'broad consulting route');
expectText(consultingPage, '工作、事業、產品、內容或流程都可以', 'consulting scope');
rejectText(config, 'AI 專案卡關諮詢', 'consulting is not AI-only');
rejectText(consultingPage, 'AI 專案卡關諮詢', 'consulting page is not AI-only');
expectText(config, '申請五週一對一陪跑', 'coaching application route');
expectText(config, '邀請適合的人免費聊 30 分鐘', 'coaching selection route');
expectText(coachingPage, 'NT$39,800', 'coaching public price');
expectText(coachingPage, 'price: 39800', 'coaching structured price');
rejectText(coachingPage, 'NT$49,800', 'old coaching public price');
expectText(contract, 'NT$34,800', 'consultation credit remainder');
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
