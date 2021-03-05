/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, RouteNode, inject } from 'aurelia';
@lifecycleHooks()
@inject()
export class EcosRouterViewsLifecycles {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public load(vm: any, params: any, current: RouteNode): void {
    console.log('load', current);
    if (current.viewport === 'bottom') {
      document.documentElement.classList.add('bottom');
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public unload(vm: any, params: any, current: RouteNode): void {
    if (current.viewport === 'bottom') {
      document.documentElement.classList.remove('bottom');
    }
  }

}