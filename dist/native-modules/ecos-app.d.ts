import { IRouter, ICustomElementViewModel, ILogger, EventAggregator, IDisposable, IPlatform } from 'aurelia';
import { IRouterEvents, NavigationEndEvent } from '@aurelia/router';
import { CordovaService } from './services/cordova-service';
import { PageVisibility } from './page-visibility';
import { ApolloService } from './services/apollo-service';
export declare class EcosApp implements ICustomElementViewModel {
    private router;
    readonly routerEvents: IRouterEvents;
    readonly platform: IPlatform;
    eventAggregator: EventAggregator;
    pageVisibility: PageVisibility;
    private cordova;
    apollo: ApolloService;
    static neutral: string;
    static accent: string;
    static neutralPalette: string[];
    static accentPalette: string[];
    subscriptions: IDisposable[];
    started: boolean;
    private logger;
    constructor(router: IRouter, routerEvents: IRouterEvents, platform: IPlatform, logger: ILogger, eventAggregator: EventAggregator, pageVisibility: PageVisibility, cordova: CordovaService, apollo: ApolloService);
    attached(): void;
    binding(): Promise<void>;
    loginIfNotAuthenticated(): Promise<boolean>;
    bound(): Promise<void>;
    adjustCordovaAppearance(navigation: NavigationEndEvent): void;
    unbind(): void;
}
