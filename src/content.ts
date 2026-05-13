export const RTL_START_MARKER = '/* RTL Text Support for Gemini Code Assist - Added by script */';
export const RTL_END_MARKER = '/* End RTL Text Support for Gemini Code Assist */';

export const JS_START_MARKER = '/* RTL Toggle Button - Added by script */';
export const JS_END_MARKER = '/* End RTL Toggle Button */';

export const RTL_CSS_RULES = `
${RTL_START_MARKER}
/* ==========================================
   Toggle button - floating, fixed in webview
   ========================================== */

#yby-rtl-btn {
    position: fixed !important;
    top: 6px !important;
    right: 8px !important;
    z-index: 99999 !important;
    font-size: 16px !important;
    font-weight: bold !important;
    width: 26px !important;
    height: 26px !important;
    border: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.4)) !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    background-color: var(--vscode-editor-background, #1e1e1e) !important;
    color: var(--vscode-foreground, #ccc) !important;
    opacity: 0.75;
    transition: opacity 0.2s, background-color 0.2s;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-decoration: none !important;
    line-height: 1 !important;
    font-family: var(--vscode-font-family, monospace) !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
}

#yby-rtl-btn:hover {
    opacity: 1 !important;
    background-color: var(--vscode-toolbar-hoverBackground, rgba(128,128,128,0.2)) !important;
}

#yby-rtl-btn.yby-active {
    opacity: 1 !important;
    background-color: var(--vscode-button-background, #0e639c) !important;
    color: var(--vscode-button-foreground, #fff) !important;
    border-color: var(--vscode-button-background, #0e639c) !important;
}

/* ==========================================
   RTL - language aware (only marked elements)
   ========================================== */

body.yby-rtl-active .yby-rtl-text {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: plaintext !important;
}

/* LTR overrides for code blocks */
body.yby-rtl-active .yby-rtl-text pre,
body.yby-rtl-active .yby-rtl-text code,
body.yby-rtl-active .yby-rtl-text [class*="code-block"],
body.yby-rtl-active .yby-rtl-text [class*="codeBlock"],
body.yby-rtl-active .yby-rtl-text .codeblock-container {
    direction: ltr !important;
    unicode-bidi: isolate !important;
    text-align: left !important;
}

/* Markdown lists alignment */
body.yby-rtl-active ul.yby-rtl-text,
body.yby-rtl-active ol.yby-rtl-text {
    padding-inline-start: 2em !important;
    padding-inline-end: 0 !important;
}

/* Input box - auto-detect direction */
body.yby-rtl-active .chat-input,
body.yby-rtl-active .input-box,
body.yby-rtl-active .chat-submit-input {
    unicode-bidi: plaintext;
    text-align: start;
}

/* Input box - RTL when marked */
body.yby-rtl-active .input-box.input-box-new {
    direction: rtl;
}
body.yby-rtl-active .input-box:has(.chat-submit-input.yby-rtl-text) .chat-submit-input {
    padding: 6px 8px 9px 0;
}
body.yby-rtl-active .input-box:has(.chat-submit-input.yby-rtl-text) .input-placeholder.is-empty:before {
    display: block;
}
body.yby-rtl-active .input-box:has(.chat-submit-input.yby-rtl-text) .button-container {
    margin: 0 0 0 6px;
}
body.yby-rtl-active .input-box:has(.chat-submit-input.yby-rtl-text) mat-icon.mat-icon.notranslate.google-symbols-filled.google-symbols.mat-icon-no-color {
    transform: scale(-1);
}
 /* Edit input box - RTL when marked */
body.yby-rtl-active .edit-input-container .input-box:has(.edit-chat-input.yby-rtl-text) {
    direction: rtl;
}

/* History item header - RTL when marked */
body.yby-rtl-active .history-item-content:has(.yby-rtl-text) .history-item-header .history-item-header {
    direction: rtl;
}
body.yby-rtl-active .history-item-content:has(.yby-rtl-text) .history-item-header .history-item-header .profile-info .user-actions {
    direction: ltr;
    margin-right: auto;
    margin-left: unset;
}
body.yby-rtl-active .history-item-content:has(.yby-rtl-text) .history-item-header .history-item-header .profile-info h1,
body.yby-rtl-active .history-item-content:has(.yby-rtl-text) .history-item-header .history-item-header .profile-info .model-info {
    margin: 0 8px 0 0;
}
body.yby-rtl-active .history-item-content:has(.yby-rtl-text) .system-message-footer {
    direction: rtl;
}

/* Diff preview - always LTR */
body.yby-rtl-active .diff-preview,
body.yby-rtl-active .diff-preview-body,
body.yby-rtl-active .diff-preview-header,
body.yby-rtl-active .diff-preview-item {
    direction: ltr !important;
    text-align: left !important;
}

/* Dialog text - RTL when marked */
body.yby-rtl-active .dialog-text.yby-rtl-text,
body.yby-rtl-active .mat-mdc-dialog-content .yby-rtl-text {
    direction: rtl !important;
    text-align: right !important;
}

${RTL_END_MARKER}
`;

