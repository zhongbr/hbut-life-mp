import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard } from 'taro-ui';
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import './about.scss'
import '../../static/icons/github.svg'
import '../../static/icons/message.svg'

export default class AboutPage extends React.Component {
    render() {
        return <>
            <CustomNavigationBar hasBack opacity={1} title='关于小程序'></CustomNavigationBar>

            <View className='passage'>
                <AtCard
                    title='想说的话'
                    thumb='../../static/icons/message.svg'
                    isFull
                    className='card'
                >
                    <View className='content paragraph'>
                        两年前，我初次走入代码的世界，从 Error 到 Warning 再到 编译成功，从Hello World到初具雏形的小程序，开发湖工life为我带来了很多的欢乐。
                    </View>
                    <View className='content paragraph'>
                        时光荏苒，大学四年仅剩下最后的3个月，我难以保证在毕业后仍能像在校期间一样更新维护小程序。所以我将代码整理后发布到 Github。
                    </View>
                </AtCard>
                <AtCard
                    title='Github项目地址'
                    thumb='../../static/icons/github.svg'
                    isFull
                    className='card'
                >
                    <View className='paragraph'>
                        服务器端(Golang Beego)： 
                        <View 
                            className='link under-line'
                            onClick={()=>Taro.setClipboardData({data: 'https://github.com/zhongbr/hbut-life-server'})}
                        >https://github.com/zhongbr/hbut-life-server</View>
                    </View>
                    <View className='paragraph'>
                        小程序端(Taro TaroUI)： 
                        <View 
                            className='link under-line'
                            onClick={()=>Taro.setClipboardData({data: 'https://github.com/zhongbr/hbut-life-mp'})}
                        >https://github.com/zhongbr/hbut-life-mp</View>
                    </View>

                </AtCard>
            </View>
        </>
    }
}