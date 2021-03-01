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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const api_service_1 = require("./api-service");
const image_blob_reduce_1 = __importDefault(require("image-blob-reduce"));
const croppie_1 = __importDefault(require("croppie"));
require("croppie/croppie.css");
const reducer = new image_blob_reduce_1.default();
const aurelia_1 = require("aurelia");
let ImageService = class ImageService {
    constructor(apiService) {
        this.apiService = apiService;
        this.heightRatio = 1.2;
        this.smallWidth = 40;
        this.mediumWidth = 100;
        this.largeWidth = 1000;
        this.cropType = 'square';
        this.cropping = false;
        this.imageChanged = false;
    }
    selectImage() {
        const width = window.innerWidth;
        const input = document.createElement('input');
        this.inputFileContainer.append(input);
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.addEventListener('change', async () => {
            input.remove();
            if (input.files && input.files.length === 1) {
                const file = input.files[0];
                this.originalImageUrl = URL.createObjectURL(file);
                this.cropping = true;
                setTimeout(() => {
                    this.croppie = new croppie_1.default(this.croppieElement, {
                        viewport: { width: width * 0.8, height: width * 0.8 * this.heightRatio, type: this.cropType }
                    });
                    this.croppie.bind({ url: this.originalImageUrl });
                }, 100);
            }
        });
    }
    cancelImage() {
        this.cropping = false;
        if (this.croppie) {
            this.croppie.destroy();
        }
        URL.revokeObjectURL(this.originalImageUrl);
        if (this.onCancel) {
            this.onCancel.call(null);
        }
    }
    async saveCrop() {
        const blob = await this.croppie.result({
            type: 'blob',
            size: 'original',
            format: 'jpeg',
            quality: 1,
            circle: false
        });
        this.smallBlob = await this.resizeBlob(blob, this.smallWidth);
        this.mediumBlob = await this.resizeBlob(blob, this.mediumWidth);
        this.largeBlob = await this.resizeBlob(blob, this.largeWidth);
        this.smallB64 = await this.blob2base64(this.smallBlob);
        this.mediumB64 = await this.blob2base64(this.mediumBlob);
        this.largeB64 = await this.blob2base64(this.largeBlob);
        this.cropping = false;
        this.croppie.destroy();
        URL.revokeObjectURL(this.originalImageUrl);
        this.imageChanged = true;
        if (this.onSelect) {
            this.onSelect.call(null);
        }
    }
    async resizeBlob(blob, width) {
        const resizeRatio = this.heightRatio > 1 ? this.heightRatio : 1;
        return await reducer.toBlob(blob, { max: width * resizeRatio });
    }
    async blob2base64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    return resolve(reader.result);
                }
                reject(new Error('Invalid image format'));
            };
            reader.onerror = () => {
                reject(reader.error);
            };
        });
    }
    removeImage() {
        this.smallB64 = '';
        this.mediumB64 = '';
        this.largeB64 = '';
        delete this.smallBlob;
        delete this.mediumBlob;
        delete this.largeBlob;
        if (this.onRemove) {
            this.onRemove.call(null);
        }
    }
    async publish() {
        if (!this.imageChanged) {
            return 'no-change';
        }
        const smallForm = new FormData();
        const mediumForm = new FormData();
        const largeForm = new FormData();
        smallForm.append('file', this.smallBlob);
        mediumForm.append('file', this.mediumBlob);
        largeForm.append('file', this.largeBlob);
        const smallSrc = await this.apiService.post('/image', smallForm);
        const mediumSrc = await this.apiService.post('/image', mediumForm);
        const largeSrc = await this.apiService.post('/image', largeForm);
        return {
            smallB64: this.smallB64,
            small: `api:${smallSrc.id}`,
            medium: `api:${mediumSrc.id}`,
            large: `api:${largeSrc.id}`
        };
    }
};
ImageService = __decorate([
    aurelia_1.transient(),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], ImageService);
exports.ImageService = ImageService;
