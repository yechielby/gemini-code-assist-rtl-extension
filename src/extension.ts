import * as vscode from 'vscode';
import { findGeminiExtensions } from './finder.js';
import { addRtl, removeRtl, getStatus } from './injector.js';
import { createStatusBarItem, updateStatusBar, disposeStatusBar } from './statusBar.js';

const STATE_MODE_KEY = 'geminiRtl.mode';
const STATE_VERSION_KEY = 'geminiRtl.version';

let outputChannel: vscode.OutputChannel;
let globalState: vscode.Memento;
let currentVersion: string;

function log(msg: string) {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('Gemini RTL Support');
    }
    outputChannel.appendLine(msg);
}

function getSavedMode(): 'active' | 'inactive' {
    return globalState.get<'active' | 'inactive'>(STATE_MODE_KEY, 'inactive');
}

async function saveMode(mode: 'active' | 'inactive'): Promise<void> {
    await globalState.update(STATE_MODE_KEY, mode);
}

async function saveVersion(): Promise<void> {
    await globalState.update(STATE_VERSION_KEY, currentVersion);
}

async function silentInject(): Promise<boolean> {
    const exts = await findGeminiExtensions();
    if (exts.length === 0) return false;

    let anyChanged = false;
    for (const ext of exts) {
        const result = await addRtl(ext);
        if (result.changed) anyChanged = true;
    }
    return anyChanged;
}

async function autoReactivate(): Promise<void> {
    const savedVersion = globalState.get<string>(STATE_VERSION_KEY);
    const savedMode = getSavedMode();
    const hasModeKey = globalState.get<string>(STATE_MODE_KEY) !== undefined;

    // First install (no version ever saved)
    if (!savedVersion) {
        // User had explicitly deactivated in old version
        if (hasModeKey && savedMode === 'inactive') {
            await saveVersion();
            return;
        }

        // True first install — auto-activate
        await saveMode('active');
        await saveVersion();
        if (await silentInject()) {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
        return;
    }

    // Version upgrade — re-inject to apply updated code
    if (savedVersion !== currentVersion) {
        await saveVersion();
        if (savedMode === 'inactive') return;

        if (await silentInject()) {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
        return;
    }

    // Same version — only re-inject if Gemini overwrote files
    if (savedMode === 'inactive') return;

    const exts = await findGeminiExtensions();
    if (exts.length === 0) return;

    const statuses = await getStatus(exts);
    const needsReinjection = statuses.some(s => !s.cssInstalled);
    if (!needsReinjection) return;

    if (await silentInject()) {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
}

export function activate(context: vscode.ExtensionContext) {
    globalState = context.globalState;
    currentVersion = context.extension.packageJSON.version ?? '0.0.0';

    const statusBarItem = createStatusBarItem();
    context.subscriptions.push(statusBarItem);

    // Command: Add RTL
    const addRtlCmd = vscode.commands.registerCommand('gemini-rtl.add', async () => {
        log('\n--- Activating Gemini RTL ---');
        const exts = await findGeminiExtensions();

        if (exts.length === 0) {
            vscode.window.showErrorMessage('No Gemini Code Assist installations found.');
            return;
        }

        let totalChanged = false;
        for (const ext of exts) {
            log(`Found Gemini: ${ext.name}`);
            const result = await addRtl(ext);
            result.messages.forEach(m => log(m));
            if (result.changed) totalChanged = true;
        }

        await saveMode('active');
        await updateStatusBar('active');

        if (totalChanged) {
            const action = await vscode.window.showInformationMessage(
                'Gemini RTL activated! Please reload the window to see changes.',
                'Reload Window'
            );
            if (action === 'Reload Window') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        } else {
            vscode.window.showInformationMessage('Gemini RTL is already active or could not be applied. Check output channel for details.');
        }
    });

    // Command: Remove RTL
    const removeRtlCmd = vscode.commands.registerCommand('gemini-rtl.remove', async () => {
        log('\n--- Deactivating Gemini RTL ---');
        const exts = await findGeminiExtensions();

        if (exts.length === 0) {
            vscode.window.showErrorMessage('No Gemini Code Assist installations found.');
            return;
        }

        let totalChanged = false;
        for (const ext of exts) {
            log(`Found Gemini: ${ext.name}`);
            const result = await removeRtl(ext);
            result.messages.forEach(m => log(m));
            if (result.changed) totalChanged = true;
        }

        await saveMode('inactive');
        await updateStatusBar('inactive');

        if (totalChanged) {
            const action = await vscode.window.showInformationMessage(
                'Gemini RTL deactivated! Please reload the window to see changes.',
                'Reload Window'
            );
            if (action === 'Reload Window') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        } else {
            vscode.window.showInformationMessage('Gemini RTL was not active or could not be removed. Check output channel for details.');
        }
    });

    // Command: Toggle RTL (for status bar click)
    const toggleRtlCmd = vscode.commands.registerCommand('gemini-rtl.toggle', async () => {
        const exts = await findGeminiExtensions();
        if (exts.length === 0) return;

        const statuses = await getStatus(exts);
        const anyInstalled = statuses.some(s => s.cssInstalled || s.jsInstalled);

        if (anyInstalled) {
            const answer = await vscode.window.showInformationMessage(
                'Gemini Code Assist RTL is active. Do you want to turn it off?',
                'Turn Off',
                'Cancel'
            );
            if (answer === 'Turn Off') {
                await vscode.commands.executeCommand('gemini-rtl.remove');
            }
        } else {
            const answer = await vscode.window.showInformationMessage(
                'Gemini Code Assist RTL is inactive. Do you want to turn it on?',
                'Turn On',
                'Cancel'
            );
            if (answer === 'Turn On') {
                await vscode.commands.executeCommand('gemini-rtl.add');
            }
        }
    });

    // Command: Check Status
    const statusCmd = vscode.commands.registerCommand('gemini-rtl.status', async () => {
        log('\n--- Checking Gemini RTL Status ---');
        const exts = await findGeminiExtensions();

        if (exts.length === 0) {
            vscode.window.showInformationMessage('No Gemini Code Assist installations found.');
            return;
        }

        const statuses = await getStatus(exts);
        log(`Saved mode: ${getSavedMode()}`);
        for (const s of statuses) {
            log(`Extension: ${s.extension.name}`);
            log(`  CSS injected: ${s.cssInstalled}`);
            log(`  JS injected: ${s.jsInstalled}`);
        }

        outputChannel.show();
    });

    context.subscriptions.push(addRtlCmd, removeRtlCmd, toggleRtlCmd, statusCmd);

    // Auto-reactivate on startup
    autoReactivate().catch(err => console.error('Gemini RTL auto-reactivation failed:', err));
    updateStatusBar(getSavedMode()).catch(err => console.error('Gemini RTL status bar update failed:', err));
}

export function deactivate() {
    disposeStatusBar();
    outputChannel?.dispose();
}
