// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window;
export class CordovaService {
    constructor() {
        this.isCordova = false;
        this.isReady = false;
        this.isDarkModeEnabled = false;
        this.isCordova = document.documentElement.classList.contains('cordova');
        document.addEventListener('deviceready', () => {
            this.isReady = true;
        }, { capture: false, once: true });
    }
    adaptProviderWithTheme() {
        if (!this.isCordova) {
            this.isDarkModeEnabled = false;
            return;
        }
        this.isDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const provider = document.querySelector("fast-design-system-provider");
        if (!provider) {
            return;
        }
        if (this.isDarkModeEnabled) {
            provider.backgroundColor = '#000000';
        }
        else {
            provider.backgroundColor = '#FFFFFF';
        }
    }
    // TODO: fix this method to work with current router
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adaptStatusBarWithThemeAndRoute(instructions) {
        if (!this.isCordova) {
            return;
        }
        if (!this.isReady) {
            document.addEventListener('deviceready', () => {
                this.isReady = true;
                this.adaptStatusBarWithThemeAndRoute(instructions);
            }, { capture: false, once: true });
            return;
        }
        if (!w.StatusBar) {
            console.warn('StatusBar not found in window object');
            return;
        }
        if (instructions.length === 0) {
            // TODO: fix this .activeComponents thing
            // instructions = this.router.activeComponents;
        }
        // TODO: better handle this idea of black opaque or not (not coupled to an app)
        const blackOpaqueComps = [];
        if (!this.isDarkModeEnabled) {
            blackOpaqueComps.push('topic-detail', 'praying', 'sharing');
        }
        const blackOpaqueInstructions = instructions.find(i => blackOpaqueComps.includes(i.component));
        if (blackOpaqueInstructions) {
            w.StatusBar.styleBlackOpaque();
        }
        else {
            w.StatusBar.styleDefault();
        }
    }
    async openNativeSettings(setting) {
        return new Promise((resolve, reject) => {
            if (w.cordova && w.cordova.plugins.settings) {
                w.cordova.plugins.settings.open(setting, resolve, function () {
                    reject(new Error('Failed to open settings'));
                });
            }
            else {
                console.warn('openNativeSettingsTest is not active!');
            }
        });
    }
}
