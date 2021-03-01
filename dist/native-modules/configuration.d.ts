export interface IConfiguration {
    autoRegister?: boolean;
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
}
export declare class Configuration implements IConfiguration {
    apiHost: string;
    unauthorizedDefaultRoute: string;
    authorizedDefaultRoute: string;
}
