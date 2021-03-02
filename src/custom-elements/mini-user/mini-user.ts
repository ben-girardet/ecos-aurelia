import { gql } from 'apollo-boost';
import { customElement, bindable, IDisposable, EventAggregator, ILogger, inject } from 'aurelia';
import { ApolloService } from './../../services/apollo-service';
import { IUser } from 'ecos-types';
import template from './mini-user.html';

@customElement({name: 'mini-user', template})
@inject(EventAggregator, ApolloService)
export class MiniUser {
  @bindable userId: string;

  private picture: {fileId: string, width: number, height: number}[];
  private firstname: string;
  private lastname: string;
  @bindable private onlyAvatar = false;
  @bindable private onlyName = false;
  @bindable private size: 'small' | 'medium' | 'large' = 'medium';

  private events: IDisposable[] = [];
  private log: ILogger;

  public static index = 0;

  public constructor(
    private eventAggregator: EventAggregator, 
    private apollo: ApolloService) {
    MiniUser.index++; 
  }

  public attached(): void {
    this.userIdChanged();
    this.events.push(this.eventAggregator.subscribe('user:changed', (userId) => {
      if (userId === this.userId) {
        this.userIdChanged(true);
      }
    }))
  }

  public async userIdChanged(force = false): Promise<void> {
    if (this.userId) {
      const user = await this.getUser(force ? 'network-only' : 'cache-first');
      this.firstname = user.firstname;
      this.lastname = user.lastname;
      this.picture = user.picture;
    }
  }

  public async getUser(fetchPolicy: 'cache-first' | 'network-only' = 'cache-first'): Promise<Partial<IUser>> {
    // TODO: find a way to clear the userId cache on edit
    // should be possible with fetch policy or such in apollo
    // need to learn anyway for same feature for topics
    if (!this.userId) {
      return null
    }
    const result = await this.apollo.client.query<{user: Partial<IUser>}>({query: gql`query User($userId: String!) {
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
    }`, variables: {userId: this.userId}, fetchPolicy});
    return result.data.user;
  }
}
