var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, inject } from 'aurelia';
let EcosRouterViewsLifecycles = class EcosRouterViewsLifecycles {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    load(vm, params, current) {
        console.log('load', current);
        if (current.viewport === 'bottom') {
            document.documentElement.classList.add('bottom');
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    unload(vm, params, current) {
        if (current.viewport === 'bottom') {
            document.documentElement.classList.remove('bottom');
        }
    }
};
EcosRouterViewsLifecycles = __decorate([
    lifecycleHooks(),
    inject()
], EcosRouterViewsLifecycles);
export { EcosRouterViewsLifecycles };
