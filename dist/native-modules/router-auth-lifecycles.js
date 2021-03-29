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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lifecycleHooks, inject, ILogger } from 'aurelia';
import { ApolloService } from './services/apollo-service';
import { Configuration } from './configuration';
let EcosRouterAuthLifecycles = class EcosRouterAuthLifecycles {
    constructor(apollo, conf, logger) {
        this.apollo = apollo;
        this.conf = conf;
        this.logger = logger.scopeTo('ecos:router-auth-lifecycle');
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async canLoad(vm, params, next, current) {
        const requiresAuth = current.data.auth !== undefined && current.data.auth !== '0';
        if (requiresAuth && !(await this.apollo.isAuthenticated())) {
            this.logger.info('requires auth and is not authenticated => redirect to', this.conf.unauthorizedDefaultRoute);
            return this.conf.unauthorizedDefaultRoute;
        }
        return true;
    }
};
EcosRouterAuthLifecycles = __decorate([
    lifecycleHooks(),
    inject(),
    __param(2, ILogger),
    __metadata("design:paramtypes", [ApolloService,
        Configuration, Object])
], EcosRouterAuthLifecycles);
export { EcosRouterAuthLifecycles };
