import { IToken } from 'ecos-types';
import { ApolloService } from '../../services/apollo-service';
import { gql } from 'apollo-boost';
import { AvatarSelection } from './../avatar-selection/avatar-selection';
import { customElement, ICustomElementViewModel, Constructable, IRouter, ILogger, IDisposable, inject, bindable, EventAggregator } from 'aurelia';
import { EcosNotification } from '../../fast-components/ecos-notification';
import PhoneNumber from 'awesome-phonenumber';
import { Configuration } from '../../configuration';
import { RegisterCommands } from '../../gql/register';
import { UserCommands } from '../../gql/user';
import { CordovaService } from '../../services/cordova-service';
import { CordovaPushService } from '../../services/cordova-push-service';

// TODO: import type from ecos-types
interface Image {
  fileId: string;
  width: number;
  height: number;
}

@customElement('registration-sms')
@inject()
export class RegistrationSms implements ICustomElementViewModel {

  @bindable welcomeComponent: Constructable | undefined;
  @bindable finishComponent: Constructable | undefined;

  private step: 'welcome' | 'mobile' | 'validation' | 'identity' | 'finish' = 'welcome';
  private mobile = '';
  private regionCode = 'ch';
  private isMobileValid = false;
  private countryCode: number;
  private validationCode = '';
  private invalidCode = false;
  private firstname = '';
  private lastname = '';
  public preview: string;

  private token: IToken;
  private userId: string;
  
  private avatar: AvatarSelection;
  private loading = false;
  
  private logger: ILogger;

  public constructor(
    @IRouter private router: IRouter, 
    @ILogger iLogger: ILogger,
    private eventAggregator: EventAggregator,
    private push: CordovaPushService,
    private apollo: ApolloService,
    private conf: Configuration,
    private registerCommands: RegisterCommands,
    private userCommands: UserCommands,
    private cordova: CordovaService
    ) {
    this.logger = iLogger.scopeTo('register route');
  }

  public async binding(): Promise<void> {
    if (this.apollo.authenticated && this.apollo.getState() === 1) {
      this.router.load(this.conf.authorizedDefaultRoute);
    } else {
      console.log('binding', 'this.apollo', this.apollo);
      this.apollo.client.clearStore();
    }
  }

  // public load(parameters: Params): void {
  //   if (parameters[0] === 'identity') {
  //     this.step = 'identity';
  //   }
  // }

  public attached(): void {
    this.countryChanged();
    const starts = document.querySelectorAll('start');
    const start = starts.length === 2 ? starts[1] : starts[0];
    if (starts.length === 2) {
      (starts[0] as HTMLElement).style.display = 'none';
    }
    start.classList.add('start-container');
  }

  private transitioning = false;

