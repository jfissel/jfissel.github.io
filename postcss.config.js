export default {
  plugins: {
    '@fullhuman/postcss-purgecss': {
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx,html}'
      ],
      // Safelist classes and selectors that are added dynamically
      safelist: {
        standard: [
          'no-js',
          'js',
          'aos-init',
          'aos-animate',
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
        // Keep all data-aos attributes and their variations
        deep: [/^aos-/, /^data-aos/],
        greedy: [/^header-/, /^s-/, /^ss-/, /\[data-aos/]
      },
      // Custom extractor to preserve attribute selectors
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
