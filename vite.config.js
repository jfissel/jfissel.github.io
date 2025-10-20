import { defineConfig } from 'vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: mode === 'analyze' ? [
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Options: treemap, sunburst, network
    })
  ] : [],
  // Custom domain configuration
  base: '/',

  // PostCSS configuration will be loaded from postcss.config.js
  css: {
    postcss: './postcss.config.js'
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Asset hashing for cache busting
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        // Minify HTML in the output
        compact: true,
        // Manual chunk splitting for better caching
        manualChunks(id) {
          // Split vendor/third-party code into separate chunk
          // This allows better long-term caching since vendor code changes less frequently
          if (id.includes('plugins.js')) {
            return 'vendor'
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2
      },
      format: {
        comments: false
      }
    },
    cssCodeSplit: true,
    reportCompressedSize: true
  },

  // Development server
  server: {
    port: 3000,
    open: true
  },

  // Preview server
  preview: {
    port: 4173,
    open: true
  },

  // Asset handling
  assetsInclude: ['**/*.webp', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.ico'],

  // Optimize dependencies
  optimizeDeps: {
    include: []
  }
}))
