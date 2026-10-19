/**
 * Content Validation Script
 *
 * Scans non-draft article markdown files for:
 * 1. [TEST] markers — placeholder content that should not ship
 * 2. Unicode replacement characters (U+FFFD) — source corruption
 * 3. Date-times without a timezone offset — YAML reads them as UTC and shifts the published time
 * 4. ogImage paths that do not exist under public/
 *
 * Usage: node scripts/validate-content.js
 * Exit code: 1 if violations found, 0 if clean.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { validateMarkdownFile } from './validate-svg-diagrams.mjs';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const ARTICLES_DIR = join(ROOT_DIR, 'src', 'content', 'articles');
const PUBLIC_DIR = join(ROOT_DIR, 'public');

const FORBIDDEN_PATTERNS = [
  { pattern: /\[TEST(?:\s+DATA)?\]/gi, label: '[TEST] marker' },
  { pattern: /�/g, label: 'Unicode replacement character (U+FFFD)' },
];
const DATE_FIELD = /^(publishDate|updatedDate):\s*["']?([^"'\s]+)/gm;
const DATE_TIME_WITHOUT_OFFSET = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

const failures = [];

for (const file of readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'))) {
  const content = readFileSync(join(ARTICLES_DIR, file), 'utf-8').replace(/\r\n/g, '\n');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!frontmatter) {
    failures.push(`${file}: missing frontmatter`);
    continue;
  }

  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) failures.push(`${file}: found ${matches.length}x ${label}`);
  }

  for (const [, field, value] of frontmatter.matchAll(DATE_FIELD)) {
    if (DATE_TIME_WITHOUT_OFFSET.test(value)) failures.push(`${file}: ${field} ${value} has a time but no timezone offset (use +08:00)`);
  }

  const ogImage = frontmatter.match(/^ogImage:\s*["']?([^"'\n]+)/m)?.[1]?.trim();
  if (ogImage && !ogImage.startsWith('http') && !existsSync(join(PUBLIC_DIR, ogImage))) {
    failures.push(`${file}: ogImage ${ogImage} does not exist under public/`);
  }

  failures.push(...validateMarkdownFile(join(ARTICLES_DIR, file)));
}

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`  FAIL  ${failure}`));
  console.error(`\n[validate-content] ${failures.length} violation(s) found.`);
  process.exit(1);
}
console.log('[validate-content] All published article content is clean.');
