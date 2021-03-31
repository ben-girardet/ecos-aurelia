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
    const onlyUnauth = current.data.onlyUnauth !== undefined && current.data.onlyUnauth !== '0';

    if (!requiresAuth && !onlyUnauth) {
      return;
    }

    const isAuth = await this.apollo.isAuthenticated();
    if (requiresAuth && !isAuth) {
      this.logger.info('requires auth and is not authenticated => redirect to', this.conf.unauthorizedDefaultRoute);
      return this.conf.unauthorizedDefaultRoute;
    }
    if (onlyUnauth && isAuth) {
      this.logger.info('route only for unauth => redirect to', this.conf.authorizedDefaultRoute);
    }
    return true;
  }

}