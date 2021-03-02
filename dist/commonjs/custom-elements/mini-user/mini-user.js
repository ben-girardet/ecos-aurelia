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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MiniUser_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniUser = void 0;
const apollo_boost_1 = require("apollo-boost");
const aurelia_1 = require("aurelia");
const apollo_service_1 = require("./../../services/apollo-service");
const mini_user_html_1 = __importDefault(require("./mini-user.html"));
let MiniUser = MiniUser_1 = class MiniUser {
    constructor(eventAggregator, apollo) {
        this.eventAggregator = eventAggregator;
        this.apollo = apollo;
        this.onlyAvatar = false;
        this.onlyName = false;
        this.size = 'medium';
        this.events = [];
        MiniUser_1.index++;
    }
    attached() {
        this.userIdChanged();
        this.events.push(this.eventAggregator.subscribe('user:changed', (userId) => {
            if (userId === this.userId) {
                this.userIdChanged(true);
            }
        }));
    }
    async userIdChanged(force = false) {
        if (this.userId) {
            const user = await this.getUser(force ? 'network-only' : 'cache-first');
            this.firstname = user.firstname;
            this.lastname = user.lastname;
            this.picture = user.picture;
        }
    }
    async getUser(fetchPolicy = 'cache-first') {
        // TODO: find a way to clear the userId cache on edit
        // should be possible with fetch policy or such in apollo
        // need to learn anyway for same feature for topics
        if (!this.userId) {
            return null;
        }
        const result = await this.apollo.client.query({ query: apollo_boost_1.gql `query User($userId: String!) {
user(id: $userId) {
  id,
  firstname,
  lastname,
  picture {
    fileId,
    width,
    height
  }
}
    }`, variables: { userId: this.userId }, fetchPolicy });
        return result.data.user;
    }
};
MiniUser.index = 0;
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", String)
], MiniUser.prototype, "userId", void 0);
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", Object)
], MiniUser.prototype, "onlyAvatar", void 0);
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", Object)
], MiniUser.prototype, "onlyName", void 0);
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", String)
], MiniUser.prototype, "size", void 0);
MiniUser = MiniUser_1 = __decorate([
    aurelia_1.customElement({ name: 'mini-user', template: mini_user_html_1.default }),
    aurelia_1.inject(aurelia_1.EventAggregator, apollo_service_1.ApolloService),
    __metadata("design:paramtypes", [aurelia_1.EventAggregator,
        apollo_service_1.ApolloService])
], MiniUser);
exports.MiniUser = MiniUser;
