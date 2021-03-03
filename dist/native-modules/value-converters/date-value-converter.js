var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { valueConverter } from 'aurelia';
import moment from 'moment';
let DateValueConverter = class DateValueConverter {
    toView(dateString, format = 'DD/MM/YYYY') {
        const m = moment(dateString);
        if (m.isValid) {
            if (format === 'nice') {
                const diff = m.diff(moment(), 'days');
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
                const diff = moment().diff(m, 'minutes');
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
};
DateValueConverter = __decorate([
    valueConverter('date')
], DateValueConverter);
export { DateValueConverter };
