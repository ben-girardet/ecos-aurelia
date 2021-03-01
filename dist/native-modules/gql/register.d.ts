import { ApolloService } from '../services/apollo-service';
import { IToken, ILogin } from 'ecos-types';
export declare class RegisterCommands {
    private apollo;
    constructor(apollo: ApolloService);
    register(mobile: string, email: string, password: string): Promise<IToken>;
    validateRegistration(token: string, code: string, type: 'email' | 'mobile', password: string): Promise<{
        id: string;
    }>;
    requestMobileCode(mobile: string): Promise<IToken>;
    validateCode(token: string, code: string): Promise<ILogin>;
}
