"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosRouterViewsLifecycles = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const aurelia_1 = require("aurelia");
let EcosRouterViewsLifecycles = class EcosRouterViewsLifecycles {
    constructor(logger) {
        this.logger = logger.scopeTo('ecos:router-views-lifecycles');
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    load(vm, params, current) {
        this.logger.info('load', current.component, 'in', current.viewport);
        if (current.viewport === 'bottom') {
            document.documentElement.classList.add('bottom');
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    unload(vm, params, current) {
        this.logger.info('unload', current.component, 'in', current.viewport);
        if (current.viewport === 'bottom') {
            document.documentElement.classList.remove('bottom');
        }
    }
};
EcosRouterViewsLifecycles = __decorate([
    aurelia_1.lifecycleHooks(),
    aurelia_1.inject(),
    __param(0, aurelia_1.ILogger),
    __metadata("design:paramtypes", [Object])
], EcosRouterViewsLifecycles);
exports.EcosRouterViewsLifecycles = EcosRouterViewsLifecycles;
