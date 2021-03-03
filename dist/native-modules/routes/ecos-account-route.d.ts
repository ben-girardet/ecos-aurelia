import { ApolloService } from '../services';
import { IRouteViewModel, ICustomElementViewModel, EventAggregator, IRouter } from 'aurelia';
import { IUser } from 'ecos-types';
import { I18N } from '@aurelia/i18n';
import './ecos-account-route.css';
export declare class EcosAccountRoute implements IRouteViewModel, ICustomElementViewModel {
    private router;
    private eventAggregator;
    private i18n;
    private apollo;
    user: IUser;
    private events;
    language: string;
    constructor(router: IRouter, eventAggregator: EventAggregator, i18n: I18N, apollo: ApolloService);
    binding(): Promise<void>;
    attached(): void;
    unload(): void;
    getUser(): Promise<{
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        mobile: string;
        picture: {
            fileId: string;
            width: number;
            height: number;
        }[];
    }>;
    logout(): Promise<void>;
    updateLanguage(): void;
    openLink(link: string): void;
    loadEcosEditProfileRoute(): void;
}
