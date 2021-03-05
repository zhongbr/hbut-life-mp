import React from 'react'
import Taro, { navigateTo } from '@tarojs/taro'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { OperationCard } from '../../components/operation-card/operation-card'

interface LibraryPageState { }

export default class LibraryPage extends React.Component<any, LibraryPageState> {
    render() {
        return (<>
            <CustomNavigationBar opacity={1} title='图书馆' hasBack />
            <OperationCard title='馆藏图书' image='background-files' onClick={() => Taro.navigateTo({ url: './search-books' })} />
            <OperationCard title='图书借阅' image='background-completed-tasks' onClick={() => Taro.navigateTo({ url: './borrowed-books' })} />
        </>);
    }
}
