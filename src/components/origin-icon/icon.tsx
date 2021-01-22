import React from 'react';
import {View, Text, Image} from '@tarojs/components';
import './icon.scss';

interface OriginIconProps {
    tag: string;
    square: boolean;
    direction: 'vert'|'lvl';
    icon: string;
    onClick: ()=>void;
}

export class OriginIcon extends React.Component<OriginIconProps>{
    render(){
        let vert = this.props.direction === 'vert';
        let iconsize = {
            width: (vert ? '100%': (this.props.square?'100%':'60%')),
            height: (vert ? (this.props.square?'100%':'60%'): '100%')
        };
        let tagsize = {
            width: (vert ? '100%': (this.props.square?'100%':'40%')),
            height: (vert ? (this.props.square?'100%':'40%'): '100%')
        }
        return (
            <View className='origin-icon-box' style={{
                    flexDirection: (vert ? 'column': 'row')
                }}
                onClick={this.props.onClick}
            >
                <View className={`origin-icon-icon`} style={{...iconsize}}>
                    <Image mode='aspectFit' src={this.props.icon} style={{
                        width:'80%', 
                        height: '80%',
                    }}/>
                </View>
                {!this.props.square && (<View className={`origin-icon-tag`} style={{...tagsize}}>
                    <Text>{this.props.tag}</Text>
                </View>)}
            </View>
        )
    }
}