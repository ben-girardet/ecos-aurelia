/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, RouteNode, inject, ILogger } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';

@lifecycleHooks()
@inject()
export class EcosRouterAuthLifecycles {

  private logger: ILogger;

  public constructor(
    private apollo: ApolloService, 
    private conf: Configuration,
    @ILogger logger: ILogger) {
      this.logger = logger.scopeTo('ecos:router-auth-lifecycle');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async canLoad(vm: any, params: any, next: RouteNode, current: RouteNode): Promise<boolean | string> {
    const requiresAuth = current.data.auth !== undefined && current.data.auth !== '0';
    if (requiresAuth && !(await this.apollo.isAuthenticated())) {
      this.logger.info('requires auth and is not authenticated => redirect to', this.conf.unauthorizedDefaultRoute);
      return this.conf.unauthorizedDefaultRoute;
    }
    return true;
  }

}