# Android TWA Packaging

This folder is a placeholder for the Android Trusted Web Activity project.

## What is ready

- The web app is already PWA-ready.
- `public/manifest.json` now references real icon files in `public/icons/`.
- `public/service-worker.js` caches the manifest and icons.

## Next steps

1. Deploy the web app to HTTPS.
   - Build the project: `npm run build`
   - Deploy the `dist/` folder to Netlify, Vercel, GitHub Pages, or another HTTPS host.

2. Install Bubblewrap CLI (if not installed):
   ```bash
   npm install -g @bubblewrap/cli
   ```

3. Initialize a TWA project:
   ```bash
   bubblewrap init --manifest=https://yourdomain.com/manifest.json
   ```

4. Build and run the TWA:
   ```bash
   cd <twa-project>
   bubblewrap build
   ./gradlew installDebug
   ```

5. Add Digital Asset Links:
   - Bubblewrap will provide an `assetlinks.json` snippet.
   - Host it at `https://yourdomain.com/.well-known/assetlinks.json`.

6. Sign the app and prepare release bundle:
   ```bash
   ./gradlew bundleRelease
   ```

## Notes

- If you want a fully local Android package without hosting, consider Capacitor instead of TWA.
- TWA needs a hosted origin to work correctly.
