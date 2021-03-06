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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloService = void 0;
console.log('ECOS: top of apollo service');
const ecos_notification_1 = require("../fast-components/ecos-notification");
const apollo_boost_1 = __importDefault(require("apollo-boost"));
const login_1 = require("../gql/login");
const moment_1 = __importDefault(require("moment"));
const configuration_1 = require("../configuration");
const aurelia_1 = require("aurelia");
const gun_1 = __importDefault(require("gun"));
require("gun/sea");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window;
w.getRefreshToken = function () {
    return window.localStorage.getItem('refreshToken');
};
w.getRefreshTokenExpiry = function () {
    return window.localStorage.getItem('refreshTokenExpiry');
};
w.setRefreshToken = function (refreshToken, refreshTokenExpiry) {
    window.localStorage.setItem('refreshToken', refreshToken);
    window.localStorage.setItem('refreshTokenExpiry', refreshTokenExpiry);
};
let ApolloService = class ApolloService {
    constructor(conf) {
        this.conf = conf;
        this.authenticated = false;
        this.isOutOfDate = false;
        console.log('apollowService constructor', conf);
        this.client = new apollo_boost_1.default({
            uri: `${this.conf.apiHost}/graphql`,
            credentials: 'include',
            request: async (operation) => {
                var _a;
                // the window.device object is populated by: `cordova-plugin-device`
                if (typeof ((_a = w.device) === null || _a === void 0 ? void 0 : _a.platform) === 'string') {
                    operation.setContext(context => ({
                        headers: Object.assign(Object.assign({}, context.headers), { "client-version": "VERSIONNB", "client-platform": `${w.device.platform.toLowerCase()}` })
                    }));
                }
                if (conf.includeRefreshToken === true) {
                    operation.setContext(context => ({
                        headers: Object.assign(Object.assign({}, context.headers), { "ecos-params": "include-refresh-token" })
                    }));
                }
                if (operation.operationName !== 'Login' && operation.operationName !== 'RefreshToken' && !this.isTokenValid() && this.getUserId()) {
                    await this.refreshToken();
                }
                if (operation.operationName === 'RefreshToken' && this.getRefreshToken()) {
                    operation.setContext(context => ({
                        headers: Object.assign(Object.assign({}, context.headers), { "refresh-token": this.getRefreshToken() })
                    }));
                }
                const token = this.getToken();
                if (token && operation.operationName !== 'RefreshToken' && operation.operationName !== 'Login') {
                    operation.setContext(context => ({
                        headers: Object.assign(Object.assign({}, context.headers), { authorization: `Bearer ${token}` })
                    }));
                }
            },
            onError: (error) => {
                var _a, _b, _c;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const networkError = error.networkError;
                if (((_a = networkError === null || networkError === void 0 ? void 0 : networkError.result) === null || _a === void 0 ? void 0 : _a.error) === 'Out of date client') {
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
                if ((_b = error.networkError) === null || _b === void 0 ? void 0 : _b.message) {
                    messages.push((_c = error.networkError) === null || _c === void 0 ? void 0 : _c.message);
                }
                if (messages.length) {
                    ecos_notification_1.EcosNotification.notify(`${messages.join('; ')}`, 'error');
                }
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.__APOLLO_CLIENT__ = this.client;
    }
    setLogin(login) {
        if (typeof login.expires === 'string') {
            const expDate = moment_1.default(login.expires);
            this.expires = expDate;
            this.authenticated = true;
            this.jwt = login.token;
            this.privateKey = login.privateKey;
            this.state = login.state;
        }
        else {
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
    setRefreshToken(refreshToken, refreshTokenExpiry) {
        if (w.setRefreshToken) {
            w.setRefreshToken.call(null, refreshToken, refreshTokenExpiry);
        }
        else {
            this.rt = refreshToken;
            this.rtExpiry = moment_1.default(refreshTokenExpiry);
        }
    }
    setState(state) {
        this.state = state;
    }
    getState() {
        return this.state;
    }
    isTokenValid() {
        if (this.expires === undefined) {
            return false;
        }
        if (moment_1.default.isMoment(this.expires)) {
            return this.expires.isAfter(moment_1.default());
        }
        else {
            return false;
        }
    }
    getUserId() {
        return this.userId;
    }
    getToken() {
        return this.jwt;
    }
    getJWT() {
        return this.jwt;
    }
    getRefreshToken() {
        const refreshToken = w.getRefreshToken ? w.getRefreshToken() : this.rt;
        const refreshTokenExpiry = w.getRefreshTokenExpiry ? moment_1.default(w.getRefreshTokenExpiry()) : this.rtExpiry;
        if (refreshToken && refreshTokenExpiry && refreshTokenExpiry.isValid() && refreshTokenExpiry.isAfter(moment_1.default())) {
            return refreshToken;
        }
        if (w.setRefreshToken) {
            w.setRefreshToken.call(null, '', '');
        }
        delete this.rt;
        delete this.rtExpiry;
        return null;
    }
    async refresh() {
        try {
            // when the refreshToken command is successfull
            // it calls the apolloAuth setLogin method
            await this.refreshToken(!this.privateKey);
            if (!this.isTokenValid() || !this.authenticated) {
                return false;
            }
            return true;
        }
        catch (error) {
            // silent refresh failing
            return false;
        }
    }
    async isAuthenticated() {
        if (this.authenticated && this.isTokenValid()) {
            return true;
        }
        return await this.refresh();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async encrypt(message, otherPublicKey) {
        const SEA = gun_1.default.SEA;
        const pair = { epub: otherPublicKey, epriv: this.privateKey, pub: '', priv: '' };
        const data = await SEA.encrypt(message, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        SEA.secret(otherPublicKey, pair));
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async decrypt(encryptedMessage, otherPublicKey) {
        const SEA = gun_1.default.SEA;
        const pair = { epub: otherPublicKey, epriv: this.privateKey, pub: '', priv: '' };
        const message = await SEA.decrypt(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        encryptedMessage, SEA.secret(otherPublicKey, pair));
        if (typeof message === 'string') {
            return message;
        }
        throw new Error('Not permitted to decrypt this message');
    }
    async login(username, password) {
        const result = await this.client.mutate({ mutation: login_1.loginMutation, variables: { username, password }, fetchPolicy: 'no-cache' });
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
    async refreshToken(withPrivateKey = false) {
        const result = await this.client.mutate({
            mutation: login_1.refreshTokenMutation,
            variables: { withPrivateKey },
            fetchPolicy: 'no-cache'
        });
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
    async logout() {
        const result = await this.client.mutate({ mutation: login_1.logoutMutation, fetchPolicy: 'no-cache' });
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
};
ApolloService = __decorate([
    aurelia_1.inject(configuration_1.Configuration),
    __metadata("design:paramtypes", [configuration_1.Configuration])
], ApolloService);
exports.ApolloService = ApolloService;
