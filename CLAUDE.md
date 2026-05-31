# CLAUDE.md — AI Assistant Guide for jfissel.github.io

This file provides context for AI assistants (Claude Code and others) working on this codebase. Read it fully before making changes.

---

## Project Overview

**johnfissel.com** is a personal portfolio website for John Fissel, a Certified Public Accountant (CPA) specializing in data analytics, automation, and AI applications in accounting. It is hosted via **GitHub Pages** at the custom domain `johnfissel.com`.

This is a **zero-dependency, no-build-step static site** built entirely with vanilla HTML, CSS, and JavaScript. There are no npm packages, bundlers, transpilers, or frameworks.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (single page: `index.html`) |
| Styles | Vanilla CSS3 (`css/` directory, 2 files) |
| Scripts | Vanilla JavaScript ES6+ (`js/` directory, 2 files) |
| Fonts | Google Fonts (Source Serif 4 + Inter, variable) via CDN |
| Animation | Native IntersectionObserver scroll-reveal (no library) |
| Effects | Custom Canvas particle animation (`particle-cluster.js`) |
| PWA | Service worker (`sw.js`) + Web App Manifest (`site.webmanifest`) |
| Hosting | GitHub Pages with custom domain via `CNAME` file |

---

## Repository Structure

```
jfissel.github.io/
├── index.html              # Single-page application entry point (542 lines)
├── CNAME                   # Custom domain: johnfissel.com
├── robots.txt              # Search engine crawler directives
├── sitemap.xml             # XML sitemap for SEO
├── site.webmanifest        # PWA manifest (icons, theme, display mode)
├── sw.js                   # Service worker (offline caching)
├── README.md               # Human-readable project documentation
│
├── css/
│   ├── base.css            # Normalize.css v8.0.1 + base element styles
│   └── main.css            # Custom layout, components, responsive styles
│
├── js/
│   ├── main.js             # Core interactivity (scroll, menu, typewriter, scroll-reveal, etc.)
│   └── particle-cluster.js # Canvas 3D particle animation
│
├── images/
│   ├── hero-bg-3000.webp   # Hero section background
│   ├── profile-pic.webp    # 1x profile photo
│   ├── profile-pic@2x.webp # 2x retina profile photo
│   ├── logo.svg            # Site logo
│   └── icons/
│       └── icon-quote.svg  # Testimonial quote icon
│
├── favicon.ico             # Browser tab icon
├── favicon-16x16.png       # Small favicon
├── favicon-32x32.png       # Medium favicon
├── apple-touch-icon.png    # iOS home screen icon
├── android-chrome-192x192.png
├── android-chrome-512x512.png
│
└── .well-known/
    └── security.txt        # Security disclosure contact info
```

---

## Development Workflow

### Running Locally

There is **no build step**. Open `index.html` directly in a browser, or serve it with a local HTTP server for accurate service worker behavior:

```bash
# Python (simplest)
python3 -m http.server 8000

# Node (if available)
npx serve .

# Then open: http://localhost:8000
```

> **Important:** The service worker (`sw.js`) only activates on `localhost` or HTTPS. A local server is required to test PWA/offline features.

### Making Changes

1. Edit `index.html`, `css/main.css`, or `js/main.js` directly.
2. Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass the service worker cache during development.
3. If you modify cached assets, increment `CACHE_VERSION` in `sw.js` to force cache invalidation.

### Deployment

Deployment is automatic via **GitHub Pages**:
- Push changes to the `master` branch.
- The live site at `johnfissel.com` updates within 1–2 minutes.
- No build commands required.

---

## Code Conventions

### HTML (`index.html`)

- **Semantic HTML5**: Use `<header>`, `<main>`, `<section>`, `<nav>`, `<article>`, `<footer>` appropriately.
- **Accessibility**: Include ARIA labels (`aria-label`, `aria-expanded`, `aria-hidden`) on interactive elements and icons.
- **SEO metadata**: Maintain Open Graph (`og:`), Twitter Card, and JSON-LD schema tags. Update them when content changes.
- **Script loading**: JavaScript files are loaded at the bottom of `<body>` with `defer` where appropriate. Do not move them to `<head>` without reason.
- **Image format**: Use `.webp` images. Provide `@2x` retina variants for profile/content images.

### CSS (`css/main.css`)

- **CSS Variables**: Defined in `:root` at the top of `main.css`. Always use variables for colors, spacing, and transitions rather than hardcoded values.

  ```css
  /* Example variables */
  --color-1: hsla(276, 33%, 28%, 1);
  --color-text: #111111;
  --vspace-1: 4.8rem;
  ```

