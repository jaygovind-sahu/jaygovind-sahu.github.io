# jaygovindsahu.com — Technical Specification

**Version:** 1.0  
**Last Updated:** March 2026  
**Stack:** Astro · TinaCMS · Tailwind CSS · React · @react-pdf/renderer · Cloudflare Pages

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure](#4-folder-structure)
5. [Data Layer — resume.json](#5-data-layer--resumejson)
6. [Tina CMS Schema](#6-tina-cms-schema)
7. [Page & Component Spec](#7-page--component-spec)
8. [PDF Generation](#8-pdf-generation)
9. [Styling System](#9-styling-system)
10. [Environment Variables](#10-environment-variables)
11. [Deployment — Cloudflare Pages](#11-deployment--cloudflare-pages)
12. [DNS Setup — Squarespace](#12-dns-setup--squarespace)
13. [Tina Cloud Setup](#13-tina-cloud-setup)
14. [Local Development](#14-local-development)
15. [Roadmap & Phases](#15-roadmap--phases)

---

## 1. Project Overview

A static personal resume website with:

- **Public page** at `jaygovindsahu.com` — a minimal, typographically refined resume viewer with a PDF download button
- **Admin editor** at `jaygovindsahu.com/admin` — a TinaCMS visual editor protected by GitHub OAuth, with no custom backend
- **PDF download** — generated client-side from the same data using `@react-pdf/renderer`, producing a clean ATS-friendly single-page document

### Key Architectural Principles

- **Zero backend.** No server, no database, no auth infrastructure to maintain.
- **Single source of truth.** All resume data lives in `src/data/resume.json`. Both the web page and PDF read from this file.
- **Git as version history.** Every edit made through TinaCMS commits to GitHub. Every resume change is tracked and reversible.
- **Static output.** Astro builds to pure HTML/CSS/JS. Cloudflare Pages serves it from the CDN edge globally.

---

## 2. Architecture

```
┌─────────────────────────────────────────────┐
│                  EDITING                    │
│                                             │
│  TinaCMS UI  ──commits──▶  GitHub Repo      │
│  (browser)                  main branch     │
└─────────────────────────┬───────────────────┘
                          │ push triggers build
                          ▼
┌─────────────────────────────────────────────┐
│                BUILD & DEPLOY               │
│                                             │
│  Cloudflare Pages                           │
│  └── runs: npm run build                    │
│  └── Astro reads resume.json at build time  │
│  └── outputs: /dist (pure static files)     │
└─────────────────────────┬───────────────────┘
                          │ served from CDN
                          ▼
┌─────────────────────────────────────────────┐
│                  PUBLIC SITE                │
│                                             │
│  jaygovindsahu.com          (Astro page)    │
│  jaygovindsahu.com/admin    (TinaCMS UI)    │
└─────────────────────────────────────────────┘
         │
         │ PDF button clicked
         ▼
┌─────────────────────────────────────────────┐
│            PDF GENERATION (client-side)     │
│                                             │
│  @react-pdf/renderer reads resume data      │
│  Renders A4 PDF template in browser         │
│  Triggers download — no server involved     │
└─────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Astro | ^4.16 | Static site generation |
| Styling | Tailwind CSS | ^3.4 | Utility-first CSS |
| Interactivity | React | ^18.3 | React islands (PDF button) |
| CMS | TinaCMS | ^2.6 | Visual editor + GitHub commits |
| PDF | @react-pdf/renderer | ^3.4 | Client-side PDF generation |
| Hosting | Cloudflare Pages | — | Static site CDN hosting |
| Fonts | Google Fonts | — | Cormorant Garamond, DM Sans, DM Mono |
| Node | Node.js | 20 | Build environment |

### Astro Integrations

```js
// astro.config.mjs
import react from "@astrojs/react";     // for React islands (PDF button)
import tailwind from "@astrojs/tailwind"; // for Tailwind CSS
```

---

## 4. Folder Structure

```
jaygovindsahu.com/
│
├── public/                         # Static assets (copied as-is to /dist)
│   ├── favicon.ico
│   └── images/                     # TinaCMS media uploads (if any)
│
├── src/
│   ├── data/
│   │   └── resume.json             # ★ SINGLE SOURCE OF TRUTH for all resume data
│   │
│   ├── layouts/
│   │   └── Base.astro              # HTML shell: fonts, meta tags, OG tags, CSS vars
│   │
│   ├── components/
│   │   ├── SectionLabel.astro      # Reusable section header (label + horizontal rule)
│   │   ├── Divider.astro           # Thin horizontal rule between sections
│   │   └── DownloadButton.jsx      # ★ React island: PDF renderer + download trigger
│   │
│   ├── pages/
│   │   └── index.astro             # ★ Main public resume page (all sections)
│   │
│   └── styles/                     # (optional) Global CSS overrides if needed
│       └── global.css
│
├── tina/
│   └── config.ts                   # ★ TinaCMS schema — defines all editable fields
│
├── astro.config.mjs                # Astro config (integrations, output: static)
├── tailwind.config.mjs             # Tailwind theme (custom fonts, colors, spacing)
├── wrangler.toml                   # Cloudflare Pages build config
├── .env                            # Local secrets (gitignored)
├── .env.example                    # Template for required env vars
├── .gitignore
├── package.json
└── README.md
```

### Generated at Build Time (do not edit manually)

```
tina/__generated__/         # TinaCMS auto-generates GraphQL types — gitignore this
public/admin/               # TinaCMS builds its editor UI here — gitignore this
dist/                       # Astro build output — gitignore this
.astro/                     # Astro cache — gitignore this
```

---

## 5. Data Layer — resume.json

**Location:** `src/data/resume.json`

This file is the single source of truth for all resume content. Both the Astro page and the PDF template read from it. TinaCMS reads and writes to it via GitHub commits.

### Full Schema

```json
{
  "meta": {
    "name": "Jay Govind Sahu",
    "headline": "Software Engineer",
    "location": "Downingtown, PA",
    "email": "jay@jaygovindsahu.com",
    "website": "jaygovindsahu.com",
    "linkedin": "https://linkedin.com/in/jaygovindsahu",
    "github": "https://github.com/jaygovindsahu",
    "summary": "A 2-3 sentence professional summary."
  },

  "experience": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State or Remote",
      "start": "YYYY-MM",
      "end": "YYYY-MM",
      "current": false,
      "bullets": [
        "Accomplishment or responsibility 1",
        "Accomplishment or responsibility 2"
      ]
    }
  ],

  "education": [
    {
      "id": "edu-1",
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "start": "YYYY",
      "end": "YYYY",
      "gpa": null,
      "notes": ""
    }
  ],

  "skills": [
    {
      "id": "skill-1",
      "category": "Category Name",
      "items": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],

  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "description": "What it does and why it matters.",
      "tech": ["Tech 1", "Tech 2"],
      "url": "https://github.com/...",
      "featured": true
    }
  ],

  "certifications": [
    {
      "id": "cert-1",
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "YYYY-MM",
      "url": ""
    }
  ]
}
```

### Field Notes

| Field | Type | Notes |
|---|---|---|
| `experience[].start` | `"YYYY-MM"` | e.g. `"2022-01"` |
| `experience[].end` | `"YYYY-MM" \| null` | `null` = present |
| `experience[].current` | `boolean` | controls "Present" display label |
| `projects[].featured` | `boolean` | shows "Featured" badge |
| `projects[].url` | `string` | leave `""` to hide the ↗ link |
| `certifications[].url` | `string` | leave `""` to hide "Verify ↗" link |
| All `id` fields | `string` | unique, used as React keys |

---

## 6. Tina CMS Schema

**Location:** `tina/config.ts`

TinaCMS reads this file to auto-generate the visual editor UI. Each `field` definition maps to a form control in the `/admin` editor.

### Collection Structure

```
resume (single document → src/data/resume.json)
  ├── meta          (object)
  ├── experience    (list of objects)
  ├── education     (list of objects)
  ├── skills        (list of objects)
  ├── projects      (list of objects)
  └── certifications (list of objects)
```

### Key Config Options

```ts
// tina/config.ts
export default defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",    // TinaCMS editor served at /admin
    publicFolder: "public",
  },
  // ...
})
```

### TinaCMS Field Types Used

| Tina type | Maps to JSON | Used for |
|---|---|---|
| `"string"` | `string` | Names, titles, URLs, dates |
| `"string"` + `ui.component: "textarea"` | `string` | Summary, descriptions |
| `"boolean"` | `boolean` | `current`, `featured` |
| `"string"` + `list: true` | `string[]` | Bullets, tech stack, skill items |
| `"object"` | `{}` | Meta block |
| `"object"` + `list: true` | `[{}]` | All list sections |

### Admin Access

TinaCMS is configured with GitHub OAuth via Tina Cloud. Only GitHub accounts authorized in your Tina Cloud project can access `/admin`. Since you are the only member, only you can log in.

There is no password, no separate auth service, and nothing to maintain.

---

## 7. Page & Component Spec

### `src/layouts/Base.astro`

The HTML shell rendered around every page.

**Responsibilities:**
- `<meta>` tags: charset, viewport, description, author
- Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`
- Google Fonts `<link>` preconnect + stylesheet (Cormorant Garamond, DM Sans, DM Mono)
- CSS custom properties (`:root` vars for color system)
- Global `@keyframes fadeUp` animation
- `.fade-up` utility class with staggered `animation-delay` for child elements
- `::selection` color override (accent orange on paper)

**Props:**
```ts
{
  title?: string;       // defaults to "Jay Govind Sahu — Software Engineer"
  description?: string; // defaults to meta.summary
}
```

---

### `src/pages/index.astro`

The main public resume page. Imports `resume.json` at build time (no runtime data fetching).

**Imports:**
```astro
import Base from "../layouts/Base.astro";
import SectionLabel from "../components/SectionLabel.astro";
import Divider from "../components/Divider.astro";
import DownloadButton from "../components/DownloadButton.jsx";
import resume from "../data/resume.json";
```

**Section order:**
1. `<header>` — Hero: name, headline, summary, links row, PDF download button
2. Experience
3. `<Divider />`
4. Projects
5. `<Divider />`
6. Skills
7. `<Divider />`
8. Education
9. `<Divider />`
10. Certifications
11. `<footer>`

**Date formatting helper** (defined in frontmatter):
```ts
function formatDate(str: string | null): string {
  if (!str) return "Present";
  const [year, month] = str.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  return month ? `${months[parseInt(month) - 1]} ${year}` : year;
}
```

---

### `src/components/SectionLabel.astro`

Reusable section header: a small all-caps label in accent color, followed by a horizontal rule.

**Props:**
```ts
{ label: string }
```

**Output:**
```html
<div class="flex items-center gap-4 mb-8">
  <span class="font-mono text-[10px] tracking-widest text-accent uppercase">
    Experience
  </span>
  <div class="flex-1 h-px bg-rule"></div>
</div>
```

---

### `src/components/Divider.astro`

A thin `<hr>` separating major resume sections. No props.

---

### `src/components/DownloadButton.jsx`

**Type:** React island (`client:load` directive in parent)

**Responsibilities:**
- Renders the "↓ Download PDF" button
- On click: calls `@react-pdf/renderer`'s `pdf()` function with the `ResumePDFDoc` component
- Converts output to a Blob, creates an object URL, programmatically triggers a file download
- Shows "Generating…" loading state while rendering
- Cleans up the object URL after download

**Key implementation:**
```jsx
import { pdf } from "@react-pdf/renderer";

async function handleDownload() {
  setLoading(true);
  const blob = await pdf(<ResumePDFDoc resume={resume} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Jay_Govind_Sahu_Resume.pdf";
  a.click();
  URL.revokeObjectURL(url);
  setLoading(false);
}
```

**Props:**
```ts
{ resume: ResumeData }  // the full resume.json object
```

**Rendering directive in index.astro:**
```astro
<DownloadButton client:load resume={resume} />
```

> `client:load` ensures the React component hydrates immediately on page load so the button is interactive without delay.

---

## 8. PDF Generation

**Library:** `@react-pdf/renderer`  
**Location:** defined inside `src/components/DownloadButton.jsx` as `ResumePDFDoc`

### PDF vs Web Layout

The PDF uses a completely separate layout from the web page. Same data, different presentation.

| Attribute | Web Page | PDF |
|---|---|---|
| Format | Scrolling webpage | A4 single page |
| Fonts | Cormorant Garamond + DM Sans + DM Mono | Helvetica (embedded) |
| Purpose | Visual showcase | ATS-parseable, recruiter-ready |
| Font rendering | Browser | @react-pdf internal renderer |

### PDF Document Structure

```
<Document>
  <Page size="A4" style={...}>
    ├── Header block (name, headline, contact row, summary)
    ├── Experience section
    ├── Projects section
    ├── Skills section
    ├── Education section
    └── Certifications section
  </Page>
</Document>
```

### PDF Styling Notes

- All styles are defined using `StyleSheet.create({})` — CSS-like syntax but only supports a subset of properties
- No web fonts — use `"Helvetica"`, `"Helvetica-Bold"`, `"Courier"` (built-in PDF fonts)
- Flexbox is supported for layout
- `@react-pdf/renderer` does not support CSS Grid, animations, or pseudo-selectors
- Text is selectable and searchable in the output PDF (not a screenshot)
- Links are rendered using `<Link src="...">` component

### PDF Color Palette

| Token | Hex | Used for |
|---|---|---|
| Ink | `#1a1a18` | Body text |
| Accent | `#c8622a` | Section labels, dashes, links |
| Muted | `#9a9a94` | Secondary text, dates, metadata |
| Rule | `#e2e0d8` | Borders, tag outlines |

---

## 9. Styling System

### Design Language

- **Tone:** Minimal and clean — generous whitespace, typography-forward
- **Background:** Warm off-white (`#f7f6f2`) — not pure white
- **Accent:** Terracotta orange (`#c8622a`) — used sparingly for section labels and dashes

### Font Stack

| Font | Weight | Usage |
|---|---|---|
| Cormorant Garamond | 300, 400, 500 (+ italic) | Name, section titles, job titles |
| DM Sans | 300, 400, 500 | Body text, descriptions, bullets |
| DM Mono | 300, 400 | Dates, labels, tags, links, metadata |

### CSS Custom Properties (defined in Base.astro)

```css
:root {
  --ink:    #1a1a18;   /* primary text */
  --paper:  #f7f6f2;   /* page background */
  --muted:  #9a9a94;   /* secondary text, dates */
  --accent: #c8622a;   /* terracotta — section labels, dashes */
  --rule:   #e2e0d8;   /* dividers, tag borders */
}
```

### Tailwind Custom Tokens

```js
// tailwind.config.mjs
theme: {
  extend: {
    fontFamily: {
      display: ["'Cormorant Garamond'", "Georgia", "serif"],
      body:    ["'DM Sans'", "sans-serif"],
      mono:    ["'DM Mono'", "monospace"],
    },
    colors: {
      ink:    "#1a1a18",
      paper:  "#f7f6f2",
      muted:  "#9a9a94",
      accent: "#c8622a",
      rule:   "#e2e0d8",
    },
  },
},
```

### Animation

A single staggered `fadeUp` animation runs on page load. All direct children of `<main>` with the `.fade-up` class animate in sequence via CSS `animation-delay`.

```css
.fade-up {
  opacity: 0;
  transform: translateY(18px);
  animation: fadeUp 0.6s ease forwards;
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
.fade-up:nth-child(1) { animation-delay: 0.05s; }
.fade-up:nth-child(2) { animation-delay: 0.12s; }
/* ...up to nth-child(6) */
```

### Link Hover Effect

Underline grows from left to right on hover using a CSS `::after` pseudo-element. Defined in `<style>` in `index.astro`.

```css
.link-underline::after {
  content: "";
  position: absolute;
  bottom: -1px; left: 0;
  width: 0; height: 1px;
  background: var(--accent);
  transition: width 0.2s ease;
}
.link-underline:hover::after { width: 100%; }
```

---

## 10. Environment Variables

### Local (`.env` — gitignored)

```bash
TINA_CLIENT_ID=your_tina_client_id
TINA_TOKEN=your_tina_token
GITHUB_BRANCH=main
```

### Cloudflare Pages (set in dashboard)

The same three variables must be added in the Cloudflare Pages project settings under **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `TINA_CLIENT_ID` | From Tina Cloud project |
| `TINA_TOKEN` | From Tina Cloud project |
| `GITHUB_BRANCH` | `main` |

### `.env.example` (committed to repo)

```bash
# Tina CMS Cloud credentials
# Get these from https://app.tina.io after connecting your GitHub repo
TINA_CLIENT_ID=your_tina_client_id
TINA_TOKEN=your_tina_token
GITHUB_BRANCH=main
```

---

## 11. Deployment — Cloudflare Pages

### Build Configuration

**`wrangler.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

These values also need to be set in the Cloudflare Pages dashboard:

| Setting | Value |
|---|---|
| Framework preset | None (custom) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `20` |

### Deployment Flow

```
git push origin main
        ↓
Cloudflare Pages webhook triggered
        ↓
npm install
npm run build          ← Astro builds static files
        ↓
/dist deployed to CDN
        ↓
jaygovindsahu.com live within ~60 seconds
```

### Preview Deployments

Cloudflare Pages automatically creates a preview URL for every branch push and pull request. Preview URLs follow the pattern:

```
https://<branch-name>.<project-name>.pages.dev
```

This is useful for reviewing changes before merging to `main`.

---

## 12. DNS Setup — Squarespace

Your domain is registered at Squarespace with Google Workspace MX records already in place. **Do not touch the MX records.** Only update the A/CNAME records for the root domain and `www`.

### Steps

1. Go to **Squarespace → Domains → jaygovindsahu.com → DNS Settings**
2. Remove or replace any existing A records or CNAME records pointing to `github.io`
3. Add the following records (Cloudflare Pages will provide the exact values after you add the custom domain in their dashboard):

| Type | Host | Value |
|---|---|---|
| `CNAME` | `www` | `jaygovindsahu.pages.dev` |
| `CNAME` | `@` | `jaygovindsahu.pages.dev` |

> **Note:** Some DNS providers don't support CNAME on the root (`@`). If Squarespace doesn't allow it, use an A record pointing to Cloudflare's IP (they'll provide it in the custom domain setup wizard).

4. In Cloudflare Pages dashboard → **Custom Domains** → Add `jaygovindsahu.com` and `www.jaygovindsahu.com`
5. Cloudflare Pages auto-provisions an SSL certificate via Let's Encrypt

**DNS propagation:** Changes typically take 15–60 minutes, up to 24 hours in rare cases.

### What Stays Unchanged

- Google Workspace MX records — untouched, email works normally
- Domain registrar — stays at Squarespace
- SSL — Cloudflare Pages provisions automatically

---

## 13. Tina Cloud Setup

Tina Cloud provides the hosted backend that authenticates your `/admin` editor and commits changes to GitHub on your behalf.

### Steps

1. Go to **[app.tina.io](https://app.tina.io)** and create an account
2. Click **New Project** → Connect to GitHub → Select your `jaygovindsahu.com` repo
3. Once connected, copy the **Client ID** and **Token** from the project settings
4. Add these to your Cloudflare Pages environment variables (see section 10)
5. The editor will be live at `https://jaygovindsahu.com/admin` after next deploy

### Authentication

Tina Cloud uses **GitHub OAuth** by default. Only GitHub users you explicitly authorize in the Tina Cloud project can access the editor. Add only your own GitHub account.

When you visit `jaygovindsahu.com/admin`:
1. TinaCMS checks for an active session
2. If not logged in, redirects to GitHub OAuth
3. GitHub confirms your identity
4. TinaCMS grants access if your account is authorized

### Editing Workflow

```
Visit jaygovindsahu.com/admin
        ↓
Log in with GitHub (one-time OAuth flow)
        ↓
Select "resume" document in sidebar
        ↓
Edit fields in the visual form UI
        ↓
Click Save
        ↓
TinaCMS commits changes to src/data/resume.json on GitHub main branch
        ↓
Cloudflare Pages auto-rebuilds (~30 seconds)
        ↓
jaygovindsahu.com updates live
```

---

## 14. Local Development

### Prerequisites

- Node.js 20+
- npm 9+
- A code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Clone your repo
git clone https://github.com/jaygovindsahu/jaygovindsahu.com.git
cd jaygovindsahu.com

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.example .env
# Fill in your Tina credentials (optional for local dev — see below)
```

### Running Locally

**Option A — Astro only (no CMS editor)**

```bash
npm run dev
# Site available at http://localhost:4321
```

Use this when you only need to work on the visual design or are editing `resume.json` directly.

**Option B — Astro + TinaCMS editor**

```bash
npm run tinacms
# Astro site at http://localhost:4321
# TinaCMS editor at http://localhost:4321/admin
```

In local mode, TinaCMS writes directly to your local `src/data/resume.json` — no GitHub credentials needed. Commit and push manually when ready.

### Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Astro dev server only |
| CMS + Dev | `npm run tinacms` | Astro + TinaCMS local editor |
| Build | `npm run build` | Production static build to `/dist` |
| Preview | `npm run preview` | Preview the production build locally |

### `package.json` Scripts

```json
{
  "scripts": {
    "dev":     "astro dev",
    "build":   "astro build",
    "preview": "astro preview",
    "tinacms": "tinacms dev -c \"astro dev\""
  }
}
```

---

## 15. Roadmap & Phases

### Phase 1 — Scaffold & Deploy (Day 1)

- [x] Initialize Astro project with React and Tailwind integrations
- [x] Create `src/data/resume.json` with your real data
- [x] Configure `tina/config.ts` schema
- [x] Push to GitHub
- [x] Connect Cloudflare Pages → build → verify live at `*.pages.dev`
- [x] Update Squarespace DNS CNAME records
- [x] Verify `jaygovindsahu.com` resolves correctly

### Phase 2 — Public Resume Page (Week 1)

- [x] Build `Base.astro` layout with fonts, CSS vars, OG tags
- [x] Build `index.astro` with all sections
- [x] Build `SectionLabel.astro` and `Divider.astro`
- [x] Verify all sections render correctly from JSON
- [x] Test on mobile (responsive layout)
- [x] Verify Google Fonts load correctly
- [x] Test fade-up animation

### Phase 3 — PDF Download (Week 1–2)

- [x] Build `ResumePDFDoc` component in `DownloadButton.jsx`
- [x] Style PDF: header, experience, projects, skills, education, certifications
- [x] Test PDF output — verify text is selectable (not a screenshot)
- [x] Verify filename downloads as `Jaygovind_Sahu_Resume.pdf`
- [x] Test loading state on button

### Phase 4 — TinaCMS Editor (Week 2)

- [x] Set up Tina Cloud account at `app.tina.io`
- [x] Connect GitHub repo to Tina Cloud project
- [x] Add env vars to Cloudflare Pages dashboard
- [x] Verify `/admin` is accessible and authenticated
- [x] Test adding a new job entry end-to-end (edit → save → rebuild → live)
- [x] Test editing skill items
- [x] Test reordering projects

### Phase 5 — Polish (Week 2–3)

- [ ] Run Lighthouse audit — target 95+ Performance, 100 Accessibility
- [ ] Verify OG image / meta tags (use [opengraph.xyz](https://opengraph.xyz) to preview)
- [ ] Accessibility audit: check heading hierarchy, alt text, color contrast
- [x] Cross-browser test: Chrome, Firefox, Safari

### Phase 6 — Contact Form (Future)

- [ ] Add contact section to `index.astro` (email + LinkedIn links, or a form)
- [ ] Create `src/pages/api/contact.ts` as a Cloudflare Worker
- [ ] Integrate [Resend](https://resend.com) for email forwarding (free tier: 100 emails/day)
- [ ] Add form state: idle → submitting → success / error
- [ ] Test end-to-end: form submit → email received

---

## Appendix A — Key Dependencies

```json
{
  "dependencies": {
    "@astrojs/react":       "^3.6.0",
    "@astrojs/tailwind":    "^5.1.0",
    "@react-pdf/renderer":  "^3.4.4",
    "@tinacms/auth":        "^1.0.6",
    "astro":                "^4.16.0",
    "react":                "^18.3.0",
    "react-dom":            "^18.3.0",
    "tinacms":              "^2.6.0"
  },
  "devDependencies": {
    "@types/react":  "^18.3.0",
    "tailwindcss":   "^3.4.0"
  }
}
```

---

## Appendix B — .gitignore

```
node_modules/
dist/
.astro/
.env
.DS_Store
public/admin/
tina/__generated__/
```

---

## Appendix C — Useful Links

| Resource | URL |
|---|---|
| Astro docs | https://docs.astro.build |
| TinaCMS docs | https://tina.io/docs |
| TinaCMS Cloud | https://app.tina.io |
| @react-pdf/renderer docs | https://react-pdf.org |
| Cloudflare Pages docs | https://developers.cloudflare.com/pages |
| Tailwind CSS docs | https://tailwindcss.com/docs |
| Google Fonts | https://fonts.google.com |
| Resend (contact form, future) | https://resend.com/docs |

---

*This document covers the complete specification for `jaygovindsahu.com` v1.0. Update this document when making architectural changes.*