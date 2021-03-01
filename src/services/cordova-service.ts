// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w: any = window;

export class CordovaService {

  public isCordova = false;
  public isReady = false;
  public isDarkModeEnabled = false;

  public constructor() {
    this.isCordova = document.documentElement.classList.contains('cordova');
    document.addEventListener('deviceready', () => {
      this.isReady = true;
    }, {capture: false, once: true});
  }

  public adaptProviderWithTheme(): void {
    if (!this.isCordova) {
      this.isDarkModeEnabled = false;
      return;
    }
    this.isDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const provider = document.querySelector("fast-design-system-provider") as HTMLElement & {backgroundColor: string; neutralPalette: string[]; accentPalette: string[]; accentBaseColor: string};
    if (!provider) {
      return;
    }
    if (this.isDarkModeEnabled) {
      provider.backgroundColor = '#000000';
    } else {
      provider.backgroundColor = '#FFFFFF';
    }
  }

  // TODO: fix this method to work with current router
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public adaptStatusBarWithThemeAndRoute(instructions: any[]): void {
    if (!this.isCordova) {
      return;
    }
    if (!this.isReady) {
      document.addEventListener('deviceready', () => {
        this.isReady = true;
        this.adaptStatusBarWithThemeAndRoute(instructions);
      }, {capture: false, once: true});
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
      w.StatusBar.styleBlackOpaque()
    } else {
      w.StatusBar.styleDefault()
    }
  }

  public async openNativeSettings(setting: 'notification_id' | 'wifi'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (w.cordova && w.cordova.plugins.settings) {
        w.cordova.plugins.settings.open(setting, resolve,
            function () {
              reject(new Error('Failed to open settings'));
            }
        );
      } else {
        console.warn('openNativeSettingsTest is not active!');
      }
    });
  }

  // TODO: add push

}