"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AureliaFastAdapter = void 0;
const aurelia_1 = require("aurelia");
class AureliaFastAdapter {
    static register(container) {
        AureliaFastAdapter.extendTemplatingSyntax(container);
    }
    static extendTemplatingSyntax(container) {
        aurelia_1.AppTask.with(aurelia_1.IContainer).beforeCreate().call(container => {
            const attrSyntaxTransformer = container.get(aurelia_1.IAttrSyntaxTransformer);
            const nodeObserverLocator = container.get(aurelia_1.NodeObserverLocator);
            attrSyntaxTransformer.useTwoWay((el, property) => {
                switch (el.tagName) {
                    case 'FAST-SELECT':
                    case 'FAST-SLIDER':
                    case 'FAST-TEXT-FIELD':
                    case 'FAST-TEXT-AREA':
                        return property === 'value';
                    case 'FAST-CHECKBOX':
                    case 'FAST-RADIO':
                    case 'FAST-RADIO-GROUP':
                    case 'FAST-SWITCH':
                        return property === 'checked';
                    case 'FAST-TABS':
                        return property === 'activeid';
                    default:
                        return false;
                }
            });
            // Teach Aurelia what events to use to observe properties of elements.
            const valuePropertyConfig = { events: ['input', 'change'] };
            nodeObserverLocator.useConfig({
                'FAST-CHECKBOX': {
                    value: valuePropertyConfig
                },
                'FAST-RADIO': {
                    value: valuePropertyConfig
                },
                'FAST-RADIO-GROUP': {
                    value: valuePropertyConfig
                },
                'FAST-SELECT': {
                    value: valuePropertyConfig
                },
                'FAST-SLIDER': {
                    value: valuePropertyConfig
                },
                'FAST-SWITCH': {
                    checked: valuePropertyConfig
                },
                'FAST-TABS': {
                    activeid: valuePropertyConfig
                },
                'FAST-TEXT-FIELD': {
                    value: valuePropertyConfig
                },
                'FAST-TEXT-AREA': {
                    value: valuePropertyConfig
                }
            });
        }).register(container);
    }
}
exports.AureliaFastAdapter = AureliaFastAdapter;
