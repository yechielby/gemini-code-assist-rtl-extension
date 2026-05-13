"use strict";var et=Object.create;var T=Object.defineProperty;var nt=Object.getOwnPropertyDescriptor;var ot=Object.getOwnPropertyNames;var it=Object.getPrototypeOf,st=Object.prototype.hasOwnProperty;var at=(t,e)=>{for(var n in e)T(t,n,{get:e[n],enumerable:!0})},J=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of ot(e))!st.call(t,s)&&s!==n&&T(t,s,{get:()=>e[s],enumerable:!(i=nt(e,s))||i.enumerable});return t};var h=(t,e,n)=>(n=t!=null?et(it(t)):{},J(e||!t||!t.__esModule?T(n,"default",{value:t,enumerable:!0}):n,t)),rt=t=>J(T({},"__esModule",{value:!0}),t);var bt={};at(bt,{activate:()=>ht,deactivate:()=>vt});module.exports=rt(bt);var l=h(require("vscode"));var j=h(require("os")),p=h(require("path")),m=h(require("fs/promises")),W=h(require("vscode"));function ct(){let t=W.env.appName.toLowerCase();return t.includes("antigravity")?"antigravity":t.includes("cursor")?"cursor":"vscode"}async function lt(){try{return(await m.readFile("/proc/version","utf-8")).toLowerCase().includes("microsoft")}catch{return!1}}async function dt(){let t=[],e=new Set(["public","default","default user","all users"]);for(let n of["c","d"]){let i=`/mnt/${n}/Users`;try{let s=await m.readdir(i);for(let r of s){if(e.has(r.toLowerCase()))continue;let o=p.join(i,r);try{(await m.stat(o)).isDirectory()&&t.push(o)}catch{}}}catch{}}return t}async function ut(){let t=[],e=new Set(["root"]);for(let n of["\\\\wsl$","\\\\wsl.localhost"]){let i;try{i=await m.readdir(n)}catch{continue}for(let s of i){let r=p.join(n,s,"home");try{let o=await m.readdir(r);for(let a of o){if(e.has(a))continue;let c=p.join(r,a);try{(await m.stat(c)).isDirectory()&&t.push(c)}catch{}}}catch{}}}return t}async function mt(t){let e=process.platform,n=[],i={vscode:{local:".vscode",server:".vscode-server"},cursor:{local:".cursor",server:".cursor-server"},antigravity:{local:".antigravity",server:".antigravity-server"}},s=(r,o)=>{let{local:a,server:c}=i[o];n.push(p.join(r,a,"extensions")),n.push(p.join(r,c,"extensions"))};if(e==="win32"){let r=process.env.USERPROFILE;r&&s(r,t);let o=await ut();for(let a of o){let c=i[t].server;n.push(p.join(a,c,"extensions"))}}else if(e==="darwin")s(j.homedir(),t);else if(e==="linux"){let r=j.homedir();s(r,t);try{let o=await m.readdir("/home");for(let a of o){let c=p.join("/home",a);if(c!==r)try{(await m.stat(c)).isDirectory()&&s(c,t)}catch{}}}catch{}if(await lt()){let o=await dt();for(let a of o)s(a,t)}}return n}async function _(t){try{return await m.access(t),!0}catch{return!1}}async function g(){let t=ct(),e=await mt(t),n=[];for(let i of e){if(!await _(i))continue;let s;try{s=await m.readdir(i)}catch{continue}let r=s.filter(a=>a.startsWith("google.geminicodeassist-")).sort((a,c)=>{let d=a.replace("google.geminicodeassist-","").split(".").map(Number),v=c.replace("google.geminicodeassist-","").split(".").map(Number);for(let R=0;R<Math.max(d.length,v.length);R++){let N=d[R]||0,O=v[R]||0;if(N!==O)return N-O}return 0}),o=r.length>0?r[r.length-1]:null;if(o){let a=p.join(i,o),c=p.join(a,"webview","styles.css"),d=p.join(a,"webview","app_bundle.js");await _(c)&&n.push({dir:a,cssPath:c,jsPath:await _(d)?d:null,name:o})}}return n}var u=h(require("fs/promises"));var b="/* RTL Text Support for Gemini Code Assist - Added by script */",E="/* End RTL Text Support for Gemini Code Assist */",x="/* RTL Toggle Button - Added by script */",S="/* End RTL Toggle Button */",K=`
${b}
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
.chat-input,
.input-box,
.chat-submit-input {
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

${E}
`,H=`
${x}
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
${S}
`;async function C(t){try{return await u.access(t),!0}catch{return!1}}async function ft(t){try{return(await u.readFile(t,"utf-8")).includes(b)}catch{return!1}}async function q(t){if(!t)return!1;try{return(await u.readFile(t,"utf-8")).includes(x)}catch{return!1}}function z(t,e,n){let i=t.indexOf(e),s=t.indexOf(n);if(i===-1||s===-1)return t;let r=i,o=s+n.length;return r>0&&t[r-1]===`
`&&(r-=1),t.substring(0,r)+t.substring(o)}function pt(t,e,n){let i=t;for(;i.includes(e)&&i.includes(n);){let s=z(i,e,n);if(s===i)break;i=s}return i}async function V(t,e,n,i,s,r){try{let o=t+".bak";await C(o)?(await u.copyFile(o,t),r.push(`  ${s}: Restored from backup`)):(await u.copyFile(t,o),r.push(`  ${s}: Backup created: ${o}`));let a=await u.readFile(t,"utf-8");return a=pt(a,n,i),await u.writeFile(t,a+`
`+e,"utf-8"),!0}catch(o){let a=o;return a.code==="EPERM"||a.code==="EACCES"?(r.push(`  ${s}: Permission denied: ${t}`),r.push("       Try running with elevated privileges")):r.push(`  ${s}: Error: ${a.message}`),!1}}async function yt(t,e,n){let i=t+".bak";if(!await C(i))return!1;try{return await u.copyFile(i,t),await u.unlink(i),n.push(`  ${e}: Restored from backup (backup deleted)`),!0}catch(s){return n.push(`  ${e}: Error restoring: ${s.message}`),!1}}async function I(t){let e=[];for(let n of t){let i="";try{i=await u.readFile(n.cssPath,"utf-8")}catch{}let s=i.includes(b);e.push({extension:n,cssInstalled:s,jsInstalled:await q(n.jsPath),cssBackupExists:await C(n.cssPath+".bak"),jsBackupExists:n.jsPath?await C(n.jsPath+".bak"):!1})}return e}async function P(t){let e=[],n=!1;return await V(t.cssPath,K,b,E,"CSS",e)&&(e.push(`  CSS: RTL support added to ${t.name}`),n=!0),t.jsPath?await V(t.jsPath,H,x,S,"JS",e)&&(e.push(`  JS:  Toggle button added to ${t.name}`),n=!0):e.push("  JS:  app_bundle.js not found, skipping button injection"),{messages:e,changed:n}}async function U(t,e,n,i,s,r,o){if(!e)return o.push(`  ${s}: RTL not installed in ${r}`),!1;if(await yt(t,s,o))return!0;try{let a=await u.readFile(t,"utf-8"),c=z(a,n,i);return await u.writeFile(t,c,"utf-8"),o.push(`  ${s}: RTL removed from ${r}`),!0}catch(a){return o.push(`  ${s}: Error removing RTL: ${a.message}`),!1}}async function X(t){let e=[],n=!1;await U(t.cssPath,await ft(t.cssPath),b,E,"CSS",t.name,e)&&(n=!0);let i=t.jsPath?await q(t.jsPath):!1;return!t.jsPath||!i?e.push(`  JS:  Button not installed in ${t.name}`):await U(t.jsPath,i,x,S,"JS",t.name,e)&&(n=!0),{messages:e,changed:n}}var k=h(require("vscode"));var f,Y="inactive";function Q(){return f=k.window.createStatusBarItem(k.StatusBarAlignment.Left,98),f.command="gemini-rtl.toggle",f.show(),f}async function A(t){if(!f)return;if(t!==void 0&&(Y=t),(await g()).length===0){f.text="$(globe) Gemini RTL: N/A",f.tooltip="Gemini Code Assist is not installed or found";return}Y==="active"?(f.text="$(globe) Gemini RTL: On",f.tooltip="Gemini Code Assist RTL is active. Click to toggle."):(f.text="$(globe) Gemini RTL: Off",f.tooltip="Gemini Code Assist RTL is inactive. Click to toggle.")}function Z(){f?.dispose()}var F="geminiRtl.mode",tt="geminiRtl.version",L,w,M;function y(t){L||(L=l.window.createOutputChannel("Gemini RTL Support")),L.appendLine(t)}function D(){return w.get(F,"inactive")}async function $(t){await w.update(F,t)}async function B(){await w.update(tt,M)}async function G(){let t=await g();if(t.length===0)return!1;let e=!1;for(let n of t)(await P(n)).changed&&(e=!0);return e}async function gt(){let t=w.get(tt),e=D(),n=w.get(F)!==void 0;if(!t){if(n&&e==="inactive"){await B();return}await $("active"),await B(),await G()&&l.commands.executeCommand("workbench.action.reloadWindow");return}if(t!==M){if(await B(),e==="inactive")return;await G()&&l.commands.executeCommand("workbench.action.reloadWindow");return}if(e==="inactive")return;let i=await g();i.length===0||!(await I(i)).some(o=>!o.cssInstalled)||await G()&&l.commands.executeCommand("workbench.action.reloadWindow")}function ht(t){w=t.globalState,M=t.extension.packageJSON.version??"0.0.0";let e=Q();t.subscriptions.push(e);let n=l.commands.registerCommand("gemini-rtl.add",async()=>{y(`
--- Activating Gemini RTL ---`);let o=await g();if(o.length===0){l.window.showErrorMessage("No Gemini Code Assist installations found.");return}let a=!1;for(let c of o){y(`Found Gemini: ${c.name}`);let d=await P(c);d.messages.forEach(v=>y(v)),d.changed&&(a=!0)}await $("active"),await A("active"),a?await l.window.showInformationMessage("Gemini RTL activated! Please reload the window to see changes.","Reload Window")==="Reload Window"&&l.commands.executeCommand("workbench.action.reloadWindow"):l.window.showInformationMessage("Gemini RTL is already active or could not be applied. Check output channel for details.")}),i=l.commands.registerCommand("gemini-rtl.remove",async()=>{y(`
--- Deactivating Gemini RTL ---`);let o=await g();if(o.length===0){l.window.showErrorMessage("No Gemini Code Assist installations found.");return}let a=!1;for(let c of o){y(`Found Gemini: ${c.name}`);let d=await X(c);d.messages.forEach(v=>y(v)),d.changed&&(a=!0)}await $("inactive"),await A("inactive"),a?await l.window.showInformationMessage("Gemini RTL deactivated! Please reload the window to see changes.","Reload Window")==="Reload Window"&&l.commands.executeCommand("workbench.action.reloadWindow"):l.window.showInformationMessage("Gemini RTL was not active or could not be removed. Check output channel for details.")}),s=l.commands.registerCommand("gemini-rtl.toggle",async()=>{let o=await g();if(o.length===0)return;(await I(o)).some(d=>d.cssInstalled||d.jsInstalled)?await l.window.showInformationMessage("Gemini Code Assist RTL is active. Do you want to turn it off?","Turn Off","Cancel")==="Turn Off"&&await l.commands.executeCommand("gemini-rtl.remove"):await l.window.showInformationMessage("Gemini Code Assist RTL is inactive. Do you want to turn it on?","Turn On","Cancel")==="Turn On"&&await l.commands.executeCommand("gemini-rtl.add")}),r=l.commands.registerCommand("gemini-rtl.status",async()=>{y(`
--- Checking Gemini RTL Status ---`);let o=await g();if(o.length===0){l.window.showInformationMessage("No Gemini Code Assist installations found.");return}let a=await I(o);y(`Saved mode: ${D()}`);for(let c of a)y(`Extension: ${c.extension.name}`),y(`  CSS injected: ${c.cssInstalled}`),y(`  JS injected: ${c.jsInstalled}`);L.show()});t.subscriptions.push(n,i,s,r),gt().catch(o=>console.error("Gemini RTL auto-reactivation failed:",o)),A(D()).catch(o=>console.error("Gemini RTL status bar update failed:",o))}function vt(){Z(),L?.dispose()}0&&(module.exports={activate,deactivate});
