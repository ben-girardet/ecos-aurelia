"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nl2brValueConverter = void 0;
class Nl2brValueConverter {
    toView(value, breakTag = '<br>') {
        if (!value || typeof value !== 'string')
            return value;
        ;
        return (value).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
}
exports.Nl2brValueConverter = Nl2brValueConverter;
