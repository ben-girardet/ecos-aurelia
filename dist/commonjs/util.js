"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
async function wait(time = 1000) {
    return new Promise(resolve => setTimeout(resolve, time));
}
exports.wait = wait;
