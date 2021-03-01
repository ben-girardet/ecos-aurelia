"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutMutation = exports.refreshTokenMutation = exports.loginMutation = void 0;
const apollo_boost_1 = require("apollo-boost");
exports.loginMutation = apollo_boost_1.gql `
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password)
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
exports.refreshTokenMutation = apollo_boost_1.gql `
mutation RefreshToken($withPrivateKey: Boolean!) {
  refreshToken {
    token,
    userId,
    expires,
    state,
    refreshToken,
    refreshTokenExpiry,
    privateKey @include(if: $withPrivateKey)
  }
}`;
exports.logoutMutation = apollo_boost_1.gql `
mutation Logout {
  logout
}`;
