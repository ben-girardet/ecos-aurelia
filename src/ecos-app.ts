import { IRouter, ICustomElementViewModel, inject, EventAggregator, IDisposable, IPlatform } from 'aurelia';
import { IRouterEvents, NavigationEndEvent } from '@aurelia/router';
import { CordovaService } from './services/cordova-service';
import { PageVisibility } from './page-visibility'
import { parseColorWebRGB } from "@microsoft/fast-colors";
import { createColorPalette, parseColorString } from "@microsoft/fast-components";
import { ApolloService } from './services/apollo-service';

const neutral = 'rgb(200, 200, 200)'; // 'rgb(70,51,175)';
// const accent = 'rgb(0,201,219)';
const accent = '#3AC3BD';
const neutralPalette = createColorPalette(parseColorWebRGB(neutral));
const accentPalette = createColorPalette(parseColorString(accent));

@inject()
export class EcosApp implements ICustomElementViewModel {

  public subscriptions: IDisposable[] = [];
  public started = false;

  public constructor(
    @IRouter private router: IRouter, 
    @IRouterEvents readonly routerEvents: IRouterEvents,
    @IPlatform readonly platform: IPlatform,
    public eventAggregator: EventAggregator,
    public pageVisibility: PageVisibility,
    private cordova: CordovaService,
    public apollo: ApolloService ) {
      this.pageVisibility.listen();
      document.addEventListener("deviceready", () => {
        this.eventAggregator.publish('device:ready');
      }, false);
  }

  public attached(): void {
    this.cordova.adaptProviderWithTheme();
    const provider = document.querySelector("fast-design-system-provider") as HTMLElement & {backgroundColor: string; neutralPalette: string[]; accentPalette: string[]; accentBaseColor: string};
    provider.neutralPalette = neutralPalette;
    provider.accentBaseColor = accent;
    provider.accentPalette = accentPalette;
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
      console.log('loginIfNotAuthenticated: this.router', this.router);
      // const vp = this.router.getViewport('main');
      // const componentName = vp.content.content.componentName;
      // if (!['login', 'start', 'register'].includes(componentName)) {
      //   this.router.load('start');
      // }
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


    // Authentication HOOK
    // this.router.addHook(async (instructions: IViewportInstruction[]) => {
    //   this.global.bumpRoute();
    //   // User is not logged in, so redirect them back to login page
    //   const mainInstruction = instructions.find(i => i.viewportName === 'main');
    //   if (mainInstruction && !(await this.apollo.isAuthenticated())) {
    //     if (!['login', 'start', 'register'].includes(mainInstruction.componentName)) {
    //       return [this.router.createViewportInstruction('start', mainInstruction.viewport)];
    //     }
    //   }
    //   if (!this.started) {
    //     this.started = true;
    //     this.global.eventAggregator.publish('app:started');
    //   }
    //   return true;
    // });

    // View type HOOK
    // this.router.addHook(async (instructions: IViewportInstruction[]) => {
    //   const prayingInstruction = instructions.find(i => i.viewportName === 'praying');
    //   const bottomInstruction = instructions.find(i => i.viewportName === 'bottom');
    //   const detailInstruction = instructions.find(i => i.viewportName === 'detail');
    //   const bottomViewport = this.router.getViewport('bottom');
    //   const detailViewport = this.router.getViewport('detail');
    //   if (prayingInstruction) {
    //     if (prayingInstruction.componentName === 'praying') {
    //       document.documentElement.classList.add('praying');
    //       this.eventAggregator.publish(`praying-in`);
    //       this.shouldDisplayPrayingHelp();
    //     } else if (prayingInstruction.componentName === '-') {
    //       document.documentElement.classList.remove('praying');
    //       this.eventAggregator.publish(`praying-out`);
    //     }
    //   }
    //   if (bottomInstruction) {
    //     if (bottomInstruction.componentName === '-') {
    //       document.documentElement.classList.remove('bottom');
    //       this.eventAggregator.publish(`${bottomViewport.content.content.componentName}-out`);
    //     } else {
    //       document.documentElement.classList.add('bottom');
    //       this.eventAggregator.publish(`${bottomViewport.content.content.componentName}-in`);
    //     }
    //   }
    //   if (detailInstruction) {
    //     if (detailInstruction.componentName === '-') {
    //       document.documentElement.classList.remove('detail');
    //       this.eventAggregator.publish(`${detailViewport.content.content.componentName}-out`);
    //     } else {
    //       document.documentElement.classList.add('detail');
    //       this.eventAggregator.publish(`${detailViewport.content.content.componentName}-in`);
    //     }
    //   }
    //   return true;
    // }, {
    //   include: ['praying', '-', 'topic-form', 'topic-detail', 'conversation', 'sharing', 'friends', 'edit-profile', 'notifications-settings']
    // });
  }

  public adjustCordovaAppearance(navigation: NavigationEndEvent): void {
    console.log('adjustCordovaAppearance', navigation);
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