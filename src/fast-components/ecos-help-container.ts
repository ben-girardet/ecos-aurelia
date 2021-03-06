/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { attr } from "@microsoft/fast-element";
import { FASTElement, customElement, html, css } from '@microsoft/fast-element';
import { neutralForegroundRestBehavior, neutralLayerFloatingBehavior } from "@microsoft/fast-components";

const template = html<EcosHelpContainer>`
<template class="${x => x.fullscreen === true ? 'full-screen':''}">
<slot></slot>
</template>`;

const styles = css`
  :host {
    background: ${neutralLayerFloatingBehavior.var};
    color: ${neutralForegroundRestBehavior.var};
    position: fixed;
    top: calc(24px + env(safe-area-inset-top));
    top: 24px;
    left: 24px;
    right: 24px;
    bottom: 24px;
    bottom: calc(24px + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: calc(var(--corner-radius) * 1px);
    z-index: 10;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    padding: 32px 16px;
    padding-top: calc(32px + env(safe-area-inset-top));
    padding-bottom: calc(32px + env(safe-area-inset-bottom));
    text-align: center;
  }
  :host(.full-screen) {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    padding: 64px 32px;
    padding-top: calc(64px + env(safe-area-inset-top));
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
  ::slotted(img) {
    max-width: 70%;
  }
  ::slotted(.slogan) {
    font-size: var(--type-ramp-plus-3-font-size);
    line-height: var(--type-ramp-plus-3-line-height);
    margin: 24px;
  }
`.withBehaviors(
  neutralLayerFloatingBehavior,
  neutralForegroundRestBehavior);

@customElement({name: 'ecos-help-container', template, styles})
export class EcosHelpContainer extends FASTElement {

  @attr({ mode: 'boolean' })
  public fullscreen: boolean = true;

}
