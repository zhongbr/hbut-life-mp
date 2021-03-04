import Taro from '@tarojs/taro'
import { request } from './net/request'

export interface UserInfoInterface {
    student_id: string;
    name: string;
    id: string;
    class: string;
    colleage: string;
    nationality: string;
    gendar: string;
    subject: string;
    school_system: string;
}

export async function GetUserInfo(): Promise<UserInfoInterface> {
    try {
        let localUserInfo = (await Taro.getStorage({ key: 'userinfo' })).data;
        if (localUserInfo) return localUserInfo as UserInfoInterface;
    } catch (error) {
        // 从服务器加载
        let resp = await request({
            data: {
                group: 'base',
                action: 'userInfo',
                data: {
                    accounts: ['005']
                }
            }
        });
        let userinfo = resp.data as UserInfoInterface;
        Taro.setStorage({ key: 'userinfo', data: userinfo });
        return userinfo;
    }
}