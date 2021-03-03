"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nl2brValueConverter = void 0;
const aurelia_1 = require("aurelia");
let Nl2brValueConverter = class Nl2brValueConverter {
    toView(value, breakTag = '<br>') {
        if (!value || typeof value !== 'string')
            return value;
        ;
        return (value).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
};
Nl2brValueConverter = __decorate([
    aurelia_1.valueConverter('nl2br')
], Nl2brValueConverter);
exports.Nl2brValueConverter = Nl2brValueConverter;
