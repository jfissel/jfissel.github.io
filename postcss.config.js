export default (ctx) => {
  // Skip PurgeCSS entirely for vendor.css (contains AOS library)
  const isPurgeEnabled = !ctx.file || !ctx.file.includes('vendor.css')

  return {
    plugins: {
      ...(isPurgeEnabled && {
        '@fullhuman/postcss-purgecss': {
          content: [
            './index.html',
            './src/**/*.{js,jsx,ts,tsx,html}'
          ],
          safelist: {
            standard: [
              'no-js',
              'js',
              'menu-is-open',
              'ss-navicon-close',
              'ss-preload',
              'ss-loaded',
              'is-clicked',
              'sticky',
              'scrolling',
              'is-active',
              'link-is-visible'
            ],
            greedy: [/^header-/, /^s-/, /^ss-/]
          },
          defaultExtractor: content => {
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
            const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
            return broadMatches.concat(innerMatches)
          }
        }
      }),
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true
        }]
      }
    }
  }
}
