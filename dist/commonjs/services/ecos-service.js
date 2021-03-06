"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosService = void 0;
const router_1 = require("@aurelia/router");
let EcosService = class EcosService {
    constructor(router) {
        this.router = router;
    }
    loadInViewport(route, viewport) {
        const instructions = this.router.routeTree.root.children.filter((routeNode) => routeNode.viewport !== viewport);
        route.viewport = viewport;
        instructions.push(route);
        this.router.load(instructions);
    }
    emptyViewport(viewport) {
        const instructions = this.router.routeTree.root.children.filter((routeNode) => routeNode.viewport !== viewport);
        this.router.load(instructions);
    }
};
EcosService = __decorate([
    __param(0, router_1.IRouter),
    __metadata("design:paramtypes", [Object])
], EcosService);
exports.EcosService = EcosService;
