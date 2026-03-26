# CLAUDE.md

## Project Overview

Personal resume website for Jaygovind Sahu. Static site built with Astro, styled with Tailwind CSS, content managed via TinaCMS, deployed to Cloudflare Pages.

**Live site:** jaygovindsahu.com
**Admin panel:** jaygovindsahu.com/admin (TinaCMS, GitHub OAuth)

See `README.md` for setup, dev commands, and deployment instructions.

---

## Key Constraints

- `tinacms` is a local package — always use `npx tinacms`, never bare `tinacms`
- No server — PDF generation is entirely client-side via `@react-pdf/renderer`
- Static output only — Astro is configured for static site generation
- `astro.config.mjs` has `site: "https://jaygovindsahu.com"` — required for sitemap generation, do not remove

---

## Content Schema

**Single source of truth:** `src/data/resume.json`

Both the web page and PDF download read from this file. Edit via TinaCMS at `/admin` or directly in the JSON.

| Section          | Notes                                                        |
|------------------|--------------------------------------------------------------|
| `meta`           | Name, headline, contact info, summary                        |
| `experience`     | Jobs — dates in `YYYY-MM` format, `end: null` = current role |
| `education`      | Degrees                                                      |
| `skills`         | Categorized skill lists                                      |
| `projects`       | Portfolio projects — `featured: true` adds a badge           |
| `certifications` | Professional certs                                           |

---

## Styling

Custom CSS variables (defined in `src/layouts/Base.astro`):

| Variable   | Value     | Usage                       |
|------------|-----------|-----------------------------|
| `--ink`    | `#1a1a18` | Primary text                |
| `--paper`  | `#f7f6f2` | Background (warm off-white) |
| `--muted`  | `#3d3d39` | Secondary text, dates       |
| `--accent` | `#7a3309` | Section labels (terracotta) |
| `--rule`   | `#e2e0d8` | Dividers and borders        |

Custom Tailwind font classes: `font-display` (Cormorant Garamond), `font-body` (DM Sans), `font-mono` (DM Mono).

---

## Gitignored Paths

Generated at build time — don't worry about these being absent:

- `node_modules/`, `dist/`, `.astro/`
- `.env`
- `public/admin/`
- `tina/__generated__/`

---

## Git Commit Guidelines

- Don't commit unless explicitly asked to do so
- Don't include co-author / model name in the commit message
