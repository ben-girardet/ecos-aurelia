"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosEnLocale = exports.EcosFrLocale = exports.EcosValueConverters = exports.EcosCustomElements = exports.Ecos = void 0;
const aurelia_1 = require("aurelia");
const configuration_1 = require("./configuration");
const fast_adapter_1 = require("./adapters/fast-adapter");
const apollo_service_1 = require("./services/apollo-service");
const EcosCustomElements = __importStar(require("./custom-elements"));
exports.EcosCustomElements = EcosCustomElements;
const EcosValueConverters = __importStar(require("./value-converters"));
exports.EcosValueConverters = EcosValueConverters;
const router_lifecycles_1 = require("./router-lifecycles");
// TODO: find out if we can conditionnally import these styles
require("./variables.css");
require("./basics.css");
require("./views.css");
require("./typography.css");
require("./fast-trick.css");
require("./cropping.css");
// TODO: find out if we can conditionnally import these components
const ecos_help_container_1 = require("./fast-components/ecos-help-container");
const ecos_icon_1 = require("./fast-components/ecos-icon");
const ecos_notification_1 = require("./fast-components/ecos-notification");
ecos_help_container_1.EcosHelpContainer;
ecos_icon_1.EcosIcon;
ecos_notification_1.EcosNotification;
exports.Ecos = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    configure(config) {
        console.log('ECOS: configure');
        return {
            register(container) {
                console.log('ECOS: register');
                if (config.autoRegister) {
                    container.register(router_lifecycles_1.EcosRouterLifecycles);
                    container.register(apollo_service_1.ApolloService);
                    console.log('ECOS: registering custom elements', EcosCustomElements);
                    container.register(EcosCustomElements);
                    container.register(EcosValueConverters);
                    console.log('ECOS: registering value converters', EcosValueConverters);
                    container.register(fast_adapter_1.AureliaFastAdapter);
                }
                const configuration = new configuration_1.Configuration();
                configuration.apiHost = config.apiHost;
                configuration.unauthorizedDefaultRoute = config.unauthorizedDefaultRoute;
                configuration.authorizedDefaultRoute = config.authorizedDefaultRoute;
                console.log('register configuration', configuration);
                container.register(aurelia_1.Registration.instance(configuration_1.Configuration, configuration));
            }
        };
    }
};
__exportStar(require("./adapters"), exports);
__exportStar(require("./custom-elements"), exports);
__exportStar(require("./fast-components"), exports);
__exportStar(require("./gql"), exports);
__exportStar(require("./services"), exports);
__exportStar(require("./value-converters"), exports);
__exportStar(require("./configuration"), exports);
__exportStar(require("./ecos-app"), exports);
__exportStar(require("./page-visibility"), exports);
__exportStar(require("./util"), exports);
const EcosFrLocale = __importStar(require("./locales/fr/ecos.json"));
exports.EcosFrLocale = EcosFrLocale;
const EcosEnLocale = __importStar(require("./locales/en/ecos.json"));
exports.EcosEnLocale = EcosEnLocale;
