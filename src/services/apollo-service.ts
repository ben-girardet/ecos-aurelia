console.log('ECOS: top of apollo service');
import { ErrorResponse } from 'apollo-link-error';
import { EcosNotification } from '../fast-components/ecos-notification';
import ApolloClient, { Operation, ApolloQueryResult } from 'apollo-boost';
import { loginMutation, refreshTokenMutation, logoutMutation } from '../gql/login';
import moment from 'moment';
import { Configuration } from '../configuration';
import { inject } from 'aurelia';
import Gun from 'gun';
import 'gun/sea';
import { ILogin } from 'ecos-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w: any = window;
w.getRefreshToken = function() {
  return window.localStorage.getItem('refreshToken');
}
w.getRefreshTokenExpiry = function() {
  return window.localStorage.getItem('refreshTokenExpiry');
}
w.setRefreshToken = function(refreshToken: string, refreshTokenExpiry: string) {
  window.localStorage.setItem('refreshToken', refreshToken);
  window.localStorage.setItem('refreshTokenExpiry', refreshTokenExpiry);
}

@inject(Configuration)
export class ApolloService {

  private expires: moment.Moment;
  private userId: string;
  public authenticated = false;
  private jwt: string;
  private privateKey: string;
  private state: number;

  private rt?: string;
  private rtExpiry?: moment.Moment;

  public isOutOfDate = false;

  public client: ApolloClient<unknown>;

