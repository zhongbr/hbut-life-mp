import React from 'react'
import {View, Image} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './blank.scss'
import '../../static/svgs/blank.svg'


interface BlankProps {
    tips: string;
    onClick?: ()=>void;
    buttonTips?: string;
}

export class Blank extends React.Component<BlankProps> {
    render(){
        return (
            <View className='blank'>
                <Image src={'../../static/svgs/blank.svg'} mode='aspectFit'></Image>
                <View className='tips'>{this.props.tips}</View>
                {Boolean(this.props.buttonTips)&&<AtButton 
                    type='primary' 
                    className='login-button'
                    circle 
                    size='normal'
                    onClick={this.props.onClick}
                >{this.props.buttonTips}</AtButton>}
            </View>
        )
    }
}