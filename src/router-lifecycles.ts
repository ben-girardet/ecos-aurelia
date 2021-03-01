/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, RouteNode, inject } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';

@lifecycleHooks()
@inject()
export class EcosRouterLifecycles {

  public constructor(private apollo: ApolloService, private conf: Configuration) {
    
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async canLoad(vm: any, params: any, next: RouteNode, current: RouteNode): Promise<boolean | string> {

    console.log('canLoad');
    console.log('vm', vm);
    console.log('params', params);
    console.log('next', next);
    console.log('current', current);

    const requiresAuth = current.data.auth !== undefined && current.data.auth !== '0';

    if (requiresAuth && !(await this.apollo.isAuthenticated())) {
      console.log('redirect to login');
      return this.conf.unauthorizedDefaultRoute;
    }

    if (!requiresAuth && (await this.apollo.isAuthenticated()) && current.finalPath === this.conf.unauthorizedDefaultRoute) {
      console.log('redirect to auth default');
      return this.conf.authorizedDefaultRoute;
    }

    return true;
  }

  public unload(vm: any, params: any, current: any, next: any) {
    console.log('unload');
    console.log('vm', vm);
    console.log('params', params);
    console.log('next', next);
    console.log('current', current);
    // remove the "tag" in the body
  }

}