  public async prev(step: string): Promise<void> {
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
      }, {once: true});
    } catch (error) {
      // what should we do ??
    }
    this.transitioning = false;
  }

  public async next(step: 'welcome' | 'mobile' | 'validation' | 'identity' | 'finish'): Promise<void> {
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
      }, {once: true});
    } catch (error) {
      // what should we do ??
    }
    this.transitioning = false;
  }

  private setPrevNext() {
    const currentElement = document.querySelector(`.start-container .start--current`);
    if (currentElement instanceof HTMLElement) {
      currentElement.classList.remove('start--showing');
      currentElement.classList.remove('start--next');
      currentElement.classList.remove('start--prev');
      this.setNext(currentElement);
      this.setPrev(currentElement);
    }
  }

  private setNext(el: HTMLElement) {
    const sib = el.nextElementSibling;
    if (sib instanceof HTMLElement) {
      sib.classList.remove('start--current');
      sib.classList.remove('start--prev');
      sib.classList.add('start--next');
      this.setNext(sib);
    }
  }

  private setPrev(el: HTMLElement) {
    const sib = el.previousElementSibling;
    if (sib instanceof HTMLElement) {
      sib.classList.remove('start--current');
      sib.classList.remove('start--next');
      sib.classList.add('start--prev');
      this.setPrev(sib);
    }
  }

  public countryChanged(): void {
    this.countryCode = PhoneNumber.getCountryCodeForRegionCode(this.regionCode);
    this.mobileChanged();
  }

  public mobileChanged(): void {
    this.isMobileValid = new PhoneNumber(this.mobile, this.regionCode).isValid();
  }

  public async requestMobileCode(event: Event | null, again = false): Promise<void> {
    if (event) {
      event.preventDefault();
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    if (!this.mobile) {
      EcosNotification.notify('Please enter a valid mobile number', 'info');
      return;
    }
    try {
      const pn = new PhoneNumber(this.mobile, this.regionCode);
      if (!pn.isValid()) {
        throw new Error('Please enter a valid mobile number');
      }
      this.token = await this.registerCommands.requestMobileCode(pn.getNumber());
      if (!again) {
        this.next('validation');
      } else {
        EcosNotification.notify('The code has been sent again', 'success');
      }
    } catch (error) {
      if (error.message.includes('No correct phone numbers')) {
        EcosNotification.notify('Invalid phone number', 'info');
      } else {
        EcosNotification.notify(error.message, 'info');
      }
    }
    this.loading = false;
    return;
  }

  public codeChanged(): void {
    if (this.validationCode.length === 6) {
      this.validateCode(null, true);
    }
  }

  public validationField: HTMLElement;
  public async validateCode(event: Event | null, silent = false): Promise<void> {
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
    } catch (error) {
      if (!silent) {
        if (error.message.includes('Token not found')) {
          EcosNotification.notify('Invalid code', 'info');
          this.invalidCode = true;
        } else {
          EcosNotification.notify(error.message, 'info');
        }
      }
    }
    this.loading = false;
    return;
  }

  public async getIdentity(): Promise<void> {
    if (!this.apollo.getUserId()) {
      return null
    }
    try {
      console.log('getIdentity', 'this.apollo', this.apollo);
      const result = await this.apollo.client.query<{user: {
        id: string,
        firstname: string, 
        lastname: string, 
        picture: {fileId: string, width: number, height: number}[]}}>({query: gql`query User($userId: String!) {
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
      }`, variables: {userId: this.apollo.getUserId()}, fetchPolicy: 'network-only'});
      this.firstname = result.data.user.firstname;
      this.lastname = result.data.user.lastname;
      this.preview = result.data.user.picture && result.data.user.picture.length ? result.data.user.picture.find(i => i.height > 50 && i.width > 50).fileId : '';
    } catch (error) {
      // do nothing
    }
  }

  public async setIdentity(event: Event | null): Promise<void> {
    console.log('setIdentity');
    if (event) {
      event.preventDefault();
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const editUserData: {firstname?: string, lastname?: string, picture?: Image[]} = {};
      editUserData.firstname = this.firstname;
      editUserData.lastname = this.lastname;
      if (this.avatar) {
        if (this.avatar.avatar === 'image') {
          const imageData = await this.avatar.imageService.publish();
          if (imageData !== 'no-change') {
            editUserData.picture = [
              {fileId: imageData.small, width: 40, height: 40},
              {fileId: imageData.medium, width: 100, height: 1000},
              {fileId: imageData.large, width: 1000, height: 1000},
            ]
          }
        } else if (this.avatar.avatar !== 'original') {
          editUserData.picture = [
            {fileId: `static:${this.avatar.avatar}.gif`, width: 40, height: 40},
            {fileId: `static:${this.avatar.avatar}.gif`, width: 100, height: 100},
            {fileId: `static:${this.avatar.avatar}.gif`, width: 1000, height: 1000},
          ];
        }
      }
      console.log('editMe', editUserData);
      await this.userCommands.editMe(editUserData.firstname, editUserData.lastname, editUserData.picture);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (this.finishComponent) {
        this.next('finish');
      } else {
        this.router.load(this.conf.authorizedDefaultRoute);
      }
    } catch (error) {
      EcosNotification.notify(error.message, 'info');
    }
    this.loading = false;
    return;
  }

  public notificationPrayer = true;
  public notificationAnswer = true;
  public notificationMessage = false;  
  private notificationsTags: string[] = [];
  private regSub: IDisposable;

  public async setNotification(event: Event): Promise<void> {
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
        this.regSub = this.eventAggregator.subscribeOnce('push:registration', async (data: PhonegapPluginPush.RegistrationEventResponse) => {
          this.toggleDisabledNotificationDialog(false);
          await this.userCommands.editMe(undefined, undefined, undefined, data.registrationId, this.push.regType, this.notificationsTags, true);
          this.router.load(this.conf.authorizedDefaultRoute);
        });
        this.push.init();
        const enabled = await this.push.hasPermission();
        if (enabled === true) {
          // if enabled => we set the user/player/regid
        } else if (enabled === false) {
          // here we should display a screen/info
          // explaining that notifications have been disabled for
          // this app and that the user should go
          // in the settings to enable them again
          this.toggleDisabledNotificationDialog(true);
        } else {
          // if unknown, let's see what we can do ?
          // probably wait for registration
        }
      } else {
        if (this.regSub) {
          this.regSub.dispose();
          delete this.regSub;
        }
        await this.userCommands.editMe(undefined, undefined, undefined, '', undefined, [], false);
        this.router.load(this.conf.authorizedDefaultRoute);
      }
    } catch (error) {
      EcosNotification.notify(error.message, 'error');
    }

    this.loading = false;
    return;
  }

  public skipNotifications(): void {
    this.toggleDisabledNotificationDialog(false);
    if (this.regSub) {
      this.regSub.dispose();
      delete this.regSub;
    }
    this.router.load(this.conf.authorizedDefaultRoute);
  }

  private disabledNotificationDialog: HTMLElement;
  public toggleDisabledNotificationDialog(force?: boolean): void {
    if (force !== undefined) {
      force = !force;
    }
    this.disabledNotificationDialog.toggleAttribute('hidden', force);
  }

  public openNotificationsSettings(): void {
    this.toggleDisabledNotificationDialog(false);
    this.cordova.openNativeSettings('notification_id');
  }
}
