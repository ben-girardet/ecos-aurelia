import { ApiService } from './api-service';
import Croppie from 'croppie';
import 'croppie/croppie.css';
export declare class ImageService {
    private apiService;
    heightRatio: number;
    smallWidth: number;
    mediumWidth: number;
    largeWidth: number;
    cropType: 'square' | 'circle';
    private smallBlob;
    private mediumBlob;
    private largeBlob;
    smallB64: string;
    mediumB64: string;
    largeB64: string;
    cropping: boolean;
    croppieElement: HTMLElement;
    inputFileContainer: HTMLElement;
    originalImageUrl: string;
    croppie: Croppie;
    onSelect: () => void;
    onCancel: () => void;
    onRemove: () => void;
    private imageChanged;
    constructor(apiService: ApiService);
    selectImage(): void;
    cancelImage(): void;
    saveCrop(): Promise<void>;
    resizeBlob(blob: Blob, width: number): Promise<Blob>;
    blob2base64(blob: Blob): Promise<string>;
    removeImage(): void;
    publish(): Promise<{
        smallB64: string;
        small: string;
        medium: string;
        large: string;
    } | 'no-change'>;
}
