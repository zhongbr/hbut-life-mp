import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import { AtSearchBar, AtList, AtListItem, AtFloatLayout, AtDivider, AtButton } from 'taro-ui'
import { request } from '../../utils/net/request'
import * as utils from '../../utils/index'
import './table.scss'

interface SearchBookState {
    semester: string;
    keyword: string;
    results?: ElectiveCourse[];
    detail?: ElectiveCourse;
}

interface ElectiveCourse {
    subject_name: string;
    semester: string;
    host_teacher: string;
    others_info: string;
    subject_type: string;
    source: string;  
}


export default class SearchBooksPage extends React.Component<any, SearchBookState> {

    constructor(props: any) {
        super(props);
        this.state = {
            keyword: '',
            semester: utils.constants.CurrentSemester.name,
        }
    }

    async componentDidShow(){
        await this.GetElectiveCourses();
    }

    private async GetElectiveCourses() {
        console.log('search books');
        Taro.showLoading({
            title: '加载中'
        })
        let resp = await request({
            data: {
                group: 'study',
                action: 'get-elective-courses-semesters',
                data: {
                    accounts: ['005'],
                    semester: this.state.semester,
                }
            }
        });
        Taro.hideLoading();
        let results = resp.data.courses as ElectiveCourse[];
        this.setState({ results});
        console.log(resp);
    }

    render() {
        return <>
            <CustomNavigationBar opacity={1} title='选修课一览表' hasBack />
            {/* 搜索框 */}
            <View className='card'>
                <AtSearchBar
                    value={this.state.keyword}
                    placeholder='请输入选修课名称'
                    onChange={value => this.setState({ keyword: value })}
                />
            </View>
            {/* 搜索结果 */}
            <view className='card'>
                {(this.state.results?.length === 0 || !this.state.results) && <Blank tips={`没有${this.state.semester}的选修课信息哦！`} />}
                {this.state.results?.length !== 0 && <View>
                    <AtList
                        hasBorder={false}
                    >
                        {this.state.results?.filter(result => {
                            return result.subject_name.startsWith(this.state.keyword)
                        }).map((result, index) => <AtListItem
                            title={`${index + 1}.${result.subject_name}`}
                            note={`${result.subject_type} ${result.others_info}`}
                            arrow='right'
                            onClick={()=>this.setState({detail: result})}
                        />)}
                    </AtList>
                </View>}
            </view>
            {/* 课程详情 */}
            <AtFloatLayout
                title='课程详情'
                isOpened={Boolean(this.state.detail)}
                onClose={() => this.setState({ detail: undefined })}
            >
                {this.state.detail?.subject_name && <View>
                    <AtList>
                        <AtListItem
                            title='课程名称'
                            note={this.state.detail?.subject_name}
                        />
                        <AtListItem
                            title='课程类型'
                            note={this.state.detail?.subject_type}
                        />
                        <AtListItem
                            title='其他信息'
                            note={this.state.detail?.others_info}
                        />
                    </AtList>
                </View>}
            </AtFloatLayout>
        </>
    }
}