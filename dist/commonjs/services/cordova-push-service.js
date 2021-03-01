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
exports.CordovaPushService = void 0;
const ecos_notification_1 = require("./../fast-components/ecos-notification");
// Uncomment the following line to have VS Code intellisence
// But comment it for proper build
// import '@havesource/cordova-plugin-push/types';
const aurelia_1 = require("aurelia");
let CordovaPushService = class CordovaPushService {
    constructor(eventAggregator, logger) {
        this.eventAggregator = eventAggregator;
        this.permission = undefined;
        this.logger = logger.scopeTo('push');
    }
    init() {
        this.logger.debug('init');
        this.push = PushNotification.init({
            ios: {
                alert: true,
                badge: true,
                sound: true,
            }
        });
        this.listen();
    }
    async hasPermission() {
        this.logger.debug('hasPersmission');
        try {
            this.permission = await new Promise((resolve, reject) => {
                PushNotification.hasPermission((data) => {
                    this.logger.debug('hasPermission data', data);
                    resolve(data.isEnabled);
                }, () => {
                    this.logger.debug('hasPermission errored');
                    reject();
                });
            });
        }
        catch (error) {
            this.permission = undefined;
        }
        return this.permission;
    }
    listen() {
        this.logger.debug('listen');
        this.push.on('registration', (data) => {
            this.logger.debug('registration', data);
            this.regId = data.registrationId;
            this.regType = data.registrationType === 'APNS' ? 'apn' : 'fcm';
            this.eventAggregator.publish('push:registration', data);
        });
        this.push.on('notification', (data) => {
            this.logger.debug('notification', data);
            this.eventAggregator.publish('push:notification', data);
        });
        this.push.on('error', (error) => {
            this.logger.error(error);
            ecos_notification_1.EcosNotification.notify(error.message, 'error');
        });
    }
    clearAllNotifications() {
        return new Promise((resolve, reject) => {
            this.push.clearAllNotifications(() => {
                resolve();
            }, reject);
        });
    }
    setApplicationIconBadgeNumber(number) {
        return new Promise((resolve, reject) => {
            this.push.setApplicationIconBadgeNumber(() => {
                resolve();
            }, reject, number);
        });
    }
};
CordovaPushService = __decorate([
    __param(1, aurelia_1.ILogger),
    __metadata("design:paramtypes", [aurelia_1.EventAggregator, Object])
], CordovaPushService);
exports.CordovaPushService = CordovaPushService;
