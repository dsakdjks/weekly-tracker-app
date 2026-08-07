TWA / Play Store next steps

What I did:

- Updated `public/service-worker.js` to prefetch `/assets/*` references found in `index.html` during install.
- Updated the TWA project to use package id `com.weeklydairy.app` and app name `Weekly Dairy`.
- Added `public/.well-known/assetlinks.json` so the hosted site can serve Digital Asset Links.
- Updated the Android Gradle config in `android-twa/app/build.gradle` to sign release builds with `upload.keystore`.


Recommended next steps (TWA via Bubblewrap):

1. Host the production site on HTTPS

- Deploy the contents of `dist/` to Netlify / Vercel / GitHub Pages / your hosting provider.
- Ensure the site is served over HTTPS and the `start_url` in `public/manifest.json` points to the hosted origin (currently `/`).

2. Prepare icons and manifest

- Replace data-URI SVG icons in `public/manifest.json` with real icon files in `public/icons/`.
- Ensure `public/manifest.json` uses `icons/icon-192.svg`, `icons/icon-512.svg`, and `icons/maskable-icon-512.svg`.

3. Install Bubblewrap CLI

- On your machine run:

```bash
npm install -g @bubblewrap/cli
```

4. Initialize a TWA project

- Run:

```bash
bubblewrap init --manifest=<https://yourdomain/manifest.json>
```

- Follow prompts: package name (e.g., com.example.lifetracker), application name, start URL.

5. Build and test the TWA

- After `bubblewrap init` completes, run:

```bash
cd <twa-project>
bubblewrap build
# open in Android Studio or run via ./gradlew installDebug
```

6. Digital Asset Links

- Bubblewrap outputs a `assetlinks.json` snippet and the SHA256 fingerprint of the signing key.
- Host the `assetlinks.json` at `https://yourdomain/.well-known/assetlinks.json`.

7. Keystore and signing

- Generate a release keystore or use Play App Signing.

```bash
keytool -genkeypair -v -keystore release.keystore -alias lifetracker -keyalg RSA -keysize 2048 -validity 10000
```

- Configure Gradle signing (Bubblewrap project `app/build.gradle`) or use Android Studio to sign.

8. Build AAB and upload

- From the TWA project:

```bash
./gradlew bundleRelease
# find bundle at app/build/outputs/bundle/release/app-release.aab
```

- Upload the signed AAB to Google Play Console.

9. Play Console

- Prepare store listing, screenshots, privacy policy URL, content rating, and roll out release.

10. Remote build without local JDK

- A GitHub Actions workflow is already added at `.github/workflows/build-android.yml`.
- Push this repo to GitHub and run the workflow to build the AAB remotely.
- The workflow will produce `android-twa/app/build/outputs/bundle/release/app-release.aab` as a downloadable artifact.

Notes & caveats

- TWA requires a hosted origin; if you prefer packaging local assets without hosting, consider Capacitor instead (it bundles web assets inside the APK). TWA provides the best performance and uses Chrome as renderer.
- I can continue by deploying `dist/` to Netlify and running `bubblewrap init` (I'll need the hosted URL and your input for package name and app name).
