"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosRouterViewsLifecycles = void 0;
const ecos_empty_component_1 = require("./routes/ecos-empty-component");
/* eslint-disable @typescript-eslint/no-explicit-any */
const aurelia_1 = require("aurelia");
// import { ApolloService } from './services/apollo-service';
// import { Configuration } from './configuration';
let EcosRouterViewsLifecycles = class EcosRouterViewsLifecycles {
    // public constructor(private apollo: ApolloService, private conf: Configuration) {
    // }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    load(vm, params, current) {
        if (current.viewport === 'bottom') {
            if (vm instanceof ecos_empty_component_1.EcosEmptyComponent) {
                document.documentElement.classList.remove('bottom');
            }
            else {
                document.documentElement.classList.add('bottom');
            }
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
    aurelia_1.lifecycleHooks(),
    aurelia_1.inject()
], EcosRouterViewsLifecycles);
exports.EcosRouterViewsLifecycles = EcosRouterViewsLifecycles;
