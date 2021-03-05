import Taro from '@tarojs/taro'
import { request } from './net/request'
import { Subject as SubjectGpaCalculate } from './gpa'

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


export interface ExtraData {
    key: string;
    value: string;
}

export interface Subject extends SubjectGpaCalculate {
    name: string;
    course_code: string;
    extra_data: ExtraData[];
}

export async function GetGrades(semester: string) {
    // 如果学期格式不是纯数字
    if (!/^\d+$/.test(semester)) {
        let year = semester.slice(0, 4);
        let half = { '一': '1', '二': '2' }[semester[12]];
        semester = year + half;
    }
    Taro.showLoading({ title: '查询中' });
    let resp = await request({
        data: {
            group: 'base',
            action: 'score',
            data: {
                accounts: ['005'],
                semester: semester
            }
        }
    });
    Taro.hideLoading();
    let subjects = resp.data.courses as Subject[];
    // 转换学期格式
    let semesterString = `${semester.slice(0, 4)}-${parseInt(semester.slice(0, 4)) + 1}学年第${{ '1': '一', '2': '二' }[semester[4]]}学期`
    // 计算学年绩点
    try {
        let otherSemesterGrades = await Taro.getStorage({ key: `grades_${semester.slice(0, 4)}${semester[4] === '1' ? '2' : '1'}` });
    } catch (e) { }
    // 缓存查询过的成绩
    await Taro.setStorage({ key: `grades_${semester}`, data: subjects });
    return { subjects };
}