#!/usr/bin/env node
/**
 * Claude Code Hook: CabLate Article & SVG Guard
 *
 * 1. PostToolUse (Edit | Write | MultiEdit):
 *    When an article under `src/content/articles/*.md` is created or edited,
 *    immediately runs `validate-svg-diagrams.mjs` on that file and `lint-copy.mjs --strict`,
 *    surfacing any blank-line HTML traps, SVG text overflows, or copy violations right away.
 * 2. PreToolUse (Bash):
 *    Before `git commit` or `git push` targeting the CabLate repository, runs
 *    `lint-copy.mjs --strict` and `validate-content.js` (which includes SVG validation),
 *    blocking the command with `permissionDecision: "deny"` if any check fails.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CABLATE_ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const SVG_VALIDATOR = path.join(CABLATE_ROOT, 'scripts', 'validate-svg-diagrams.mjs');
const CONTENT_VALIDATOR = path.join(CABLATE_ROOT, 'scripts', 'validate-content.js');
const COPY_LINTER = path.join(CABLATE_ROOT, 'scripts', 'lint-copy.mjs');

function norm(p) {
  return path.resolve(p).replace(/\\/g, '/').toLowerCase();
}

const CABLATE_NORM = norm(CABLATE_ROOT);

function isCabLateArticle(filePath) {
  if (!filePath) return false;
  const n = norm(filePath);
  return n.startsWith(`${CABLATE_NORM}/src/content/articles/`) && n.endsWith('.md');
}

function commandTouchesCabLateGit(command, cwd) {
  if (!/\bgit\b[\s\S]*\b(?:commit|push)\b/.test(command)) return false;
  if (norm(cwd || '').startsWith(CABLATE_NORM)) return true;
  if (/cablate/i.test(command)) return true;
  return false;
}

function runNode(scriptPath, args = []) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: CABLATE_ROOT,
    encoding: 'utf8',
    timeout: 15000,
  });
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const event = payload.hook_event_name || '';
const tool = payload.tool_name || '';
const input = payload.tool_input || {};
const cwd = payload.cwd || process.cwd();

if (event === 'PostToolUse' && (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit')) {
  const filePath = input.file_path ? path.resolve(cwd, input.file_path) : null;
  if (!filePath || !isCabLateArticle(filePath) || !fs.existsSync(filePath)) {
    process.exit(0);
  }

  const issues = [];
  const svgRes = runNode(SVG_VALIDATOR, [filePath]);
  if (svgRes.status !== 0) {
    issues.push((svgRes.stderr || svgRes.stdout || '').trim());
  }
  const copyRes = runNode(COPY_LINTER, ['--strict']);
  if (copyRes.status !== 0) {
    issues.push((copyRes.stderr || copyRes.stdout || '').trim());
  }

  if (issues.length > 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `🚨 [article-svg-guard] 剛修改的文章未通過機械掃描，請立即修正後再繼續：\n${issues.join('\n')}`,
        },
      })
    );
  }
  process.exit(0);
}

if (event === 'PreToolUse' && tool === 'Bash') {
  const cmd = String(input.command || '');
  if (!commandTouchesCabLateGit(cmd, cwd)) {
    process.exit(0);
  }

  const failures = [];
  const contentRes = runNode(CONTENT_VALIDATOR);
  if (contentRes.status !== 0) {
    failures.push((contentRes.stderr || contentRes.stdout || '').trim());
  }
  const copyRes = runNode(COPY_LINTER, ['--strict']);
  if (copyRes.status !== 0) {
    failures.push((copyRes.stderr || copyRes.stdout || '').trim());
  }

  if (failures.length > 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `🚨 [article-svg-guard] CabLate 文章或 SVG 機械掃描未通過，已攔截 git commit/push：\n${failures.join('\n')}`,
        },
      })
    );
  }
  process.exit(0);
}
