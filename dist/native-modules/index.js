import { Registration } from 'aurelia';
import { Configuration } from './configuration';
import { AureliaFastAdapter } from './adapters/fast-adapter';
import { ApolloService } from './services/apollo-service';
import * as EcosCustomElements from './custom-elements';
import * as EcosValueConverters from './value-converters';
import * as EcosRoutes from './routes';
import { EcosRouterAuthLifecycles } from './router-auth-lifecycles';
import { EcosRouterViewsLifecycles } from './router-views-lifecycles';
import { PageVisibility } from './page-visibility';
// TODO: find out if we can conditionnally import these styles
import './variables.css';
import './basics.css';
import './views.css';
import './typography.css';
import './fast-trick.css';
import './cropping.css';
// TODO: find out if we can conditionnally import these components
import { EcosHelpContainer } from './fast-components/ecos-help-container';
import { EcosIcon } from './fast-components/ecos-icon';
import { EcosNotification } from './fast-components/ecos-notification';
EcosHelpContainer;
EcosIcon;
EcosNotification;
export const Ecos = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    configure(config) {
        // console.log('ECOS: configure');
        return {
            register(container) {
                // console.log('ECOS: register');
                if (config.autoRegister) {
                    container.register(EcosRouterAuthLifecycles);
                    container.register(EcosRouterViewsLifecycles);
                    container.register(ApolloService);
                    // console.log('ECOS: registering custom elements', EcosCustomElements);
                    container.register(EcosCustomElements);
                    container.register(EcosValueConverters);
                    // console.log('ECOS: registering value converters', EcosValueConverters);
                    container.register(AureliaFastAdapter);
                    // console.log('ECOS: registering routes', EcosValueConverters);
                    container.register(EcosRoutes);
                }
                const configuration = new Configuration();
                configuration.apiHost = config.apiHost;
                configuration.unauthorizedDefaultRoute = config.unauthorizedDefaultRoute;
                configuration.authorizedDefaultRoute = config.authorizedDefaultRoute;
                configuration.includeRefreshToken = config.includeRefreshToken;
                configuration.apolloHiddenMessages = config.apolloHiddenMessages;
                // console.log('register configuration', configuration);
                container.register(Registration.instance(Configuration, configuration));
                if (!configuration.disablePageVisibility) {
                    container.register(PageVisibility);
                    const pageVisibility = container.get(PageVisibility);
                    pageVisibility.listen();
                }
            }
        };
    }
};
export { EcosCustomElements };
export { EcosValueConverters };
export * from './adapters';
export * from './custom-elements';
export * from './fast-components';
export * from './gql';
export * from './routes';
export * from './services';
export * from './value-converters';
export * from './configuration';
export * from './ecos-app';
export * from './page-visibility';
export * from './util';
import * as EcosFrLocale from './locales/fr/ecos.json';
import * as EcosEnLocale from './locales/en/ecos.json';
export { EcosFrLocale };
export { EcosEnLocale };
