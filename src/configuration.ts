export interface IConfiguration {
  autoRegister?: boolean;
  apiHost: string;
  unauthorizedDefaultRoute: string;
  authorizedDefaultRoute: string;
  includeRefreshToken?: boolean;
  apolloHiddenMessages?: string[];
}
export class Configuration implements IConfiguration {
  public apiHost: string;
  public unauthorizedDefaultRoute: string;
  public authorizedDefaultRoute: string;
  public includeRefreshToken?: boolean;
  public apolloHiddenMessages?: string[];
}