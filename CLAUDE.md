# CLAUDE.md — AI Assistant Guide for jfissel.github.io

Context for AI assistants working on this codebase. Read it fully before making changes.

---

## Project Overview

**johnfissel.com** is a personal portfolio site for John Fissel, a CPA specializing in data analytics, automation, and AI in accounting. Hosted on **GitHub Pages** at the custom domain `johnfissel.com` (via the `CNAME` file).

It is a **zero-dependency, no-build-step static site**: vanilla HTML5, CSS3, and ES6+ JavaScript. No npm, no bundlers, no frameworks. Fonts are Google Fonts (Source Serif 4 + Inter) via CDN; everything else is first-party.

Key files:

- `index.html` — the entire site (single page); `404.html` is a standalone, self-contained 404 page that doubles as the service worker's offline fallback (`noindex`, not in the sitemap)
- `css/main.css` — all custom styles; `css/base.css` is a third-party normalize — **never edit it**
- `js/main.js` — all interactivity; `js/particle-cluster.js` — the hero canvas animation
- `sw.js` — service worker; `site.webmanifest` — PWA manifest
- `images/og-image.png` — social share image; `images/logo.svg` is currently unreferenced

---

## Development Workflow

No build step. Serve locally (the service worker only activates on `localhost` or HTTPS):

```bash
python3 -m http.server 8000   # or: npx serve .
```

- Hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) during development to bypass the service worker cache.
- **Verify changes manually in-browser** — there is no CI, no tests, no linters. For anything touching layout, images, or `<head>`, run Lighthouse; targets are Performance 95+, Accessibility / Best Practices / SEO 100.
- Deployment is automatic: merging to `main` publishes to johnfissel.com within 1–2 minutes.
- Work on descriptively named feature branches and open a PR — **do not push to `main` directly**.

---

## Project-Specific Rules

- **No build tools, no npm/package.json, no frameworks or external libraries** — this is intentional. Keep everything vanilla.
- **Do not edit `css/base.css`** (third-party normalize) and do not remove the PWA files (`sw.js`, `site.webmanifest`) without deliberate intent.
- **CSS variables**: colors, spacing, and transitions come from custom properties in `:root` at the top of `main.css` — never hardcode values that have a variable.
- **Naming**: BEM-like classes (`block__element`, `block--modifier`); page sections prefixed `s-` (`.s-about`), utilities prefixed `u-` (`.u-fullwidth`).
- **Breakpoints**: a consolidated scale — `1800px`, `1200px`, `1000px`, `900px`, `600px`, `400px`, plus feature queries (`prefers-reduced-motion`, `prefers-color-scheme`, `hover`, short-landscape via `max-height: 600px`). Mobile-first: don't invent new breakpoints.
- **JS structure**: one IIFE in `main.js`; shared elements live in the module-level `DOM` object (populated by `initDOMCache()`); each feature is an `ss`-prefixed function wired up in `ssInit()`. Follow this pattern for new features.
- **Scroll/resize handlers**: `requestAnimationFrame`-throttled and `{ passive: true }`. Header state, back-to-top, the scroll progress bar, and the profile parallax share one combined `onScroll` handler — extend it rather than adding parallel listeners.
- **Desktop/mobile split in JS**: use the shared module-level `desktopMQ` (`min-width: 901px`) media query — don't create new `matchMedia` queries for the 900px breakpoint.
- **Reduced motion**: every animation (typewriter, scroll-reveal, parallax, particles) checks `prefers-reduced-motion` and degrades to a static equivalent. Any new animation must too.
- **SEO metadata**: keep Open Graph, Twitter Card, and JSON-LD in sync when content changes; keep `sitemap.xml` and `robots.txt` accurate if sections change.
- **Performance**: preserve `fetchpriority="high"` on the hero/critical CSS `<link>`; no render-blocking scripts in `<head>` (scripts load at the bottom of `<body>`); use `.webp` with `@2x` retina variants for content images.

### Service Worker (`sw.js`)

- **Increment the `CACHE_NAME` version whenever any cached asset changes** — this is the only cache-busting mechanism.
- **Precache shell only**: `urlsToCache` deliberately lists just the critical shell (HTML, CSS, JS, hero background). Everything else is cached at runtime on first use — do not add non-critical assets to the precache list.
- Strategy: cache-first with network fallback; offline misses fall back to cached `index.html` for navigations and cached `404.html` for everything else. Keep this intact after edits.

---

## Site Map

Sections of `index.html`, in order:

1. `#home` / `.s-hero` — hero with particle canvas (`.s-header` is the separate fixed nav bar)
2. `#about` / `.s-about` — bio and profile photo
3. `#skills` / `.s-skills` — skills card grid
4. `#contact` / `.s-footer` — the footer doubles as the contact section (the one id ↔ class mismatch: the element genuinely is the page footer, and the id is the public URL anchor)

---

## Gotchas & Non-obvious Behaviors

- **Theme toggle only re-skins the About section.** `ssThemeToggle` sets `data-theme` on `<html>` and persists to `localStorage("theme")`; an inline `<head>` script re-applies it before first paint. The palette change is driven entirely by the `--about-*` custom properties in `main.css`.
- **The copy-email button ships `hidden`.** `ssCopyEmail` reveals it only when the Clipboard API is available (it isn't on insecure origins). Feedback is a CSS `::after` bubble plus an `aria-live` span.
- **Hero heading no-JS fallback**: `html.js .hero-content h1 { opacity: 0 }` hides the heading only when JS runs (the typewriter reveals it via inline style); without JS it stays visible. Don't "fix" the seemingly-redundant rule.
- **Particle pointer parallax listens on `window`**, not the canvas — the canvas is `pointer-events: none`. The render loop pauses via `IntersectionObserver`/`visibilitychange` when the hero is off-screen or the tab is hidden; reduced-motion gets a single static frame.
- **Smooth scrolling is pure CSS** (`scroll-behavior: smooth` + `scroll-margin-top` on `.target-section` for the fixed-header offset). There is no JS scroll animation — don't add one.
- **Profile photo parallax is desktop-only**: `ssParallaxProfile` runs inside the combined `onScroll` handler via the module-level `updateParallax` slot, set/cleared by a `desktopMQ` change listener (the transform is reset when cleared).
- **Active nav highlighting** uses an IntersectionObserver with `rootMargin: "-50% 0px"` to set `.current` + `aria-current` on header links — section detection is midpoint-based, not top-based.
- **Mobile menu keyboard contract**: while open, Escape closes and refocuses the toggle, and Tab is trapped within the header (`handleMenuKeydown` inside `ssMobileMenu`). State lives in `aria-expanded` on the toggle and `.menu-is-open` on `<body>`.
- **Scroll-reveal** is driven by bare `data-reveal` attributes + a native IntersectionObserver (`ssReveal`) — no animation library involved.
- **About dark palette is single-sourced**: the `--about-dark-*` tokens in `:root` hold the values; the two swap blocks near the end of `main.css` (system `prefers-color-scheme` and the `[data-theme]` override) only re-point `--about-*` at them — edit the tokens, not the blocks.