- **BEM-like naming**: Component classes use a `block__element` or `block--modifier` pattern (e.g., `services-list__item-header`, `s-header`, `u-fullwidth`).
- **Section prefixes**: Page sections are prefixed with `s-` (e.g., `.s-about`, `.s-services`, `.s-contact`).
- **Utility prefixes**: Utility classes use `u-` (e.g., `.u-fullwidth`, `.u-hidden`).
- **Responsive breakpoints**: Defined with `@media` queries. Main breakpoints: `900px` (tablet), `1000px` (desktop), `400px` (small mobile).
- **Mobile-first**: Write base styles for mobile, then add complexity for larger screens via `min-width` media queries.
- **Do not edit `base.css`**: This is a CSS normalize/reset. It should not be modified.

### JavaScript (`js/main.js`)

- **IIFE pattern**: All code is wrapped in an immediately invoked function expression (`(function() { ... })()`) with `"use strict"` to avoid global scope pollution.
- **DOM caching**: Cache frequently accessed DOM elements in module-level variables at the top of the IIFE. Do not call `document.querySelector` repeatedly inside loops or handlers.
- **Event delegation**: Prefer a single parent-level listener over multiple child listeners where possible.
- **Scroll performance**: Scroll handlers use `requestAnimationFrame` with a throttle pattern to avoid jank.
- **Passive listeners**: Always add `{ passive: true }` to scroll and resize event listeners.
- **No dependencies**: Do not import external libraries. The only external script is the vendored AOS (`plugins.js`).

### Service Worker (`sw.js`)

- **Cache versioning**: The `CACHE_VERSION` constant must be incremented whenever cached assets change, to ensure users receive fresh content.
- **Offline-first strategy**: The service worker uses a cache-first strategy for static assets. Verify this remains intact after edits.

---

## SEO & Performance Requirements

This site targets high Lighthouse scores. When making changes, preserve the following:

| Metric | Target |
|---|---|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

### Key practices to maintain:
- Images must include `alt` attributes.
- Interactive elements must be keyboard-navigable.
- Color contrast must meet WCAG AA standards.
- Do not add render-blocking scripts in `<head>`.
- Keep total page weight minimal (no unnecessary images or scripts).
- Preserve `fetchpriority="high"` on the hero/critical CSS `<link>` tag.
- Keep `sitemap.xml` and `robots.txt` accurate if pages/sections change.

---

## What NOT to Do

- **Do not introduce build tools** (webpack, vite, rollup, etc.) without explicit instruction. This is intentionally a no-build project.
- **Do not add npm/package.json** unless explicitly requested.
- **Do not edit `base.css`**. It is a third-party normalize/reset.
- **Do not push to `master` directly** when working from a feature branch — open a PR instead.
- **Do not remove PWA files** (`sw.js`, `site.webmanifest`) without deliberate intent.
- **Do not use JavaScript frameworks** (React, Vue, etc.) for changes. Keep it vanilla JS.

---

## Git Workflow

- **Primary branch**: `master` (deploys to production via GitHub Pages)
- **Feature branches**: Use descriptive names, e.g., `fix/mobile-nav`, `feat/dark-mode`
- **Commit messages**: Use imperative present tense (e.g., `Fix mobile toggle alignment`, `Add dark mode toggle`)
- **No CI/CD**: There are no automated tests or linters. Review changes manually in-browser before merging.

---

## Sections of the Site

The single-page `index.html` is divided into these sections (in order):

1. **`#home` / `.s-header`** — Hero with particle animation, name, CTA buttons
2. **`.s-about`** — Professional bio, profile photo, stats
3. **`.s-services`** — Service offerings with accordion expand/collapse
4. **`.s-testimonials`** — Client testimonials slider
5. **`.s-contact`** — Contact information and social links
6. **`footer`** — Copyright, back-to-top link

---

## Known Patterns & Non-obvious Behaviors

- **Typewriter effect**: Implemented in `main.js` via a character-by-character interval loop on the hero subtitle text.
- **Particle animation**: Driven by `particle-cluster.js` using the HTML5 Canvas API. It responds to mouse movement for interactive 3D depth.
- **Sticky header**: JavaScript adds a `.sticky` class to `.s-header` on scroll, which triggers CSS transitions defined in `main.css`.
- **Mobile menu**: Toggled by `.header-menu-toggle` button; the open state is tracked via `aria-expanded` and a `.menu-is-open` class on `<html>`.
- **Scroll-reveal**: Elements with `data-aos="..."` attributes fade/slide into view on scroll, driven by a native `IntersectionObserver` in `main.js` (the `ssReveal` function). Respects `prefers-reduced-motion`.
- **Cache busting**: To force the service worker to re-fetch assets after a deployment, increment `CACHE_VERSION` in `sw.js`.
