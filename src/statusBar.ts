import * as vscode from 'vscode';
import { findGeminiExtensions } from './finder.js';

let statusBarItem: vscode.StatusBarItem;
let lastMode: 'active' | 'inactive' = 'inactive';

export function createStatusBarItem(): vscode.StatusBarItem {
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        98 // Priority 98 so it appears near Antigravity RTL (99) and Claude RTL (100)
    );
    statusBarItem.command = 'gemini-rtl.toggle';
    statusBarItem.show();
    return statusBarItem;
}

export async function updateStatusBar(mode?: 'active' | 'inactive'): Promise<void> {
    if (!statusBarItem) return;

    if (mode !== undefined) {
        lastMode = mode;
    }

    const extensions = await findGeminiExtensions();

    if (extensions.length === 0) {
        statusBarItem.text = '$(globe) Gemini RTL: N/A';
        statusBarItem.tooltip = 'Gemini Code Assist is not installed or found';
        return;
    }

    if (lastMode === 'active') {
        statusBarItem.text = '$(globe) Gemini RTL: On';
        statusBarItem.tooltip = 'Gemini Code Assist RTL is active. Click to toggle.';
    } else {
        statusBarItem.text = '$(globe) Gemini RTL: Off';
        statusBarItem.tooltip = 'Gemini Code Assist RTL is inactive. Click to toggle.';
    }
}

export function disposeStatusBar(): void {
    statusBarItem?.dispose();
}
