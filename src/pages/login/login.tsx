import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { request } from '../../utils/net/request'
import * as utils from '../../utils/index'
import { SavePassword } from '../../utils/net/password'
import { LoginTips } from '../../utils/constants'
import './login.scss'

interface LoginTip {
    WebsiteName: string;
    UsernameTips: string;
    PasswordTips: string;
    WebsiteUrl: string;
}

interface LoginPageState {
    loginTip?: LoginTip;
    username?: string;
    password?: string;
}

export default class LoginPage extends React.Component<any, LoginPageState> {
    private code: string = '001';

    constructor(props) {
        super(props);
        this.state = {}
    }

    onLoad(options) {
        console.log('进入login页面');
        let code = options.code ? options.code as string : '001';
        this.code = code;
        this.setState({ loginTip: LoginTips[code] });
    }

    async tryToLogin() {
        if (!/[0-9a-zA-Z]{10}/.test(this.state.username) || this.state.password === '') Taro.showToast({
            icon: 'none',
            title: '表单格式错误'
        });
        else {
            let account = {
                username: this.state.username,
                password: this.state.password,
                code: this.code
            }
            Taro.showLoading({
                title:'登录中'
            });
            let resp = await request({
                data: {
                    group: 'base',
                    action: 'bind',
                    data: {
                        accounts: [],
                        account
                    }
                }
            });
            Taro.hideLoading();
            let valid = resp.data.valid;
            if (!valid) Taro.showModal({
                title: '登录出错',
                content: resp.data.message,
                confirmText: '我知道了',
                showCancel: false
            });
            else {
                await SavePassword({
                    code: this.code,
                    username: this.state.username as string,
                    password: this.state.password as string
                })
                await Taro.showToast({
                    title: `登录成功`
                });
                Taro.navigateBack();
            }

        }
    }

    async TestUserLogin(){
        let res = await Taro.showModal({
            title: '进入游客登录模式',
            content: '你即将进入游客登录模式，该模式可以体验小程序的功能，但是数据均为虚拟数据、'
        })
        if(res.confirm){
            utils.test.SetTestMode(true); // 开启测试模式
            Taro.reLaunch({
                url: '../index/index',
                success:()=>{
                    Taro.showToast({title: '游客登录'});
                }
            })    
        }
    }

    render() {
        return (<>
            <CustomNavigationBar hasBack title='登录' opacity={1} />
            <View className='login-logo'>
                <Image src={'http://pic.zhongbr.cn/logo.png'} mode='scaleToFill' />
            </View>
            <View className='login-form'>
                <Text className='login-form-title'>{this.state.loginTip?.WebsiteName}登录</Text>
                <AtForm className='login-form-atform'>
                    <AtInput
                        name='username'
                        className='login-form-input'
                        required
                        title='账号'
                        type='text'
                        placeholder={this.state.loginTip?.UsernameTips}
                        value={this.state.username}
                        onChange={(username) => this.setState({ username: username.toString() })}
                    />
                    <AtInput
                        name='password'
                        className='login-form-input'
                        required
                        title='密码'
                        type='password'
                        placeholder={this.state.loginTip?.PasswordTips}
                        value={this.state.password}
                        onChange={(password) => this.setState({ password: password.toString() })}
                    />
                    <View className='test-login' onClick={this.TestUserLogin.bind(this)}>
                        <Text>游客登录</Text>
                    </View>
                    <View className='login-form-warning'>如果你点击“登录验证”按钮，随即代表你同意本应用从{this.state.loginTip?.WebsiteUrl}网站获取数据。</View>
                    <AtButton className='login-form-button' type='primary' circle onClick={this.tryToLogin.bind(this)}>登录验证</AtButton>
                    {/* <AtButton className='login-form-button' type='primary' circle onClick={() => this.setState({ username: '', password: '' })}>重新输入</AtButton> */}
                </AtForm>
            </View>
        </>)
    }
}