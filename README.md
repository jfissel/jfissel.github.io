# John Fissel — Professional Portfolio Website

A modern, high-performance personal portfolio website for John Fissel, a Certified Public Accountant based in Austin, TX, specializing in data analytics, automation, and AI in accounting.

**Live Site:** [johnfissel.com](https://johnfissel.com)

## Overview

This is a single-page Progressive Web App (PWA) built with vanilla HTML, CSS, and JavaScript — no frameworks, no npm packages, no build step. It is optimized for performance, accessibility, and SEO, and deploys automatically to GitHub Pages.

## Key Features

### Design & Interactivity
- **Canvas Particle Animation**: A custom 3D particle cluster in the hero that auto-rotates, follows the cursor on desktop, and pauses when off-screen or in a hidden tab
- **Typewriter Hero Heading**: Character-by-character reveal of the hero heading
- **Scroll-Reveal Animations**: Sections fade/slide into view using a native IntersectionObserver (no animation library)
- **Light/Dark Theme Toggle**: Sun/moon toggle in the header, persisted in `localStorage`, defaulting to the system `prefers-color-scheme`
- **Sticky Header & Scroll Progress**: Fixed navigation with active-section highlighting and a top-of-page reading progress bar
- **Copy-Email Button**: One-click email copy in the footer (shown only when the Clipboard API is available)
- **Reduced-Motion Support**: Every animation honours `prefers-reduced-motion` and degrades to a static equivalent

### Performance
- **No Dependencies**: Zero frameworks or libraries; total page weight stays minimal
- **Optimized Loading**: Deferred JavaScript, resource prioritization (`fetchpriority`), and preconnect for Google Fonts
- **WebP Images**: Modern image format with 2x retina variants, lazy-loaded below the fold
- **Service Worker Caching**: Cache-first strategy with a precached critical shell and runtime caching for everything else

### Progressive Web App (PWA)
- **Offline Capability**: The site works without a connection; offline navigations fall back to the cached homepage
- **Installable**: Web app manifest with custom icons and theme colors for a native app-like experience
- **Custom 404 Page**: A self-contained `404.html` that also serves as the service worker's offline fallback

### SEO & Accessibility
- **Structured Data**: JSON-LD schema markup for rich search results
- **Social Previews**: Open Graph and Twitter Card tags with a dedicated share image
- **Sitemap & Robots**: XML sitemap and crawler directives
- **Semantic HTML & ARIA**: Proper heading hierarchy, landmarks, and labels for screen readers
- **Keyboard Navigation**: Fully keyboard-accessible, including a focus-trapped mobile menu with Escape-to-close
- **Color Contrast**: WCAG AA–compliant color schemes

## Project Structure

```
jfissel.github.io/
├── index.html              # Single-page application entry point
├── 404.html                # Custom 404 / offline fallback page
├── css/
│   ├── base.css            # Normalize.css + base element styles
│   └── main.css            # Custom layout, components, responsive styles
├── js/
│   ├── main.js             # Core interactivity (scroll, menu, typewriter, theme, etc.)
│   └── particle-cluster.js # Canvas 3D particle animation
├── images/
│   ├── hero-bg-1920.webp   # Hero section background
│   ├── og-image.png        # Social share image (Open Graph / Twitter)
│   ├── profile-pic.webp    # Profile photo (1x)
│   └── profile-pic@2x.webp # Profile photo (2x retina)
├── sw.js                   # Service worker (offline caching)
├── site.webmanifest        # PWA manifest
├── sitemap.xml             # XML sitemap for SEO
├── robots.txt              # Search engine crawler directives
├── CNAME                   # Custom domain configuration
├── .well-known/
│   └── security.txt        # Security disclosure contact info
└── favicon / app icons     # favicon.ico, PNG favicons, Apple & Android icons
```

## Technology Stack

- **HTML5** — semantic markup with accessibility attributes
- **CSS3** — custom properties, flexbox/grid layouts, mobile-first media queries
- **Vanilla JavaScript (ES6+)** — no framework dependencies
- **Browser APIs** — Service Worker, IntersectionObserver, Canvas, Clipboard, `matchMedia`
- **Google Fonts** — Source Serif 4 + Inter (variable fonts)
- **Standards** — Schema.org structured data, Open Graph, Twitter Cards

## Development

### Prerequisites
- A modern web browser
- A local web server (required only for testing the service worker / PWA features)

### Local Development Setup

There is no build step. Clone and serve:

```bash
git clone https://github.com/jfissel/jfissel.github.io.git
cd jfissel.github.io

# Python
python3 -m http.server 8000

# or Node.js
npx serve .
```

Then open `http://localhost:8000`.

> Service workers only activate on `localhost` or HTTPS. During development, hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass the service worker cache.

### Making Changes

- **Content**: Edit `index.html` (update the SEO/social meta tags if content changes)
- **Styles**: Edit `css/main.css` — use the CSS variables defined in `:root`; don't edit `base.css` (it's a third-party normalize)
- **Interactivity**: Edit `js/main.js` or `js/particle-cluster.js`
- **Caching**: Edit `sw.js` — and **increment the `CACHE_NAME` version** whenever cached assets change, so visitors receive fresh content

## Deployment

The site deploys automatically via GitHub Pages:

1. Push (or merge a PR) to the `main` branch
2. GitHub Pages publishes the static files — no build commands
3. The live site at [johnfissel.com](https://johnfissel.com) updates within 1–2 minutes

The custom domain is configured via the `CNAME` file, with DNS pointing `johnfissel.com` to GitHub Pages and `www` redirecting to the apex domain.

## Performance Targets

Lighthouse score targets, maintained across changes:

| Metric | Target |
|---|---|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## License

© 2026 John Fissel. All rights reserved.

This is a personal portfolio website. The code structure and techniques may be used as reference, but please do not copy content or design wholesale.

## Contact

**John Fissel**
- Website: [johnfissel.com](https://johnfissel.com)
- Email: contact@johnfissel.com
- LinkedIn: [linkedin.com/in/johnfissel](https://www.linkedin.com/in/johnfissel/)
- X/Twitter: [@johnfissel](https://x.com/johnfissel)
- Medium: [@johnfissel](https://medium.com/@johnfissel)

---

**Built with** performance, accessibility, and user experience in mind.
