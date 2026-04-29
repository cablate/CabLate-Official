/**
 * Content Validation Script
 *
 * Scans non-draft course markdown files for:
 * 1. [TEST] markers — placeholder content that should not ship
 * 2. Unicode replacement characters (U+FFFD) — source corruption
 *
 * Usage: node scripts/validate-content.js
 * Exit code: 1 if violations found, 0 if clean.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const COURSES_DIR = join(process.cwd(), 'src', 'content', 'courses');

const FORBIDDEN_PATTERNS = [
  { pattern: /\[TEST(?:\s+DATA)?\]/gi, label: '[TEST] marker' },
  { pattern: /�/g, label: 'Unicode replacement character (U+FFFD)' },
];

let violations = 0;

let files;
try {
  files = readdirSync(COURSES_DIR).filter(f => f.endsWith('.md'));
} catch {
  // No courses directory yet — nothing to validate
  console.log('[validate-content] No courses directory found, skipping.');
  process.exit(0);
}

for (const file of files) {
  const filePath = join(COURSES_DIR, file);
  const content = readFileSync(filePath, 'utf-8');

  // Parse draft status from frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) continue;

  const frontmatter = frontmatterMatch[1];
  const isDraft = /^draft:\s*true/m.test(frontmatter);

  if (isDraft) {
    // Draft files are allowed to have test content
    continue;
  }

  // Check non-draft files for forbidden patterns
  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      console.error(`  FAIL  ${file}: found ${matches.length}x ${label}`);
      violations += matches.length;
    }
  }
}

if (violations > 0) {
  console.error(`\n[validate-content] ${violations} violation(s) found. Set draft: true or replace placeholders.`);
  process.exit(1);
} else {
  console.log('[validate-content] All published course content is clean.');
}
