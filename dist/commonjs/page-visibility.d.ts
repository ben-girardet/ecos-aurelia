import { EventAggregator, ILogger } from 'aurelia';
export declare class PageVisibility {
    private eventAggregator;
    enableLogs: boolean;
    private hidden;
    private visibilityChange;
    private logger;
    constructor(iLogger: ILogger, eventAggregator: EventAggregator);
    private log;
    private init;
    listen(): void;
    isHidden(): any;
}
