# Hosting assetlinks.json on Netlify

## File placement:

```
dist/
  ├── .well-known/
  │   └── assetlinks.json
  ├── netlify.toml (with headers for .well-known/assetlinks.json)
  └── (other site files)
```

## Steps:

1. Copy `assetlinks.json` to your deployed site:

   ```bash
   mkdir -p dist/.well-known
   cp android-twa/assetlinks.json dist/.well-known/assetlinks.json
   ```

2. Ensure `dist/netlify.toml` includes headers for assetlinks (already done in this project).

3. Redeploy to Netlify:

   ```bash
   npm run build
   git add dist/
   git commit -m "Add assetlinks.json for Android TWA verification"
   git push
   # Netlify auto-deploys on push, or manually trigger a deploy in Netlify dashboard
   ```

4. Verify assetlinks.json is accessible:

   ```bash
   curl -I https://weeklylifetrackerdairy.netlify.app/.well-known/assetlinks.json
   # Should return 200 with Content-Type: application/json

   curl https://weeklylifetrackerdairy.netlify.app/.well-known/assetlinks.json | jq .
   # Should show the JSON array with your cert fingerprint
   ```

## Troubleshooting:

- If 404 on `.well-known/assetlinks.json`, verify the file exists in `dist/.well-known/` before deploy.
- If CORS issues, check `netlify.toml` headers match above config.
- Android apps should be able to fetch assetlinks and verify the fingerprint matches the app's signing cert.
