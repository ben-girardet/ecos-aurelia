import { EcosNotification } from '../fast-components';
import { ApolloService } from '../services';
import { gql } from 'apollo-boost';
import { inject, IRouteViewModel, ICustomElementViewModel, IDisposable, EventAggregator, IRouter } from 'aurelia';
import { IUser } from 'ecos-types';
import { I18N } from '@aurelia/i18n';
import { Configuration } from '../configuration';
import './ecos-account-route.css';

@inject(IRouter, EventAggregator, I18N, ApolloService, Configuration)
export class EcosAccountRoute implements IRouteViewModel, ICustomElementViewModel {

  public user: IUser;
  private events: IDisposable[] = [];
  public language: string;

  public constructor(
    @IRouter private router: IRouter, 
    private eventAggregator: EventAggregator, 
    private i18n: I18N,
    private apollo: ApolloService,
    private conf: Configuration) {
  }

  public async binding(): Promise<void> {
    this.user = await this.getUser();
    this.events.push(this.eventAggregator.subscribe('user:changed', async (userId: string) => {
      if (userId === this.user.id) {
        this.user = await this.getUser();
      }
    }));
  }

  public attached(): void {
    this.language = this.i18n.getLocale();
  }

  public unload(): void {
    for (const event of this.events) {
      event.dispose();
    }
    this.events = [];
  }

  public async getUser(): Promise<{id: string, firstname: string, lastname: string, email: string, mobile: string, picture:{fileId: string, width: number, height: number}[]}> {
    if (!this.apollo.getUserId()) {
      return null
    }
    const result = await this.apollo.client.query<{user: {
      id: string,
      firstname: string, 
      lastname: string, 
      email: string,
      mobile: string,
      picture: {fileId: string, width: number, height: number}[]}}>({query: gql`query User($userId: String!) {
user(id: $userId) {
  id,
  firstname,
  lastname,
  email,
  mobile,
  picture {
    fileId,
    width,
    height
  }
}
    }`, variables: {userId: this.apollo.getUserId()}, fetchPolicy: 'network-only'});
    return result.data.user;
  }

  public async logout(): Promise<void> {
    try {
      // await this.userCommands.logout();
      await this.apollo.logout();
      this.eventAggregator.publish('logout');
      this.router.load(this.conf.unauthorizedDefaultRoute);
    } catch (error) {
      EcosNotification.notify(error.message, 'error');
    }
  }

  public updateLanguage(): void {
    this.i18n.setLocale(this.language);
    this.eventAggregator.publish('app:locale:changed');
  }

  public openLink(link: string): void {
    location.href = link;
  }

  public loadEcosEditProfileRoute(): void {
    // this.router.load({component: EcosEditProfileRoute, viewport: 'bottom'});
    this.router.load('+ecos-edit-profile-route@bottom');
  }
}
