# Quick Reference - Mobile Responsive, Fast & Scalable App

## 🚀 Quick Start

```bash
# Development (live reload, HMR)
npm run dev

# Production build (optimized)
npm run build

# Preview production build
npm run preview

# Format code
npm run format

# Lint code
npm run lint
```

---

## 📱 Responsive Breakpoints

```css
/* Small phones (320px - 480px) */
@media (max-width: 480px) { }

/* Tablets (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) { }

/* Desktops (769px+) */
@media (min-width: 769px) { }
```

---

## 🎨 CSS Variables Reference

```css
/* Colors */
--color-primary: #667eea
--color-secondary: #f093fb
--color-success: #10b981
--color-danger: #ef4444

/* Spacing (4px base scale) */
--space-xs: 4px
--space-sm: 8px
--space-md: 12px
--space-lg: 16px
--space-xl: 20px
--space-2xl: 24px
--space-3xl: 32px
--space-4xl: 40px

/* Border Radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 15px
--radius-2xl: 20px
--radius-full: 999px

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15)
--shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 25px 80px rgba(0, 0, 0, 0.3)

/* Transitions */
--transition-fast: 0.15s ease
--transition-base: 0.2s ease
--transition-slow: 0.3s ease
```

---

## 📦 Build Optimizations

### What's Optimized
✅ Terser minification (80% size reduction)
✅ CSS code splitting
✅ Content hash versioning
✅ Drop console statements
✅ Drop debugger statements
✅ Remove source maps

### Output Structure
```
dist/
├── index.html
├── service-worker.js
├── manifest.json
└── assets/
    ├── [name].[hash].js
    ├── [name].[hash].css
    └── ...
```

---

## 🔄 Service Worker Features

### Automatic Caching
- Network-first strategy
- Automatic fallback to cache
- Offline support
- Auto cache cleanup

### Implementation
```javascript
// Already registered in src/index.js
navigator.serviceWorker.register('/service-worker.js')
```

### Test Offline
1. DevTools → Application → Service Workers
2. Check "Offline"
3. Refresh - loads from cache

---

## 📐 Mobile Design Best Practices

### Touch Targets
- Minimum: 44×44px
- Recommended: 48×48px
- Spacing: 8px minimum gap

### Font Sizes (Responsive)
```css
/* Mobile first */
h1 { font-size: 1.5em; }     /* 320px */
@media (min-width: 481px) {
  h1 { font-size: 2em; }      /* Tablets */
}
@media (min-width: 769px) {
  h1 { font-size: 2.5em; }    /* Desktop */
}
```

### Grid Layouts
```css
/* Mobile: 1 column */
.grid { grid-template-columns: 1fr; }

/* Tablet: 2 columns */
@media (min-width: 481px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 3+ columns */
@media (min-width: 769px) {
  .grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
}
```

---

## ⚡ Performance Tips

### Image Optimization (Future)
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="Description">
</picture>
```

### Lazy Loading (Future)
```html
<img src="image.png" loading="lazy" alt="Description">
```

### Critical CSS
```html
<link rel="preload" href="critical.css" as="style">
```

### Preconnect
```html
<link rel="preconnect" href="https://example.com">
<link rel="dns-prefetch" href="https://example.com">
```

---

## 🐛 Debugging

### Check Service Worker
```javascript
// Browser console
navigator.serviceWorker.getRegistrations()
  .then(r => console.log(r))
```

### Check Cache
```javascript
caches.keys().then(names => console.log(names))
caches.open('cache-name').then(cache => {
  cache.keys().then(requests => console.log(requests))
})
```

### Check Bundle Size
```bash
npm run build:analyze
```

### Network Issues
1. DevTools → Network
2. Filter by resource type
3. Check request/response headers
4. Look for slow requests

---

## 📊 Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Scores
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Bundle Sizes
- HTML: < 20KB gzipped
- CSS: < 30KB gzipped
- JS: < 50KB gzipped

---

## 🌐 PWA Manifest

Located in `public/manifest.json`

### Features
- App installation
- Splash screen
- App icons
- Theme colors
- Shortcuts

### Test PWA
1. Open DevTools → Manifest
2. Check "Add to home screen"
3. Test on Android/iOS

---

## 🔐 Security

### Headers to Configure (on server)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### Content Security Policy
```
Content-Security-Policy: default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline'
```

---

## 📚 File Structure

```
project/
├── public/
│   ├── index.html           (Optimized with preload)
│   ├── styles.css           (Responsive + variables)
│   ├── index.js            (SW registration)
│   ├── service-worker.js   (Caching strategy)
│   └── manifest.json       (PWA config)
├── src/
│   ├── index.js            (Entry point)
│   └── modules/
│       ├── app.js
│       ├── storage.js
│       ├── ui.js
│       └── weekManager.js
├── vite.config.js          (Build optimizations)
├── package.json            (Scripts)
└── dist/                   (Built output)
```

---

## 🚢 Deployment

### Netlify (Recommended)
```
Build: npm run build
Publish: dist
```

### Vercel
```
Build: npm run build
Output: dist
```

### GitHub Pages
```
Use GitHub Actions workflow
```

---

## 📖 Documentation Files

1. **RESPONSIVE_AND_PERFORMANCE.md** - Full technical details
2. **DEPLOYMENT_GUIDE.md** - Deployment instructions
3. **README.md** - Project overview
4. **This file** - Quick reference

---

## 🎯 Next Steps

### Immediate
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Test offline functionality
- [ ] Deploy to production

### Short-term
- [ ] Add PWA installation prompt
- [ ] Set up analytics
- [ ] Monitor performance metrics

### Long-term
- [ ] Add backend API
- [ ] User authentication
- [ ] Data sync across devices
- [ ] Mobile app wrapper

---

## 💡 Tips & Tricks

### Quick Device Testing
```bash
# Get local IP
ipconfig getifaddr en0  # macOS
hostname -I              # Linux

# Access from phone
http://<YOUR_IP>:3000
```

### Clear All Caches
```javascript
// Browser console
Promise.all([
  ...await navigator.serviceWorker.getRegistrations(),
  ...await caches.keys()
].map(item => item instanceof ServiceWorkerRegistration 
  ? item.unregister() 
  : caches.delete(item.name || item)))
```

### Force Update Service Worker
```javascript
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(r => r.unregister());
  });
```

---

## ❓ FAQ

**Q: How do I add CSS variables to my components?**
A: Use `var(--variable-name)` in your CSS. Define new variables in `:root`

**Q: Can I change the breakpoints?**
A: Yes, edit the media query values in `styles.css`

**Q: How do I test the offline functionality?**
A: DevTools → Application → Service Workers → Check "Offline"

**Q: Why is the bundle so small?**
A: Terser minification, tree-shaking, CSS splitting, and console removal

**Q: Can I deploy this anywhere?**
A: Yes! Netlify, Vercel, GitHub Pages, Docker, or any static host

---

## 📞 Support

For issues or questions:
1. Check RESPONSIVE_AND_PERFORMANCE.md
2. Check DEPLOYMENT_GUIDE.md
3. Review error logs
4. Run `npm run build:analyze`
