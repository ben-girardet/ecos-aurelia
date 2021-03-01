import { IContainer } from 'aurelia';
import { IConfiguration } from './configuration';
import * as EcosCustomElements from './custom-elements';
import * as EcosValueConverters from './value-converters';
import './variables.css';
import './basics.css';
import './views.css';
import './typography.css';
import './fast-trick.css';
import './cropping.css';
export declare const Ecos: {
    configure(config: IConfiguration): {
        register(container: IContainer): void;
    };
};
export { EcosCustomElements };
export { EcosValueConverters };
export * from './adapters';
export * from './custom-elements';
export * from './fast-components';
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