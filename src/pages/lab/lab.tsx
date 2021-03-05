import React from 'react'
import Taro from '@tarojs/taro'
import { AtCard, AtList, AtListItem, AtFloatLayout } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import * as utils from '../../utils/index'
import '../../static/icons/lab.svg'

interface Test {
    name: string;
    location: string;
    timeAndTeacher: string;
    preview: string;
    process: string;
    report: string;
    status: string;
    lab_id: string;
}

interface LabPageState {
    tests?: Test[];
    detail?: Test;
}

export default class LabPage extends React.Component<any, LabPageState> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }

    async componentDidShow(){
        await this.getTests();
    }

    private async getTests(){
        Taro.showLoading({title: '加载中'});
        let resp = await utils.net.request({
            data: {
                group: 'study',
                action: 'get-physic-labs',
                data: {
                    accounts: ['003']
                }
            }
        });
        Taro.hideLoading();
        let tests = resp.data.labs;
        this.setState({tests});
    }

    render() {
        return <>
            <CustomNavigationBar hasBack title='物理实验' opacity={1} />
            <AtCard
                title='物理实验'
                thumb='../../static/icons/lab.svg'
                isFull
                className='card'
            >
                {(!this.state.tests || this.state.tests?.length === 0) && <Blank tips='暂时没有物理实验安排哦' />}
                {this.state.tests?.length !== 0 && <AtList hasBorder={false}>
                    {this.state.tests?.map((test, index) => <AtListItem
                        title={`${index + 1}.${test.name}`}
                        note={`${test.timeAndTeacher}`}
                        extraText={test.location}
                        arrow='right'
                        onClick={() => this.setState({ detail: test })}
                    />)}
                </AtList>}
            </AtCard>
            <AtFloatLayout
                isOpened={Boolean(this.state.detail)}
                title='实验详情'
                onClose={() => this.setState({ detail: undefined })}
            >
                <AtList hasBorder={false}>
                    <AtListItem title='实验名称' note={this.state.detail?.name} />
                    <AtListItem title='实验地点' note={this.state.detail?.location} />
                    <AtListItem title='时间老师' note={this.state.detail?.timeAndTeacher} />
                    <AtListItem title='预习分数' extraText={this.state.detail?.preview} />
                    <AtListItem title='实验分数' extraText={this.state.detail?.process} />
                    <AtListItem title='报告分数' extraText={this.state.detail?.report} />
                    <AtListItem title='完成状态' extraText={this.state.detail?.status} />
                </AtList>
            </AtFloatLayout>
        </>
    }
}