import { HttpClient } from 'aurelia';
import { Configuration } from './../configuration';
export declare class ApiService {
    private http;
    private conf;
    token: string | undefined;
    constructor(http: HttpClient, conf: Configuration);
    defaultOptions(): {
        headers: {
            [key: string]: string;
        };
    };
    get(entrypoint: string, options?: RequestInit): Promise<any>;
    post(entrypoint: string, body: any, options?: RequestInit): Promise<any>;
    put(entrypoint: string, body: any, options?: RequestInit): Promise<any>;
    jsonify(response: Response): Promise<any>;
}
