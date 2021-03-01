import { ApolloQueryResult, gql } from 'apollo-boost';
import { ApolloService } from '../services/apollo-service';
import { inject } from 'aurelia';
import { IToken,  ILogin } from 'ecos-types';

const registerMutation = gql`
mutation Register($email: String, $mobile: String) {
  register(data: {email: $email, mobile: $mobile})
  {
    id,
    token,
    code
  }
}`;

const validateRegistrationMutation = gql`
mutation ValidateRegistration($token: String!, $code: String!, $type: String!, $password: String!) {
  validateRegistration(data: {token: $token, code: $code, type: $type, password: $password})
  {
    id
  }
}`;

const requestMobileCodeMutation = gql`
mutation RequestMobileCode($mobile: String!) {
  requestMobileCode(data: {mobile: $mobile})
  {
    id,
    token
  }
}`;

const validateCodeMutation = gql`
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

@inject()
export class RegisterCommands {

  public constructor(private apollo: ApolloService) {

  }

  public async register(mobile: string, email: string, password: string): Promise<IToken> {
    const result = await this.apollo.client.mutate({mutation: registerMutation, variables: {mobile, email, password}, fetchPolicy: 'no-cache'}) as ApolloQueryResult<{register: IToken}>;
    return result.data.register;
  }
  
  public async validateRegistration(token: string, code: string, type: 'email' | 'mobile', password: string): Promise<{id: string}> {
    const result = await this.apollo.client.mutate({mutation: validateRegistrationMutation, variables: {token, code, type, password}, fetchPolicy: 'no-cache'}) as ApolloQueryResult<{validateRegistration: {id: string}}>;
    return result.data.validateRegistration;
  }
  
  public async requestMobileCode(mobile: string): Promise<IToken> {
    const result = await this.apollo.client.mutate({mutation: requestMobileCodeMutation, variables: {mobile}, fetchPolicy: 'no-cache'}) as ApolloQueryResult<{requestMobileCode: IToken}>;
    return result.data.requestMobileCode;
  }
  
  public async validateCode(token: string, code: string): Promise<ILogin> {
    const result = await this.apollo.client.mutate({mutation: validateCodeMutation, variables: {token, code}, fetchPolicy: 'no-cache'}) as ApolloQueryResult<{validateCode: ILogin}>;
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

}
