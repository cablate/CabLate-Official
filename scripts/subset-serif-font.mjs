// Writes the heading serif font as a woff2 holding only the characters the built site can display.
// Text injected by scripts counts too, so every HTML and JS file in dist/ feeds the character set.
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import subsetFont from 'subset-font';

const SOURCE = resolve('assets/fonts/NotoSerifTC-Bold.woff2');
const OUTPUT_PATH = '/fonts/cablate-serif-700.woff2';
const MAX_BYTES = 400 * 1024;

const dist = resolve(process.argv[2] ?? 'dist');
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const characters = new Set();
for (const file of walk(dist).filter((path) => /\.(html|js)$/.test(path))) {
  for (const character of readFileSync(file, 'utf8')) characters.add(character);
}

const font = await subsetFont(readFileSync(SOURCE), [...characters].join(''), { targetFormat: 'woff2' });
if (font.length > MAX_BYTES) {
  throw new Error(`[subset-serif-font] ${font.length} bytes exceeds the ${MAX_BYTES} byte budget`);
}

const target = join(dist, OUTPUT_PATH);
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, font);
console.log(`[subset-serif-font] ${characters.size} characters -> ${OUTPUT_PATH} (${font.length} bytes)`);
