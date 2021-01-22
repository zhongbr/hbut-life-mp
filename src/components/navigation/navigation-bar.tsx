import React from 'react'
import {View, Image} from '@tarojs/components'
import taro from '@tarojs/taro'
import {AppName, MenuButtonBoundingClientReact, SystemInfo, MainColor, NavigationBarHeight} from '../../utils/constants'
import '../../static/icons/back.svg'
import '../../static/icons/logo.svg'
import './navigation-bar.scss'

interface NavgationBarProps {
    title?: string;
    hasBack?: boolean;
    opacity?: number;
}

export class CustomNavigationBar extends React.Component<NavgationBarProps> {
    render(){
        let style: React.CSSProperties = {
            height: `${MenuButtonBoundingClientReact.height+5}px`,
            width: `${MenuButtonBoundingClientReact.height}px`,
        }
        return (
            <>
            <View className='bar' style={{
                backgroundColor: `rgba(${MainColor},${this.props.opacity?this.props.opacity:0})`,
            }}>
                <View className='navigation-bar-box' style={{
                    paddingTop: `${MenuButtonBoundingClientReact.top}px`,
                    paddingRight: `${SystemInfo.screenWidth-MenuButtonBoundingClientReact.left}px`
                }}>
                    <View style={style} className='navigation-bar-back'>
                        {this.props.hasBack&&<Image 
                            onClick={()=>taro.navigateBack()}
                            src='../../static/icons/back.svg' 
                            mode='aspectFit'/>}
                    </View>
                    <View style={{...style, lineHeight: style.height}} className='navigation-bar-title'>
                        {this.props.title?this.props.title:AppName}
                    </View>
                </View>
            </View>
            <View style={{
                height: `${MenuButtonBoundingClientReact.bottom+5}px`
            }}/>
            </>
        )
    }
}
