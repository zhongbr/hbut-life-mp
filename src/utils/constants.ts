import taro from '@tarojs/taro'

export const AppName = '湖工life';
export const DebugMode = false;
export const AppVersion = '6.0';
export const Platform = {
    'WEAPP': 'wx',
    'QQ': 'qq',
}[taro.getEnv()];

export const SystemInfo = taro.getSystemInfoSync();
export const MenuButtonBoundingClientReact = taro.getMenuButtonBoundingClientRect();
export const NavigationBarHeight = MenuButtonBoundingClientReact.bottom + 5;

export const MainColor = /*rgb(*/'8,16,200'/*)*/;

// 服务器信息
export const ServerDomain = DebugMode?'localhost':'proxy.zhongbr.cn';
export const Protocol = DebugMode?'http':'https';
export const Port = DebugMode?8888:5443;
export const ApiBase = '/api/data';
export const AuthBase = '/auth/mp';
export const ApiVersion = '/v1';
export const TokenExpire = 600;

// 登录账户信息
export const LoginTips = {
    '001': {
        WebsiteName: '个人门户',
        UsernameTips: '个人门户账号',
        PasswordTips: '个人门户密码',
        WebsiteUrl: 'http://portal.hbut.edu.cn/',
        Replace: []
    },
    '002': {
        WebsiteName: '图书馆',
        UsernameTips: '图书馆读书证号码',
        PasswordTips: '图书馆读书证密码',
        WebsiteUrl: 'https://lib.hbut.edu.cn/',
        Replace: ['001']
    },
    '003': {
        WebsiteName: '大学物理实验',
        UsernameTips: '大学物理实验账号',
        PasswordTips: '大学物理实验密码',
        WebsiteUrl: 'http://dxwlsy.hbut.edu.cn/',
        Replace: []
    },
    '004': {
        WebsiteName: '一卡通网站',
        UsernameTips: '一卡通网站账号',
        PasswordTips: '一卡通网站密码',
        WebsiteUrl: 'http://ecard.hbut.edu.cn',
        Replace: []
    },
    '005': {
        WebsiteName: '教务处网站',
        UsernameTips: '教务处账号',
        PasswordTips: '教务处密码',
        WebsiteUrl: 'http://run.hbut.edu.cn',
        Replace: ['001']
    }
}
