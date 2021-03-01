import { IUser } from 'ecos-types';
import { ApolloService } from '../services/apollo-service';
export declare class UserCommands {
    private apollo;
    constructor(apollo: ApolloService);
    editMe(firstname: string | undefined, lastname: string | undefined, picture: {
        fileId: string;
        width: number;
        height: number;
    }[] | undefined, regId?: string | undefined, pushType?: 'apn' | 'fcm' | undefined, pushTags?: string[] | undefined, pushActive?: boolean | undefined): Promise<IUser>;
}
