export default {
  plugins: {
    '@fullhuman/postcss-purgecss': {
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx,html}'
      ],
      // Safelist classes that are added dynamically
      safelist: {
        standard: [
          'no-js',
          'js',
          'aos-init',
          'aos-animate',
          'menu-is-open',
          'ss-navicon-close'
        ],
        // Keep all data-aos attributes and their variations
        deep: [/^data-aos/, /^aos-/],
        greedy: [/^header-/, /^s-/, /^ss-/]
      },
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
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
