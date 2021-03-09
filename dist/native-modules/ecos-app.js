var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EcosApp_1;
import { IRouter, inject, EventAggregator, IPlatform } from 'aurelia';
import { IRouterEvents } from '@aurelia/router';
import { CordovaService } from './services/cordova-service';
import { PageVisibility } from './page-visibility';
import { parseColorWebRGB } from "@microsoft/fast-colors";
import { createColorPalette, parseColorString } from "@microsoft/fast-components";
import { ApolloService } from './services/apollo-service';
let EcosApp = EcosApp_1 = class EcosApp {
    constructor(router, routerEvents, platform, eventAggregator, pageVisibility, cordova, apollo) {
        this.router = router;
        this.routerEvents = routerEvents;
        this.platform = platform;
        this.eventAggregator = eventAggregator;
        this.pageVisibility = pageVisibility;
        this.cordova = cordova;
        this.apollo = apollo;
        this.subscriptions = [];
        this.started = false;
        this.pageVisibility.listen();
        document.addEventListener("deviceready", () => {
            this.eventAggregator.publish('device:ready');
        }, false);
    }
    attached() {
        this.cordova.adaptProviderWithTheme();
        const provider = document.querySelector("fast-design-system-provider");
        provider.neutralPalette = EcosApp_1.neutralPalette;
        provider.accentBaseColor = EcosApp_1.accent;
        provider.accentPalette = EcosApp_1.accentPalette;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = provider;
        // p.density = 10;
        // p.designUnit = 10;
        p.cornerRadius = 10;
        p.outlineWidth = 1;
        p.focusOutlineWidth = 1;
        p.disabledOpacity = 0.2;
    }
    async binding() {
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
    async loginIfNotAuthenticated() {
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
    async bound() {
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
    adjustCordovaAppearance(navigation) {
        console.log('adjustCordovaAppearance', navigation);
        this.cordova.adaptProviderWithTheme();
        // this.global.adaptStatusBarWithThemeAndRoute(instructions);
        // this.global.platform.domReadQueue.queueTask(() => {
        //   this.global.adaptStatusBarWithThemeAndRoute(instructions);
        // });
    }
    unbind() {
        for (const sub of this.subscriptions) {
            sub.dispose();
        }
        this.subscriptions = [];
    }
};
EcosApp.neutral = 'rgb(200, 200, 200)'; // 'rgb(70,51,175)';
EcosApp.accent = '#3AC3BD';
EcosApp.neutralPalette = createColorPalette(parseColorWebRGB(EcosApp_1.neutral));
EcosApp.accentPalette = createColorPalette(parseColorString(EcosApp_1.accent));
EcosApp = EcosApp_1 = __decorate([
    inject(),
    __param(0, IRouter),
    __param(1, IRouterEvents),
    __param(2, IPlatform),
    __metadata("design:paramtypes", [Object, Object, Object, EventAggregator,
        PageVisibility,
        CordovaService,
        ApolloService])
], EcosApp);
export { EcosApp };