export const RTL_JS_CODE = `
${JS_START_MARKER}
(function() {
    var BTN_ID = 'yby-rtl-btn';
    var ACTIVE_CLS = 'yby-rtl-active';
    var RTL_CLS = 'yby-rtl-text';
    var RTL_RE = /[\\u0590-\\u05FF\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/;

    /* Text selectors - targets chat messages, thinking blocks, and message text wrappers */
    var CONTAINERS = [
        '.history-item-text',
        '.app-message-text',
        '.app-message-text-wrapper',
        '.history-item-thinking-summary .thinking-body'
    ];
    var ELEMENTS = 'p, li, a, h1, h2, h3, h4, h5, h6, blockquote, td, th';

    /* Build combined selector: each container > each element type */
    var parts = [];
    for (var c = 0; c < CONTAINERS.length; c++) {
        var els = ELEMENTS.split(', ');
        for (var e = 0; e < els.length; e++) {
            parts.push(CONTAINERS[c] + ' ' + els[e]);
        }
    }
    var TEXT_SEL = parts.join(', ');

    /* Dialog text selectors */
    var DIALOG_SEL = '.dialog-text, .mat-mdc-dialog-content p, .mat-mdc-dialog-content li';

    var ALL_SEL = TEXT_SEL + ', ' + DIALOG_SEL;

    function shouldIgnore(el) {
        return !!(el && el.closest && el.closest('pre, code, .codeblock-container, [class*="code-block"], [class*="codeBlock"]'));
    }

    function scanElement(el) {
        if (!el || !el.matches) return;
        if (shouldIgnore(el)) {
            el.classList.remove(RTL_CLS);
            return;
        }

        var txt = (el.textContent || '').trim();
        if (txt && RTL_RE.test(txt)) {
            el.classList.add(RTL_CLS);
        } else {
            el.classList.remove(RTL_CLS);
        }
    }

    function scanRoot(root) {
        if (!root || root.nodeType !== 1) return;
        scanElement(root);
        if (root.querySelectorAll) {
            root.querySelectorAll(ALL_SEL).forEach(scanElement);
        }
    }

    function applyPerLanguageClasses(isActive) {
        var nodes = document.querySelectorAll(ALL_SEL);

        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if (shouldIgnore(el)) continue;

            if (isActive) {
                var txt = (el.textContent || '').trim();
                if (!txt) continue;

                if (RTL_RE.test(txt)) {
                    el.classList.add(RTL_CLS);
                } else {
                    el.classList.remove(RTL_CLS);
                }
            } else {
                el.classList.remove(RTL_CLS);
            }
        }
    }

    var debounceTimer = null;
    function scheduleUpdate() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
            if (document.body.classList.contains(ACTIVE_CLS)) {
                applyPerLanguageClasses(true);
            }
        }, 100);
    }

    function startObserver() {
        if (!document.body) return;

        var obs = new MutationObserver(function(muts) {
            for (var i = 0; i < muts.length; i++) {
                var m = muts[i];

                if (m.type === 'characterData' && m.target && m.target.parentElement) {
                    scanElement(m.target.parentElement);
                    continue;
                }

                for (var j = 0; j < m.addedNodes.length; j++) {
                    var nd = m.addedNodes[j];
                    if (nd.nodeType === 1) {
                        scanRoot(nd);
                        scheduleUpdate();
                    }
                }
            }
        });

        obs.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function mkBtn() {
        var btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.textContent = '\\u21C4';
        btn.title = 'Toggle RTL mode';
        btn.setAttribute('aria-label', 'Toggle RTL mode');
        btn.setAttribute('type', 'button');

        // Load state from localStorage
        var isRtl = localStorage.getItem('yby-gemini-rtl') === 'true';
        if (isRtl) {
            document.body.classList.add(ACTIVE_CLS);
            btn.classList.add('yby-active');
        }

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var isActive = document.body.classList.toggle(ACTIVE_CLS);
            btn.classList.toggle('yby-active', isActive);
            localStorage.setItem('yby-gemini-rtl', isActive ? 'true' : 'false');
            applyPerLanguageClasses(isActive);
        });

        return btn;
    }

    function tryInsertButton() {
        if (document.getElementById(BTN_ID)) return;
        if (!document.body) return;

        var btn = mkBtn();
        document.body.appendChild(btn);
    }

    if (document.readyState !== 'loading') {
        tryInsertButton();
        applyPerLanguageClasses(document.body.classList.contains(ACTIVE_CLS));
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            tryInsertButton();
            applyPerLanguageClasses(document.body.classList.contains(ACTIVE_CLS));
            startObserver();
        });
    }
})();
${JS_END_MARKER}
`;
