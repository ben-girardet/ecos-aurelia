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
exports.PageVisibility = void 0;
const aurelia_1 = require("aurelia");
let PageVisibility = class PageVisibility {
    constructor(iLogger, eventAggregator) {
        this.eventAggregator = eventAggregator;
        this.enableLogs = false;
        this.logger = iLogger.scopeTo('page-visibility');
        this.init();
    }
    log(message, ...params) {
        if (!this.enableLogs) {
            return;
        }
        this.logger.debug(message, ...params);
    }
    init() {
        this.log('Init');
        if (typeof document.hidden !== 'undefined') {
            this.hidden = 'hidden';
            this.visibilityChange = 'visibilitychange';
        }
        else if (typeof document.msHidden !== 'undefined') {
            this.hidden = 'msHidden';
            this.visibilityChange = 'msvisibilitychange';
        }
        else if (typeof document.webkitHidden !== 'undefined') {
            this.hidden = 'webkitHidden';
            this.visibilityChange = 'webkitvisibilitychange';
        }
        this.log('hidden:', this.hidden);
        this.log('visibilityChange:', this.visibilityChange);
    }
    listen() {
        this.log('Listen');
        if (!this.hidden) {
            this.init();
        }
        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === 'undefined' || typeof document.hidden === 'undefined') {
            this.logger.warn('Page Visibility API not supported');
        }
        else {
            // Handle page visibility change
            document.addEventListener(this.visibilityChange, () => {
                if (document[this.hidden]) {
                    this.log('Page is now hidden');
                    this.eventAggregator.publish('page:background');
                }
                else {
                    this.log('Page is now visibile');
                    this.eventAggregator.publish('page:foreground');
                }
            }, false);
        }
    }
    isHidden() {
        return document[this.hidden];
    }
};
PageVisibility = __decorate([
    __param(0, aurelia_1.ILogger),
    __metadata("design:paramtypes", [Object, aurelia_1.EventAggregator])
], PageVisibility);
exports.PageVisibility = PageVisibility;
