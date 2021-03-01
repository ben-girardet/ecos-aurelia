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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosRouterLifecycles = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const aurelia_1 = require("aurelia");
const apollo_service_1 = require("./services/apollo-service");
const configuration_1 = require("./configuration");
let EcosRouterLifecycles = class EcosRouterLifecycles {
    constructor(apollo, conf) {
        this.apollo = apollo;
        this.conf = conf;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async canLoad(vm, params, next, current) {
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
    unload(vm, params, current, next) {
        console.log('unload');
        console.log('vm', vm);
        console.log('params', params);
        console.log('next', next);
        console.log('current', current);
        // remove the "tag" in the body
    }
};
EcosRouterLifecycles = __decorate([
    aurelia_1.lifecycleHooks(),
    aurelia_1.inject(),
    __metadata("design:paramtypes", [apollo_service_1.ApolloService, configuration_1.Configuration])
], EcosRouterLifecycles);
exports.EcosRouterLifecycles = EcosRouterLifecycles;
