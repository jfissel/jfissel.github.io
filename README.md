# John Fissel - Professional Portfolio Website

A modern, high-performance personal portfolio website for John Fissel, a Certified Public Accountant based in Austin, TX, specializing in data analytics, automation, and AI in accounting.

**Live Site:** [johnfissel.com](https://johnfissel.com)

## Overview

This is a single-page Progressive Web App (PWA) featuring a responsive design optimized for performance, accessibility, and SEO. The site showcases professional experience, technical skills, and provides multiple channels for contact and professional networking.

## Key Features

### Performance
- **Optimized Loading**: Deferred JavaScript loading and resource prioritization
- **Preconnect & DNS Prefetch**: Faster font loading from Google Fonts
- **Lazy Loading**: Images loaded on-demand for faster initial page load
- **Service Worker Caching**: Offline-first architecture with intelligent asset caching
- **WebP Images**: Modern image format with 2x retina support

### Progressive Web App (PWA)
- **Offline Capability**: Full functionality without internet connection via service worker
- **Installable**: Can be installed on mobile devices and desktop
- **Web App Manifest**: Custom icons and theme colors for native app-like experience
- **Mobile Optimization**: Apple-specific meta tags for iOS devices

### SEO & Discoverability
- **Structured Data**: JSON-LD schema markup for rich search results
- **Open Graph**: Optimized for social media sharing (Facebook, LinkedIn)
- **Twitter Cards**: Enhanced link previews on X/Twitter
- **Sitemap**: XML sitemap for search engine crawlers
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Meta Tags**: Comprehensive description and keyword optimization

### Accessibility
- **ARIA Labels**: Comprehensive screen reader support
- **Semantic Structure**: Proper HTML5 semantic elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG-compliant color schemes
- **Focus Indicators**: Clear visual feedback for interactive elements

### User Experience
- **Smooth Scrolling**: Animated navigation between sections
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Loading Animation**: Elegant preloader for initial page load
- **Interactive Navigation**: Sticky header with mobile menu toggle
- **Scroll Indicators**: Visual cues for navigation

## Project Structure

```
jfissel.github.io/
├── css/
│   ├── base.css          # Base styles and CSS reset
│   ├── main.css          # Custom styles and layout
│   └── vendor.css        # Third-party styles and utilities
├── js/
│   ├── main.js           # Core JavaScript functionality
│   └── plugins.js        # JavaScript plugins and helpers
├── images/
│   ├── profile-pic.webp  # Profile image (1x)
│   └── profile-pic@2x.webp  # Profile image (2x retina)
├── .well-known/          # Domain verification files
├── index.html            # Main HTML file
├── sw.js                 # Service worker for PWA
├── site.webmanifest      # PWA manifest file
├── sitemap.xml           # XML sitemap for SEO
├── robots.txt            # Search engine crawler instructions
├── favicon.ico           # Browser favicon
├── favicon-16x16.png     # Favicon 16x16
├── favicon-32x32.png     # Favicon 32x32
├── apple-touch-icon.png  # iOS home screen icon
├── android-chrome-192x192.png  # Android icon
├── android-chrome-512x512.png  # Android icon (high-res)
└── CNAME                 # Custom domain configuration
```

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Modern styling with flexbox and grid layouts
- **Vanilla JavaScript**: No framework dependencies for optimal performance

### Browser APIs
- **Service Worker API**: Offline functionality and caching
- **Intersection Observer**: Efficient scroll-based animations
- **Web App Manifest**: PWA installation

### Third-Party Resources
- **Google Fonts**: Custom typography
- **AOS (Animate On Scroll)**: Scroll-triggered animations

### Standards & Protocols
- **Schema.org**: Structured data for search engines
- **Open Graph Protocol**: Social media optimization
- **Twitter Card**: Enhanced Twitter/X integration

## Development

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (required for service worker testing)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jfissel/jfissel.github.io.git
   cd jfissel.github.io
   ```

2. **Start a local server**

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx serve
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Testing PWA Features

Service workers require HTTPS or localhost. For local testing:
- Use `http://localhost` (service worker will work)
- Or use `ngrok` to create HTTPS tunnel: `ngrok http 8000`

### Making Changes

**CSS Modifications:**
- Edit `css/main.css` for layout and styling changes
- Edit `css/base.css` for typography and base styles

**Content Updates:**
- Edit `index.html` for text content
- Update images in the `images/` directory

**JavaScript Changes:**
- Edit `js/main.js` for interactive features
- Edit `sw.js` to modify caching strategy

**Important**: After modifying `sw.js`, increment the cache version to ensure users get the latest version.

## Deployment

### GitHub Pages
The site is deployed automatically via GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Actions builds and deploys automatically
3. Live site updates within 1-2 minutes

### Custom Domain
The site uses a custom domain configured via the `CNAME` file. DNS is configured to point:
- `johnfissel.com` → GitHub Pages
- `www.johnfissel.com` → redirects to apex domain

### Cache Busting
When updating the service worker:
1. Increment the `CACHE_VERSION` in `sw.js`
2. Update the files array if new assets were added
3. Test locally before pushing to production

## Browser Support

Tested and fully supported on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

Target performance (Lighthouse scores):
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Security

- **Content Security Policy**: Headers configured at server level
- **HTTPS Only**: All resources loaded over secure connections
- **No External Scripts**: Minimal third-party dependencies
- **Subresource Integrity**: Could be added for CDN resources

## License

© 2025 John Fissel. All rights reserved.

This is a personal portfolio website. The code structure and techniques may be used as reference, but please do not copy content or design wholesale.

## Contact

**John Fissel**
- Website: [johnfissel.com](https://johnfissel.com)
- Email: contact@johnfissel.com
- LinkedIn: [linkedin.com/in/johnfissel](https://www.linkedin.com/in/johnfissel/)
- X/Twitter: [@johnfissel](https://twitter.com/johnfissel)
- Medium: [@johnfissel](https://medium.com/@johnfissel)

---

**Built with** performance, accessibility, and user experience in mind.
