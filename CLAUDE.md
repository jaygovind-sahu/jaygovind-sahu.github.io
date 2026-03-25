# CLAUDE.md

## Project Overview

Personal resume website for Jaygovind Sahu. Static site built with Astro, styled with Tailwind CSS, content managed via TinaCMS, deployed to Cloudflare Pages.

**Live site:** jaygovindsahu.com
**Admin panel:** jaygovindsahu.com/admin (TinaCMS, GitHub OAuth)

---

## Tech Stack

- **Astro** (static output) — site framework
- **React** — interactive islands (PDF download button)
- **Tailwind CSS** — styling
- **TinaCMS** — content management, writes to `src/data/resume.json` via GitHub
- **@react-pdf/renderer** — client-side PDF generation (no server)
- **Cloudflare Pages** — hosting and CDN

---

## Development

```bash
npm install          # Install dependencies (required before build/dev)
npm run dev          # Astro dev server only (port 4321)
npm run tinacms      # Astro + TinaCMS editor at /admin
npm run build        # Production build → /dist
npm run preview      # Preview production build locally
```

---

## Build

The build script runs TinaCMS first to generate the `/admin` panel, then Astro:

```bash
npx tinacms build && astro build
```

`tinacms` is a local package — always use `npx tinacms`, never bare `tinacms`.

---

## Environment Variables

Required in `.env` (local) and Cloudflare Pages dashboard (production):

```
TINA_CLIENT_ID=   # From Tina Cloud project settings
TINA_TOKEN=       # From Tina Cloud project settings
GITHUB_BRANCH=main
```

See `.env.example` for the template.

---

## Deployment

- **Platform:** Cloudflare Pages
- **Trigger:** Push to `main` branch
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 20 (set in `wrangler.toml`)

After pushing, CF Pages runs `npm install && npm run build` and deploys `/dist` to the CDN in ~60 seconds.

---

## Content

**Single source of truth:** `src/data/resume.json`

All resume sections live here. Both the web page and the PDF download read from this file. Edit via TinaCMS at `/admin` or directly in the JSON.

**Schema sections:**
- `meta` — name, headline, contact info, summary
- `experience` — jobs (dates in `YYYY-MM` format, `end: null` = current role)
- `education` — degrees
- `skills` — categorized skill lists
- `projects` — portfolio projects (`featured: true` adds a badge)
- `certifications` — professional certs

---

## Project Structure

```
src/
  components/
    Divider.astro         # Thin horizontal rule
    SectionLabel.astro    # Section header with accent label
    DownloadButton.jsx    # React island — PDF generation + download
  data/
    resume.json           # All resume content (single source of truth)
  layouts/
    Base.astro            # HTML shell, fonts, meta/OG tags, CSS vars
  pages/
    index.astro           # Main public resume page
  styles/
    global.css            # Minimal global CSS overrides
tina/
  config.ts               # TinaCMS schema definition
docs/
  TECH_SPECS.md           # Full technical specification
```

---

## Styling

Custom CSS variables defined in `Base.astro`:

| Variable   | Value     | Usage                          |
|------------|-----------|--------------------------------|
| `--ink`    | `#1a1a18` | Primary text                   |
| `--paper`  | `#f7f6f2` | Background (warm off-white)    |
| `--muted`  | `#9a9a94` | Secondary text, dates          |
| `--accent` | `#c8622a` | Section labels (terracotta)    |
| `--rule`   | `#e2e0d8` | Dividers and borders           |

Custom Tailwind font classes: `font-display` (Cormorant Garamond), `font-body` (DM Sans), `font-mono` (DM Mono).

---

## Gitignored Paths

These are generated at build time and not committed:

- `node_modules/`
- `dist/`
- `.astro/`
- `.env`
- `public/admin/`
- `tina/__generated__/`


## Git Commit Guidelines

* Don't commit unless you're explicitly asked to do so
* Don't include co-author / model name in the commit message