import { EventAggregator } from 'aurelia';
import { ApolloService } from './../../services/apollo-service';
import { IUser } from 'ecos-types';
export declare class MiniUser {
    private eventAggregator;
    private apollo;
    userId: string;
    private picture;
    private firstname;
    private lastname;
    private onlyAvatar;
    private onlyName;
    private size;
    private events;
    private log;
    static index: number;
    constructor(eventAggregator: EventAggregator, apollo: ApolloService);
    attached(): void;
    userIdChanged(force?: boolean): Promise<void>;
    getUser(fetchPolicy?: 'cache-first' | 'network-only'): Promise<Partial<IUser>>;
}
