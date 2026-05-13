# Per-Code-Block RTL Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a ⇄ button inside each code block's `action-buttons` that toggles RTL direction on that specific code block.

**Architecture:** Single file change to `src/content.ts`. Add CSS rules (button visibility, active state, per-block RTL override) and JS logic (button creation, injection into `div.action-buttons`, click handler using `closest('pre')`, extend existing MutationObserver).

**Tech Stack:** TypeScript (build-time string), vanilla JS + CSS (runtime injection into Gemini webview)

---

### Task 1: Add CSS rules for the per-code-block RTL button

**Files:**
- Modify: `src/content.ts:7-143` (inside `RTL_CSS_RULES` template literal)

- [ ] **Step 1: Add CSS rules before the closing marker**

Insert the following CSS block in `src/content.ts` **before** line 142 (`${RTL_END_MARKER}`), after the dialog text rules (line 140):

```css

/* ==========================================
   Per-code-block RTL toggle button
   ========================================== */

.yby-rtl-code-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: var(--vscode-foreground, #ccc);
    font-size: 14px;
    font-weight: bold;
    font-family: var(--vscode-font-family, monospace);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    opacity: 0.75;
    transition: opacity 0.2s, background-color 0.2s;
}

.yby-rtl-code-btn:hover {
    opacity: 1;
    background-color: var(--vscode-toolbar-hoverBackground, rgba(128,128,128,0.2));
}

body.yby-rtl-active .yby-rtl-code-btn {
    display: inline-flex;
}

.yby-rtl-code-btn.yby-active {
    opacity: 1;
    background-color: var(--vscode-button-background, #0e639c) !important;
    color: var(--vscode-button-foreground, #fff) !important;
}

/* Per-code-block RTL override */
body.yby-rtl-active pre.yby-rtl-pre code {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: plaintext !important;
}
```

- [ ] **Step 2: Build and verify CSS output**

Run:
```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/content.ts
git commit -m "feat: add CSS rules for per-code-block RTL toggle button"
```

---

### Task 2: Add JS logic for button creation and injection

**Files:**
- Modify: `src/content.ts:145-313` (inside `RTL_JS_CODE` template literal)

- [ ] **Step 1: Add constants and helper functions**

In `src/content.ts`, inside the `RTL_JS_CODE` IIFE, add the following **after** line 151 (the `RTL_RE` declaration) and **before** line 153 (the `/* Text selectors */` comment):

```js

    var CODE_BTN_CLS = 'yby-rtl-code-btn';
    var CODE_RTL_CLS = 'yby-rtl-pre';
    var ACTION_BTN_SEL = 'div.action-buttons';

    function mkCodeBtn() {
        var btn = document.createElement('button');
        btn.className = CODE_BTN_CLS;
        btn.textContent = '\\u21C4';
        btn.title = 'Toggle RTL for this code block';
        btn.setAttribute('aria-label', 'Toggle RTL for this code block');
        btn.setAttribute('type', 'button');

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var pre = btn.closest('pre');
            if (!pre) return;
            var isActive = pre.classList.toggle(CODE_RTL_CLS);
            btn.classList.toggle('yby-active', isActive);
        });

        return btn;
    }

    function injectCodeBtns(root) {
        if (!root || !root.querySelectorAll) return;
        var containers = root.querySelectorAll(ACTION_BTN_SEL);
        for (var i = 0; i < containers.length; i++) {
            var container = containers[i];
            if (container.querySelector('.' + CODE_BTN_CLS)) continue;
            var copyBtn = container.querySelector('copy-button');
            if (!copyBtn) continue;
            var btn = mkCodeBtn();
            copyBtn.insertAdjacentElement('afterend', btn);
        }
    }
```

- [ ] **Step 2: Add initial scan call**

In the initialization block (around lines 300-310), add `injectCodeBtns(document.body);` after `applyPerLanguageClasses(...)` in both branches. The block should become:

```js
    if (document.readyState !== 'loading') {
        tryInsertButton();
        applyPerLanguageClasses(document.body.classList.contains(ACTIVE_CLS));
        injectCodeBtns(document.body);
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            tryInsertButton();
            applyPerLanguageClasses(document.body.classList.contains(ACTIVE_CLS));
            injectCodeBtns(document.body);
            startObserver();
        });
    }
```

- [ ] **Step 3: Extend MutationObserver to inject buttons into new nodes**

In the `startObserver` function, inside the loop over `m.addedNodes` (around line 250-253), add `injectCodeBtns(nd);` after `scanRoot(nd);`. The block should become:

```js
                for (var j = 0; j < m.addedNodes.length; j++) {
                    var nd = m.addedNodes[j];
                    if (nd.nodeType === 1) {
                        scanRoot(nd);
                        injectCodeBtns(nd);
                        scheduleUpdate();
                    }
                }
```

- [ ] **Step 4: Build and verify**

Run:
```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/content.ts
git commit -m "feat: add JS logic for per-code-block RTL toggle injection"
```

---

### Task 3: Manual integration test

**Files:** None (testing only)

- [ ] **Step 1: Build the extension**

```bash
node esbuild.mjs
```
Expected: Build completes without errors.

- [ ] **Step 2: Test in VS Code**

1. Run `Gemini RTL: Activate RTL` command
2. Reload VS Code
3. Open Gemini Code Assist chat
4. Ask Gemini a question that generates a code block
5. Click the global ⇄ button to enable RTL
6. Verify: a ⇄ button appears inside each code block's action bar, after the copy button
7. Click the per-code-block ⇄ button
8. Verify: the code inside that block switches to RTL direction
9. Click it again — verify it toggles back to LTR
10. Verify: other code blocks are unaffected
11. Turn off global RTL — verify per-code-block buttons disappear

- [ ] **Step 3: Final commit with version bump (if needed)**

```bash
git add -A
git commit -m "feat: per-code-block RTL toggle button"
```
