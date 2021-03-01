import { FASTElement } from '@microsoft/fast-element';
import * as outline from '../icons/outline';
import * as solid from '../icons/solid';
export declare class EcosIcon extends FASTElement {
    button: boolean;
    buttonChanged(): void;
    lightweight: boolean;
    lightweightChanged(): void;
    accent: boolean;
    accentChanged(): void;
    icon: string;
    iconChanged(): void;
    private setIcon;
    type: 'outline' | 'solid';
    typeChanged(): void;
    weight: number;
    weightChanged(): void;
    size: string;
    sizeChanged(): void;
    private sizeInPx;
    solid: typeof solid;
    outline: typeof outline;
}
