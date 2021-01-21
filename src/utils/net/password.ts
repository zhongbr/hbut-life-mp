import Taro from '@tarojs/taro';

export interface Password {
    username: string;
    password: string;
    code: string;
};

// 本地缓存密码
export function SavePassword(password: Password): Promise<Taro.General.CallbackResult> {
    return new Promise<Taro.General.CallbackResult>((resolve: (res: Taro.General.CallbackResult) => void, reject: () => void) => {
        Taro.getStorage({ key: 'passwords' })
            .then((res: Taro.getStorage.SuccessCallbackResult<any>) => {
                res.data[password.code] = password;
                return Taro.setStorage({ key: 'passwords', data: res.data });
            }, () => {
                let data: Taro.getStorage.SuccessCallbackResult<any> = { data: {}, errMsg: '' };
                data.data[password.code] = password;
                Taro.setStorage({ key: 'passwords', data: data.data })
            })
            .then(resolve, reject);
    });
}

// 读取本地缓存的密码
export async function ReadPassword(codes: Array<string>): Promise<Array<Password>> {
    try {
        let localPasswords = await Taro.getStorage({key: 'passwords'});
        let results = codes.map(code => localPasswords.data[code] as Password);
        return results;
    } catch (e) {
        return [];
    }
}