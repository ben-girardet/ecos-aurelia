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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationSms = void 0;
const apollo_service_1 = require("../../services/apollo-service");
const apollo_boost_1 = require("apollo-boost");
const aurelia_1 = require("aurelia");
const ecos_notification_1 = require("../../fast-components/ecos-notification");
const awesome_phonenumber_1 = __importDefault(require("awesome-phonenumber"));
const configuration_1 = require("../../configuration");
const register_1 = require("../../gql/register");
const user_1 = require("../../gql/user");
const cordova_service_1 = require("../../services/cordova-service");
const cordova_push_service_1 = require("../../services/cordova-push-service");
const registration_sms_html_1 = __importDefault(require("./registration-sms.html"));
let RegistrationSms = class RegistrationSms {
    constructor(router, iLogger, eventAggregator, push, apollo, conf, registerCommands, userCommands, cordova) {
        this.router = router;
        this.eventAggregator = eventAggregator;
        this.push = push;
        this.apollo = apollo;
        this.conf = conf;
        this.registerCommands = registerCommands;
        this.userCommands = userCommands;
        this.cordova = cordova;
        this.step = 'welcome';
        this.mobile = '';
        this.regionCode = 'ch';
        this.isMobileValid = false;
        this.validationCode = '';
        this.invalidCode = false;
        this.firstname = '';
        this.lastname = '';
        this.loading = false;
        this.transitioning = false;
        this.notificationPrayer = true;
        this.notificationAnswer = true;
        this.notificationMessage = false;
        this.notificationsTags = [];
        this.logger = iLogger.scopeTo('register route');
    }
    async binding() {
        if (this.apollo.authenticated && this.apollo.getState() === 1) {
            this.router.load(this.conf.authorizedDefaultRoute);
        }
        else {
            console.log('binding', 'this.apollo', this.apollo);
            this.apollo.client.clearStore();
        }
    }
    // public load(parameters: Params): void {
    //   if (parameters[0] === 'identity') {
    //     this.step = 'identity';
    //   }
    // }
    attached() {
        this.countryChanged();
        const starts = document.querySelectorAll('start');
        const start = starts.length === 2 ? starts[1] : starts[0];
        if (starts.length === 2) {
            starts[0].style.display = 'none';
        }
        start.classList.add('start-container');
    }
    async prev(step) {
        if (this.transitioning) {
            return;
        }
        try {
            this.transitioning = true;
            const stepElement = document.querySelector(`.start-container .start-${step}`);
            const currentElement = document.querySelector(`.start-container .start--current`);
            if (!stepElement || !currentElement) {
                return;
            }
            stepElement.classList.add('start--prev');
            await new Promise(resolve => setTimeout(resolve, 200));
            stepElement.classList.add('start--showing');
            stepElement.addEventListener('transitionend', () => {
                currentElement.classList.remove('start--current');
                stepElement.classList.add('start--current');
                this.setPrevNext();
            }, { once: true });
        }
        catch (error) {
            // what should we do ??
        }
        this.transitioning = false;
    }
    async next(step) {
        console.log('next', step);
        if (this.transitioning) {
            return;
        }
        try {
            this.transitioning = true;
            const stepElement = document.querySelector(`.start-container .start-${step}`);
            const currentElement = document.querySelector(`.start-container .start--current`);
            if (!stepElement || !currentElement) {
                return;
            }
            stepElement.classList.add('start--next');
            await new Promise(resolve => setTimeout(resolve, 200));
            stepElement.classList.add('start--showing');
            stepElement.addEventListener('transitionend', () => {
                currentElement.classList.remove('start--current');
                stepElement.classList.add('start--current');
                this.setPrevNext();
            }, { once: true });
        }
        catch (error) {
            // what should we do ??
        }
        this.transitioning = false;
    }
    setPrevNext() {
        const currentElement = document.querySelector(`.start-container .start--current`);
        if (currentElement instanceof HTMLElement) {
            currentElement.classList.remove('start--showing');
            currentElement.classList.remove('start--next');
            currentElement.classList.remove('start--prev');
            this.setNext(currentElement);
            this.setPrev(currentElement);
        }
    }
    setNext(el) {
        const sib = el.nextElementSibling;
        if (sib instanceof HTMLElement) {
            sib.classList.remove('start--current');
            sib.classList.remove('start--prev');
            sib.classList.add('start--next');
            this.setNext(sib);
        }
    }
    setPrev(el) {
        const sib = el.previousElementSibling;
        if (sib instanceof HTMLElement) {
            sib.classList.remove('start--current');
            sib.classList.remove('start--next');
            sib.classList.add('start--prev');
            this.setPrev(sib);
        }
    }
    countryChanged() {
        this.countryCode = awesome_phonenumber_1.default.getCountryCodeForRegionCode(this.regionCode);
        this.mobileChanged();
    }
    mobileChanged() {
        this.isMobileValid = new awesome_phonenumber_1.default(this.mobile, this.regionCode).isValid();
    }
    async requestMobileCode(event, again = false) {
        if (event) {
            event.preventDefault();
        }
        if (this.loading) {
            return;
        }
        this.loading = true;
        if (!this.mobile) {
            ecos_notification_1.EcosNotification.notify('Please enter a valid mobile number', 'info');
            return;
        }
        try {
            const pn = new awesome_phonenumber_1.default(this.mobile, this.regionCode);
            if (!pn.isValid()) {
                throw new Error('Please enter a valid mobile number');
            }
            this.token = await this.registerCommands.requestMobileCode(pn.getNumber());
            if (!again) {
                this.next('validation');
            }
            else {
                ecos_notification_1.EcosNotification.notify('The code has been sent again', 'success');
            }
        }
        catch (error) {
            if (error.message.includes('No correct phone numbers')) {
                ecos_notification_1.EcosNotification.notify('Invalid phone number', 'info');
            }
            else {
                ecos_notification_1.EcosNotification.notify(error.message, 'info');
            }
        }
        this.loading = false;
        return;
    }
    codeChanged() {
        if (this.validationCode.length === 6) {
            this.validateCode(null, true);
        }
    }
    async validateCode(event, silent = false) {
        if (event) {
            event.preventDefault();
        }
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            if (this.validationCode.length !== 6) {
                throw new Error('Validation code must have 6 digits');
            }
            await this.registerCommands.validateCode(this.token.token, this.validationCode);
            this.validationField.blur();
            await this.getIdentity();
            this.next('identity');
        }
        catch (error) {
            if (!silent) {
                if (error.message.includes('Token not found')) {
                    ecos_notification_1.EcosNotification.notify('Invalid code', 'info');
                    this.invalidCode = true;
                }
                else {
                    ecos_notification_1.EcosNotification.notify(error.message, 'info');
                }
            }
        }
        this.loading = false;
        return;
    }
    async getIdentity() {
        if (!this.apollo.getUserId()) {
            return null;
        }
        try {
            console.log('getIdentity', 'this.apollo', this.apollo);
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
      }`, variables: { userId: this.apollo.getUserId() }, fetchPolicy: 'network-only' });
            this.firstname = result.data.user.firstname;
            this.lastname = result.data.user.lastname;
            this.preview = result.data.user.picture && result.data.user.picture.length ? result.data.user.picture.find(i => i.height > 50 && i.width > 50).fileId : '';
        }
        catch (error) {
            // do nothing
        }
    }
    async setIdentity(event) {
        console.log('setIdentity');
        if (event) {
            event.preventDefault();
        }
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const editUserData = {};
            editUserData.firstname = this.firstname;
            editUserData.lastname = this.lastname;
            if (this.avatar) {
                if (this.avatar.avatar === 'image') {
                    const imageData = await this.avatar.imageService.publish();
                    if (imageData !== 'no-change') {
                        editUserData.picture = [
                            { fileId: imageData.small, width: 40, height: 40 },
                            { fileId: imageData.medium, width: 100, height: 1000 },
                            { fileId: imageData.large, width: 1000, height: 1000 },
                        ];
                    }
                }
                else if (this.avatar.avatar !== 'original') {
                    editUserData.picture = [
                        { fileId: `static:${this.avatar.avatar}.gif`, width: 40, height: 40 },
                        { fileId: `static:${this.avatar.avatar}.gif`, width: 100, height: 100 },
                        { fileId: `static:${this.avatar.avatar}.gif`, width: 1000, height: 1000 },
                    ];
                }
            }
            console.log('editMe', editUserData);
            await this.userCommands.editMe(editUserData.firstname, editUserData.lastname, editUserData.picture);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (this.finishComponent) {
                this.next('finish');
            }
            else {
                this.router.load(this.conf.authorizedDefaultRoute);
            }
        }
        catch (error) {
            ecos_notification_1.EcosNotification.notify(error.message, 'info');
        }
        this.loading = false;
        return;
    }
    async setNotification(event) {
        if (event) {
            event.preventDefault();
        }
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            this.notificationsTags = [];
            if (this.notificationPrayer) {
                this.notificationsTags.push('prayer');
            }
            if (this.notificationAnswer) {
                this.notificationsTags.push('answer');
            }
            if (this.notificationMessage) {
                this.notificationsTags.push('message');
            }
            if (this.notificationsTags.length) {
                // this should trigger a request from the app
                // TODO: here we must add a listener for 'push-registration'
                // from there we get the registrationId and we can set the right
                // tags to the player, linked to the userId
                if (this.regSub) {
                    this.regSub.dispose();
                    delete this.regSub;
                }
                this.regSub = this.eventAggregator.subscribeOnce('push:registration', async (data) => {
                    this.toggleDisabledNotificationDialog(false);
                    await this.userCommands.editMe(undefined, undefined, undefined, data.registrationId, this.push.regType, this.notificationsTags, true);
                    this.router.load(this.conf.authorizedDefaultRoute);
                });
                this.push.init();
                const enabled = await this.push.hasPermission();
                if (enabled === true) {
                    // if enabled => we set the user/player/regid
                }
                else if (enabled === false) {
                    // here we should display a screen/info
                    // explaining that notifications have been disabled for
                    // this app and that the user should go
                    // in the settings to enable them again
                    this.toggleDisabledNotificationDialog(true);
                }
                else {
                    // if unknown, let's see what we can do ?
                    // probably wait for registration
                }
            }
            else {
                if (this.regSub) {
                    this.regSub.dispose();
                    delete this.regSub;
                }
                await this.userCommands.editMe(undefined, undefined, undefined, '', undefined, [], false);
                this.router.load(this.conf.authorizedDefaultRoute);
            }
        }
        catch (error) {
            ecos_notification_1.EcosNotification.notify(error.message, 'error');
        }
        this.loading = false;
        return;
    }
    skipNotifications() {
        this.toggleDisabledNotificationDialog(false);
        if (this.regSub) {
            this.regSub.dispose();
            delete this.regSub;
        }
        this.router.load(this.conf.authorizedDefaultRoute);
    }
    toggleDisabledNotificationDialog(force) {
        if (force !== undefined) {
            force = !force;
        }
        this.disabledNotificationDialog.toggleAttribute('hidden', force);
    }
    openNotificationsSettings() {
        this.toggleDisabledNotificationDialog(false);
        this.cordova.openNativeSettings('notification_id');
    }
};
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", Object)
], RegistrationSms.prototype, "welcomeComponent", void 0);
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", Object)
], RegistrationSms.prototype, "finishComponent", void 0);
RegistrationSms = __decorate([
    aurelia_1.customElement({ name: 'registration-sms', template: registration_sms_html_1.default }),
    aurelia_1.inject(),
    __param(0, aurelia_1.IRouter),
    __param(1, aurelia_1.ILogger),
    __metadata("design:paramtypes", [Object, Object, aurelia_1.EventAggregator,
        cordova_push_service_1.CordovaPushService,
        apollo_service_1.ApolloService,
        configuration_1.Configuration,
        register_1.RegisterCommands,
        user_1.UserCommands,
        cordova_service_1.CordovaService])
], RegistrationSms);
exports.RegistrationSms = RegistrationSms;
