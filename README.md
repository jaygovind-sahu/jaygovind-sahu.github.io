# jaygovindsahu.com

Personal resume website for Jaygovind Sahu.

**Live site:** [jaygovindsahu.com](https://jaygovindsahu.com)
**Admin panel:** [jaygovindsahu.com/admin](https://jaygovindsahu.com/admin) (TinaCMS, GitHub OAuth)

## Tech Stack

- [Astro](https://astro.build) — static site framework
- [Tailwind CSS](https://tailwindcss.com) — styling
- [TinaCMS](https://tina.io) — content management (writes to `src/data/resume.json` via GitHub)
- [React](https://react.dev) — interactive islands (PDF download button)
- [@react-pdf/renderer](https://react-pdf.org) — client-side PDF generation
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting and CDN
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — sitemap generation

## Getting Started

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your TinaCMS credentials:

```bash
cp .env.example .env
```

```
TINA_CLIENT_ID=   # From Tina Cloud project settings
TINA_TOKEN=       # From Tina Cloud project settings
GITHUB_BRANCH=main
```

## Development

```bash
npm run dev        # Astro dev server at http://localhost:4321
npm run tinacms    # Astro + TinaCMS editor at /admin
npm run build      # Production build → /dist
npm run preview    # Preview production build locally
```

## Performance

Run Lighthouse locally against the dev server. Start `npm run dev` first, then in a separate terminal:

```bash
# Mobile (default emulation)
npx lighthouse http://localhost:4321

# Desktop
npx lighthouse http://localhost:4321 --preset=desktop
```

> For real-world field data, use [PageSpeed Insights](https://pagespeed.web.dev/) against the live URL — local runs use simulated throttling which inflates mobile times significantly.

## Deployment

Hosted on Cloudflare Pages. Deployments trigger automatically on push to `main`.

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 20

The build runs `astro build`. The TinaCMS `/admin` panel is generated separately when needed via `npm run tinacms`.

Set the same environment variables (`TINA_CLIENT_ID`, `TINA_TOKEN`, `GITHUB_BRANCH`) in the Cloudflare Pages dashboard.

## Editing Content

All resume content lives in a single file: `src/data/resume.json`.

You can edit it directly or through the CMS at `/admin`. Both the web page and the PDF download read from this file.

**Sections:**

| Section          | Description                                           |
|------------------|-------------------------------------------------------|
| `meta`           | Name, headline, contact info, summary                 |
| `experience`     | Jobs — dates in `YYYY-MM` format, `end: null` = current |
| `education`      | Degrees                                               |
| `skills`         | Categorized skill lists                               |
| `projects`       | Portfolio projects (`featured: true` adds a badge)    |
| `certifications` | Professional certifications                           |

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
```
