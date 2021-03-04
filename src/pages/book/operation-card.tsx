import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import { MainColor } from '../../utils/constants';

import './operation-card.scss'

interface OperationCardProp {
    title: string;
    image: string;
    onClick: () => void;
}

export class OperationCard extends React.Component<OperationCardProp> {
    render() {
        return <View className='operation-card animation-scale-up' style={{
            backgroundColor: `rgb(${MainColor})`
        }}
            onClick={this.props.onClick}
        >
            <View className={`operation-title ${this.props.image}`}>
                <Text>{this.props.title}</Text>
            </View>
        </View>
    }
}
