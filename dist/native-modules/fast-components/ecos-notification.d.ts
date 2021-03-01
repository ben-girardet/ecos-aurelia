import { FASTElement } from '@microsoft/fast-element';
export declare type NotificationTypes = 'info' | 'success' | 'error';
export declare class EcosNotification extends FASTElement {
    type: 'info' | 'success' | 'error';
    timeout: number;
    closeOnClick: boolean;
    private timeoutRef;
    closeOnClickChanged(): void;
    handleEvent(_event: MouseEvent): void;
    connectedCallback(): void;
    static notify(message: string, type: NotificationTypes): void;
}
