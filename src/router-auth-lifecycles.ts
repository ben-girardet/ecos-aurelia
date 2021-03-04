/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, RouteNode, inject } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';

@lifecycleHooks()
@inject()
export class EcosRouterAuthLifecycles {

  public constructor(private apollo: ApolloService, private conf: Configuration) {
    
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async canLoad(vm: any, params: any, next: RouteNode, current: RouteNode): Promise<boolean | string> {
    const requiresAuth = current.data.auth !== undefined && current.data.auth !== '0';
    if (requiresAuth && !(await this.apollo.isAuthenticated())) {
      return this.conf.unauthorizedDefaultRoute;
    }
    if (!requiresAuth && (await this.apollo.isAuthenticated()) && current.finalPath === this.conf.unauthorizedDefaultRoute) {
      return this.conf.authorizedDefaultRoute;
    }
    return true;
  }

}