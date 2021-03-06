export interface IConfiguration {
    autoRegister?: boolean;
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefreshToken?: boolean;
    apolloHiddenMessages?: string[];
}
export declare class Configuration implements IConfiguration {
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefreshToken?: boolean;
    apolloHiddenMessages?: string[];
}
