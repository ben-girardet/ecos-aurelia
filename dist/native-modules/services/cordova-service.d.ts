export declare class CordovaService {
    isCordova: boolean;
    isReady: boolean;
    isDarkModeEnabled: boolean;
    constructor();
    adaptProviderWithTheme(): void;
    adaptStatusBarWithThemeAndRoute(instructions: any[]): void;
    openNativeSettings(setting: 'notification_id' | 'wifi'): Promise<void>;
}
