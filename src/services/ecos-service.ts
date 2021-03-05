import { IRouter, RouteNode, IViewportInstruction } from '@aurelia/router';

export class EcosService {

  public constructor(@IRouter public router: IRouter) {

  }

  public emptyViewport(viewport: string): void {
    const instructions: (RouteNode | IViewportInstruction)[]  = this.router.routeTree.root.children.filter((routeNode: RouteNode) => routeNode.viewport !== viewport);
    this.router.load(instructions);
  }


}