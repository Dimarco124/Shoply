# Fonts Documentation - Shoply

This project uses the **Inter** font family, which is localized for improved performance, privacy, and offline support.

## Fonts Used
- **Family**: Inter
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Format**: WOFF2 (Web Open Font Format 2.0)
- **Source**: [Fontsource / Google Fonts](https://fontsource.org/fonts/inter)

## Implementation Details
The font files are stored in `frontend/public/fonts/`.
The `@font-face` declarations are defined in `frontend/styles/index.css`.
The Google Fonts `@import` was removed from `frontend/src/App.css` to prevent external dependencies.

## Local Files
- `inter-300.woff2`
- `inter-400.woff2`
- `inter-500.woff2`
- `inter-600.woff2`
- `inter-700.woff2`
