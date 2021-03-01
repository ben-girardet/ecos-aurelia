import sjcl from 'sjcl';
import { gql } from 'apollo-boost';
import { customAlphabet } from 'nanoid';
import { ApolloService } from './apollo-service';
import { inject } from 'aurelia';
const contentKeyGen = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.,;:!+*%&/()=?', 10);
// TODO: maybe use another (more modern) crypting solution
// More infos: https://medium.com/sharenowtech/high-speed-public-key-cryptography-in-javascript-part-1-3eefb6f91f77

@inject(ApolloService)
export class CryptingService {

  public constructor(private apollo: ApolloService) {

  }

  public isCrypted(message: string): boolean {
    if (typeof message === 'string' && message.length > 50 && message.substr(0, 7) === '{"iv":"') {
      return true;
    }
    return false;
  }

  public encryptString(message: string, cryptingKey: string): string {
    if (this.isCrypted(message)) {
      return message;
    }
    return sjcl.encrypt(cryptingKey, message);
  }

  public decryptString(message: string, cryptingKey: string): string {
    if (!this.isCrypted(message)) {
      return message;
    }
    try {
      return sjcl.decrypt(cryptingKey, message);
    } catch (error) {
      console.warn('Error while trying to decode', message);
      console.error(error);
      throw error;
    }
  }

  public async recryptContentKeyFor(myShare: {encryptedContentKey?: string, encryptedBy?: string}, userId: string): Promise<string> {
    const encryptedByUser = await this.apollo.client.query<{user: {publicKey: string}}>({query: gql`
query UserPubKey($id: String!) {
  user(id: $id) {
    id,
    publicKey
  }
}
    `, variables: {id: myShare.encryptedBy}});
    const contentKey = await this.apollo.decrypt(myShare.encryptedContentKey, encryptedByUser.data.user.publicKey);
    const encryptedForUser = await this.apollo.client.query<{user: {publicKey: string}}>({query: gql`
query UserPubKey($id: String!) {
  user(id: $id) {
    id,
    publicKey
  }
}
    `, variables: {id: userId}});
    const encryptedContentKey = await this.apollo.encrypt(contentKey, encryptedForUser.data.user.publicKey);
    return encryptedContentKey;
  }
}
