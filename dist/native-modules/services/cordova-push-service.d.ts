import { EventAggregator, ILogger } from 'aurelia';
export declare class CordovaPushService {
    private eventAggregator;
    push: PhonegapPluginPush.PushNotification;
    permission: boolean | undefined;
    regId: string;
    regType: 'apn' | 'fcm';
    private logger;
    constructor(eventAggregator: EventAggregator, logger: ILogger);
    init(): void;
    hasPermission(): Promise<boolean>;
    listen(): void;
    clearAllNotifications(): Promise<void>;
    setApplicationIconBadgeNumber(number: number): Promise<void>;
}
