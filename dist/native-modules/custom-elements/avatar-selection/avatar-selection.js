var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, bindable, BindingMode } from 'aurelia';
import { ImageService } from '../../services/image-service';
import template from './avatar-selection.html';
let AvatarSelection = class AvatarSelection {
    constructor(imageService) {
        this.imageService = imageService;
        this.original = '';
        this.avatar = 'liquid1';
        this.imageService.heightRatio = 1;
        this.imageService.cropType = 'circle';
        this.imageService.onCancel = () => {
            if (this.imageService.mediumB64) {
                this.selectAvatar('liquid1');
            }
        };
        this.imageService.onSelect = () => {
            this.selectAvatar('image');
        };
    }
    bound() {
        this.originalChanged();
    }
    originalChanged() {
        if (this.original) {
            this.avatar = 'original';
        }
    }
    attached() {
        this.imageService.inputFileContainer = this.inputFileContainer;
        this.imageService.croppieElement = this.croppieElement;
    }
    toggleDialog() {
        this.imagesDialog.toggleAttribute('hidden');
    }
    selectImage() {
        this.imageService.selectImage();
    }
    removeImage() {
        this.imageService.removeImage();
        this.selectAvatar('liquid1');
    }
    selectAvatar(avatar) {
        this.avatar = avatar;
        this.original = '';
        // this.imageService.cancelImage();
        this.imagesDialog.toggleAttribute('hidden', true);
    }
};
__decorate([
    bindable({ mode: BindingMode.twoWay }),
    __metadata("design:type", String)
], AvatarSelection.prototype, "profilePic", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], AvatarSelection.prototype, "original", void 0);
AvatarSelection = __decorate([
    customElement({ name: 'avatar-selection', template }),
    __metadata("design:paramtypes", [ImageService])
], AvatarSelection);
export { AvatarSelection };
