import React from 'react'
import Taro from '@tarojs/taro'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import { AtList, AtListItem, AtFloatLayout, AtDivider, AtButton, AtCard } from 'taro-ui'
import { View } from '@tarojs/components'
import { date, net } from '../../utils/index'
import '../../static/icons/book.svg'


interface BookRecord {
    code: string;
    name: string;
    borrow_date: string;
    return_date: string;
    location: string;
}

interface BorrowedBooksPageState {
    books?: BookRecord[];
}

export default class BorrowedBooksPage extends React.Component<any, BorrowedBooksPageState> {
    constructor(props: any){
        super(props);
        this.state = {}
    }

    async onLoad(){
        await this.GetBorrowedBooks();
    }

    private async GetBorrowedBooks(){
        Taro.showLoading({title: '加载中'});
        let resp = await net.request({
            data:{
                group: 'library',
                action: 'borrowBooks',
                data: {
                    accounts: ['002'],
                }
            }
        });
        Taro.hideLoading();
        let books = resp.data.books as BookRecord[];
        this.setState({books});
    }

    render() {
        return <>
            <CustomNavigationBar opacity={1} title='图书借阅' hasBack />
            <AtCard 
                className='card'
                title='借阅中的图书'
                thumb='../../static/icons/book.svg'
            >
                {(this.state.books?.length === 0 || !this.state.books) && <Blank tips='你没有等待归还的图书哦'/>}
                <AtList hasBorder={false}>
                    {this.state.books?.length !== 0 && this.state.books?.map((book, index) => <AtListItem
                        title={`${index+1}. ${book.name}`}
                        note={`条码:${book.code} 借阅日期:${book.borrow_date}`}
                        extraText={`${date.GetCountDownDays(new Date(book.return_date))}天`}
                    />)}
                </AtList>
            </AtCard>
        </>
    }
}