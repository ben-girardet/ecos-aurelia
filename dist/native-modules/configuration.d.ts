export interface IConfiguration {
    autoRegister?: boolean;
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefrehToken?: boolean;
}
export declare class Configuration implements IConfiguration {
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
    includeRefrehToken?: boolean;
}
