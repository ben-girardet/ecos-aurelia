var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import sjcl from 'sjcl';
import { gql } from 'apollo-boost';
import { customAlphabet } from 'nanoid';
import { ApolloService } from './apollo-service';
import { inject } from 'aurelia';
const contentKeyGen = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.,;:!+*%&/()=?', 10);
// TODO: maybe use another (more modern) crypting solution
// More infos: https://medium.com/sharenowtech/high-speed-public-key-cryptography-in-javascript-part-1-3eefb6f91f77
let CryptingService = class CryptingService {
    constructor(apollo) {
        this.apollo = apollo;
    }
    isCrypted(message) {
        if (typeof message === 'string' && message.length > 50 && message.substr(0, 7) === '{"iv":"') {
            return true;
        }
        return false;
    }
    encryptString(message, cryptingKey) {
        if (this.isCrypted(message)) {
            return message;
        }
        return sjcl.encrypt(cryptingKey, message);
    }
    decryptString(message, cryptingKey) {
        if (!this.isCrypted(message)) {
            return message;
        }
        try {
            return sjcl.decrypt(cryptingKey, message);
        }
        catch (error) {
            console.warn('Error while trying to decode', message);
            console.error(error);
            throw error;
        }
    }
    async recryptContentKeyFor(myShare, userId) {
        const encryptedByUser = await this.apollo.client.query({ query: gql `
query UserPubKey($id: String!) {
  user(id: $id) {
    id,
    publicKey
  }
}
    `, variables: { id: myShare.encryptedBy } });
        const contentKey = await this.apollo.decrypt(myShare.encryptedContentKey, encryptedByUser.data.user.publicKey);
        const encryptedForUser = await this.apollo.client.query({ query: gql `
query UserPubKey($id: String!) {
  user(id: $id) {
    id,
    publicKey
  }
}
    `, variables: { id: userId } });
        const encryptedContentKey = await this.apollo.encrypt(contentKey, encryptedForUser.data.user.publicKey);
        return encryptedContentKey;
    }
};
CryptingService = __decorate([
    inject(ApolloService),
    __metadata("design:paramtypes", [ApolloService])
], CryptingService);
export { CryptingService };
