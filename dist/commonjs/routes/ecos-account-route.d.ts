import { ApolloService } from '../services';
import { IRouteViewModel, ICustomElementViewModel, EventAggregator, IRouter } from 'aurelia';
import { IUser } from 'ecos-types';
import { I18N } from '@aurelia/i18n';
import { Configuration } from '../configuration';
import './ecos-account-route.css';
export declare class EcosAccountRoute implements IRouteViewModel, ICustomElementViewModel {
    private router;
    private eventAggregator;
    private i18n;
    private apollo;
    private conf;
    user: IUser;
    private events;
    language: string;
    constructor(router: IRouter, eventAggregator: EventAggregator, i18n: I18N, apollo: ApolloService, conf: Configuration);
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
        roles: string[];
    }>;
    logout(): Promise<void>;
    updateLanguage(): void;
    openLink(link: string): void;
    loadEcosEditProfileRoute(): void;
}
