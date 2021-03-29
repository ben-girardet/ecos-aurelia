import { IRouter, ICustomElementViewModel, ILogger, inject, EventAggregator, IDisposable, IPlatform } from 'aurelia';
import { IRouterEvents, NavigationEndEvent } from '@aurelia/router';
import { CordovaService } from './services/cordova-service';
import { PageVisibility } from './page-visibility'
import { parseColorWebRGB } from "@microsoft/fast-colors";
import { createColorPalette, parseColorString } from "@microsoft/fast-components";
import { ApolloService } from './services/apollo-service';

@inject()
export class EcosApp implements ICustomElementViewModel {

  public static neutral = 'rgb(200, 200, 200)'; // 'rgb(70,51,175)';
  public static accent = '#3AC3BD';
  public static neutralPalette = createColorPalette(parseColorWebRGB(EcosApp.neutral));
  public static accentPalette = createColorPalette(parseColorString(EcosApp.accent));

  public subscriptions: IDisposable[] = [];
  public started = false;

  private logger: ILogger;

  public constructor(
    @IRouter private router: IRouter, 
    @IRouterEvents readonly routerEvents: IRouterEvents,
    @IPlatform readonly platform: IPlatform,
    @ILogger logger: ILogger,
    public eventAggregator: EventAggregator,
    public pageVisibility: PageVisibility,
    private cordova: CordovaService,
    public apollo: ApolloService ) {
      this.logger = logger.scopeTo('ecos:app');
      this.pageVisibility.listen();
      document.addEventListener("deviceready", () => {
        this.eventAggregator.publish('device:ready');
      }, false);
  }

  public attached(): void {
    this.logger.info('attached');
    this.cordova.adaptProviderWithTheme();
    const provider = document.querySelector("fast-design-system-provider") as HTMLElement & {backgroundColor: string; neutralPalette: string[]; accentPalette: string[]; accentBaseColor: string};
    provider.neutralPalette = EcosApp.neutralPalette;
    provider.accentBaseColor = EcosApp.accent;
    provider.accentPalette = EcosApp.accentPalette;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = provider;
    // p.density = 10;
    // p.designUnit = 10;
    p.cornerRadius = 10;
    p.outlineWidth = 1;
    p.focusOutlineWidth = 1;
    p.disabledOpacity = 0.2;
  }

  public async binding(): Promise<void> {
    this.subscriptions.push(this.eventAggregator.subscribe('page:foreground', async () => {
      this.platform.domReadQueue.queueTask(() => {
        this.cordova.adaptProviderWithTheme();
        this.cordova.adaptStatusBarWithThemeAndRoute([]);
      });
      this.platform.setTimeout(() => {
        this.cordova.adaptProviderWithTheme();
        this.cordova.adaptStatusBarWithThemeAndRoute([]);
      }, 250);
      const isAuth = await this.loginIfNotAuthenticated();
      if (isAuth) {
        this.eventAggregator.publish('page:foreground:auth');
      }
    }));
  } 

  public async loginIfNotAuthenticated(): Promise<boolean> {
    if (!(await this.apollo.isAuthenticated())) {
      // TODO: should we ensure that the router navigates to login page in this situation ?
      return false;
    }
    return true;
  }

  public async bound(): Promise<void> {    
    this.routerEvents.subscribe('au:router:navigation-end', (navigation) => {
      this.adjustCordovaAppearance(navigation);
    });

    this.routerEvents.subscribe('au:router:navigation-error', (message) => {
      console.log('navigation error', message);
    });

    this.routerEvents.subscribe('au:router:navigation-start', (navigation) => {
      console.log('navigation start', navigation);
    });
  }

  public adjustCordovaAppearance(navigation: NavigationEndEvent): void {
    this.logger.info('adjustCordovaAppearance', navigation);
    this.cordova.adaptProviderWithTheme();
    // this.global.adaptStatusBarWithThemeAndRoute(instructions);
    // this.global.platform.domReadQueue.queueTask(() => {
    //   this.global.adaptStatusBarWithThemeAndRoute(instructions);
    // });
  }

  public unbind(): void {
    for (const sub of this.subscriptions) {
      sub.dispose();   
    }
    this.subscriptions = [];
  }
}