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
exports.AvatarSelection = void 0;
const aurelia_1 = require("aurelia");
const image_service_1 = require("../../services/image-service");
const avatar_selection_html_1 = __importDefault(require("./avatar-selection.html"));
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
    aurelia_1.bindable({ mode: aurelia_1.BindingMode.twoWay }),
    __metadata("design:type", String)
], AvatarSelection.prototype, "profilePic", void 0);
__decorate([
    aurelia_1.bindable,
    __metadata("design:type", Object)
], AvatarSelection.prototype, "original", void 0);
AvatarSelection = __decorate([
    aurelia_1.customElement({ name: 'avatar-selection', template: avatar_selection_html_1.default }),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], AvatarSelection);
exports.AvatarSelection = AvatarSelection;
