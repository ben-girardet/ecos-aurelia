import { Registration } from 'aurelia';
import { Configuration } from './configuration';
import { AureliaFastAdapter } from './adapters/fast-adapter';
import { ApolloService } from './services/apollo-service';
import * as EcosCustomElements from './custom-elements';
import * as EcosValueConverters from './value-converters';
import { EcosRouterLifecycles } from './router-lifecycles';
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
        console.log('ECOS: configure');
        return {
            register(container) {
                console.log('ECOS: register');
                if (config.autoRegister) {
                    container.register(EcosRouterLifecycles);
                    container.register(ApolloService);
                    console.log('ECOS: registering custom elements', EcosCustomElements);
                    container.register(EcosCustomElements);
                    container.register(EcosValueConverters);
                    console.log('ECOS: registering value converters', EcosValueConverters);
                    container.register(AureliaFastAdapter);
                }
                const configuration = new Configuration();
                configuration.apiHost = config.apiHost;
                configuration.unauthorizedDefaultRoute = config.unauthorizedDefaultRoute;
                configuration.authorizedDefaultRoute = config.authorizedDefaultRoute;
                console.log('register configuration', configuration);
                container.register(Registration.instance(Configuration, configuration));
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
