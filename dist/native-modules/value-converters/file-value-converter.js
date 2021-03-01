var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject } from 'aurelia';
import { Configuration } from '../configuration';
let FileValueConverter = class FileValueConverter {
    constructor(conf) {
        this.conf = conf;
    }
    toView(filename, imageWidth = '0', imageHeight = '0') {
        if (!filename || (Array.isArray(filename) && filename.length === 0)) {
            return '';
        }
        let maxImage = '';
        if (Array.isArray(filename)) {
            const width = imageWidth !== '0' ? parseInt(imageWidth, 10) : 10000;
            const height = imageHeight !== '0' ? parseInt(imageHeight, 10) : 10000;
            let maxWidth = 0;
            for (const image of filename) {
                if (image.width >= width && image.height >= height) {
                    filename = image.fileId;
                    break;
                }
                if (image.width > maxWidth) {
                    maxWidth = image.width;
                    maxImage = image.fileId;
                }
            }
        }
        if (Array.isArray(filename)) {
            if (maxImage) {
                filename = maxImage;
            }
            else {
                return '';
            }
        }
        if (typeof filename === 'string' && filename.substr(0, 4) === 'api:') {
            //return `http://localhost:3000/api/images/get/${filename.substr(4)}`
            return `${this.conf.apiHost}/image/${filename.substr(4)}`;
        }
        else if (typeof filename === 'string' && filename.substr(0, 7) === 'static:') {
            return `images/avatars/${filename.substr(7)}`;
        }
        return filename;
    }
};
FileValueConverter = __decorate([
    inject(Configuration),
    __metadata("design:paramtypes", [Configuration])
], FileValueConverter);
export { FileValueConverter };
