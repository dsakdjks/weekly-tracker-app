# Deployment Guide - Life Weeks Tracker (Optimized)

## Pre-Deployment Checklist

### Build Optimization
- [x] Terser minification enabled
- [x] CSS code splitting configured
- [x] Source maps disabled in production
- [x] Asset versioning with content hashes
- [x] Chunk splitting optimized
- [x] Console statements dropped

### Responsive Design
- [x] Mobile breakpoints (320px, 481px, 769px)
- [x] Touch-friendly interface (44px+ targets)
- [x] CSS custom properties system
- [x] Flexible layouts for all screen sizes

### Performance Features
- [x] Service Worker for offline support
- [x] Network-first caching strategy
- [x] HTML meta tags for optimization
- [x] Preload/preconnect for critical resources
- [x] PWA manifest configuration

---

## Build Process

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build for Production
```bash
npm run build
```

This will:
- Minify and optimize all assets
- Generate content-hashed filenames for cache busting
- Create service worker registration in the app
- Split code into optimal chunks
- Compress CSS and JavaScript
- Remove all console statements

Output: `dist/` directory

### Step 3: Test Production Build Locally
```bash
npm run preview
```

Open `http://localhost:4173` to test the production build with service worker caching.

---

## Deployment Platforms

### 1. Netlify (Recommended)
Netlify automatically optimizes your deployment with HTTP/2, gzip compression, and edge caching.

**Steps:**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

**Server Configuration** (`netlify.toml` already included):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/dist/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### 2. Vercel
Similar to Netlify with excellent Next.js support (if you migrate later).

**Steps:**
1. Import project from GitHub
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy

### 3. GitHub Pages
Static hosting from your GitHub repository.

**Steps:**
1. Update `vite.config.js` base URL if needed
2. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. Docker Deployment
For self-hosted solutions:

**Dockerfile:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build and run:**
```bash
docker build -t life-weeks-tracker .
docker run -p 3000:3000 life-weeks-tracker
```

---

## Performance Optimization After Deployment

### 1. Gzip/Brotli Compression
Ensure your server compresses static assets:
- Netlify: ✅ Automatic
- Vercel: ✅ Automatic
- GitHub Pages: ✅ Automatic
- Custom: Configure in nginx/Apache

### 2. Caching Strategy

**Service Worker Cache Headers:**
- Critical assets: Cache forever (31536000 seconds)
- JavaScript: 1 hour cache
- Service Worker: No cache (must-revalidate)

### 3. Content Delivery Network (CDN)
- Netlify: ✅ Built-in edge locations
- Vercel: ✅ Built-in edge network
- GitHub Pages: ✅ CloudFlare CDN

---

## Monitoring & Analytics

### 1. Performance Monitoring
Use tools to track:
- Lighthouse scores
- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)

**Google PageSpeed Insights:**
```
https://pagespeed.web.dev/?url=your-domain
```

### 2. Error Tracking
Add error monitoring (optional):
```javascript
// In src/index.js
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  // Send to error tracking service
});
```

### 3. User Analytics
Consider adding (optional):
- Google Analytics
- Hotjar for heatmaps
- LogRocket for session replays

---

## Environment Variables

Create `.env` file for environment-specific settings:

```env
VITE_BASE=/
VITE_API_URL=https://api.example.com
```

Use in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Security Headers

Configure these headers on your server:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

**Netlify Configuration:**
Add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## Database/Storage Considerations

Current implementation uses **localStorage only**:
- ✅ No backend required
- ✅ 100% client-side
- ⚠️ Limited to ~5-10MB per domain

**For future scaling:**
1. Add backend API (Node.js/Express, Python/Django)
2. Use cloud database (Firebase, MongoDB Atlas)
3. Implement user authentication
4. Add data sync across devices

---

## Post-Deployment Steps

### 1. Test Service Worker
```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations))
```

### 2. Test Offline Functionality
1. DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Refresh page - should load from cache

### 3. Test Responsive Design
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test on multiple device sizes

### 4. Run Lighthouse Audit
1. DevTools → Lighthouse
2. Run audit for all categories
3. Target scores: >90 for all metrics

### 5. Check Core Web Vitals
```bash
https://web.dev/measure/
```

---

## Rollback Procedure

If issues occur after deployment:

### GitHub Pages
```bash
git revert <commit-hash>
git push origin main
```

### Netlify
1. Go to Deployments
2. Click on previous successful deployment
3. Click "Publish deploy"

### Vercel
1. Go to Deployments
2. Click "Promote to Production" on previous deployment

---

## Maintenance & Updates

### Weekly
- Monitor error logs
- Check Core Web Vitals
- Review user feedback

### Monthly
- Update dependencies: `npm update`
- Security audit: `npm audit`
- Performance audit: Lighthouse

### Quarterly
- Major version updates
- Backup user data
- Security review

### Annually
- Full feature review
- Design refresh
- Technology stack assessment

---

## Build Sizes (Expected)

After optimization:
- HTML: ~15KB (gzipped)
- CSS: ~25KB (gzipped)
- JavaScript: ~40KB (gzipped)
- Service Worker: ~3KB (gzipped)

**Total: ~83KB gzipped** (much smaller than original)

---

## Troubleshooting

### Service Worker Not Updating
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
// Clear cache
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### High Bundle Size
```bash
npm run build:analyze
# Check which modules are largest
```

---

## Conclusion

Your app is now:
- ✅ Optimized for all devices
- ✅ Works offline
- ✅ Fast loading
- ✅ Production-ready
- ✅ Scalable architecture

Deploy with confidence! 🚀
