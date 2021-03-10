import React from 'react'
import Taro from '@tarojs/taro'
import { AtCard, AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import './alert.scss'

interface AlertState {
    CanBack: boolean;
    CountDown: number;
    ReachedBottom: boolean;
}

export default class AlertPage extends React.Component<any, AlertState> {
    constructor(props: any) {
        super(props);
        this.state = {
            CanBack: false,
            CountDown: 30,
            ReachedBottom: false
        }
    }

    render() {
        return <>
            <CustomNavigationBar opacity={1} hasBack={false} title='用户协议' />
            <View>
                <AtCard className='card' isFull title='协议内容'>
                    <View className='para bold'>您进入并使用本小程序，代表您知晓并且同意如下的条款内容：</View>
                    <View className='para'>0. 本小程序是个人开发，非学校官方平台，重要的事情说三遍</View>
                    <View className='para'>0. 本小程序是个人开发，非学校官方平台，重要的事情说三遍</View>
                    <View className='para'>0. 本小程序是个人开发，非学校官方平台，重要的事情说三遍</View>

                    <View className='para'>1. 本小程序是个人开发，非学校官方平台，提供的数据均来自模拟浏览器请求访问官方网站. </View>
                    <View className='para'>2. 因为计算机程序的不稳定性存在，使用过程中可能会产生一些意想不到的问题，所以本小程序内的数据不具有任何权威性，如果小程序的数据和实际情况或者官网数据有出入，请务必以实际情况或者官网数据为准！如果你对小程序内的数据有疑问，请先去学校官网核对，然后使用官网的数据去询问辅导员或者其他老师！</View>
                    <View className='para'>3. 本小程序不保存你的个人信息，所以你可以看到的信息都是实时获取，或者保存在你的手机缓存中，小程序的数据库仅做通知、提供功能所需要的与具体个人无关的数据.</View>
                    <View className='para'>4. 您作为用户同意以正常的方式使用小程序，不随意传播歪曲小程序内的数据及数据后的含义.</View>
                    <View className='para'>4. 如有其他补充条款，将在小程序内以弹窗形式通知，如果您收到通知后使用小程序即代表你同意通知的内容.</View>
                    <AtButton
                        disabled={!(this.state.CanBack && this.state.ReachedBottom)}
                        onClick={() => {
                            Taro.setStorageSync('agreed', true);
                            Taro.reLaunch({ url: '../index/index' });
                        }}
                    >{this.state.CanBack ? '我已阅读并同意' : `请阅读协议[${this.state.CountDown}秒]`}</AtButton>
                </AtCard>
            </View>

        </>
    }

    componentDidMount() {
        let interval = setInterval(() => {
            if (this.state.CountDown === 0) {
                clearInterval(interval);
                this.setState({CanBack: true});
            }
            else this.setState({ CountDown: this.state.CountDown - 1 });
        }, 1000);
    }

    onReachBottom() {
        console.log('reach bottom');
        this.setState({ ReachedBottom: true });
    }

}