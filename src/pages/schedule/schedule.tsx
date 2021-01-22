import React from 'react'
import { View } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'

export default class SchedulePage extends React.Component {
    render(){
        return (<>
            <CustomNavigationBar title='课程表' opacity={1} />
            <View>Schedule Page</View>
        </>)
    }
}