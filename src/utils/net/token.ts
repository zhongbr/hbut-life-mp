import Taro from '@tarojs/taro';
import {ServerDomain, Protocol, Port, ApiVersion, Platform, TokenExpire, AuthBase, AppVersion} from '../constants';

interface LoginResponse {
    code: string;
    errMsg: string;
}

export interface TokenResponse {
    token: string;
    fakeid: string;
}

export class Token {
    private token: string = '';
    private fakeid: string = '';
    private updateTime: Date | null = null;
    private expire: number = 0;
    private refreshUrl: string = '';

    constructor(url: string, expire: number) {
        this.refreshUrl = url;
        this.expire = expire * 1000;
    }

    // 从服务器刷新API调用token
    public refreshToken(): Promise<TokenResponse> {
        return new Promise<TokenResponse>((resolve: (res: TokenResponse) => void) => {
            Taro.login()
                .then((res: LoginResponse) => {
                    let jscode: string = res.code;
                    return Taro.request({
                        url: this.refreshUrl,
                        method: 'GET',
                        dataType: 'json',
                        data: {
                            platform: Platform,
                            js_code: jscode
                        },
                        success: (res: any) => {
                            this.updateTime = new Date();
                            this.token = res.data.token;
                            this.fakeid = res.data.fakeid;
                            resolve({
                                token: res.data.token,
                                fakeid: res.data.fakeid,
                            });
                        }
                    });
                })
        });
    }

    // 获取token
    public async getApiToken(): Promise<TokenResponse> {
        // 如果本地的token还在有效期，直接使用本地的token，或者从服务器获取新的token
        if (this.updateTime === null || new Date().valueOf() - this.updateTime.valueOf() > this.expire) {
            return this.refreshToken();
        }
        else {
            return { token: this.token, fakeid: this.fakeid };
        }
    }
}

const getter = new Token(`${Protocol}://${ServerDomain}:${Port}${AuthBase}${ApiVersion}?platform=${Platform}&version=${AppVersion}`, TokenExpire);

export default async function TokenFactory(): Promise<TokenResponse> {
    let token = await getter.getApiToken();
    return token as TokenResponse;
}