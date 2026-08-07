# Play Store Screenshots Template

## Guidelines:

- Format: PNG or JPG
- Dimensions: 1080x1920 (portrait) for phone screenshots
- Max file size: 8 MB per file
- Need: 2–8 screenshots per app
- Recommended: 4-5 varied screenshots showing key features

## Sample screenshots (instructions to capture manually):

1. **Home Screen** (1080x1920)
   - Show the main weeks grid
   - Display the stats (Total Weeks, Weeks Passed, Weeks Remaining)
   - Capture the app header with title and tagline

2. **Week Detail / Highlight** (1080x1920)
   - Show a week tile with a highlight/note added
   - Display text entry or editing interface
   - Show the "Add highlight" or "Add note" UI

3. **Secure Folder** (1080x1920)
   - Show the folder unlock/access interface
   - Display secure entries or empty state
   - Highlight privacy features

4. **Export/Import** (1080x1920)
   - Show the data export/import buttons
   - Display the data preservation alert
   - Emphasize data portability

5. **Dark Theme** (1080x1920) (optional)
   - Repeat any of the above in dark mode
   - Show theme toggle button

## How to capture on Android emulator or device:

```bash
# Connect device or start emulator
adb devices

# Take a screenshot
adb shell screencap -p /sdcard/screenshot.png

# Pull to local
adb pull /sdcard/screenshot.png ./screenshot_1.png

# Resize/crop if needed (optional)
convert screenshot_1.png -resize 1080x1920 screenshot_1_resized.png
```

## Upload in Play Console:

1. Go to Play Console > Your App > Manage > Store listing
2. Scroll to "Phone screenshots"
3. Click "Add screenshots"
4. Upload 4-5 screenshots in order (1st appears first in store listing)
5. Save and review

## Text overlay (optional):

Use GIMP or ImageMagick to add captions:

```bash
convert screenshot_1.png \
  -pointsize 60 -fill white \
  -gravity north -annotate +0+50 "Track Your Life in Weeks" \
  screenshot_1_captioned.png
```
