# Gemini Code Assist RTL Extension

## Project Overview
A VSCode extension that adds RTL (Right-to-Left) support to Gemini Code Assist chat. It injects CSS and JS into the Gemini extension's webview files to enable auto-detection of Hebrew/Arabic/Persian text and a toggle button for RTL mode.

## Tech Stack
- **Language:** TypeScript (strict mode)
- **Build:** esbuild (see `esbuild.mjs`), bundled as CJS to `dist/extension.js`
- **Target:** VSCode extension API ^1.94.0, ES2022
- **Module system:** Node16
- **No test framework** currently configured

## Project Structure
```
src/
  extension.ts   - Entry point: activation, commands, auto-reactivation logic
  finder.ts      - Finds installed Gemini Code Assist extension directories (cross-platform, WSL-aware)
  injector.ts    - Injects/removes RTL CSS+JS into Gemini's webview files, manages backups
  content.ts     - CSS rules and JS code that get injected into Gemini's webview
  statusBar.ts   - Status bar item management
  types.ts       - Shared interfaces (GeminiExtensionInfo, RtlStatus)
```

## Key Commands
- `npm run build` - Production build
- `npm run watch` - Watch mode for development
- `npm run package` - Package as .vsix

## Architecture Notes
- The extension works by **injecting CSS/JS directly into Gemini's webview files** (`webview/styles.css` and `webview/app_bundle.js`) on disk
- Backup files (`.bak`) are created before injection and used for restoration
- Auto-reactivation on startup: re-injects if Gemini updated or overwrote files
- State persisted via `globalState` (mode: active/inactive, version tracking)
- Supports VSCode, Cursor, and Antigravity IDEs
- The injected JS uses a MutationObserver to detect RTL text in chat bubbles and applies per-element RTL classes
- RTL detection regex covers Hebrew, Arabic, and Persian Unicode ranges

## VSCode Extension Commands
- `gemini-rtl.add` - Activate RTL
- `gemini-rtl.remove` - Deactivate RTL
- `gemini-rtl.toggle` - Toggle (used by status bar click)
- `gemini-rtl.status` - Check injection status

## Conventions
- Marker-based injection: CSS uses `RTL_START_MARKER`/`RTL_END_MARKER`, JS uses `JS_START_MARKER`/`JS_END_MARKER`
- All injected UI elements use the `yby-` prefix (e.g., `yby-rtl-btn`, `yby-rtl-active`, `yby-rtl-text`)
- CSS uses VSCode CSS variables for theming (e.g., `--vscode-editor-background`)
