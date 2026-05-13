# Per-Code-Block RTL Toggle Button

**Date:** 2026-05-13
**Status:** Approved

## Summary

Add a per-code-block RTL toggle button (⇄) inside each `action-buttons` container in Gemini Code Assist's chat view. The button toggles `direction: rtl` on the `code` element within that specific `pre` block, allowing users to read RTL comments or text inside code blocks.

## Context

Currently, the extension enforces `direction: ltr` on all `pre` and `code` elements when RTL mode is active. This is correct for code, but sometimes code blocks contain Hebrew/Arabic comments or text that would benefit from RTL rendering. Users need a way to toggle RTL per code block without affecting other blocks.

## Design

### DOM Structure (Gemini's existing hierarchy)

```
pre
  └─ details.collapse-detail
       └─ summary.collapse-heading
            └─ action-buttons
                 └─ div.action-buttons
                      └─ copy-button (content_copy icon)
```

### Button Injection

- A `<button>` element with class `yby-rtl-code-btn` is inserted **after** the `copy-button` inside each `div.action-buttons`.
- The button text is `⇄` (U+21C4).
- Duplicate prevention: before injecting, check `div.querySelector('.yby-rtl-code-btn')`.

### Button Behavior

On click:
1. Find the parent `pre` via `btn.closest('pre')`.
2. Toggle class `yby-rtl-pre` on the `pre` element.
3. Toggle class `yby-active` on the button itself (visual feedback).

### CSS Rules

```css
/* Hide button when global RTL is off, show when on */
.yby-rtl-code-btn { display: none; }
body.yby-rtl-active .yby-rtl-code-btn { display: inline-flex; }

/* RTL override for specific code blocks */
body.yby-rtl-active pre.yby-rtl-pre code {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: plaintext !important;
}

/* Active state styling (matches global toggle) */
.yby-rtl-code-btn.yby-active {
    background-color: var(--vscode-button-background, #0e639c) !important;
    color: var(--vscode-button-foreground, #fff) !important;
    border-color: var(--vscode-button-background, #0e639c) !important;
}
```

### Injection Strategy

Follows the existing pattern in `content.ts`:

1. **Initial scan:** On load, find all `div.action-buttons` and inject the button.
2. **MutationObserver:** The existing observer is extended to detect new `div.action-buttons` nodes and inject the button into them.
3. **Always created:** Buttons are always injected into the DOM regardless of global RTL state. Visibility is controlled purely by CSS (`body.yby-rtl-active` scope).

### Visibility

- **Global RTL off:** Buttons exist in DOM but are hidden (`display: none`).
- **Global RTL on:** Buttons become visible (`display: inline-flex`).
- **Global RTL toggled off again:** Buttons hide again. The `yby-rtl-pre` class remains on any toggled `pre` elements but has no visual effect since the CSS rules require `body.yby-rtl-active`.

### Button Styling

The button should visually match Gemini's existing `action-buttons` style (same size, icon-button appearance). Styled to look native alongside `copy-button`, `terminal-button`, etc.

## Files to Modify

- **`src/content.ts`** — Add CSS rules for the new button and the `pre.yby-rtl-pre code` override. Add JS logic for injection, click handling, and observer extension.

No other files need changes. The injection/backup mechanism in `injector.ts` already handles the CSS and JS content from `content.ts`.

## Out of Scope

- Persisting per-code-block RTL state across reloads (state is ephemeral).
- Adding the button outside of Gemini's `action-buttons` container.
- Modifying Gemini's Angular components directly.
