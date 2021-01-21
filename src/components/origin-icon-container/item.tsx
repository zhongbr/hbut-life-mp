import React from 'react';
import {View} from '@tarojs/components';
import './item.scss';

export interface OriginItemProps {
    name: string;
    backgrondColor: string;
}

export class OriginItem extends React.Component<OriginItemProps> {
    render() {
        return (
            <View className='origin-icon-item  animation-scale-up' style={{
                gridArea: this.props.name,
                backgroundColor: this.props.backgrondColor,
            }}>
                {this.props.children}
            </View>
        );
    }
}