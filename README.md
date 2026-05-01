# CabLate Website

CabLate.com Astro static site for public writing, SEO, course landing pages,
and product-facing content.

## Status

Active. Astro + Cloudflare Pages site. The current repo has content validation,
centralized course display rules, stronger course schema, and Astro checks.

Current operational handoff lives in the ClaudeCab workspace project card:

`F:/_Program/OwnProject/ClaudeCab/agents/coder/projects/cablate-website/README.md`

## Common Commands

```sh
npm install
npm run dev
npm run build
npm run check
npm run validate:content
```

## Project Structure

| Path | Purpose |
|------|---------|
| `src/pages/` | Astro routes |
| `src/content/` | Markdown/content collections |
| `src/components/` | Reusable Astro components |
| `src/layouts/` | Page layouts |
| `src/styles/` | Global CSS and design rules |
| `scripts/` | Build and content validation helpers |
| `public/` | Static public assets |

## Working Rules

- Run `git status --short` before edits.
- Do not edit generated/runtime folders: `node_modules/`, `dist/`, `.astro/`,
  `.serena/`, `Python/`, `.playwright-mcp/`.
- Do not commit throwaway QA screenshots from the repo root unless they are
  intentionally promoted into documentation or evidence.
- Use the ClaudeCab project card for current next step and cross-repo context.

## Current Next Step

Replace the two `[TEST DATA]` course markdown files with real sales copy, then
remove `draft: true` when they are ready to publish.
