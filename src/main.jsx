import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Service worker for PWA — unregister old ones first to bust stale cache
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    // Unregister any existing SW to clear stale caches during development
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const reg of registrations) {
      await reg.unregister()
    }
    // Clear all caches
    const cacheNames = await caches.keys()
    for (const name of cacheNames) {
      await caches.delete(name)
    }
    // Re-register fresh
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
