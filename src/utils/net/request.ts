import taro from '@tarojs/taro'
import { Sha1Hash } from './sha1';
import TokenFactory from './token';
import { ReadPassword } from './password';
import {Protocol, ServerDomain, Port, ApiBase, ApiVersion, Platform, AppVersion} from '../constants';
import aes from "./aes/export";

export interface Request<D> {
    header?: any;
    data: D;
}

export interface Response<D> {
    msg: string;
    code: number;
    data: D;
}

// 带签名校验的安全请求方法
export interface ApiBody {
    group: string;
    action: string;
    data: any;
    uuid?: string;
}

export function RequestPromise(req: any): Promise<taro.request.SuccessCallbackResult> {
    return new Promise((resolve, reject)=>{
        taro.request({
            ...req,
            success: res => resolve(res),
            fail: (res)=> reject(res),
        })
    });
}

export async function request<R = any>(req:Request<ApiBody>): Promise<Response<R>> {
    let token = await TokenFactory();
    let passwords = await ReadPassword(req.data.data.accounts as string[]);
    req.data.group = `origin/${req.data.group}`;
    // 加密密码
    req.data.data.accounts = aes.encrypt(
        JSON.stringify(passwords),
        token.token.slice(0, 16),
        token.fakeid.slice(0, 16)
    );
    req.data.uuid = token.fakeid;
    req.data.data.uuid = token.fakeid;
    req.data.data.platform = Platform;
    let reqString = JSON.stringify(req.data);
    let timestamp = Math.floor(new Date().valueOf() / 1000);
    let nonce = Math.random();
    let signature = Sha1Hash(`${reqString}${token.token}${timestamp}${nonce}`);
    let resp = await RequestPromise({
        url: `${Protocol}://${ServerDomain}:${Port}${ApiBase}${ApiVersion}/${req.data.group}/${req.data.action}?platform=${Platform}&version=${AppVersion}`,
        method: 'POST',
        dataType: 'json',
        data: req.data,
        header: {
            ...req.header,
            'X-Tag': `${signature},${timestamp},${nonce},${token.fakeid}`,
        }
    });
    return {
        code: resp.data.code,
        msg: `http:${resp.errMsg}, server:${resp.data.message}`,
        data: resp.data.data
    }
}