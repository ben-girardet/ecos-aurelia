import { IRouteViewModel, ICustomElementViewModel, EventAggregator, IRouter } from 'aurelia';
import Croppie from 'croppie';
import { ApolloService, ImageService } from '../services';
import { UserCommands } from '../gql';
import { EcosService } from '../services';
import './ecos-edit-profile-route.css';
export declare class EcosEditProfileRoute implements IRouteViewModel, ICustomElementViewModel {
    private router;
    private imageService;
    private eventAggregator;
    private apollo;
    private ecos;
    private userCommands;
    firstname: string;
    lastname: string;
    preview: string;
    private avatar;
    cropping: boolean;
    private croppieElement;
    inputFileContainer: HTMLElement;
    originalImageUrl: string;
    croppie: Croppie;
    constructor(router: IRouter, imageService: ImageService, eventAggregator: EventAggregator, apollo: ApolloService, ecos: EcosService, userCommands: UserCommands);
    binding(): Promise<void>;
    getUser(): Promise<{
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        mobile: string;
        picture: {
            fileId: string;
            width: number;
            height: number;
        }[];
    }>;
    attached(): void;
    save(): Promise<void>;
    cancel(): void;
    removeImage(): void;
}
