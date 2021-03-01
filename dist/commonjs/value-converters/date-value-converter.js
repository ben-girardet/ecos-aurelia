"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateValueConverter = void 0;
const moment_1 = __importDefault(require("moment"));
class DateValueConverter {
    toView(dateString, format = 'DD/MM/YYYY') {
        const m = moment_1.default(dateString);
        if (m.isValid) {
            if (format === 'nice') {
                const diff = m.diff(moment_1.default(), 'days');
                if (diff < 14) {
                    return m.fromNow();
                }
                else {
                    return m.calendar();
                }
            }
            else if (format === 'calendar') {
                return m.calendar({
                    sameDay: '[Today]',
                    nextDay: '[Tomorrow]',
                    nextWeek: 'dddd',
                    lastDay: '[Yesterday]',
                    lastWeek: '[Last] dddd',
                    sameElse: 'DD/MM/YYYY'
                });
            }
            else if (format === 'nicetime') {
                const diff = moment_1.default().diff(m, 'minutes');
                if (diff < 45) {
                    return m.fromNow();
                }
                else {
                    return m.format('HH:mm');
                }
            }
            else if (format === 'fromnow') {
                return m.fromNow(true);
            }
            else if (format === 'fromnow+') {
                return m.fromNow(false);
            }
            else {
                return m.format(format);
            }
        }
        else {
            return dateString;
        }
    }
}
exports.DateValueConverter = DateValueConverter;
