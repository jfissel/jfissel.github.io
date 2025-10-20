export default {
  plugins: {
    '@fullhuman/postcss-purgecss': {
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx,html}'
      ],
      // Safelist dynamically-applied classes
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
    },
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
