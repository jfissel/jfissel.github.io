# John Fissel Personal Website

This repository contains the source code for John Fissel's personal website, a certified public accountant based in Cleveland, OH.

## Features

- Responsive design for all device sizes
- Progressive Web App (PWA) capabilities
- Optimized for performance and accessibility
- SEO-friendly with meta tags, structured data, and sitemap
- Modern web standards and best practices

## Project Structure

```
public/                  # All public-facing files
├── assets/              # Static assets
│   ├── css/             # CSS stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Images and graphics
│   └── icons/           # Favicons and app icons
├── .well-known/         # Well-known URLs (security.txt)
├── index.html           # Main HTML file
├── site.webmanifest     # Web app manifest
├── sw.js                # Service worker
├── robots.txt           # Robots file for search engines
└── sitemap.xml          # XML sitemap
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Service Worker for offline capabilities
- Web App Manifest for PWA support

## Development

To run this website locally:

1. Clone the repository
2. Navigate to the `public` directory
3. Start a local server

```bash
# Using Python
cd public
python -m http.server

# Using Node.js
cd public
npx serve
```

Or use the npm scripts:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

The website is deployed using GitHub Pages with a GitHub Actions workflow. The workflow automatically deploys the contents of the `public` directory to GitHub Pages whenever changes are pushed to the main branch.

### How it works

1. The GitHub Actions workflow is defined in `.github/workflows/deploy.yml`
2. When code is pushed to the main branch, the workflow:
   - Checks out the repository
   - Configures GitHub Pages
   - Uploads the `public` directory as an artifact
   - Deploys the artifact to GitHub Pages

### Manual Deployment

If you need to deploy manually, you can:

1. Go to the repository on GitHub
2. Navigate to Actions tab
3. Select the "Deploy to GitHub Pages" workflow
4. Click "Run workflow"

## Browser Support

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

All rights reserved. This code is not open for reuse without permission.

## Contact

For any inquiries, please contact John Fissel at contact@johnfissel.com. 