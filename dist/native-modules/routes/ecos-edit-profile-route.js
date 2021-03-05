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
import { EcosNotification } from '../fast-components';
import { customElement, inject, EventAggregator, IRouter } from 'aurelia';
import { ApolloService, ImageService } from '../services';
import { UserCommands } from '../gql';
import { gql } from 'apollo-boost';
import { route } from 'aurelia';
import template from './ecos-edit-profile-route.html';
import { EcosService } from '../services';
import './ecos-edit-profile-route.css';
let EcosEditProfileRoute = class EcosEditProfileRoute {
    constructor(router, imageService, eventAggregator, apollo, ecos, userCommands) {
        this.router = router;
        this.imageService = imageService;
        this.eventAggregator = eventAggregator;
        this.apollo = apollo;
        this.ecos = ecos;
        this.userCommands = userCommands;
        this.cropping = false;
        this.imageService.heightRatio = 1;
        this.imageService.cropType = 'square';
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.imageService.onCancel = () => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.imageService.onSelect = () => { };
    }
    async binding() {
        const user = await this.getUser();
        this.preview = user.picture && user.picture.length ? user.picture.find(i => i.height > 50 && i.width > 50).fileId : '';
        setTimeout(() => {
            this.firstname = user.firstname;
            this.lastname = user.lastname;
        }, 150);
    }
    async getUser() {
        if (!this.apollo.getUserId()) {
            return null;
        }
        const result = await this.apollo.client.query({ query: gql `query User($userId: String!) {
user(id: $userId) {
  id,
  firstname,
  lastname,
  email,
  mobile,
  picture {
    fileId,
    width,
    height
  }
}
    }`, variables: { userId: this.apollo.getUserId() } });
        return result.data.user;
    }
    attached() {
        this.imageService.inputFileContainer = this.inputFileContainer;
        this.imageService.croppieElement = this.croppieElement;
    }
    async save() {
        const editUserData = {};
        editUserData.firstname = this.firstname;
        editUserData.lastname = this.lastname;
        if (this.avatar && this.avatar.avatar !== 'original') {
            if (this.avatar.avatar === 'image') {
                const imageData = await this.avatar.imageService.publish();
                if (imageData !== 'no-change') {
                    editUserData.picture = [
                        { fileId: imageData.small, width: 40, height: 40 },
                        { fileId: imageData.medium, width: 100, height: 1000 },
                        { fileId: imageData.large, width: 1000, height: 1000 },
                    ];
                }
            }
            else if (this.avatar.avatar !== 'original') {
                editUserData.picture = [
                    { fileId: `static:${this.avatar.avatar}.gif`, width: 40, height: 40 },
                    { fileId: `static:${this.avatar.avatar}.gif`, width: 100, height: 100 },
                    { fileId: `static:${this.avatar.avatar}.gif`, width: 1000, height: 1000 },
                ];
            }
        }
        try {
            await this.userCommands.editMe(editUserData.firstname, editUserData.lastname, editUserData.picture);
            this.eventAggregator.publish('user:changed', this.apollo.getUserId());
            this.ecos.emptyViewport('bottom');
        }
        catch (error) {
            EcosNotification.notify(error.message, 'info');
        }
    }
    cancel() {
        this.ecos.emptyViewport('bottom');
    }
    removeImage() {
        this.imageService.removeImage();
    }
};
EcosEditProfileRoute = __decorate([
    route({ data: { auth: '1', blackOpaque: '0' } }),
    customElement({ name: 'ecos-edit-profile-route', template }),
    inject(),
    __param(0, IRouter),
    __metadata("design:paramtypes", [Object, ImageService,
        EventAggregator,
        ApolloService,
        EcosService,
        UserCommands])
], EcosEditProfileRoute);
export { EcosEditProfileRoute };
