import { ApolloService } from '../../services/apollo-service';
import { ICustomElementViewModel, Constructable, IRouter, ILogger, EventAggregator } from 'aurelia';
import { Configuration } from '../../configuration';
import { RegisterCommands } from '../../gql/register';
import { UserCommands } from '../../gql/user';
import { CordovaService } from '../../services/cordova-service';
import { CordovaPushService } from '../../services/cordova-push-service';
export declare class RegistrationSms implements ICustomElementViewModel {
    private router;
    private eventAggregator;
    private push;
    private apollo;
    private conf;
    private registerCommands;
    private userCommands;
    private cordova;
    welcomeComponent: Constructable | undefined;
    finishComponent: Constructable | undefined;
    private step;
    private mobile;
    private regionCode;
    private isMobileValid;
    private countryCode;
    private validationCode;
    private invalidCode;
    private firstname;
    private lastname;
    preview: string;
    private token;
    private userId;
    private avatar;
    private loading;
    private logger;
    constructor(router: IRouter, iLogger: ILogger, eventAggregator: EventAggregator, push: CordovaPushService, apollo: ApolloService, conf: Configuration, registerCommands: RegisterCommands, userCommands: UserCommands, cordova: CordovaService);
    binding(): Promise<void>;
    attached(): void;
    private transitioning;
    prev(step: string): Promise<void>;
    next(step: 'welcome' | 'mobile' | 'validation' | 'identity' | 'finish'): Promise<void>;
    private setPrevNext;
    private setNext;
    private setPrev;
    countryChanged(): void;
    mobileChanged(): void;
    requestMobileCode(event: Event | null, again?: boolean): Promise<void>;
    codeChanged(): void;
    validationField: HTMLElement;
    validateCode(event: Event | null, silent?: boolean): Promise<void>;
    getIdentity(): Promise<void>;
    setIdentity(event: Event | null): Promise<void>;
    notificationPrayer: boolean;
    notificationAnswer: boolean;
    notificationMessage: boolean;
    private notificationsTags;
    private regSub;
    setNotification(event: Event): Promise<void>;
    skipNotifications(): void;
    private disabledNotificationDialog;
    toggleDisabledNotificationDialog(force?: boolean): void;
    openNotificationsSettings(): void;
}
