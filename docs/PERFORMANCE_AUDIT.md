# Performance Audit — jaygovindsahu.com

**Audit date:** 2026-03-25
**Tool:** Lighthouse 13.0.3 (local run)
**Source files:** `psi-mobile.json` (mobile emulation), `psi-desktop.json` (desktop)

---

## Scores

| Category | Mobile | Desktop |
|---|---|---|
| Performance | 🟡 55 / 100 | ✅ 97 / 100 |
| Accessibility | 94 / 100 | 94 / 100 |
| Best Practices | 96 / 100 | 96 / 100 |
| SEO | 91 / 100 | 91 / 100 |

---

## Core Web Vitals

### Mobile

> Lighthouse mobile emulation uses simulated slow-4G throttling on a mid-tier device, so absolute numbers will be much higher than real-world field data. Use PageSpeed Insights web UI against the live URL for field CWV.

| Metric | Value | Rating |
|---|---|---|
| FCP (First Contentful Paint) | 18.2 s | ❌ Poor |
| LCP (Largest Contentful Paint) | 32.3 s | ❌ Poor |
| CLS (Cumulative Layout Shift) | 0.002 | ✅ Good |
| TBT (Total Blocking Time) | 10 ms | ✅ Good |
| Speed Index | 18.2 s | ❌ Poor |

**Primary driver of slow FCP/LCP:** The `@react-pdf/renderer` bundle (~2.5 MB) is loaded eagerly on page load. Under mobile throttling this dominates parse/execution time. See Issue #7.

### Desktop

| Metric | Value | Rating |
|---|---|---|
| FCP (First Contentful Paint) | 1.0 s | ✅ Good |
| LCP (Largest Contentful Paint) | 1.1 s | ✅ Good |
| CLS (Cumulative Layout Shift) | 0 | ✅ Good |
| TBT (Total Blocking Time) | 0 ms | ✅ Good |
| Speed Index | 1.0 s | ✅ Good |

---

## Issues — Priority Order

### 🔴 P0 — Fix Immediately

#### 1. Robots.txt is broken ✅ Fixed (mobile: PASS, desktop: PASS)
- **Problem:** `/robots.txt` was serving HTML instead of valid directives. Lighthouse found 14 errors (5 unknown directives, 9 syntax errors).
- **Status:** Passes on both mobile and desktop. Confirm the fix is live in production.

---

### 🟠 P1 — High Impact

#### 2. Render-blocking resources ✅ Fixed (mobile: not flagged, desktop: not flagged)
- **Problem:** 3 resources blocked first paint — Google Fonts, Astro CSS, and Cloudflare `email-decode.min.js`.
- **Status:** Not present in either report. Self-hosted fonts and disabling Email Obfuscation resolved this.

#### 3. Color contrast failures (Accessibility) ✅ Fixed
- **Problem:** Mobile flagged 6 failing elements; desktop flagged 11 using `--accent: #c8622a` (3.7:1) and `--muted: #9a9a94` (2.6:1).
- **Status:** CSS variables in `src/layouts/Base.astro` darkened to:
  - `--accent: #8f3e10` (~6.8:1 against `--paper`)
  - `--muted: #545450` (~7.0:1 against `--paper`)
- Both exceed the WCAG AA threshold of 4.5:1. Re-run Lighthouse to confirm the accessibility score improves.

#### 7. Unused JavaScript ✅ Fixed
- **Problem:** ~2,146 KiB of unused JavaScript on initial load. Two bundles:
  - `@react-pdf/renderer.js`: 2,594 KB total, 1,534 KB wasted (59%)
  - `chunk-5S4FUZ3X.js`: 928 KB total, 556 KB wasted (60%)
- **Impact:** High on mobile — this is the primary cause of the 18 s FCP / 32 s LCP under mobile throttling. Minor on desktop (score still 97).
- **Status:** `client:load` → `client:idle` in `src/pages/index.astro`. The React PDF bundle is now deferred until the browser is idle, keeping it off the critical path.

---

### 🟡 P2 — Medium Impact

#### 4. Heading order violation ✅ Fixed (mobile: PASS, desktop: PASS)
- **Problem:** An H3 appeared without a proper H2 parent.
- **Status:** Passes on both after `SectionLabel` was updated to render as `<h2>`.

#### 5. Short cache lifetimes on external assets ✅ Partially resolved
- **Problem:** 3 resources had inefficient cache TTLs, including `email-decode.min.js` (33 min TTL).
- **Status:** `email-decode.min.js` is gone after disabling Email Obfuscation. Remaining Cloudflare challenge/beacon scripts are infrastructure-controlled.

#### 6. Deprecated browser APIs ✅ Fixed (mobile: PASS, desktop: PASS)
- **Problem:** 3 deprecated APIs from Cloudflare-injected scripts (`SharedStorage`, `StorageType.persistent`, `Fledge`).
- **Status:** No deprecated APIs on either report. Resolved by disabling Email Obfuscation.

---

### 🔵 P3 — Low Impact / Informational

#### 8. Missing source maps for JS bundle ✅ Fixed
- **Problem:** `_astro/DownloadButton.ZJAbBuy_.js` had no source map.
- **Status:** `sourcemap: true` added to `vite.build` in `astro.config.mjs`.

#### 9. Slow mobile LCP under throttling
- **Last measured value:** 32.3 s (mobile emulation, slow-4G throttling, pre-fix)
- **Context:** Desktop LCP is 1.1 s. The gap was explained almost entirely by the eager React PDF bundle load under throttled conditions.
- **Next step:** Re-run Lighthouse after the `client:idle` fix (Issue #7) and confirm real-world LCP via PageSpeed Insights web UI.

---

## Next Steps Checklist

- [x] Fix `robots.txt` — verified passing on both mobile and desktop
- [x] Disable Cloudflare Email Address Obfuscation (removes render-blocking script + cache waste)
- [x] Self-host Google Fonts using `fontsource` packages to eliminate render-blocking external request
- [x] Fix heading hierarchy — `SectionLabel` now renders as `<h2>`, giving `<h3>` entries a proper parent
- [x] Enable source maps — added `vite.build.sourcemap: true` to `astro.config.mjs`
- [x] Fix LCP opacity issue — removed `fade-up` (opacity: 0) from `<header>` so the `<h1>` is visible on first paint
- [x] Run desktop Lighthouse report — saved as `psi-desktop.json` (97 Performance, 94 Accessibility)
- [x] Re-run mobile Lighthouse report — saved as `psi-mobile.json` (55 Performance, 94 Accessibility)
- [x] Darken `--accent` and `--muted` CSS variables — current values `#8f3e10` and `#545450` already applied in code; audits reflect pre-fix state. Re-run to confirm WCAG AA pass.
- [x] Lazy-load `DownloadButton` (`client:idle`) to defer React PDF bundle — switched from `client:load` in `src/pages/index.astro`
- [ ] Re-run Lighthouse after lazy-load fix and confirm real-world CWV via PageSpeed Insights web UI
