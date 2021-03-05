import React from 'react'
import Taro from '@tarojs/taro'
import { View, OpenData, Navigator } from '@tarojs/components'
import { AtList, AtListItem, AtCard } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import * as utils from '../../utils/index'
import '../../static/icons/login.svg'
import '../../static/icons/settings.png'
import './settings.scss'

interface SettingPageState {
    userinfo?: utils.userinfo.UserInfoInterface;
    loginState?: { [key: string]: boolean };
    testState?: boolean;
}

export default class SettingsPage extends React.Component<any, SettingPageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loginState: {}
        }
    }

    async componentDidShow() {
        this.checkLogin();
        await this.getUserInfo();
        this.setState({testState: utils.test.IsTestMode()})
    }

    private checkLogin() {
        let loginState = {};
        utils.constants.Accounts.forEach(acc => loginState[acc] = utils.passwords.CheckPasswordWithoutReplaceSync(acc));
        console.log('login state', loginState);
        this.setState({ loginState });
    }

    private async getUserInfo() {
        let userinfo = await utils.userinfo.GetUserInfo();
        this.setState({ userinfo });
    }

    private async quitTestMode(){
        let res = await Taro.showModal({
            title: '退出游客登录',
            content: '你即将退出游客登录模式，确认吗？'
        })
        if(res.confirm){
            utils.test.SetTestMode(false);
            Taro.reLaunch({
                url: '../index/index',
                success(){
                    Taro.showToast({title:'退出游客登录'})
                }
            })
        }
    }

    render() {
        return (<>
            <CustomNavigationBar title='我的' opacity={1} />
            <View>
                <AtCard
                    title='用户信息'
                    //thumb='../../static/icons/login.svg'
                    isFull
                    className='card'
                    renderIcon={<OpenData
                        type='userAvatarUrl'
                        style={{ height: '20px', width: '20px', marginRight: '10px', borderRadius: '50%', overflow: 'hidden' }}
                    />}
                >
                    <View className='opendata-box'>
                        <OpenData
                            type='userNickName'
                            className='nickname'
                        />
                    </View>
                    {this.state.userinfo && <AtList>
                        <AtListItem title='姓名' extraText={this.state.userinfo.name} />
                        <AtListItem title='班级' extraText={this.state.userinfo.class} />
                        <AtListItem title='学院' extraText={this.state.userinfo.colleage} />
                        <AtListItem title='学号' extraText={this.state.userinfo.student_id} />
                    </AtList>}
                </AtCard>

                <AtCard
                    title='账号管理'
                    thumb='../../static/icons/login.svg'
                    isFull
                    className='card'
                >
                    <AtList>
                        {utils.constants.Accounts.map((account, index) => {
                            let password = utils.passwords.ReadPasswordSync(account);
                            return <AtListItem
                                title={`${index + 1}.${utils.constants.LoginTips[account].WebsiteName}`}
                                note={`账号:${(password?.username) ? password?.username : '无授权'}[${(utils.constants.LoginTips[password?.code]?.WebsiteName) ? utils.constants.LoginTips[password?.code]?.WebsiteName : '无授权'}]`}
                                extraText={this.state.loginState[account] ? '注销' : '登录'}
                                onClick={this.state.loginState[account] ?
                                    async () => {
                                        let res = await Taro.showModal({
                                            title: '注销登录',
                                            content: `你即将注销${utils.constants.LoginTips[account].WebsiteName}的登录状态，确定吗？`
                                        })
                                        if (res.confirm) {
                                            await utils.passwords.RemovePassword(account);
                                            this.checkLogin();
                                            Taro.showToast({ title: '注销成功' });
                                        } else {
                                            Taro.showToast({ title: '取消', icon: 'none' })
                                        }
                                    } : async () => {
                                        Taro.navigateTo({ url: `../login/login?code=${account}` })
                                        this.checkLogin();
                                    }
                                }
                            />
                        })}
                    </AtList>
                </AtCard>

                <AtCard
                    title='其他设置'
                    thumb='../../static/icons/settings.png'
                    isFull
                    className='card'
                >
                    <AtList>
                        <Navigator url='../about/about'>
                            <AtListItem
                                title='关于小程序'
                                arrow='right'
                            />
                        </Navigator>
                        {this.state.testState && <AtListItem 
                            title='退出游客登录'
                            arrow='right'
                            onClick={this.quitTestMode.bind(this)}
                        />}
                        <AtListItem
                            title='清除缓存'
                            arrow='right'
                            onClick={async () => {
                                let res = await Taro.showModal({
                                    title: '清除缓存',
                                    content: '你即将清除小程序所有的缓存，确认吗？'
                                })
                                if (res.confirm) {
                                    await Taro.clearStorage();
                                    await Taro.showToast({ title: '清除成功' });
                                    Taro.reLaunch({ url: '../index/index' });
                                } else {
                                    await Taro.showToast({ title: '取消', icon: 'none' });
                                }
                            }}
                        />
                    </AtList>
                </AtCard>
            </View>
        </>)
    }
}