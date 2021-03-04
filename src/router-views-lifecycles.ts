import { EcosEmptyComponent } from './routes/ecos-empty-component';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, RouteNode, inject } from 'aurelia';
// import { ApolloService } from './services/apollo-service';
// import { Configuration } from './configuration';

@lifecycleHooks()
@inject()
export class EcosRouterViewsLifecycles {

  // public constructor(private apollo: ApolloService, private conf: Configuration) {
    
  // }


  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public load(vm: any, params: any, current: RouteNode): void {
    if (current.viewport === 'bottom') {
      if (vm instanceof EcosEmptyComponent) {
        document.documentElement.classList.remove('bottom');
      } else {
        document.documentElement.classList.add('bottom');
      }
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public unload(vm: any, params: any, current: RouteNode): void {
    if (current.viewport === 'bottom') {
      document.documentElement.classList.remove('bottom');
    }
  }

}