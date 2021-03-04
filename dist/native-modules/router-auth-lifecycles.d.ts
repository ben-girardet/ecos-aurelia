import { RouteNode } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';
export declare class EcosRouterAuthLifecycles {
    private apollo;
    private conf;
    constructor(apollo: ApolloService, conf: Configuration);
    canLoad(vm: any, params: any, next: RouteNode, current: RouteNode): Promise<boolean | string>;
}
