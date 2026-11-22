#!/usr/bin/env bash
# Builds dist/nusta-Arena-Planner-Setup-<version>.exe on Linux or macOS without Wine.
# (On Windows, `npm run dist` works directly.)
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=$(node -p "require('./package.json').version")
npm run prepare-app
rm -rf dist/win-unpacked
npx electron-builder --win dir --x64
NSIS="$HOME/.cache/electron-builder/nsis/nsis-3.0.4.1"
chmod +x "$NSIS/linux/makensis"
NSISDIR="$NSIS" "$NSIS/linux/makensis" -V2 -DVERSION="$VERSION" build/installer.nsi
ls -lh dist/*.exe
