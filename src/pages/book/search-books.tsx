import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import { AtSearchBar, AtList, AtListItem, AtFloatLayout, AtDivider, AtButton } from 'taro-ui'
import { request } from '../../utils/net/request'
import { MainColor } from '../../utils/constants'
import './search-books.scss'

interface SearchBookState {
    keyword: string;
    results?: BookResult[];
    detail?: BookDetail;
}

interface BookResult {
    all: number;
    author: string;
    borrowAble: number;
    href: string;
    name: string;
    publishingCompany: string;
}

interface KeyValue {
    key: string;
    value: string;
}

interface BookState {
    annualVolume: string;
    barCodeNumber: string;
    bookStatus: string;
    callNumber: string;
    returnLocation: string;
}

interface BookDetail {
    base: KeyValue[];
    books: BookState[];
}

export default class SearchBooksPage extends React.Component<any, SearchBookState> {
    private currentPage: number = 0;

    constructor(props: any) {
        super(props);
        this.state = {
            keyword: '',
        }
    }

    async onReachBottom() {
        this.SearchBooks(this.currentPage + 1);
    }

    private async ScanQRCode() {
        let res = await Taro.scanCode({});
        this.setState({ keyword: res.result });
        this.SearchBooks(0);
    }

    private async SearchBooks(page: number) {
        console.log('search books');
        Taro.showLoading({
            title: '搜索中'
        })
        let resp = await request({
            data: {
                group: 'library',
                action: 'find-book',
                data: {
                    accounts: ['002'],
                    keyword: this.state.keyword,
                    page
                }
            }
        });
        Taro.hideLoading();
        let results = resp.data.books as BookResult[];
        this.setState({ results: ((this.state.results && page !== 0) ? this.state.results : []).concat(results) });
        this.currentPage = page;
        console.log(resp);
    }

    private async GetBookDetail(href: string) {
        Taro.showLoading({ title: '获取中' });
        let resp = await request({
            data: {
                group: 'library',
                action: 'book-home-page',
                data: {
                    accounts: ['002'],
                    href
                }
            }
        })
        let detail = resp.data.homepage as BookDetail;
        this.setState({ detail });
        Taro.hideLoading();
        console.log(resp);
    }

    render() {
        return <>
            <CustomNavigationBar opacity={1} title='馆藏图书' hasBack />
            {/* 搜索框 */}
            <View className='card'>
                <AtSearchBar
                    value={this.state.keyword}
                    placeholder='请输入图书题名或者ISBN条码号'
                    onChange={value => this.setState({ keyword: value })}
                    onActionClick={this.SearchBooks.bind(this, 0)}
                    actionName='搜索馆藏'
                />
            </View>
            <AtButton
                circle
                className='card qr-scan-button'
                type='secondary'
                size='small'
                onClick={this.ScanQRCode.bind(this)}
            >扫图书条码</AtButton>
            {/* 搜索结果 */}
            {(this.state.results?.length === 0 || !this.state.results) && <Blank tips='没有搜索到哦！' />}
            {this.state.results?.length !== 0 && <View className='card'>
                <AtList
                    hasBorder={false}
                >
                    {this.state.results?.map((result, index) => <AtListItem
                        title={`${index + 1}.${result.name}`}
                        note={`${result.author} ${result.publishingCompany}`}
                        extraText={`${result.borrowAble}/${result.all}本`}
                        arrow='right'
                        onClick={this.GetBookDetail.bind(this, result.href)}
                    />)}
                </AtList>
            </View>}
            {/* 图书详情 */}
            <AtFloatLayout
                isOpened={Boolean(this.state.detail)}
                onClose={() => this.setState({ detail: undefined })}
            >
                <AtDivider content='基本信息' fontColor={`rgb(${MainColor})`} />
                <AtList hasBorder={false}>
                    {this.state.detail?.base.map(info => <AtListItem
                        title={info.key}
                        note={info.value}
                        hasBorder={false}
                    />)}
                </AtList>
                <AtDivider content='馆藏图书' fontColor={`rgb(${MainColor})`} />
                {!this.state.detail?.books && <Blank tips='图书馆暂时没有馆藏这本书哦！' />}
                {this.state.detail?.books.map((book, index) => <View>
                    <AtDivider content={`图书${index + 1}`} fontColor='grey' fontSize={20} />
                    <AtList>
                        <AtListItem
                            title='图书条码'
                            note={book.barCodeNumber}
                        />
                        <AtListItem
                            title='图书书号'
                            note={book.callNumber}
                        />
                        <AtListItem
                            title='图书状态'
                            note={book.bookStatus}
                        />
                        <AtListItem
                            title='还书地点'
                            note={book.returnLocation}
                        />
                    </AtList>
                </View>)}
            </AtFloatLayout>
        </>
    }
}