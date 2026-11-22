# nusta Arena Planner: desktop app

The whole planner is one file: `../esports-arena-planner.html`. This folder wraps it as a Windows app.

## Make a change
1. Edit `../esports-arena-planner.html` (or ask Claude to).
2. Raise `"version"` in `package.json` (for example 1.0.0 → 1.0.1).
3. Build a new installer:
   - On Windows: `npm install`, then `npm run dist`
   - On Linux/macOS (no Wine needed): `npm install`, then `npm run dist:linux`
4. The installer appears in `dist/nusta-Arena-Planner-Setup-<version>.exe`. Run it over the old one: it updates in place and keeps your saved work.

`npm start` opens the app without installing, for a quick check.

## What's inside
- `main.js`: the window, the save-file dialog and the menu
- `scripts/build-app.js`: copies the planner into `app/` and bundles three.js and the fonts so it works offline
- `scripts/after-pack.js`: puts the nusta icon and version on the .exe
- `build/installer.nsi`: the installer (per-user, no admin rights, desktop and Start menu shortcuts, uninstaller)
- `build/icon.ico`, `build/icon.png`: app icon. Logos are in `../brand/`.
