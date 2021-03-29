import { RouteNode, ILogger } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';
export declare class EcosRouterAuthLifecycles {
    private apollo;
    private conf;
    private logger;
    constructor(apollo: ApolloService, conf: Configuration, logger: ILogger);
    canLoad(vm: any, params: any, next: RouteNode, current: RouteNode): Promise<boolean | string>;
}
