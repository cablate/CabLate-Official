import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const application = read('src/pages/services/apply.astro');
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
expectText(application, 'method="post"', 'form fallback');
expectText(application, 'enctype="text/plain"', 'form fallback');
expectText(application, '開啟草稿不代表 Cab 已收到', 'truthful receipt state');
expectText(application, 'consent" value="agreed" required', 'consent');
expectText(application, 'mailto.length <= 8000', 'mailto length guard');
expectText(application, 'CAB-${date}-', 'lead ID');
expectText(application, '^[A-Za-z0-9._~-]{1,100}$', 'attribution allowlist');
rejectText(application, 'localStorage', 'PII persistence');
rejectText(application, 'sessionStorage', 'PII persistence');
rejectText(application, 'fetch(', 'unapproved application backend');
rejectText(application, 'gtag(', 'PII analytics');
expectText(styles, '@media (max-width: 760px)', 'mobile layout');
expectText(styles, 'grid-template-columns: 1fr;', 'mobile single-column layout');
expectText(styles, 'min-block-size: 3.25rem;', 'form control target size');
expectText(styles, 'font-size: 1rem;', 'mobile form font size');

for (const service of ['consulting', 'coaching', 'enterprise', 'partnerships']) {
  const page = read(`src/pages/services/${service}.astro`);
  expectText(config, `id: '${service}'`, `${service} config`);
  expectText(page, `getServiceApplicationHref('${service}', '${service}_page')`, `${service} source route`);
  rejectText(page, `const ${service === 'partnerships' ? 'partnership' : service}Mailto`, `${service} legacy mailto`);
}

expectText(privacy, '<h2>服務申請與 Email</h2>', 'privacy disclosure');
expectText(privacy, '不會因此自動加入電子報', 'purpose separation');
expectText(contract, 'revenue-pipeline-ledger.md', 'unique ledger authority');
expectText(contract, '`email_prepared`', 'honest state contract');
expectText(contract, '只有後端確認成功後', 'backend receipt gate');

if (failures.length > 0) {
  console.error('Service application validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Service application validation passed.');
