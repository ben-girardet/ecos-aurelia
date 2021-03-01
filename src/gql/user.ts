import { ApolloQueryResult, gql } from 'apollo-boost';
import { IUser } from 'ecos-types';
import { inject } from 'aurelia';
import { ApolloService } from '../services/apollo-service';

const editMeMutation = gql`
mutation EditMe($firstname: String, $lastname: String, $picture: [ImageInput!], $regId: String, $pushType: String, $pushTags: [String!], $pushActive: Boolean) {
  editMe(data: {firstname: $firstname, lastname: $lastname, picture: $picture, regId: $regId, pushType: $pushType, pushTags: $pushTags, pushActive: $pushActive})
  {
    id,
    firstname,
    lastname,
    picture {
      fileId,
      width,
      height
    },
    state
  }
}`;

@inject(ApolloService)
export class UserCommands {

  public constructor(private apollo: ApolloService) {
    console.log('userCommands constructor', this.apollo);
  }

  public async editMe(
    firstname: string | undefined, 
    lastname: string | undefined, 
    picture: {fileId: string, width: number, height: number}[] | undefined,
    regId?: string | undefined,
    pushType?: 'apn' | 'fcm' | undefined,
    pushTags?: string[] | undefined,
    pushActive?: boolean | undefined): Promise<IUser> {
    const result = await this.apollo.client.mutate({
      mutation: editMeMutation, 
      variables: {firstname, lastname, picture, regId, pushType, pushTags, pushActive}, 
      fetchPolicy: 'no-cache'}) as ApolloQueryResult<{editMe: IUser}>;
    if (typeof result.data.editMe.state === 'number') {
      this.apollo.setState(result.data.editMe.state);
    }
    return result.data.editMe;
  }
}