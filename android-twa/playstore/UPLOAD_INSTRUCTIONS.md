Steps to upload app-release.aab to Google Play Console

1. Verify you have a Google Play developer account and the app listing created.
2. Prepare assets (screenshots, feature graphic, privacy policy URL).
3. Host the generated assetlinks.json at:
   https://weeklylifetrackerdairy.netlify.app/.well-known/assetlinks.json
   (copy file from `dist/.well-known/assetlinks.json` to your site's `.well-known/`)

4. From Play Console > Production > Create new release > Upload > select:
   android-twa/app/build/outputs/bundle/release/app-release.aab

5. Review release notes, set rollout percentage, and publish.

Notes about signing:

- This AAB was signed with `android-twa/android.keystore` (alias: android).
- Play App Signing will ask whether to use Google-managed signing key. It's recommended to opt into Play App Signing.

Commands to compute SHA256 fingerprint for any keystore:

```
keytool -list -v -keystore android-twa/android.keystore -alias android -storepass android | grep 'SHA256:'
```

Verify assetlinks.json is accessible:

```
curl -I https://weeklylifetrackerdairy.netlify.app/.well-known/assetlinks.json
```
