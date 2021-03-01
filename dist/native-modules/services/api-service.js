var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, HttpClient, json } from 'aurelia';
import { Configuration } from './../configuration';
let ApiService = class ApiService {
    constructor(http, conf) {
        this.http = http;
        this.conf = conf;
        http.configure((config) => {
            config.withBaseUrl(conf.apiHost);
            // config.withBaseUrl('http://localhost:3000/api');
            // TODO: interceptors  ?
            // TODO: implement retry ?
            return config;
        });
    }
    defaultOptions() {
        const options = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        if (this.token) {
            options.headers.Authorization = `Token ${this.token}`;
        }
        return options;
    }
    async get(entrypoint, options) {
        options = Object.assign({}, this.defaultOptions(), options);
        const response = await this.http.get(entrypoint, options);
        return this.jsonify(response);
    }
    async post(entrypoint, body, options) {
        options = Object.assign({}, this.defaultOptions(), options);
        if (body instanceof FormData) {
            delete options.headers['Content-Type'];
        }
        else {
            body = json(body);
        }
        const response = await this.http.post(entrypoint, body, options);
        return this.jsonify(response);
    }
    async put(entrypoint, body, options) {
        options = Object.assign({}, this.defaultOptions(), options);
        if (body instanceof FormData) {
            delete options.headers['Content-Type'];
        }
        else {
            body = json(body);
        }
        const response = await this.http.put(entrypoint, body, options);
        return this.jsonify(response);
    }
    async jsonify(response) {
        if (response.status === 204) {
            return true;
        }
        const json = await response.json();
        if (response.status > 299 && json.error) {
            throw new Error(json.error);
        }
        return json;
    }
};
ApiService = __decorate([
    inject(HttpClient, Configuration),
    __metadata("design:paramtypes", [HttpClient, Configuration])
], ApiService);
export { ApiService };
