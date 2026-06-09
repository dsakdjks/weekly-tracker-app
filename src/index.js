import { init } from "./modules/app.js";

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  init();

  // Register service worker for offline support and caching
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Service worker registration failed, app still works without it
    });
  }
});
