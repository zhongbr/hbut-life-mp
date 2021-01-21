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