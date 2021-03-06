export interface IConfiguration {
    autoRegister?: boolean;
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefreshToken?: boolean;
}
export declare class Configuration implements IConfiguration {
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefreshToken?: boolean;
}
