import React from 'react'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'

export default class BorrowedBooksPage extends React.Component {

    render() {
        return <>
            <CustomNavigationBar opacity={1} title='图书借阅' hasBack />
        </>
    }
}