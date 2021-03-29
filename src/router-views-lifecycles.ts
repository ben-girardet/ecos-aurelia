/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, RouteNode, inject, ILogger } from 'aurelia';
@lifecycleHooks()
@inject()
export class EcosRouterViewsLifecycles {

  private logger: ILogger;

  public constructor(@ILogger logger: ILogger) {
    this.logger = logger.scopeTo('ecos:router-views-lifecycles');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public load(vm: any, params: any, current: RouteNode): void {
    this.logger.info('load', current.component, 'in', current.viewport);
    if (current.viewport === 'bottom') {
      document.documentElement.classList.add('bottom');
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public unload(vm: any, params: any, current: RouteNode): void {
    this.logger.info('unload', current.component, 'in', current.viewport);
    if (current.viewport === 'bottom') {
      document.documentElement.classList.remove('bottom');
    }
  }

}