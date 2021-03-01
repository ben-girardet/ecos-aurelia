var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, inject } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';
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
    lifecycleHooks(),
    inject(),
    __metadata("design:paramtypes", [ApolloService, Configuration])
], EcosRouterLifecycles);
export { EcosRouterLifecycles };
