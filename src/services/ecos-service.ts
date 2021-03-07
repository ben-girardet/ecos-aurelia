import { IRouter, RouteNode, IViewportInstruction } from '@aurelia/router';

export class EcosService {

  public constructor(@IRouter public router: IRouter) {

  }

  public loadInViewport(route: RouteNode, viewport: string): void {
    const instructions: (RouteNode | IViewportInstruction)[]  = this.router.routeTree.root.children.filter((routeNode: RouteNode) => routeNode.viewport !== viewport);
    route.viewport = viewport;
    instructions.push(route)
    this.router.load(instructions);
  }

  public emptyViewport(viewport: string): void {
    const instructions: (RouteNode | IViewportInstruction)[]  = this.router.routeTree.root.children.filter((routeNode: RouteNode) => routeNode.viewport !== viewport);
    this.router.load(instructions);
  }


}