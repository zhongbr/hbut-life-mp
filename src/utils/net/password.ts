import Taro from '@tarojs/taro';
import { LoginTips } from '../constants';

export interface Password {
    username: string;
    password: string;
    code: string;
};

// 本地缓存密码
export async function SavePassword(password: Password) {
    let localPasswords = {};
    try {
        localPasswords = await Taro.getStorage({key: 'passwords'});
    } catch(e) {}
    localPasswords[password.code] = password;
    await Taro.setStorage({key: 'passwords', data: localPasswords});
}

// 读取本地缓存的密码
export async function ReadPassword(codes: Array<string>): Promise<Array<Password>> {
    try {
        let localPasswords = await Taro.getStorage({key: 'passwords'});
        let results = codes.map(code => {
            if(localPasswords.data[code]) return localPasswords.data[code];
            else {
                for(let rcode of LoginTips[code].Replace) {
                    if(localPasswords.data[rcode]) return localPasswords.data[rcode];
                }
            }
        });
        return results;
    } catch (e) {
        return [];
    }
}

export function CheckPasswordSync(code: string): boolean {
    let passwords = Taro.getStorageSync('passwords');
    if(!passwords) return false;
    if(!passwords[code]){
        for(let rcode of LoginTips[code].Replace) if(passwords[rcode]) return true;
        return false;
    }
    return true;
}