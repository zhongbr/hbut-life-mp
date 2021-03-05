import React from 'react'
import Taro, { navigateTo } from '@tarojs/taro'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { OperationCard } from '../../components/operation-card/operation-card'

interface ElectivePageState { }

export default class ElectivePage extends React.Component<any, ElectivePageState> {
    render() {
        return (<>
            <CustomNavigationBar opacity={1} title='选修课' hasBack />
            <OperationCard title='选修一览表' image='background-files' onClick={() => Taro.navigateTo({ url: './tables' })} />
            <OperationCard title='已修选修课' image='background-completed-tasks' onClick={() => Taro.navigateTo({ url: './histories' })} />
        </>);
    }
}
