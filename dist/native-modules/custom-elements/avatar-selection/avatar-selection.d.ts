import { ImageService } from '../../services/image-service';
export declare class AvatarSelection {
    imageService: ImageService;
    profilePic: string;
    original: string;
    avatar: string;
    private croppieElement;
    inputFileContainer: HTMLElement;
    constructor(imageService: ImageService);
    bound(): void;
    originalChanged(): void;
    attached(): void;
    imagesDialog: HTMLElement;
    toggleDialog(): void;
    selectImage(): void;
    removeImage(): void;
    selectAvatar(avatar: string): void;
}
