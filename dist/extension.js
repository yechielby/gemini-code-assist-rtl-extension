"use strict";var et=Object.create;var T=Object.defineProperty;var nt=Object.getOwnPropertyDescriptor;var ot=Object.getOwnPropertyNames;var it=Object.getPrototypeOf,rt=Object.prototype.hasOwnProperty;var st=(t,e)=>{for(var n in e)T(t,n,{get:e[n],enumerable:!0})},J=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of ot(e))!rt.call(t,r)&&r!==n&&T(t,r,{get:()=>e[r],enumerable:!(i=nt(e,r))||i.enumerable});return t};var g=(t,e,n)=>(n=t!=null?et(it(t)):{},J(e||!t||!t.__esModule?T(n,"default",{value:t,enumerable:!0}):n,t)),at=t=>J(T({},"__esModule",{value:!0}),t);var ht={};st(ht,{activate:()=>gt,deactivate:()=>vt});module.exports=at(ht);var l=g(require("vscode"));var B=g(require("os")),y=g(require("path")),m=g(require("fs/promises")),W=g(require("vscode"));function ct(){let t=W.env.appName.toLowerCase();return t.includes("antigravity")?"antigravity":t.includes("cursor")?"cursor":"vscode"}async function lt(){try{return(await m.readFile("/proc/version","utf-8")).toLowerCase().includes("microsoft")}catch{return!1}}async function dt(){let t=[],e=new Set(["public","default","default user","all users"]);for(let n of["c","d"]){let i=`/mnt/${n}/Users`;try{let r=await m.readdir(i);for(let a of r){if(e.has(a.toLowerCase()))continue;let o=y.join(i,a);try{(await m.stat(o)).isDirectory()&&t.push(o)}catch{}}}catch{}}return t}async function ut(){let t=[],e=new Set(["root"]);for(let n of["\\\\wsl$","\\\\wsl.localhost"]){let i;try{i=await m.readdir(n)}catch{continue}for(let r of i){let a=y.join(n,r,"home");try{let o=await m.readdir(a);for(let s of o){if(e.has(s))continue;let c=y.join(a,s);try{(await m.stat(c)).isDirectory()&&t.push(c)}catch{}}}catch{}}}return t}async function mt(t){let e=process.platform,n=[],i={vscode:{local:".vscode",server:".vscode-server"},cursor:{local:".cursor",server:".cursor-server"},antigravity:{local:".antigravity",server:".antigravity-server"}},r=(a,o)=>{let{local:s,server:c}=i[o];n.push(y.join(a,s,"extensions")),n.push(y.join(a,c,"extensions"))};if(e==="win32"){let a=process.env.USERPROFILE;a&&r(a,t);let o=await ut();for(let s of o){let c=i[t].server;n.push(y.join(s,c,"extensions"))}}else if(e==="darwin")r(B.homedir(),t);else if(e==="linux"){let a=B.homedir();r(a,t);try{let o=await m.readdir("/home");for(let s of o){let c=y.join("/home",s);if(c!==a)try{(await m.stat(c)).isDirectory()&&r(c,t)}catch{}}}catch{}if(await lt()){let o=await dt();for(let s of o)r(s,t)}}return n}async function A(t){try{return await m.access(t),!0}catch{return!1}}async function b(){let t=ct(),e=await mt(t),n=[];for(let i of e){if(!await A(i))continue;let r;try{r=await m.readdir(i)}catch{continue}let a=r.filter(s=>s.startsWith("google.geminicodeassist-")).sort((s,c)=>{let d=s.replace("google.geminicodeassist-","").split(".").map(Number),v=c.replace("google.geminicodeassist-","").split(".").map(Number);for(let R=0;R<Math.max(d.length,v.length);R++){let F=d[R]||0,M=v[R]||0;if(F!==M)return F-M}return 0}),o=a.length>0?a[a.length-1]:null;if(o){let s=y.join(i,o),c=y.join(s,"webview","styles.css"),d=y.join(s,"webview","app_bundle.js");await A(c)&&n.push({dir:s,cssPath:c,jsPath:await A(d)?d:null,name:o})}}return n}var u=g(require("fs/promises"));var h="/* RTL Text Support for Gemini Code Assist - Added by script */",C="/* End RTL Text Support for Gemini Code Assist */",x="/* RTL Toggle Button - Added by script */",E="/* End RTL Toggle Button */",K=`
${h}
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

/* ==========================================
   Per-code-block RTL toggle button
   ========================================== */

.yby-rtl-code-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: var(--vscode-foreground, #ccc);
    font-size: 14px;
    font-weight: bold;
    font-family: var(--vscode-font-family, monospace);
    padding: 0;
    margin: 0 0 0 8px !important;
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

${C}
`,H=`
${x}
(function() {
    var BTN_ID = 'yby-rtl-btn';
    var ACTIVE_CLS = 'yby-rtl-active';
    var RTL_CLS = 'yby-rtl-text';
    var RTL_RE = /[\\u0590-\\u05FF\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/;

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
            injectCodeBtns(document.body);
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
                        injectCodeBtns(nd);
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
})();
${E}
`;async function S(t){try{return await u.access(t),!0}catch{return!1}}async function ft(t){try{return(await u.readFile(t,"utf-8")).includes(h)}catch{return!1}}async function U(t){if(!t)return!1;try{return(await u.readFile(t,"utf-8")).includes(x)}catch{return!1}}function z(t,e,n){let i=t.indexOf(e),r=t.indexOf(n);if(i===-1||r===-1)return t;let a=i,o=r+n.length;return a>0&&t[a-1]===`
`&&(a-=1),t.substring(0,a)+t.substring(o)}function yt(t,e,n){let i=t;for(;i.includes(e)&&i.includes(n);){let r=z(i,e,n);if(r===i)break;i=r}return i}async function V(t,e,n,i,r,a){try{let o=t+".bak";await S(o)?(await u.copyFile(o,t),a.push(`  ${r}: Restored from backup`)):(await u.copyFile(t,o),a.push(`  ${r}: Backup created: ${o}`));let s=await u.readFile(t,"utf-8");return s=yt(s,n,i),await u.writeFile(t,s+`
`+e,"utf-8"),!0}catch(o){let s=o;return s.code==="EPERM"||s.code==="EACCES"?(a.push(`  ${r}: Permission denied: ${t}`),a.push("       Try running with elevated privileges")):a.push(`  ${r}: Error: ${s.message}`),!1}}async function pt(t,e,n){let i=t+".bak";if(!await S(i))return!1;try{return await u.copyFile(i,t),await u.unlink(i),n.push(`  ${e}: Restored from backup (backup deleted)`),!0}catch(r){return n.push(`  ${e}: Error restoring: ${r.message}`),!1}}async function k(t){let e=[];for(let n of t){let i="";try{i=await u.readFile(n.cssPath,"utf-8")}catch{}let r=i.includes(h);e.push({extension:n,cssInstalled:r,jsInstalled:await U(n.jsPath),cssBackupExists:await S(n.cssPath+".bak"),jsBackupExists:n.jsPath?await S(n.jsPath+".bak"):!1})}return e}async function j(t){let e=[],n=!1;return await V(t.cssPath,K,h,C,"CSS",e)&&(e.push(`  CSS: RTL support added to ${t.name}`),n=!0),t.jsPath?await V(t.jsPath,H,x,E,"JS",e)&&(e.push(`  JS:  Toggle button added to ${t.name}`),n=!0):e.push("  JS:  app_bundle.js not found, skipping button injection"),{messages:e,changed:n}}async function q(t,e,n,i,r,a,o){if(!e)return o.push(`  ${r}: RTL not installed in ${a}`),!1;if(await pt(t,r,o))return!0;try{let s=await u.readFile(t,"utf-8"),c=z(s,n,i);return await u.writeFile(t,c,"utf-8"),o.push(`  ${r}: RTL removed from ${a}`),!0}catch(s){return o.push(`  ${r}: Error removing RTL: ${s.message}`),!1}}async function X(t){let e=[],n=!1;await q(t.cssPath,await ft(t.cssPath),h,C,"CSS",t.name,e)&&(n=!0);let i=t.jsPath?await U(t.jsPath):!1;return!t.jsPath||!i?e.push(`  JS:  Button not installed in ${t.name}`):await q(t.jsPath,i,x,E,"JS",t.name,e)&&(n=!0),{messages:e,changed:n}}var I=g(require("vscode"));var f,Y="inactive";function Q(){return f=I.window.createStatusBarItem(I.StatusBarAlignment.Left,98),f.command="gemini-rtl.toggle",f.show(),f}async function _(t){if(!f)return;if(t!==void 0&&(Y=t),(await b()).length===0){f.text="$(globe) Gemini RTL: N/A",f.tooltip="Gemini Code Assist is not installed or found";return}Y==="active"?(f.text="$(globe) Gemini RTL: On",f.tooltip="Gemini Code Assist RTL is active. Click to toggle."):(f.text="$(globe) Gemini RTL: Off",f.tooltip="Gemini Code Assist RTL is inactive. Click to toggle.")}function Z(){f?.dispose()}var $="geminiRtl.mode",tt="geminiRtl.version",L,w,O;function p(t){L||(L=l.window.createOutputChannel("Gemini RTL Support")),L.appendLine(t)}function G(){return w.get($,"inactive")}async function N(t){await w.update($,t)}async function P(){await w.update(tt,O)}async function D(){let t=await b();if(t.length===0)return!1;let e=!1;for(let n of t)(await j(n)).changed&&(e=!0);return e}async function bt(){let t=w.get(tt),e=G(),n=w.get($)!==void 0;if(!t){if(n&&e==="inactive"){await P();return}await N("active"),await P(),await D()&&l.commands.executeCommand("workbench.action.reloadWindow");return}if(t!==O){if(await P(),e==="inactive")return;await D()&&l.commands.executeCommand("workbench.action.reloadWindow");return}if(e==="inactive")return;let i=await b();i.length===0||!(await k(i)).some(o=>!o.cssInstalled)||await D()&&l.commands.executeCommand("workbench.action.reloadWindow")}function gt(t){w=t.globalState,O=t.extension.packageJSON.version??"0.0.0";let e=Q();t.subscriptions.push(e);let n=l.commands.registerCommand("gemini-rtl.add",async()=>{p(`
--- Activating Gemini RTL ---`);let o=await b();if(o.length===0){l.window.showErrorMessage("No Gemini Code Assist installations found.");return}let s=!1;for(let c of o){p(`Found Gemini: ${c.name}`);let d=await j(c);d.messages.forEach(v=>p(v)),d.changed&&(s=!0)}await N("active"),await _("active"),s?await l.window.showInformationMessage("Gemini RTL activated! Please reload the window to see changes.","Reload Window")==="Reload Window"&&l.commands.executeCommand("workbench.action.reloadWindow"):l.window.showInformationMessage("Gemini RTL is already active or could not be applied. Check output channel for details.")}),i=l.commands.registerCommand("gemini-rtl.remove",async()=>{p(`
--- Deactivating Gemini RTL ---`);let o=await b();if(o.length===0){l.window.showErrorMessage("No Gemini Code Assist installations found.");return}let s=!1;for(let c of o){p(`Found Gemini: ${c.name}`);let d=await X(c);d.messages.forEach(v=>p(v)),d.changed&&(s=!0)}await N("inactive"),await _("inactive"),s?await l.window.showInformationMessage("Gemini RTL deactivated! Please reload the window to see changes.","Reload Window")==="Reload Window"&&l.commands.executeCommand("workbench.action.reloadWindow"):l.window.showInformationMessage("Gemini RTL was not active or could not be removed. Check output channel for details.")}),r=l.commands.registerCommand("gemini-rtl.toggle",async()=>{let o=await b();if(o.length===0)return;(await k(o)).some(d=>d.cssInstalled||d.jsInstalled)?await l.window.showInformationMessage("Gemini Code Assist RTL is active. Do you want to turn it off?","Turn Off","Cancel")==="Turn Off"&&await l.commands.executeCommand("gemini-rtl.remove"):await l.window.showInformationMessage("Gemini Code Assist RTL is inactive. Do you want to turn it on?","Turn On","Cancel")==="Turn On"&&await l.commands.executeCommand("gemini-rtl.add")}),a=l.commands.registerCommand("gemini-rtl.status",async()=>{p(`
--- Checking Gemini RTL Status ---`);let o=await b();if(o.length===0){l.window.showInformationMessage("No Gemini Code Assist installations found.");return}let s=await k(o);p(`Saved mode: ${G()}`);for(let c of s)p(`Extension: ${c.extension.name}`),p(`  CSS injected: ${c.cssInstalled}`),p(`  JS injected: ${c.jsInstalled}`);L.show()});t.subscriptions.push(n,i,r,a),bt().catch(o=>console.error("Gemini RTL auto-reactivation failed:",o)),_(G()).catch(o=>console.error("Gemini RTL status bar update failed:",o))}function vt(){Z(),L?.dispose()}0&&(module.exports={activate,deactivate});
