# PGG Post-Experiment Survey

A small, installable web app (PWA) for collecting the **post-experiment
questionnaire** from participants in the public goods game (PGG) field experiment.
It uses a deep slate-teal background (instead of the black game apps) so a
facilitator can never confuse it with the Field or Moderator app on a device.

Part of the field-experiment toolkit:

| App | Folder | Role |
|-----|--------|------|
| Field App | `field-app/` | Per-group contribution recording |
| Moderator App | `moderator-app/` | Session-level console |
| **Survey App** | `survey-app/` | Post-experiment questionnaire (this app) |

## What it does

- Steps a participant through the questionnaire one screen at a time, with a
  progress bar.
- Keeps inputs editable while the rest of the UI stays tap-only.
- Stores responses **on the device** in the browser's `localStorage`, so it works
  fully offline and survives reloads.
- Exports collected responses to CSV for the data hand-off.

## Files

```
survey-app/
├── questionnaire_app.html  # the app (all HTML/CSS/JS inline, no build step)
├── manifest.json           # PWA metadata (name, colours, icons)
├── sw.js                   # service worker — offline cache
├── icon-192.png            # home-screen icon (192×192)
├── icon-512.png            # home-screen icon / splash (512×512)
└── README.md
```

## Run it locally

A service worker only runs over `http(s)://`, **not** `file://`, so serve the folder:

```bash
cd survey-app
python3 -m http.server 8000
# then visit http://localhost:8000/questionnaire_app.html
```

## Deploy on GitHub Pages

1. Push the repository to GitHub.
2. **Settings → Pages →** deploy from your default branch.
3. The app entry point is:

   ```
   https://<user>.github.io/<repo>/survey-app/questionnaire_app.html
   ```

> **Tip:** the entry file is `questionnaire_app.html`, not `index.html`, so the bare
> folder URL won't open it. Either bookmark the full URL, or rename
> `questionnaire_app.html` to `index.html` (and update the same name in
> `manifest.json` → `start_url` and in `sw.js` → `APP_SHELL` / navigation fallback)
> so the folder URL works directly. Once **installed**, the home-screen icon already
> opens the right page.

## Install on a phone ("package as an app")

1. Open the entry URL in **Chrome (Android)** or **Safari (iOS)**.
2. Android: menu **⋮ → Add to Home screen / Install app**.
   iOS: **Share → Add to Home Screen**.
3. It launches full-screen with its own icon and works offline.

## Updating the app

When you change `questionnaire_app.html` (or any cached file), bump the version in
`sw.js`:

```js
const CACHE_VERSION = 'pgg-survey-v1';  // -> 'pgg-survey-v2'
```

## Notes & limitations

- HTTPS (or `localhost`) is required for the service worker and "Install" prompt.
- Responses live in `localStorage` on each device — export to CSV before clearing
  site data or removing the installed app. Collect CSVs per device.
- Designed for portrait phone screens.
