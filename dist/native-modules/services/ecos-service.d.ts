import { IRouter, RouteNode } from '@aurelia/router';
export declare class EcosService {
    router: IRouter;
    constructor(router: IRouter);
    loadInViewport(route: RouteNode, viewport: string): void;
    emptyViewport(viewport: string): void;
}
