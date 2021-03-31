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
exports.EcosRouterAuthLifecycles = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const aurelia_1 = require("aurelia");
const apollo_service_1 = require("./services/apollo-service");
const configuration_1 = require("./configuration");
let EcosRouterAuthLifecycles = class EcosRouterAuthLifecycles {
    constructor(apollo, conf, logger) {
        this.apollo = apollo;
        this.conf = conf;
        this.logger = logger.scopeTo('ecos:router-auth-lifecycle');
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async canLoad(vm, params, next, current) {
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
};
EcosRouterAuthLifecycles = __decorate([
    aurelia_1.lifecycleHooks(),
    aurelia_1.inject(),
    __param(2, aurelia_1.ILogger),
    __metadata("design:paramtypes", [apollo_service_1.ApolloService,
        configuration_1.Configuration, Object])
], EcosRouterAuthLifecycles);
exports.EcosRouterAuthLifecycles = EcosRouterAuthLifecycles;
