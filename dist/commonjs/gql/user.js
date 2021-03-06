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
exports.UserCommands = void 0;
const apollo_boost_1 = require("apollo-boost");
const aurelia_1 = require("aurelia");
const apollo_service_1 = require("../services/apollo-service");
const editMeMutation = apollo_boost_1.gql `
mutation EditMe($firstname: String, $lastname: String, $picture: [ImageInput!], $regId: String, $pushType: String, $pushTags: [String!], $pushActive: Boolean) {
  editMe(data: {firstname: $firstname, lastname: $lastname, picture: $picture, regId: $regId, pushType: $pushType, pushTags: $pushTags, pushActive: $pushActive})
  {
    id,
    firstname,
    lastname,
    picture {
      fileId,
      width,
      height
    },
    state
  }
}`;
let UserCommands = class UserCommands {
    constructor(apollo) {
        this.apollo = apollo;
        console.log('userCommands constructor', this.apollo);
    }
    async editMe(firstname, lastname, picture, regId, pushType, pushTags, pushActive) {
        const result = await this.apollo.client.mutate({
            mutation: editMeMutation,
            variables: { firstname, lastname, picture, regId, pushType, pushTags, pushActive },
            fetchPolicy: 'no-cache'
        });
        if (typeof result.data.editMe.state === 'number') {
            this.apollo.setState(result.data.editMe.state);
        }
        return result.data.editMe;
    }
};
UserCommands = __decorate([
    aurelia_1.inject(apollo_service_1.ApolloService),
    __metadata("design:paramtypes", [apollo_service_1.ApolloService])
], UserCommands);
exports.UserCommands = UserCommands;
