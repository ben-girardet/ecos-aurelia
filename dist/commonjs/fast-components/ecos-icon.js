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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosIcon = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-inferrable-types */
const fast_element_1 = require("@microsoft/fast-element");
const fast_element_2 = require("@microsoft/fast-element");
const outline = __importStar(require("../icons/outline"));
const solid = __importStar(require("../icons/solid"));
const fast_components_1 = require("@microsoft/fast-components");
const template = fast_element_2.html `<span class="${x => x.button ? 'button' : ''} ${x => x.accent ? 'accent' : ''} ${x => x.lightweight ? 'lightweight' : ''}"></span>`;
const styles = fast_element_2.css `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    contain: content;
    stroke-width: 1px;
  }
  span {
    display:inline-flex;
    align-items: center;
    justify-content: center;
    contain: content;
    stroke-width: 1px;
  }
  .button {
    margin: 4px;
    padding: 8px;
    background: ${fast_components_1.neutralFillRestBehavior.var};
    color: ${fast_components_1.neutralForegroundRestBehavior.var};
    border-radius: calc(var(--corner-radius) * 1px);
  }
  .button:hover {
    background: ${fast_components_1.neutralFillHoverBehavior.var};
  }
  .button:active {
    background: ${fast_components_1.neutralFillActiveBehavior.var};
  }
  .button.disabled {
    background: ${fast_components_1.neutralFillRestBehavior.var};
  }
  .button.lightweight {
    background: transparent;
    color: ${fast_components_1.accentForegroundRestBehavior.var};
  }
  .button.lightweight:hover {
    color: ${fast_components_1.accentForegroundHoverBehavior.var};
  }
  .button.lightweight:active {
    color: ${fast_components_1.accentForegroundActiveBehavior.var};
  }
  .button.accent {
    margin: 4px;
    padding: 8px;
    background: ${fast_components_1.accentFillRestBehavior.var};
    color: ${fast_components_1.accentForegroundCutRestBehavior.var};
    box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${fast_components_1.neutralFocusInnerAccentBehavior.var};
    border-radius: calc(var(--corner-radius) * 1px);
  }
  .button.accent:hover {
    background: ${fast_components_1.accentFillHoverBehavior.var};
  }
  .button.accent:active {
    background: ${fast_components_1.accentFillActiveBehavior.var};
  }
  .button.accent.disabled {
    background: ${fast_components_1.accentFillRestBehavior.var};
  }
`.withBehaviors(fast_components_1.neutralFillRestBehavior, fast_components_1.neutralForegroundRestBehavior, fast_components_1.neutralFillHoverBehavior, fast_components_1.neutralFillActiveBehavior, fast_components_1.accentFillRestBehavior, fast_components_1.accentForegroundCutRestBehavior, fast_components_1.accentForegroundHoverBehavior, fast_components_1.accentForegroundActiveBehavior, fast_components_1.neutralFocusInnerAccentBehavior, fast_components_1.accentFillActiveBehavior, fast_components_1.accentForegroundRestBehavior);
let EcosIcon = class EcosIcon extends fast_element_2.FASTElement {
    constructor() {
        super(...arguments);
        this.button = false;
        this.lightweight = false;
        this.accent = false;
        this.type = 'outline';
        this.weight = 1;
        this.size = 'lg';
        this.solid = solid;
        this.outline = outline;
    }
    buttonChanged() {
        this.setIcon();
    }
    lightweightChanged() {
        this.setIcon();
    }
    accentChanged() {
        this.setIcon();
    }
    iconChanged() {
        this.setIcon();
    }
    setIcon() {
        window.requestAnimationFrame(() => {
            if (!this.shadowRoot || !this.shadowRoot.querySelector('span')) {
                this.setIcon();
                return;
            }
            this.shadowRoot.querySelector('span').innerHTML = this[this.type][this.icon];
            const svg = this.shadowRoot.querySelector('svg');
            if (svg instanceof SVGElement) {
                // svg.classList.toggle('button', this.button);
                // svg.classList.toggle('lightweight', this.lightweight);
                // svg.classList.toggle('accent', this.accent);
                svg.setAttribute('part', 'svg');
                svg.style.width = `${this.sizeInPx()}px`;
                svg.style.height = `${this.sizeInPx()}px`;
            }
            const paths = this.shadowRoot.querySelectorAll('path');
            for (const path of paths) {
                path.setAttribute('stroke-width', `${this.weight}`);
            }
        });
    }
    typeChanged() {
        if (this.type !== 'solid' && this.type !== 'outline') {
            this.type = 'outline';
        }
        this.setIcon();
    }
    weightChanged() {
        this.setIcon();
    }
    sizeChanged() {
        this.setIcon();
    }
    sizeInPx() {
        if (this.size === 'sm') {
            return 16;
        }
        if (this.size === 'md') {
            return 20;
        }
        if (this.size === 'lg') {
            return 24;
        }
        if (this.size === 'xl') {
            return 28;
        }
        return 24;
    }
};
__decorate([
    fast_element_1.attr({ mode: 'boolean' }),
    __metadata("design:type", Boolean)
], EcosIcon.prototype, "button", void 0);
__decorate([
    fast_element_1.attr({ mode: 'boolean' }),
    __metadata("design:type", Boolean)
], EcosIcon.prototype, "lightweight", void 0);
__decorate([
    fast_element_1.attr({ mode: 'boolean' }),
    __metadata("design:type", Boolean)
], EcosIcon.prototype, "accent", void 0);
__decorate([
    fast_element_1.attr(),
    __metadata("design:type", String)
], EcosIcon.prototype, "icon", void 0);
__decorate([
    fast_element_1.attr(),
    __metadata("design:type", String)
], EcosIcon.prototype, "type", void 0);
__decorate([
    fast_element_1.attr(),
    __metadata("design:type", Object)
], EcosIcon.prototype, "weight", void 0);
__decorate([
    fast_element_1.attr(),
    __metadata("design:type", Object)
], EcosIcon.prototype, "size", void 0);
EcosIcon = __decorate([
    fast_element_2.customElement({ name: 'ecos-icon', template, styles })
], EcosIcon);
exports.EcosIcon = EcosIcon;
