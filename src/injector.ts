import * as fs from 'fs/promises';
import { GeminiExtensionInfo, RtlStatus } from './types.js';
import {
    RTL_CSS_RULES, RTL_JS_CODE,
    RTL_START_MARKER, RTL_END_MARKER,
    JS_START_MARKER, JS_END_MARKER
} from './content.js';

/**
 * Check if a path exists.
 */
async function exists(p: string): Promise<boolean> {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if RTL CSS markers exist in the file.
 */
export async function isCssInstalled(cssPath: string): Promise<boolean> {
    try {
        const content = await fs.readFile(cssPath, 'utf-8');
        return content.includes(RTL_START_MARKER);
    } catch {
        return false;
    }
}

/**
 * Check if JS toggle markers exist in the file.
 */
async function isJsInstalled(jsPath: string | null): Promise<boolean> {
    if (!jsPath) return false;
    try {
        const content = await fs.readFile(jsPath, 'utf-8');
        return content.includes(JS_START_MARKER);
    } catch {
        return false;
    }
}

/**
 * Strip a marked block from content string.
 */
function stripBlock(content: string, startMarker: string, endMarker: string): string {
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (startIdx === -1 || endIdx === -1) return content;

    let actualStart = startIdx;
    const actualEnd = endIdx + endMarker.length;

    // Remove preceding newline if present
    if (actualStart > 0 && content[actualStart - 1] === '\n') {
        actualStart -= 1;
    }

    return content.substring(0, actualStart) + content.substring(actualEnd);
}

/**
 * Strip all repeated marked blocks from content string.
 */
function stripAllBlocks(content: string, startMarker: string, endMarker: string): string {
    let out = content;
    while (out.includes(startMarker) && out.includes(endMarker)) {
        const next = stripBlock(out, startMarker, endMarker);
        if (next === out) break;
        out = next;
    }
    return out;
}

// ── Injection helpers ─────────────────────────────────────────────

interface InjectionResult {
    messages: string[];
    changed: boolean;
}

/**
 * Restore a file from backup (or create backup if first time),
 * then append injected content.
 */
async function injectFile(
    filePath: string,
    injectedContent: string,
    startMarker: string,
    endMarker: string,
    label: string,
    messages: string[]
): Promise<boolean> {
    try {
        const backupPath = filePath + '.bak';

        if (await exists(backupPath)) {
            await fs.copyFile(backupPath, filePath);
            messages.push(`  ${label}: Restored from backup`);
        } else {
            await fs.copyFile(filePath, backupPath);
            messages.push(`  ${label}: Backup created: ${backupPath}`);
        }

        let content = await fs.readFile(filePath, 'utf-8');
        content = stripAllBlocks(content, startMarker, endMarker);

        await fs.writeFile(filePath, content + '\n' + injectedContent, 'utf-8');
        return true;
    } catch (e: unknown) {
        const err = e as NodeJS.ErrnoException;
        if (err.code === 'EPERM' || err.code === 'EACCES') {
            messages.push(`  ${label}: Permission denied: ${filePath}`);
            messages.push('       Try running with elevated privileges');
        } else {
            messages.push(`  ${label}: Error: ${err.message}`);
        }
        return false;
    }
}

/**
 * Restore a file from backup and delete the backup.
 */
async function restoreAndDeleteBackup(
    filePath: string,
    label: string,
    messages: string[],
): Promise<boolean> {
    const backupPath = filePath + '.bak';
    if (!(await exists(backupPath))) return false;

    try {
        await fs.copyFile(backupPath, filePath);
        await fs.unlink(backupPath);
        messages.push(`  ${label}: Restored from backup (backup deleted)`);
        return true;
    } catch (e: unknown) {
        messages.push(`  ${label}: Error restoring: ${(e as Error).message}`);
        return false;
    }
}

// ── Status ────────────────────────────────────────────────────────

/**
 * Get RTL status for all found extensions.
 */
export async function getStatus(extensions: GeminiExtensionInfo[]): Promise<RtlStatus[]> {
    const statuses: RtlStatus[] = [];

    for (const ext of extensions) {
        let cssContent = '';
        try {
            cssContent = await fs.readFile(ext.cssPath, 'utf-8');
        } catch { /* file unreadable — treat as not installed */ }

        const cssInstalled = cssContent.includes(RTL_START_MARKER);

        statuses.push({
            extension: ext,
            cssInstalled,
            jsInstalled: await isJsInstalled(ext.jsPath),
            cssBackupExists: await exists(ext.cssPath + '.bak'),
            jsBackupExists: ext.jsPath ? await exists(ext.jsPath + '.bak') : false,
        });
    }

    return statuses;
}

// ── Injection modes ───────────────────────────────────────────────

/**
 * Add RTL support
 */
export async function addRtl(ext: GeminiExtensionInfo): Promise<InjectionResult> {
    const messages: string[] = [];
    let changed = false;

    if (await injectFile(ext.cssPath, RTL_CSS_RULES, RTL_START_MARKER, RTL_END_MARKER, 'CSS', messages)) {
        messages.push(`  CSS: RTL support added to ${ext.name}`);
        changed = true;
    }

    if (!ext.jsPath) {
        messages.push('  JS:  app_bundle.js not found, skipping button injection');
    } else if (await injectFile(ext.jsPath, RTL_JS_CODE, JS_START_MARKER, JS_END_MARKER, 'JS', messages)) {
        messages.push(`  JS:  Toggle button added to ${ext.name}`);
        changed = true;
    }

    return { messages, changed };
}

// ── Removal ───────────────────────────────────────────────────────

/**
 * Remove an injected block from a file, trying backup restore first,
 * falling back to manual marker-based removal.
 */
async function removeInjected(
    filePath: string,
    isInstalled: boolean,
    startMarker: string,
    endMarker: string,
    label: string,
    extName: string,
    messages: string[],
): Promise<boolean> {
    if (!isInstalled) {
        messages.push(`  ${label}: RTL not installed in ${extName}`);
        return false;
    }

    // Try backup restore first
    if (await restoreAndDeleteBackup(filePath, label, messages)) {
        return true;
    }

    // Fallback: manual marker removal
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const cleaned = stripBlock(content, startMarker, endMarker);
        await fs.writeFile(filePath, cleaned, 'utf-8');
        messages.push(`  ${label}: RTL removed from ${extName}`);
        return true;
    } catch (e: unknown) {
        messages.push(`  ${label}: Error removing RTL: ${(e as Error).message}`);
        return false;
    }
}

/**
 * Remove RTL support from a single Gemini extension.
 */
export async function removeRtl(ext: GeminiExtensionInfo): Promise<InjectionResult> {
    const messages: string[] = [];
    let changed = false;

    if (await removeInjected(ext.cssPath, await isCssInstalled(ext.cssPath), RTL_START_MARKER, RTL_END_MARKER, 'CSS', ext.name, messages)) {
        changed = true;
    }

    const jsInstalled = ext.jsPath ? await isJsInstalled(ext.jsPath) : false;
    if (!ext.jsPath || !jsInstalled) {
        messages.push(`  JS:  Button not installed in ${ext.name}`);
    } else if (await removeInjected(ext.jsPath, jsInstalled, JS_START_MARKER, JS_END_MARKER, 'JS', ext.name, messages)) {
        changed = true;
    }

    return { messages, changed };
}
