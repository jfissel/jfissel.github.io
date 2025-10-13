# John Fissel Personal Website

This repository contains the source code for John Fissel's personal website, a certified public accountant based in Austin, TX.

## Features

- Responsive design for all device sizes
- Progressive Web App (PWA) capabilities
- Optimized for performance and accessibility
- SEO-friendly with meta tags, structured data, and sitemap
- Modern web standards and best practices
- Automated build and deployment with GitHub Actions

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Vite (Build tool)
- Service Worker for offline capabilities
- Web App Manifest for PWA support
- GitHub Actions for CI/CD

## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Building for Production

To build the optimized production version:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── src/                    # Source files
│   ├── index.html         # Main HTML file
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Image assets
├── public/                # Static assets (favicons, manifest, etc.)
├── dist/                  # Built files (generated)
├── .github/workflows/     # GitHub Actions
└── package.json          # Dependencies and scripts
```

## Deployment

The website is automatically deployed using GitHub Actions:

1. Push changes to the `main` branch
2. GitHub Actions builds the optimized static files
3. Built files are deployed to GitHub Pages
4. The website is live at `https://jfissel.github.io`

### Manual Deployment

If you need to deploy manually:

1. Build the project: `npm run build`
2. The built files will be in the `dist/` directory
3. Deploy the contents of `dist/` to your web server

## Build Optimizations

The build process includes:

- **CSS minification** - Reduces file size by ~50%
- **JavaScript minification** - Reduces file size by ~40%
- **Asset optimization** - Images and other assets are optimized
- **Cache busting** - Assets get hashed filenames for better caching
- **HTML minification** - Removes unnecessary whitespace and comments

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