var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { gql } from 'apollo-boost';
import { ApolloService } from '../services/apollo-service';
import { inject } from 'aurelia';
const registerMutation = gql `
mutation Register($email: String, $mobile: String) {
  register(data: {email: $email, mobile: $mobile})
  {
    id,
    token,
    code
  }
}`;
const validateRegistrationMutation = gql `
mutation ValidateRegistration($token: String!, $code: String!, $type: String!, $password: String!) {
  validateRegistration(data: {token: $token, code: $code, type: $type, password: $password})
  {
    id
  }
}`;
const requestMobileCodeMutation = gql `
mutation RequestMobileCode($mobile: String!) {
  requestMobileCode(data: {mobile: $mobile})
  {
    id,
    token
  }
}`;
const validateCodeMutation = gql `
mutation ValidateCode($token: String!, $code: String!) {
  validateCode(data: {token: $token, code: $code})
  {
    token,
    userId,
    expires,
    privateKey,
    state,
    refreshToken,
    refreshTokenExpiry,
  }
}`;
let RegisterCommands = class RegisterCommands {
    constructor(apollo) {
        this.apollo = apollo;
    }
    async register(mobile, email, password) {
        const result = await this.apollo.client.mutate({ mutation: registerMutation, variables: { mobile, email, password }, fetchPolicy: 'no-cache' });
        return result.data.register;
    }
    async validateRegistration(token, code, type, password) {
        const result = await this.apollo.client.mutate({ mutation: validateRegistrationMutation, variables: { token, code, type, password }, fetchPolicy: 'no-cache' });
        return result.data.validateRegistration;
    }
    async requestMobileCode(mobile) {
        const result = await this.apollo.client.mutate({ mutation: requestMobileCodeMutation, variables: { mobile }, fetchPolicy: 'no-cache' });
        return result.data.requestMobileCode;
    }
    async validateCode(token, code) {
        const result = await this.apollo.client.mutate({ mutation: validateCodeMutation, variables: { token, code }, fetchPolicy: 'no-cache' });
        if (result.data.validateCode.expires instanceof Date) {
            result.data.validateCode.expires = result.data.validateCode.expires.toString();
        }
        if (typeof result.data.validateCode.expires === 'string') {
            this.apollo.setLogin({
                token: result.data.validateCode.token,
                userId: result.data.validateCode.userId,
                expires: result.data.validateCode.expires,
                privateKey: result.data.validateCode.privateKey,
                state: result.data.validateCode.state
            });
        }
        if (typeof result.data.validateCode.refreshToken === 'string') {
            this.apollo.setRefreshToken(result.data.validateCode.refreshToken, result.data.validateCode.refreshTokenExpiry);
        }
        return result.data.validateCode;
    }
};
RegisterCommands = __decorate([
    inject(),
    __metadata("design:paramtypes", [ApolloService])
], RegisterCommands);
export { RegisterCommands };
