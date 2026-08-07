# Play Console API Upload Guide

## Prerequisites:

- Google Play Console account and app created
- Service account credentials (JSON key file)
- `bundletool` installed locally

## Getting Service Account Credentials:

1. Go to Google Play Console > Settings > API access
2. Click "Create service account"
3. Select "Google Cloud Console"
4. In Google Cloud Console:
   - Create a new service account (e.g., "play-console-upload")
   - Grant role: "Service Account User"
   - Create and download a JSON key file
5. Upload the JSON key to your local machine
6. Back in Play Console > Settings > API access, grant the service account access to your app

## Install bundletool:

```bash
wget https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar -O bundletool.jar
chmod +x bundletool.jar
```

## Upload via bundletool:

```bash
java -jar bundletool.jar upload-bundle \
  --bundle=android-twa/app/build/outputs/bundle/release/app-release.aab \
  --service-account-json=path/to/service-account-key.json \
  --package-name=com.weeklydairy.app
```

## Upload via Play Console UI (easiest):

1. Go to Play Console > Your App > Release > Production
2. Click "Create new release"
3. Click "Upload" in the "App bundles and APKs" section
4. Select and upload: `android-twa/app/build/outputs/bundle/release/app-release.aab`
5. Review app changes, add release notes
6. Set rollout: 100% (full rollout) or lower % for staged rollout
7. Review and publish

## Troubleshooting:

- If upload fails with "Signature issue", regenerate signing key or check cert fingerprint matches assetlinks.json
- If "Package name mismatch", verify `build.gradle` applicationId = `com.weeklydairy.app`
- If assetlinks not found, ensure it's hosted at `https://yourdomain/.well-known/assetlinks.json` with correct cert fingerprint