  public constructor(private conf: Configuration) {
    console.log('apollowService constructor', conf);
    this.client = new ApolloClient({
      uri: `${this.conf.apiHost}/graphql`,
      credentials: 'include',
      request: async (operation: Operation) => {
        // the window.device object is populated by: `cordova-plugin-device`
        if (typeof w.device?.platform === 'string') {
          operation.setContext(context => ({
            headers: {
                ...context.headers,
                "client-version": "VERSIONNB",
                "client-platform": `${w.device.platform.toLowerCase()}`,
            }
          }));
        }
        if (conf.includeRefreshToken === true) {
          operation.setContext(context => ({
            headers: {
                ...context.headers,
                "ecos-params": "include-refresh-token"
            }
          }));
        }
        if (operation.operationName !== 'Login' && operation.operationName !== 'RefreshToken' && !this.isTokenValid() && this.getUserId()) {
            await this.refreshToken();
            
        }
        if (operation.operationName === 'RefreshToken' && this.getRefreshToken()) {
          operation.setContext(context => ({
            headers: {
                ...context.headers,
                "refresh-token": this.getRefreshToken()
            }
          }));
        }
        const token = this.getToken();
        if (token && operation.operationName !== 'RefreshToken' && operation.operationName !== 'Login') {
          operation.setContext(context => ({
            headers: {
                ...context.headers,
                authorization: `Bearer ${token}`
            }
          }));
        }
      },
      onError: (error: ErrorResponse) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const networkError: any = error.networkError;
        if (networkError?.result?.error === 'Out of date client') {
          this.isOutOfDate = true;
          return;
        }
        const hiddenMessages = [
          'Invalid refresh token',
          'No refresh token',
          'Failed to fetch',
          'network timeout'
        ];
        console.log('apollo onError', error);
        const messages = (error.graphQLErrors || [])
        .map(e => e.message)
        .filter(m => !hiddenMessages.includes(m));
        if (error.networkError?.message) {
          messages.push(error.networkError?.message)
        }
        if (messages.length) {
          EcosNotification.notify(`${messages.join('; ')}`, 'error');
        }
      }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__APOLLO_CLIENT__ = this.client;
  }
  
  public setLogin(login: {token: string, userId: string, expires: string, privateKey: string, state: number}): void {
    if (typeof login.expires === 'string') {
      const expDate = moment(login.expires);
      this.expires = expDate;
      this.authenticated = true;
      this.jwt = login.token;
      this.privateKey = login.privateKey;
      this.state = login.state;
    } else {
      this.expires = undefined;
      this.userId = undefined;
      this.authenticated = false;
      this.jwt = '';
      this.privateKey = '';
      this.state = -1;
      throw new Error('Invalid login');
    }
    this.userId = login.userId;
  }

  public setRefreshToken(refreshToken: string, refreshTokenExpiry: string): void {
    if (w.setRefreshToken) {
      w.setRefreshToken.call(null, refreshToken, refreshTokenExpiry);
    } else {
      this.rt = refreshToken;
      this.rtExpiry = moment(refreshTokenExpiry);
    }
  }

  public setState(state: number): void {
    this.state = state;
  }

  public getState(): number {
    return this.state;
  }

  public isTokenValid(): boolean {
    if (this.expires === undefined) {
      return false;
    }
    if (moment.isMoment(this.expires)) {
      return this.expires.isAfter(moment());
    } else {
      return false;
    }
  }

  public getUserId(): string {
    return this.userId;
  }

  public getToken(): string {
    return this.jwt;
  }

  public getJWT(): string {
    return this.jwt;
  }

  public getRefreshToken(): string | null {
    const refreshToken = w.getRefreshToken ? w.getRefreshToken() : this.rt;
    const refreshTokenExpiry = w.getRefreshTokenExpiry ? moment(w.getRefreshTokenExpiry()) : this.rtExpiry;
    if (refreshToken && refreshTokenExpiry && refreshTokenExpiry.isValid() && refreshTokenExpiry.isAfter(moment())) {
      return refreshToken;
    }
    if (w.setRefreshToken) {
      w.setRefreshToken.call(null, '', '');
    } 
    delete this.rt;
    delete this.rtExpiry;
    return null;
  }

  public async refresh(): Promise<boolean> {
    try {
      // when the refreshToken command is successfull
      // it calls the apolloAuth setLogin method
      await this.refreshToken(!this.privateKey);
      if (!this.isTokenValid() || !this.authenticated) {
        return false;
      }
      return true;
    } catch (error) {
      // silent refresh failing
      return false;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    if (this.authenticated && this.isTokenValid()) {
      return true;
    }
    return await this.refresh();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async encrypt(message: string, otherPublicKey: string): Promise<any> {
    const SEA = Gun.SEA;
    const pair = {epub: otherPublicKey, epriv: this.privateKey, pub: '', priv: ''};
    const data = await SEA.encrypt(
      message, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (SEA as any).secret(otherPublicKey, pair));
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async decrypt(encryptedMessage: any, otherPublicKey: string): Promise<string> {
    const SEA = Gun.SEA;
    const pair = {epub: otherPublicKey, epriv: this.privateKey, pub: '', priv: ''};
    const message = await SEA.decrypt(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      encryptedMessage, (SEA as any).secret(otherPublicKey, pair));
    if (typeof message === 'string') {
        return message;
    }
    throw new Error('Not permitted to decrypt this message');
  }

  public async login(username: string, password: string): Promise<ILogin> {
    const result = await this.client.mutate({mutation: loginMutation, variables: {username, password}, fetchPolicy: 'no-cache'}) as ApolloQueryResult<{login: ILogin}>;
    if (result.data.login.expires instanceof Date) {
      result.data.login.expires = result.data.login.expires.toString();
    }
    if (typeof result.data.login.expires === 'string') {
      this.setLogin({
        token: result.data.login.token,
        userId: result.data.login.userId, 
        expires: result.data.login.expires,
        privateKey: result.data.login.privateKey,
        state: result.data.login.state
      });
    }
    if (typeof result.data.login.refreshToken === 'string') {
      this.setRefreshToken(result.data.login.refreshToken, result.data.login.refreshTokenExpiry);
    }
    return result.data.login;
  }

  public async refreshToken(withPrivateKey = false): Promise<ILogin> {
    const result = await this.client.mutate({
      mutation: refreshTokenMutation, 
      variables: {withPrivateKey},
      fetchPolicy: 'no-cache'}) as ApolloQueryResult<{refreshToken: ILogin}>;
    if (result.data.refreshToken.expires instanceof Date) {
      result.data.refreshToken.expires = result.data.refreshToken.expires.toString();
    }
    if (typeof result.data.refreshToken.expires === 'string') {
      this.setLogin({
        token: result.data.refreshToken.token,
        userId: result.data.refreshToken.userId, 
        expires: result.data.refreshToken.expires,
        privateKey: result.data.refreshToken.privateKey,
        state: result.data.refreshToken.state
      });
    }
    if (typeof result.data.refreshToken.refreshToken === 'string') {
      this.setRefreshToken(result.data.refreshToken.refreshToken, result.data.refreshToken.refreshTokenExpiry);
    }
    return result.data.refreshToken;
  }

  public async logout(): Promise<boolean> {
    const result = await this.client.mutate({mutation: logoutMutation, fetchPolicy: 'no-cache'}) as ApolloQueryResult<{logout: boolean}>;
    this.userId = undefined;
    this.expires = undefined;
    this.authenticated = false;
    this.privateKey = '';
    if (w.setRefreshToken) {
      w.setRefreshToken.call(null, '', '');
    } 
    delete this.rt;
    delete this.rtExpiry;
    return result.data.logout;
  }
}
