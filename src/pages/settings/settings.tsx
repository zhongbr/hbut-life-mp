import React from 'react'
import { View } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'

export default class SettingsPage extends React.Component {
    render(){
        return (<>
            <CustomNavigationBar title='我的' opacity={1} />
            <View>Settings Page</View>
        </>)
    }
}