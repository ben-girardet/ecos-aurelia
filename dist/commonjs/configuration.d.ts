export interface IConfiguration {
    autoRegister?: boolean;
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefreshToken?: boolean;
    apolloHiddenMessages?: string[];
    disablePageVisibility?: boolean;
}
export declare class Configuration implements IConfiguration {
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefreshToken?: boolean;
    apolloHiddenMessages?: string[];
    disablePageVisibility?: boolean;
}
