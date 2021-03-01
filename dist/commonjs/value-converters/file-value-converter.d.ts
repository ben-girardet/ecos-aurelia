import { Configuration } from '../configuration';
export declare class FileValueConverter {
    private conf;
    constructor(conf: Configuration);
    toView(filename: string | {
        fileId: string;
        width: number;
        height: number;
    }[], imageWidth?: string, imageHeight?: string): string;
}
