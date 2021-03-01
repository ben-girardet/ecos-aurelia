var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { attr } from "@microsoft/fast-element";
import { FASTElement, customElement, html, css } from '@microsoft/fast-element';
import * as outline from '../icons/outline';
import * as solid from '../icons/solid';
import { accentFillRestBehavior, accentForegroundCutRestBehavior, accentFillHoverBehavior, accentFillActiveBehavior, neutralFocusInnerAccentBehavior, neutralFillRestBehavior, neutralForegroundRestBehavior, neutralFillHoverBehavior, neutralFillActiveBehavior, accentForegroundRestBehavior, accentForegroundHoverBehavior, accentForegroundActiveBehavior } from "@microsoft/fast-components";
const template = html `<span class="${x => x.button ? 'button' : ''} ${x => x.accent ? 'accent' : ''} ${x => x.lightweight ? 'lightweight' : ''}"></span>`;
const styles = css `
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
    background: ${neutralFillRestBehavior.var};
    color: ${neutralForegroundRestBehavior.var};
    border-radius: calc(var(--corner-radius) * 1px);
  }
  .button:hover {
    background: ${neutralFillHoverBehavior.var};
  }
  .button:active {
    background: ${neutralFillActiveBehavior.var};
  }
  .button.disabled {
    background: ${neutralFillRestBehavior.var};
  }
  .button.lightweight {
    background: transparent;
    color: ${accentForegroundRestBehavior.var};
  }
  .button.lightweight:hover {
    color: ${accentForegroundHoverBehavior.var};
  }
  .button.lightweight:active {
    color: ${accentForegroundActiveBehavior.var};
  }
  .button.accent {
    margin: 4px;
    padding: 8px;
    background: ${accentFillRestBehavior.var};
    color: ${accentForegroundCutRestBehavior.var};
    box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${neutralFocusInnerAccentBehavior.var};
    border-radius: calc(var(--corner-radius) * 1px);
  }
  .button.accent:hover {
    background: ${accentFillHoverBehavior.var};
  }
  .button.accent:active {
    background: ${accentFillActiveBehavior.var};
  }
  .button.accent.disabled {
    background: ${accentFillRestBehavior.var};
  }
`.withBehaviors(neutralFillRestBehavior, neutralForegroundRestBehavior, neutralFillHoverBehavior, neutralFillActiveBehavior, accentFillRestBehavior, accentForegroundCutRestBehavior, accentForegroundHoverBehavior, accentForegroundActiveBehavior, neutralFocusInnerAccentBehavior, accentFillActiveBehavior, accentForegroundRestBehavior);
let EcosIcon = class EcosIcon extends FASTElement {
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
    attr({ mode: 'boolean' }),
    __metadata("design:type", Boolean)
], EcosIcon.prototype, "button", void 0);
__decorate([
    attr({ mode: 'boolean' }),
    __metadata("design:type", Boolean)
], EcosIcon.prototype, "lightweight", void 0);
__decorate([
    attr({ mode: 'boolean' }),
    __metadata("design:type", Boolean)
], EcosIcon.prototype, "accent", void 0);
__decorate([
    attr(),
    __metadata("design:type", String)
], EcosIcon.prototype, "icon", void 0);
__decorate([
    attr(),
    __metadata("design:type", String)
], EcosIcon.prototype, "type", void 0);
__decorate([
    attr(),
    __metadata("design:type", Object)
], EcosIcon.prototype, "weight", void 0);
__decorate([
    attr(),
    __metadata("design:type", Object)
], EcosIcon.prototype, "size", void 0);
EcosIcon = __decorate([
    customElement({ name: 'ecos-icon', template, styles })
], EcosIcon);
export { EcosIcon };
