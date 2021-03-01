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
import { attr } from "@microsoft/fast-element";
import { FASTElement, customElement, html, css } from '@microsoft/fast-element';
import { neutralFillRestBehavior, neutralForegroundRestBehavior } from "@microsoft/fast-components";
const template = html `
  <template class="${x => x.type}">
    <slot></slot>
  </template>
`;
const styles = css `
  :host {
    padding: calc((10 + (var(--design-unit) * 2 * var(--density))) * 1px) calc((10 + (var(--design-unit) * 2 * var(--density))) * 2px);
    display: flex;
    contain: content;
    position: fixed;
    top: 16px;
    top: calc(16px + env(safe-area-inset-top));
    left: 50%;
    transform: translateX(-50%);
    border-radius: calc(var(--corner-radius) * 1px);
    background: ${neutralFillRestBehavior.var};
    color: ${neutralForegroundRestBehavior.var};
    z-index: 10;
  }
  :host(.success) {
    background: var(--accent-color);
    color: #FFFFFF;
  }
  :host(.error) {
    background: #BE2D39;
    color: #FFFFFF;
  }
`.withBehaviors(neutralFillRestBehavior, neutralForegroundRestBehavior);
let EcosNotification = class EcosNotification extends FASTElement {
    constructor() {
        super(...arguments);
        this.type = 'info';
        this.timeout = 5000;
        this.closeOnClick = true;
    }
    closeOnClickChanged() {
        if (this.closeOnClick) {
            this.shadowRoot.addEventListener('click', this);
        }
        else {
            this.shadowRoot.removeEventListener('click', this);
        }
    }
    handleEvent(_event) {
        clearTimeout(this.timeoutRef);
        this.remove();
    }
    connectedCallback() {
        super.connectedCallback();
        this.timeoutRef = setTimeout(() => {
            this.remove();
        }, this.timeout);
    }
    static notify(message, type) {
        const notification = document.createElement('ecos-notification');
        notification.innerText = message;
        notification.setAttribute('type', type);
        document.querySelector('fast-design-system-provider').append(notification);
    }
};
__decorate([
    attr(),
    __metadata("design:type", String)
], EcosNotification.prototype, "type", void 0);
__decorate([
    attr(),
    __metadata("design:type", Object)
], EcosNotification.prototype, "timeout", void 0);
__decorate([
    attr({ mode: 'boolean' }),
    __metadata("design:type", Object)
], EcosNotification.prototype, "closeOnClick", void 0);
EcosNotification = __decorate([
    customElement({ name: 'ecos-notification', template, styles })
], EcosNotification);
export { EcosNotification };
