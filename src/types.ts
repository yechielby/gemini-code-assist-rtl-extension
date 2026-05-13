export interface GeminiExtensionInfo {
    dir: string;
    cssPath: string;
    jsPath: string | null;
    name: string;
}

export interface RtlStatus {
    extension: GeminiExtensionInfo;
    cssInstalled: boolean;
    jsInstalled: boolean;
    cssBackupExists: boolean;
    jsBackupExists: boolean;
}
