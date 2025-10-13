import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // GitHub Pages configuration
  base: '/jfissel.github.io/',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      },
      output: {
        // Asset hashing for cache busting
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
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
})
