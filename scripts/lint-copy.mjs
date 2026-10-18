// Counts AI-tell patterns in the marketing copy surfaces.
// Usage: node scripts/lint-copy.mjs [--strict] [--quiet]
// Exits 1 only with --strict and at least one hit.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const strict = process.argv.includes('--strict');
const quiet = process.argv.includes('--quiet');

const dirFiles = (dir, ext) => {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && ext.some((e) => entry.name.endsWith(e)))
    .map((entry) => `${dir}/${entry.name}`);
};

const files = [
  ...['index', 'about', 'services', 'expertise', '404', 'confirm-subscription', 'newsletter', 'privacy'].map((n) => `src/pages/${n}.astro`),
  ...dirFiles('src/pages/services', ['.astro']),
  'src/pages/courses/index.astro',
  ...dirFiles('src/config', ['.ts']),
  ...dirFiles('src/components/common', ['.astro']),
  ...dirFiles('src/components/sections', ['.astro']),
  'src/components/NewsletterCTA.astro',
].filter((file) => existsSync(join(root, file)));

// A sentence never crosses 。！？ or a line break, so contrast patterns stay inside one sentence.
const S = '[^。！？\\n]*?';
const patterns = [
  { name: 'em dash 「——」', re: /——|—/g },
  { name: '不是…而是', re: new RegExp(`不是${S}而是`, 'g') },
  { name: '不是…，是（無「而」）', re: new RegExp(`不是${S}[，、；]\\s*(?:是|也不是)`, 'g') },
  { name: '不只是', re: /不只是/g },
  { name: '不只/不僅…更', re: new RegExp(`(?:不只|不僅|不單)${S}更`, 'g') },
  { name: '真正的', re: /真正的/g },
  { name: '關鍵', re: /關鍵/g },
  { name: '說白了', re: /說白了/g },
  { name: 'colon reveal', re: /(?:答案|重點|關鍵|結論|差別|原因|核心|真相)(?:是|在於)?[：:]/g },
  { name: 'colon connector（…是：／學到：／一件事：）', re: /(?:是[^，。！？：:\n]{0,8}|學到|一件事)[：:]/g },
  { name: '打造/賦能/無縫/一站式', re: /打造|賦能|無縫|一站式/g },
  { name: '全方位/深度/極致', re: /全方位|深度(?!工程手冊)|極致/g },
];

const hits = new Map(patterns.map((p) => [p.name, []]));

for (const file of files) {
  const lines = readFileSync(join(root, file), 'utf8').split(/\r?\n/);
  let inStyle = false;
  lines.forEach((line, index) => {
    if (/<style\b/.test(line)) inStyle = true;
    const skip = inStyle;
    if (/<\/style>/.test(line)) inStyle = false;
    if (skip) return;
    for (const { name, re } of patterns) {
      for (const match of line.matchAll(re)) {
        hits.get(name).push({ file, line: index + 1, text: match[0].length > 60 ? `${match[0].slice(0, 60)}...` : match[0] });
      }
    }
  });
}

let total = 0;
console.log(`[lint-copy] scanned ${files.length} files`);
for (const { name } of patterns) {
  const list = hits.get(name);
  total += list.length;
  console.log(`${String(list.length).padStart(4)}  ${name}`);
}
console.log(`${String(total).padStart(4)}  total`);

if (!quiet) {
  for (const { name } of patterns) {
    const list = hits.get(name);
    if (!list.length) continue;
    console.log(`\n# ${name}`);
    for (const hit of list) console.log(`${relative(root, join(root, hit.file)).replaceAll('\\', '/')}:${hit.line}  ${hit.text}`);
  }
}

if (strict && total > 0) process.exit(1);
