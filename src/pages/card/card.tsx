import React from 'react'
import Taro from '@tarojs/taro'
import { request } from '../../utils/net/request'
import { View, Text, Picker } from '@tarojs/components'
import { AtCard, AtList, AtListItem, AtButton, AtFloatLayout } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import * as userinfor from '../../utils/userinfo'
import { DateFormat } from '../../utils/date'
import '../../static/icons/card.svg'
import './card.scss'

interface CostRecord {
    time: string;
    description: string;
    amount: string;
    balance: string;
    operator: string;
    workstation: string;
    terminal: string;
}

interface CampusCardState {
    balance: number;
    userinfo?: userinfor.UserInfoInterface;
    startDate?: Date;
    endDate?: Date;
    records?: CostRecord[];
    recordPages?: number;
    currentPage?: number;
    detail?: CostRecord;
}

export default class CampusCardPgae extends React.Component<any, CampusCardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            balance: 0,
            startDate: new Date(new Date().valueOf() - 86400 * 7 * 1000),
            endDate: new Date(),
            recordPages: 0,
            currentPage: 0,
            records: []
        }
    }

    async componentDidShow() {
        await this.GetCampusCardBalance();
        await this.LoadUserInfo();
    }

    async onReachBottom() {
        if (this.state.currentPage === this.state.recordPages) Taro.showToast({ title: '到底了' });
        else this.GetBills(this.state.records, this.state.currentPage);
    }

    private async GetCampusCardBalance() {
        Taro.showLoading({ title: '加载中' });
        let resp = await request({
            data: {
                group: 'campus-card',
                action: 'get-balance',
                data: {
                    accounts: ['004']
                }
            }
        });
        Taro.hideLoading();
        let balance = resp.data.balance as number;
        this.setState({ balance })
    }

    private async LoadUserInfo() {
        let userinfo = await userinfor.GetUserInfo();
        this.setState({ userinfo });
    }

    private async GetBills(currentRecords: CostRecord[], currentPage: number) {
        Taro.showLoading({ title: '加载中' });
        let resp = await request({
            data: {
                group: 'campus-card',
                action: 'get-bill',
                data: {
                    start_date: DateFormat(this.state.startDate, 'yyyy-MM-dd'),
                    end_date: DateFormat(this.state.endDate, 'yyyy-MM-dd'),
                    page: `${currentPage}`,
                    accounts: ['004']
                }
            }
        })
        Taro.hideLoading();
        let records = resp.data.bill;
        let page = resp.data.page;
        this.setState({ recordPages: page, records: currentRecords.concat(records), currentPage: currentPage + 1 })
    }

    render() {
        return <>
            <CustomNavigationBar title='校园卡' opacity={1} hasBack />
            {/* 一卡通余额 */}
            <View>
                <AtCard
                    title={'校园一卡通'}
                    thumb={'../../static/icons/card.svg'}
                    isFull
                    className='card'
                >
                    <View className={'card-box'}>
                        <AtList hasBorder={false}>
                            <AtListItem hasBorder={false} title='卡号' extraText={this.state.userinfo?.student_id ? this.state.userinfo?.student_id : 'unknown'} />
                            <AtListItem hasBorder={false} title='姓名' extraText={this.state.userinfo?.name ? this.state.userinfo?.name : 'unknown'} />
                            <AtListItem hasBorder={false} title='班级' extraText={this.state.userinfo?.class ? this.state.userinfo?.class : 'unknown'} />
                            <AtListItem hasBorder={false} title='余额' extraText={`${this.state.balance}元`} />
                        </AtList>
                    </View>
                </AtCard>
            </View>
            {/* 消费记录 */}
            <View>
                <AtCard
                    title={'消费记录查询'}
                    thumb={'../../static/icons/card.svg'}
                    isFull
                    className='card'
                >
                    <AtList hasBorder={false}>
                        <Picker
                            mode='date'
                            fields='day'
                            start={'2017-09-01'}
                            end={DateFormat(new Date(), 'yyyy-MM-dd')}
                            value={DateFormat(this.state.startDate, 'yyyy-MM-dd')}
                            onChange={(e) => this.setState({ startDate: new Date(e.detail.value) })}
                        >
                            <AtListItem
                                title='开始日期'
                                extraText={this.state.startDate ? DateFormat(this.state.startDate, 'yyyy-MM-dd') : ''}
                                hasBorder={false}
                            />
                        </Picker>
                        <Picker
                            mode='date'
                            fields='day'
                            start={DateFormat(this.state.startDate, 'yyyy-MM-dd')}
                            end={DateFormat(new Date(), 'yyyy-MM-dd')}
                            value={DateFormat(this.state.endDate, 'yyyy-MM-dd')}
                            onChange={(e) => this.setState({ startDate: new Date(e.detail.value) })}
                        >
                            <AtListItem
                                title='结束日期'
                                extraText={this.state.endDate ? DateFormat(this.state.endDate, 'yyyy-MM-dd') : ''}
                                hasBorder={false}
                            />
                        </Picker>
                        <AtButton
                            type='primary'
                            circle
                            onClick={this.GetBills.bind(this, [], 0)}
                        >点击查询</AtButton>
                    </AtList>
                    {/* 消费记录 */}
                    {this.state.records && <AtList>
                        {this.state.records.map((record, index) => <AtListItem
                            title={`${index + 1}.${record.description}`}
                            note={`${record.time}`}
                            extraText={`${record.amount}元`}
                            arrow='right'
                            onClick={() => this.setState({ detail: record })}
                        />)}
                    </AtList>}
                </AtCard>
            </View>
            {/* 记录详情 */}
            {this.state.detail && <AtFloatLayout
                title={'记录详情'}
                isOpened={Boolean(this.state.detail)}
                onClose={() => this.setState({ detail: undefined })}
            >
                <AtList hasBorder={false}>
                    <AtListItem
                        title={'描述'}
                        note={this.state.detail.description}
                    />
                    <AtListItem
                        title={'时间'}
                        note={this.state.detail.time}
                    />
                    <AtListItem
                        title={'金额'}
                        note={this.state.detail.amount}
                    />
                    <AtListItem
                        title={'余额'}
                        note={this.state.detail.balance}
                    />
                    <AtListItem
                        title={'工作站'}
                        note={this.state.detail.workstation}
                    />
                    <AtListItem
                        title={'终端'}
                        note={this.state.detail.terminal}
                    />
                    <AtListItem
                        title={'操作者'}
                        note={this.state.detail.operator}
                    />
                </AtList>
            </AtFloatLayout>
            }
        </>;
    }
}