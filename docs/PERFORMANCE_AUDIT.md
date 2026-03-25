# Performance Audit — jaygovindsahu.com

**Audit date:** 2026-03-25
**Tool:** Lighthouse 13.0.3 (local run, mobile emulation)
**Source file:** `psi-mobile.json`

> Desktop report not yet captured. Findings below are mobile-only. Expect similar issues on desktop with better absolute numbers.

---

## Scores

| Category | Score |
|---|---|
| Performance | ❌ Error (LCP failure — see below) |
| Accessibility | 91 / 100 |
| Best Practices | 81 / 100 |
| SEO | 91 / 100 |

---

## Core Web Vitals

| Metric | Value | Rating |
|---|---|---|
| FCP (First Contentful Paint) | 2.8 s | 🟡 Needs improvement |
| LCP (Largest Contentful Paint) | ❌ NO_LCP error | — |
| CLS (Cumulative Layout Shift) | 0 | ✅ Good |
| TBT (Total Blocking Time) | ❌ NO_LCP error | — |
| Speed Index | 2.8 s | ✅ Good (0.96) |

**Note on NO_LCP:** Lighthouse could not identify an LCP element during the local run. This is likely a localhost/VPN timing issue or a missing image alt/size hint. It causes 9 downstream audits (TTI, TBT, unused JS/CSS, redirects, minification) to also error out. Run a fresh report from PageSpeed Insights (the web UI) to confirm real-world LCP.

---

## Issues — Priority Order

### 🔴 P0 — Fix Immediately

#### 1. Robots.txt is broken
- **Problem:** `/robots.txt` is serving HTML instead of valid directives. Lighthouse found 14 errors (5 unknown directives, 9 syntax errors).
- **Impact:** SEO — crawlers may ignore or misparse the file entirely.
- **Fix:** Verify Cloudflare Pages is serving the correct `public/robots.txt`. Check that `public/robots.txt` exists and contains plain-text directives, not HTML. If missing, create it:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://jaygovindsahu.com/sitemap-index.xml
  ```

---

### 🟠 P1 — High Impact

#### 2. Render-blocking resources
- **Problem:** 3 resources block first paint:
  - `_astro/index.DSoyc4PI.css` (3.4 KB)
  - `fonts.googleapis.com/css2?...` (1.5 KB)
  - `cdn-cgi/scripts/.../email-decode.min.js` (0.9 KB, Cloudflare)
- **Impact:** Directly delays FCP.
- **Fixes:**
  - **Google Fonts:** Add `rel="preconnect"` to `fonts.googleapis.com` and `fonts.gstatic.com`, or switch to self-hosted fonts using `fontsource` packages. Self-hosting removes the external roundtrip entirely.
  - **Astro CSS:** Astro inlines critical CSS by default for static builds — confirm `output: 'static'` is set and no `inlineStylesheets: 'never'` override exists in `astro.config.*`.
  - **email-decode.min.js:** This is injected by Cloudflare's email obfuscation feature. Disable it in Cloudflare dashboard → Scrape Shield → Email Address Obfuscation (toggle off), since the site already uses a mailto link.

#### 3. Color contrast failures (Accessibility)
- **Problem:** 6 elements fail WCAG AA contrast ratios:

  | Element | Color | Ratio | Required |
  |---|---|---|---|
  | "Senior Data Engineer" (h3) | `#d18052` | 2.8 : 1 | 4.5 : 1 |
  | "↓ Download PDF" button | `#c8622a` | 3.7 : 1 | 4.5 : 1 |
  | Email link | `#9a9a94` | 2.6 : 1 | 4.5 : 1 |
  | LinkedIn link | `#9a9a94` | 2.6 : 1 | 4.5 : 1 |
  | GitHub link | `#9a9a94` | 2.6 : 1 | 4.5 : 1 |
  | Footer byline | `#9a9a94` | 2.6 : 1 | 4.5 : 1 |

- **Impact:** Accessibility score, screen reader/low-vision users, WCAG compliance.
- **Fix:** Darken the CSS variables in `src/layouts/Base.astro`:
  - `--accent: #c8622a` → try `#a84e1e` (passes at ~5.5:1)
  - `--muted: #9a9a94` → try `#6b6b65` (passes at ~4.6:1)
  - Test with [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)

---

### 🟡 P2 — Medium Impact

#### 4. Heading order violation
- **Problem:** An H3 ("Netflix") appears in the document outline without a proper H2 parent, breaking heading hierarchy.
- **Impact:** Screen readers and SEO rely on logical heading structure.
- **Fix:** Audit heading levels in the experience section of the page. Role titles and company names should follow a consistent H2 → H3 pattern throughout.

#### 5. Short cache lifetimes on external assets
- **Problem:** 3 resources have inefficient cache TTLs (est. 13 KiB wasted):
  - Cloudflare CDN challenge scripts: 14.4 hr TTL
  - Cloudflare insights beacon: 24 hr TTL
  - email-decode.min.js: 33 min TTL
- **Impact:** Repeat visitors re-download these on every visit.
- **Fix:** These are Cloudflare-controlled scripts — cache headers can't be overridden from the app. Disabling Email Obfuscation (see P1 #2) removes the email-decode script entirely. The challenge/beacon scripts are part of Cloudflare's infrastructure.

#### 6. Deprecated browser APIs (Best Practices)
- **Problem:** 3 deprecated APIs detected, all from Cloudflare-injected scripts:
  - `SharedStorage`
  - `StorageType.persistent`
  - `Fledge`
- **Impact:** Console warnings, minor Best Practices score hit.
- **Fix:** No action needed from the app side — these come from Cloudflare's challenge platform scripts.

---

### 🔵 P3 — Low Impact / Informational

#### 7. Missing source maps for JS bundle
- **Problem:** `_astro/DownloadButton.ZJAbBuy_.js` has no source map.
- **Impact:** Harder to debug production JS errors.
- **Fix:** Add `sourcemap: true` to `vite.build` in `astro.config.*` if you want source maps deployed. Not a user-facing issue.

#### 8. LCP element not identified
- **Problem:** Lighthouse couldn't find an LCP candidate locally.
- **Likely cause:** The hero text (name/headline) may not have a visible paint event Lighthouse can latch onto, or the fade-in animation defers the paint.
- **Fix:** Run the PageSpeed Insights web UI report for the real-world LCP value. If LCP is genuinely slow, consider adding `fetchpriority="high"` to the primary heading or first visible image, and ensuring no `opacity: 0` initial state on hero text delays paint.

---

## Next Steps Checklist

- [ ] Fix `robots.txt` — verify it's being served correctly from Cloudflare Pages
- [ ] Disable Cloudflare Email Address Obfuscation (removes render-blocking script + cache waste)
- [ ] Self-host Google Fonts using `fontsource` packages to eliminate render-blocking external request
- [ ] Darken `--accent` and `--muted` CSS variables to pass WCAG AA contrast
- [ ] Fix heading hierarchy in the experience section
- [ ] Run desktop Lighthouse report and save as `psi-desktop.json` for comparison
- [ ] Re-run mobile report via PageSpeed Insights web UI to get real-world LCP value
