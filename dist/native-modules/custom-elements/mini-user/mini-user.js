var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MiniUser_1;
import { gql } from 'apollo-boost';
import { customElement, bindable, EventAggregator, inject } from 'aurelia';
import { ApolloService } from './../../services/apollo-service';
import template from './mini-user.html';
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
        const result = await this.apollo.client.query({ query: gql `query User($userId: String!) {
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
    bindable,
    __metadata("design:type", String)
], MiniUser.prototype, "userId", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], MiniUser.prototype, "onlyAvatar", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], MiniUser.prototype, "onlyName", void 0);
__decorate([
    bindable,
    __metadata("design:type", String)
], MiniUser.prototype, "size", void 0);
MiniUser = MiniUser_1 = __decorate([
    customElement({ name: 'mini-user', template }),
    inject(EventAggregator, ApolloService),
    __metadata("design:paramtypes", [EventAggregator,
        ApolloService])
], MiniUser);
export { MiniUser };
