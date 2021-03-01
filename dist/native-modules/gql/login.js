import { gql } from 'apollo-boost';
export const loginMutation = gql `
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
export const refreshTokenMutation = gql `
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
export const logoutMutation = gql `
mutation Logout {
  logout
}`;
