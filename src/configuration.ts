export interface IConfiguration {
  autoRegister?: boolean;
  apiHost: string;
  unauthorizedDefaultRoute: string;
  authorizedDefaultRoute: string;
  includeRefreshToken?: boolean;
  apolloHiddenMessages?: string[];
  disablePageVisibility?: boolean;
}
export class Configuration implements IConfiguration {
  public apiHost: string;
  public unauthorizedDefaultRoute: string;
  public authorizedDefaultRoute: string;
  public includeRefreshToken?: boolean;
  public apolloHiddenMessages?: string[];
  public disablePageVisibility?: boolean;
}