// Main entry point for Vite build
// Import CSS files (vendor.css excluded - loaded directly in HTML to bypass PurgeCSS)
import './css/base.css'
import './css/main.css'

// Import all JavaScript modules
import './js/plugins.js'
import './js/main.js'

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error)
      })
  })
}
