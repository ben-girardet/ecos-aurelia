import { AvatarSelection } from '../custom-elements';
import { EcosNotification } from '../fast-components';
import { IRouteViewModel, ICustomElementViewModel, inject, EventAggregator, IRouter } from 'aurelia';
import Croppie from 'croppie';
import { ApolloService, ImageService } from '../services';
import { IImage } from 'ecos-types';
import { UserCommands } from '../gql';
import { gql } from 'apollo-boost';
import { route } from 'aurelia';
import './ecos-edit-profile-route.css';

@route({data: {auth: '1', blackOpaque: '0'}})
@inject()
export class EcosEditProfileRoute implements IRouteViewModel, ICustomElementViewModel {

  public firstname: string;
  public lastname: string;
  public preview: string;
  private avatar: AvatarSelection;

  public cropping = false;
  private croppieElement: HTMLElement;
  public inputFileContainer: HTMLElement;
  public originalImageUrl: string;
  public croppie: Croppie;
  
  public constructor(
    @IRouter private router: IRouter, 
    private imageService: ImageService, 
    private eventAggregator: EventAggregator,
    private apollo: ApolloService,
    private userCommands: UserCommands) {
    this.imageService.heightRatio = 1;
    this.imageService.cropType = 'square';
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.imageService.onCancel = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.imageService.onSelect = () => {}
  }

  public async binding(): Promise<void> {
    const user = await this.getUser();
    this.preview = user.picture && user.picture.length ? user.picture.find(i => i.height > 50 && i.width > 50).fileId : '';
    setTimeout(() => {
      this.firstname = user.firstname;
      this.lastname = user.lastname;
    }, 150);
  }

  public async getUser(): Promise<{id: string, firstname: string, lastname: string, email: string, mobile: string, picture:{fileId: string, width: number, height: number}[]}> {
    if (!this.apollo.getUserId()) {
      return null
    }
    const result = await this.apollo.client.query<{user: {
      id: string,
      firstname: string, 
      lastname: string, 
      email: string,
      mobile: string,
      picture: {fileId: string, width: number, height: number}[]}}>({query: gql`query User($userId: String!) {
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
    }`, variables: {userId: this.apollo.getUserId()}});
    return result.data.user;
  }

  public attached(): void {
    this.imageService.inputFileContainer = this.inputFileContainer;
    this.imageService.croppieElement = this.croppieElement;
  }

  public async save(): Promise<void> {
    const editUserData: {firstname?: string, lastname?: string, picture?: IImage[]} = {};
    editUserData.firstname = this.firstname;
    editUserData.lastname = this.lastname;
    if (this.avatar && this.avatar.avatar !== 'original') {
      if (this.avatar.avatar === 'image') {
        const imageData = await this.avatar.imageService.publish();
        if (imageData !== 'no-change') {
          editUserData.picture = [
            {fileId: imageData.small, width: 40, height: 40},
            {fileId: imageData.medium, width: 100, height: 1000},
            {fileId: imageData.large, width: 1000, height: 1000},
          ]
        }
      } else if (this.avatar.avatar !== 'original') {
        editUserData.picture = [
          {fileId: `static:${this.avatar.avatar}.gif`, width: 40, height: 40},
          {fileId: `static:${this.avatar.avatar}.gif`, width: 100, height: 100},
          {fileId: `static:${this.avatar.avatar}.gif`, width: 1000, height: 1000},
        ];
      }
    }
    try {
      await this.userCommands.editMe(editUserData.firstname, editUserData.lastname, editUserData.picture);
      this.eventAggregator.publish('user:changed', this.apollo.getUserId());
      this.router.load('../account');
    } catch (error) {
      EcosNotification.notify(error.message, 'info');
    }
  }
  
  public cancel(): void {
    this.router.load('../account');
  }

  public removeImage(): void {
    this.imageService.removeImage();
  }

  

}
