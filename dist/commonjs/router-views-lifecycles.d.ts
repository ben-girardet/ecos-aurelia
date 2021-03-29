import { RouteNode, ILogger } from 'aurelia';
export declare class EcosRouterViewsLifecycles {
    private logger;
    constructor(logger: ILogger);
    load(vm: any, params: any, current: RouteNode): void;
    unload(vm: any, params: any, current: RouteNode): void;
}
