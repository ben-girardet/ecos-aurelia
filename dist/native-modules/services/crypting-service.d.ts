import { ApolloService } from './apollo-service';
export declare class CryptingService {
    private apollo;
    constructor(apollo: ApolloService);
    isCrypted(message: string): boolean;
    encryptString(message: string, cryptingKey: string): string;
    decryptString(message: string, cryptingKey: string): string;
    recryptContentKeyFor(myShare: {
        encryptedContentKey?: string;
        encryptedBy?: string;
    }, userId: string): Promise<string>;
}
