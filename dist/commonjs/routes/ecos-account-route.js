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
exports.EcosAccountRoute = void 0;
const fast_components_1 = require("../fast-components");
const services_1 = require("../services");
const apollo_boost_1 = require("apollo-boost");
const aurelia_1 = require("aurelia");
const i18n_1 = require("@aurelia/i18n");
require("./ecos-account-route.css");
let EcosAccountRoute = class EcosAccountRoute {
    constructor(router, eventAggregator, i18n, apollo) {
        this.router = router;
        this.eventAggregator = eventAggregator;
        this.i18n = i18n;
        this.apollo = apollo;
        this.events = [];
    }
    async binding() {
        this.user = await this.getUser();
        this.events.push(this.eventAggregator.subscribe('edit-profile-out', async () => {
            this.user = await this.getUser();
        }));
    }
    attached() {
        this.language = this.i18n.getLocale();
    }
    unload() {
        for (const event of this.events) {
            event.dispose();
        }
        this.events = [];
    }
    async getUser() {
        if (!this.apollo.getUserId()) {
            return null;
        }
        const result = await this.apollo.client.query({ query: apollo_boost_1.gql `query User($userId: String!) {
user(id: $userId) {
  id,
  firstname,
  lastname,
  email,
  mobile,
  picture {
    fileId,
    width,
    height
  }
}
    }`, variables: { userId: this.apollo.getUserId() }, fetchPolicy: 'network-only' });
        return result.data.user;
    }
    async logout() {
        try {
            // await this.userCommands.logout();
            await this.apollo.logout();
            this.eventAggregator.publish('logout');
            this.router.load('start');
        }
        catch (error) {
            fast_components_1.EcosNotification.notify(error.message, 'error');
        }
    }
    updateLanguage() {
        this.i18n.setLocale(this.language);
        this.eventAggregator.publish('app:locale:changed');
    }
    openLink(link) {
        location.href = link;
    }
    loadEcosEditProfileRoute() {
        this.router.load('../ecos-edit-profile-route');
    }
};
EcosAccountRoute = __decorate([
    aurelia_1.inject(aurelia_1.IRouter, aurelia_1.EventAggregator, i18n_1.I18N, services_1.ApolloService),
    __param(0, aurelia_1.IRouter),
    __metadata("design:paramtypes", [Object, aurelia_1.EventAggregator, Object, services_1.ApolloService])
], EcosAccountRoute);
exports.EcosAccountRoute = EcosAccountRoute;
