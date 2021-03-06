import Taro from '@tarojs/taro'
/**
 * 测试模式，游客登录体验返回虚拟数据
 */
let TestMode: boolean = Boolean(Taro.getStorageSync('test_state'));
export function SetTestMode(state: boolean) {
    console.log('set test mode', state);
    Taro.setStorageSync('test_state', state);
    TestMode = state;
}

export function IsTestMode() {
    console.log('test mode state', TestMode);
    return TestMode;
}

/**
 * 虚拟的数据提供入口
 */
interface RequestData {
    group: string;
    action: string;
    data: { [key: string]: any }
}
interface ResponseInterface {
    code: number;
    message: string;
    data: any;
}
interface RequestOptionsInterface {
    data: RequestData;
    success: (res: Taro.request.SuccessCallbackResult<ResponseInterface>) => void;
    fail: () => void;
    complete: () => void;
}
export async function TestRequest(options: RequestOptionsInterface) {
    console.log('test mode request', options);
    let func = TestAPI[options.data.group][options.data.action];
    options.success({
        statusCode: 200,
        errMsg: '200 ok',
        header: {},
        data: {
            code: 200,
            message: 'request ok',
            data: await func(options.data.data)
        },
    });
}

//需要提供的数据
const TestAPI = {
    "origin/base": {
        'notification': async function () {
            return [{
                id: 1,
                send_time: new Date().valueOf(),
                title: '欢迎使用湖工life小程序',
                text: '欢迎使用湖工life小程序，你当前处于游客登录模式，如果你需要退出游客登录模式，请到“我的”页面操作退出。',
                image_url: '',
            }]
        },
        'banner': async function () {
            return {
                banners: [{
                    id: 1,
                    type: '',
                    url: 'http://pic.zhongbr.cn/banner-default.png',
                    target: '',
                    desc: '欢迎使用湖工life小程序',
                }]
            }
        },
        'get-weather-info': async function () {
            return { "data": { "city": "武汉", "forecast": [{ "date": "5日星期五", "fengli": "\u003c![CDATA[2级]]\u003e", "fengxiang": "东风", "high": "高温 12℃", "low": "低温 8℃", "type": "中雨" }, { "date": "6日星期六", "fengli": "\u003c![CDATA[3级]]\u003e", "fengxiang": "东北风", "high": "高温 10℃", "low": "低温 4℃", "type": "小雨" }, { "date": "7日星期天", "fengli": "\u003c![CDATA[2级]]\u003e", "fengxiang": "东北风", "high": "高温 12℃", "low": "低温 4℃", "type": "多云" }, { "date": "8日星期一", "fengli": "\u003c![CDATA[2级]]\u003e", "fengxiang": "东风", "high": "高温 10℃", "low": "低温 5℃", "type": "小雨" }, { "date": "9日星期二", "fengli": "\u003c![CDATA[2级]]\u003e", "fengxiang": "东风", "high": "高温 15℃", "low": "低温 7℃", "type": "阴" }], "ganmao": "感冒多发期，适当减少外出频率，适量补充水分，适当增减衣物。", "wendu": "11", "yesterday": { "date": "4日星期四", "fl": "\u003c![CDATA[2级]]\u003e", "fx": "东南风", "high": "高温 18℃", "low": "低温 10℃", "type": "晴" } }, "desc": "OK", "status": 1000 }
        },
        'bind': async function () { },
        'userInfo': async function () {
            return {
                class: '17自动化2班',
                student_id: '1710221201',
                name: '张三',
                id: '420116200001011234',
                gendar: '男',
                nationality: '汉族',
                colleage: '电气学院',
                subject: '自动化',
                school_system: '4年',
            }
        },
        'score': async function () {
            return {
                totalGpa: 3.3154,
                courses: [
                    {
                        name: '深度学习',
                        course_code: '123456789',
                        credit: 2.5,
                        grade: 97,
                        extra_data: [
                            { key: '类型', value: '必修课' },
                            { key: '平时成绩', value: '100分' }
                        ],
                    },
                    {
                        name: '大学体育',
                        course_code: '123456789',
                        credit: 1.5,
                        grade: 87,
                        extra_data: [
                            { key: '类型', value: '必修课' },
                            { key: '平时成绩', value: '90分' }
                        ],
                    },
                ],
                cookies: undefined
            }
        },
        'get-all-grades': async function () { },
        'courseTable': async function () {
            return {
                courses: [{ "name": "形势与政策(一)-8", "code": "", "teachers": ["王秀红-主讲"], "schedules": [{ "weeks": [6], "day": 4, "section": [9, 10], "classroom": "2-002" }] }, { "name": "毕业实习(一)", "code": "", "teachers": ["曾亮-实习指导,廖想-实习指导"], "schedules": [{ "weeks": [1, 4], "day": 0, "section": null, "classroom": "DQ" }] }, { "name": "毕业设计(一)", "code": "", "teachers": ["常雨芳-设计指导,廖冬初-设计指导,王淑青-设计指导,宋阿妮-设计指导,权轶-设计指导,王珊珊-设计指导"], "schedules": [{ "weeks": [5, 16], "day": 0, "section": null, "classroom": "DQ" }] }],
                previous_data: [{ "Classes": "17自动1,17自动2,17自动3,17创新_AI1", "CurName": "形势与政策(一)-8", "Day": 4, "DayStr": "", "DayTime": 5, "DayTimeStr": "", "Place": "2-002", "TaskTimeType": 1, "Teacher": "王秀红-主讲", "Week": "第6周" }, { "Classes": "17自动2", "CurName": "毕业实习(一)", "Day": 0, "DayStr": "星期一~星期六", "DayTime": 0, "DayTimeStr": "第1~8节", "Place": "DQ", "TaskTimeType": 2, "Teacher": "曾亮-实习指导,廖想-实习指导", "Week": "第1~4周" }, { "Classes": "17自动2", "CurName": "毕业设计(一)", "Day": 0, "DayStr": "星期一~星期六", "DayTime": 0, "DayTimeStr": "第1~8节", "Place": "DQ", "TaskTimeType": 2, "Teacher": "常雨芳-设计指导,廖冬初-设计指导,王淑青-设计指导,宋阿妮-设计指导,权轶-设计指导,王珊珊-设计指导", "Week": "第5~16周" }]
            }
        },
        'exam': async function () {
            return {
                exams: [
                    {
                        Name: '深度学习考试',
                        Class: '17自动化2班',
                        Extra: '1-001 第5周星期一 10:00-12:00',
                    }
                ]
            }
        },
        'make-up-subjects': async function () {
            return {
                subjects: [
                    {
                        course_name: '大学体育',
                        others_info: '中心操场-1',
                    }
                ]
            }
        },
    },
    "origin/campus-card": {
        'get-balance': async function () {
            return {
                balance: 99.72
            }
        },
        'get-bill': async function () {
            return {
                pages: 2,
                bill: [
                    {
                        time: '2021-01-01 17:00:14',
                        description: '消费',
                        amount: 5.14,
                        balance: 99.72,
                        operator: '不会手抖的食堂阿姨',
                        workstation: '东区食堂',
                        terminal: 'xx麻辣烫',
                    },
                    {
                        time: '2021-01-01 17:00:14',
                        description: '消费',
                        amount: 5.14,
                        balance: 99.72,
                        operator: '不会手抖的食堂阿姨',
                        workstation: '东区食堂',
                        terminal: 'xx麻辣烫',
                    },
                    {
                        time: '2021-01-01 17:00:14',
                        description: '消费',
                        amount: 5.14,
                        balance: 99.72,
                        operator: '不会手抖的食堂阿姨',
                        workstation: '东区食堂',
                        terminal: 'xx麻辣烫',
                    },
                ]
            }
        },
    },
    "origin/study": {
        'get-physic-labs': async function () {
            return {
                labs: [{ "location": "B4-1", "name": "薄透镜焦距", "preview": "94", "process": "94", "report": "92", "status": "完成", "timeAndTeacher": "第四周星期二第九十节 童亚拉" }, { "location": "B4-3", "name": "分光计的调整", "preview": "70", "process": "60", "report": "60", "status": "完成", "timeAndTeacher": "第四周星期六第九十节 甘路" }, { "location": "B4-7", "name": "杨氏模量", "preview": "75", "process": "85", "report": "70", "status": "完成", "timeAndTeacher": "第五周星期三最后两节 江铭波" }, { "location": "B4-17", "name": "多普勒效应", "preview": "75", "process": "80", "report": "70", "status": "完成", "timeAndTeacher": "第十周星期五第三四节 邓罡" }, { "location": "B5-3", "name": "示波器原理", "preview": "60", "process": "60", "report": "60", "status": "完成", "timeAndTeacher": "第八周星期五最后两节 杨昕" }, { "location": "B5-9", "name": "电表的改装", "preview": "70", "process": "85", "report": "89", "status": "完成", "timeAndTeacher": "第二周星期二第九十节 李文兵" }, { "location": "B4-16", "name": "静电场的模拟", "preview": "90", "process": "65", "report": "65", "status": "完成", "timeAndTeacher": "第三周星期三最后两节 徐国旺" }, { "location": "B5-12", "name": "理想气体定律实验", "preview": "82", "process": "81", "report": "81", "status": "完成", "timeAndTeacher": "第三周星期六第九十节 吕清花" }, { "location": "B5-7", "name": "电桥法测量电阻", "preview": "80", "process": "80", "report": "85", "status": "完成", "timeAndTeacher": "第二周星期三第一二节 陈慧" }]
            }
        },
        'free_classrooms': async function () {
            return {
                classrooms: [{ "room": "1-209", "update_time": 1608635195 }, { "room": "1-206", "update_time": 1608514117 }, { "room": "1-105", "update_time": 1607931529 }, { "room": "1-107", "update_time": 1607922677 }, { "room": "1-003", "update_time": 1607733235 }, { "room": "1-301", "update_time": 1607731663 }, { "room": "机连1-317", "update_time": 1607590722 }, { "room": "1-308B", "update_time": 1607567058 }, { "room": "1-207", "update_time": 1607161681 }, { "room": "1-204", "update_time": 1607135475 }, { "room": "1-106", "update_time": 1605590046 }, { "room": "1-205", "update_time": 1605264756 }, { "room": "1-303", "update_time": 1604540458 }, { "room": "机电楼421", "update_time": 1604409743 }, { "room": "机连1-315", "update_time": 1603158749 }, { "room": "机连1-101", "update_time": 1602499116 }, { "room": "1-308", "update_time": 1602499104 }, { "room": "1-314", "update_time": 1602499043 }, { "room": "1-203", "update_time": 1601877317 }, { "room": "1-201", "update_time": 1601877316 }, { "room": "机连1-316", "update_time": 1601877300 }, { "room": "机连1-217", "update_time": 1601877297 }, { "room": "机连1-216", "update_time": 1601877296 }, { "room": "机连1-104", "update_time": 1601877294 }, { "room": "机连1-103", "update_time": 1601877293 }, { "room": "机连1-102", "update_time": 1601877291 }]
            }
        },
        'classroom_schedule': async function () {
            return {
                busy_weeks: { "第1-2节": { "星期一": null, "星期三": null, "星期二": null, "星期五": null, "星期六": null, "星期四": null, "星期日": null }, "第3-4节": { "星期一": null, "星期三": null, "星期二": null, "星期五": null, "星期六": null, "星期四": null, "星期日": null }, "第5-6节": { "星期一": null, "星期三": null, "星期二": null, "星期五": null, "星期六": null, "星期四": null, "星期日": null }, "第7-8节": { "星期一": null, "星期三": null, "星期二": null, "星期五": null, "星期六": null, "星期四": null, "星期日": null }, "第9-10节": { "星期一": null, "星期三": null, "星期二": null, "星期五": null, "星期六": null, "星期四": null, "星期日": null } },
                courses: { "第1-2节": { "星期一": [], "星期三": [], "星期二": [], "星期五": [], "星期六": [], "星期四": [], "星期日": [] }, "第3-4节": { "星期一": [], "星期三": [], "星期二": [], "星期五": [], "星期六": [], "星期四": [], "星期日": [] }, "第5-6节": { "星期一": [], "星期三": [], "星期二": [], "星期五": [], "星期六": [], "星期四": [], "星期日": [] }, "第7-8节": { "星期一": [], "星期三": [], "星期二": [], "星期五": [], "星期六": [], "星期四": [], "星期日": [] }, "第9-10节": { "星期一": [], "星期三": [], "星期二": [], "星期五": [], "星期六": [], "星期四": [], "星期日": [] } }
            }
        },
        'get-elective-course': async function () {

        },
        'get-elective-courses-types': async function () {
            return {
                courses: [{ "id": 2451, "subject_name": "大学体育", "semester": "2018-2019学年第一学期", "host_teacher": "张毅", "others_info": "2-108 4-14周 星期二 NI节", "subject_type": "基础科学类", "source": "来自教务处" }]
            }
        },
        'get-elective-courses-semesters': async function () {
            return {
                courses: [
                    {
                        host_teacher: "",
                        id: 3180,
                        others_info: "",
                        semester: "2020-2021学年第一学期",
                        source: "教务处选课网页",
                        subject_name: "理财与投资",
                        subject_type: "经济与管理类",
                    },
                    {
                        host_teacher: "",
                        id: 3180,
                        others_info: "",
                        semester: "2020-2021学年第一学期",
                        source: "教务处选课网页",
                        subject_name: "理财与投资",
                        subject_type: "经济与管理类",
                    }
                ]
            }
        },
        'get-teacher-schedule':async function(){
            let name = arguments[0].keyword;
            return {
                schedule: {"第1-2节":{"星期一":[],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第3-4节":{"星期一":[["模拟与数字电子技术","李四s-主讲","19测控1,19测控2,19质量1","第1-7周第9-16周","1教1-002"]],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第5-6节":{"星期一":[],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第7-8节":{"星期一":[],"星期三":[["模拟与数字电子技术",name+"-主讲","19测控1,19测控2,19质量1","第9-16周","1教1-002"]],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第9-10节":{"星期一":[],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]}}
            }
        },
        'search-schedule':async function(){
            return {
                results: [
                    {
                        name: arguments[0].keyword + String.fromCharCode('a'.charCodeAt(0) + Math.ceil(Math.random()*26)),
                        info: '电气学院',
                        url: ''
                    },
                    {
                        name: arguments[0].keyword + String.fromCharCode('a'.charCodeAt(0) + Math.ceil(Math.random()*26)),
                        info: '计算机学院',
                        url: ''
                    },
                ]
            }
        },
        'get-schedule':async function(){
            let name = '张三';
            return {
                schedule: {"第1-2节":{"星期一":[],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第3-4节":{"星期一":[["模拟与数字电子技术","李四s-主讲","19测控1,19测控2,19质量1","第1-7周第9-16周","1教1-002"]],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第5-6节":{"星期一":[],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第7-8节":{"星期一":[],"星期三":[["模拟与数字电子技术",name+"-主讲","19测控1,19测控2,19质量1","第9-16周","1教1-002"]],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]},"第9-10节":{"星期一":[],"星期三":[],"星期二":[],"星期五":[],"星期六":[],"星期四":[],"星期日":[]}}
            }
        },
    },
    "origin/library": {
        'borrowBooks': async function () {
            return {
                books: [
                    {
                        'code': '123456789',
                        'name': '小程序开发1',
                        'borrow_date': '2021-01-01',
                        'return_date': '2021-03-01',
                        'location': '图书馆',
                    },
                    {
                        'code': '123456790',
                        'name': '微信小程序开发2',
                        'borrow_date': '2021-01-01',
                        'return_date': '2021-03-01',
                        'location': '图书馆',
                    },
                ]
            }
        },
        'find-book': async function () {
            return {
                books: [
                    {
                        name: arguments[0].keyword,
                        href: '123',
                        all: '3',
                        borrowAble: '2',
                        author: 'xxx',
                        publishingCompany: 'xxx出版社',
                    }
                ]
            }
        },
        'book-home-page': async function () {
            return {
                homepage: {
                    callNumber: '123456789',
                    barCodeNumber: '12345678',
                    annualVolume: 'python编程',
                    bookStatus: '可借',
                    returnLocation: '图书馆',
                }
            }
        },
    }
}