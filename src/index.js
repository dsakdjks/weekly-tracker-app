import { init } from './modules/app.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Register service worker for offline support and caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .catch((error) => {
        // Service worker registration failed, app still works
        console.log('Service Worker registration failed:', error);
      });
  }
});

