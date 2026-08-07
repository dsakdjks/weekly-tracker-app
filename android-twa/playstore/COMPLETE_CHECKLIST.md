# Complete Android App Publication Checklist

## Pre-Publication Verification ✅

- [x] AAB built and signed
- [x] Bundletool validation passed
- [x] Manifest correct (package, version, SDK levels)
- [x] Launcher icons present (all densities)
- [x] Service Worker configured
- [x] PWA Manifest configured

## Required Before Play Console Upload

### 1. Host assetlinks.json (5 min)

```bash
# Copy assetlinks.json to dist
mkdir -p dist/.well-known
cp android-twa/assetlinks.json dist/.well-known/assetlinks.json

# Commit and push
git add dist/.well-known/assetlinks.json dist/netlify.toml
git commit -m "Add assetlinks.json for Android app verification"
git push

# Verify (wait ~1-2 min for Netlify to deploy)
curl https://weeklylifetrackerdairy.netlify.app/.well-known/assetlinks.json | jq .
```

### 2. Prepare Store Listing (20 min)

- [ ] App title: "Weekly Dairy" ✅
- [ ] Short description: "Track your life in weeks and add weekly highlights."
- [ ] Full description: See `android-twa/playstore/STORE_LISTING.txt`
- [ ] Category: Productivity ✅
- [ ] Content rating: Fill in Play Console survey
- [ ] Privacy policy URL: Add your privacy policy link
- [ ] Screenshots: 4-5 phone screenshots (1080x1920, see `SCREENSHOT_GUIDE.md`)
- [ ] Feature graphic: 1024x500 promotional image

### 3. Upload AAB to Play Console (10 min)

- [ ] Log into Google Play Console
- [ ] Select app "Life Weeks Tracker"
- [ ] Navigate to Release > Production > Create new release
- [ ] Upload: `android-twa/app/build/outputs/bundle/release/app-release.aab`
- [ ] Add release notes (e.g., "Initial release")
- [ ] Review changes
- [ ] Set rollout: 100% (or staged if preferred)
- [ ] Publish

### 4. Post-Publication (1-3 hours)

- [ ] App will undergo review
- [ ] Check Play Console for any issues
- [ ] Monitor user feedback once live

## Key Credentials & Files

| Item               | Location                                                                                          | Notes                                  |
| ------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Upload Keystore    | `android-twa/android.keystore`                                                                    | Alias: android, Password: android      |
| Alternate Keystore | `android-twa/upload.keystore`                                                                     | Alias: upload, Password: upload        |
| assetlinks.json    | `dist/.well-known/assetlinks.json`                                                                | Host at `/.well-known/assetlinks.json` |
| App Package        | `com.weeklydairy.app`                                                                          | Used in Play Console and fingerprint   |
| SHA256 Fingerprint | `0B:34:86:32:05:4E:0A:69:CC:03:29:BC:06:A8:DA:57:6A:63:D8:92:3D:FB:E8:3F:F3:9F:CC:69:BA:75:A1:78` | Matches assetlinks.json                |

## Safety Notes

- **Keep keystores safe:** Store `android-twa/android.keystore` in a secure location.
- **Backup keystores:** If you lose the keystore, you cannot update the app on Play Store.
- **Avoid re-signing:** Once published, stick with the same signing key or it will be treated as a new app.
- **Test before publish:** Deploy to internal testing track first if available.

## Troubleshooting Links

- assetlinks.json not found? → See `NETLIFY_ASSETLINKS_SETUP.md`
- Screenshots help? → See `SCREENSHOT_GUIDE.md`
- API upload needed? → See `PLAY_CONSOLE_API_UPLOAD.md`
- Upload instructions? → See `UPLOAD_INSTRUCTIONS.md`
