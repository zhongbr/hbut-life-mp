import React from 'react'
import { AtCard, AtSearchBar, AtList, AtListItem, AtFloatLayout, AtPagination  } from 'taro-ui'
import Taro from '@tarojs/taro'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import { Schedule, ScheduleData } from '../../components/schedule/schedule'
import { View, Picker } from '@tarojs/components'
import * as utils from '../../utils/index'
import './schedule.scss'

interface Result {
    name: string;
    info: string;
    url: string;
}

interface ClassroomScheduleState {
    showWord: string;
    schedule?: ScheduleData;
    searchWord?: string;
    searchType?: 'Teacher' | 'Place' | 'Course' | 'Classes';
    page?: number;
    searchResults?: Result[];
    total?: number;
}

interface LoadOptions {
    mode: 'room' | 'teacher';
    area?: string;
    building?: string;
    room?: string;
    teacher?: string;
}

export default class ClassroomSchedule extends React.Component<any, ClassroomScheduleState> {
    private searchTypes: string[] = ['Teacher', 'Place', 'Course', 'Classes'];
    private searchTypesTips: string[] = ['教师姓名', '教室名称', '课程名称', '班级名称'];
    private pagesize = 13;

    constructor(props: any) {
        super(props);
        this.state = {
            showWord: '',
            searchWord: '',
            searchType: 'Teacher',
            page: 1
        };
    }

    async onLoad(options: LoadOptions) {
        if (options.mode === 'room') await this.getClassroomSchedule(options.area, options.building, options.room);
        else if (options.mode === 'teacher') await this.getTeacherSchedule(options.teacher);
        else {

        }
    }

    async search(page: number) {
        Taro.showLoading({ title: '搜索中' });
        let resp = await utils.net.request({
            data: {
                group: 'study',
                action: 'search-schedule',
                data: {
                    accounts: ['005'],
                    page: page,
                    keyword: this.state.searchWord,
                    searchType: this.state.searchType
                }
            }
        });
        Taro.hideLoading();
        this.setState({ searchResults: resp.data.results, schedule: undefined , total: resp.data.total, page})
    }

    async getClassroomSchedule(area: string, building: string, room: string) {
        Taro.showLoading({ title: '查询中' });
        let resp = await utils.net.request({
            data: {
                group: 'study',
                action: 'classroom_schedule',
                data: {
                    accounts: ['005'],
                    area: area,
                    build: building,
                    classroom: room
                }
            }
        });
        Taro.hideLoading();
        this.setState({ showWord: `${room}教室的`, schedule: resp.data.courses })
    }

    async getTeacherSchedule(teacher: string) {
        Taro.showLoading({ title: '查询中' });
        let resp = await utils.net.request({
            data: {
                group: 'study',
                action: 'get-teacher-schedule',
                data: {
                    accounts: ['005'],
                    keyword: teacher
                }
            }
        });
        Taro.hideLoading();
        let schedule = resp.data.schedule;
        this.setState({ schedule, showWord: `${teacher}老师的` });
    }

    async getSchedule(result: Result) {
        Taro.showLoading({ title: '查询中' });
        let resp = await utils.net.request({
            data: {
                group: 'study',
                action: 'get-schedule',
                data: {
                    accounts: ['005'],
                    href: result.url
                }
            }
        });
        Taro.hideLoading();
        this.setState({ showWord: `${result.name}的`, schedule: resp.data.schedule });
    }

    render() {
        return <>
            <CustomNavigationBar hasBack opacity={1} />

            <View className='card'>
                <AtSearchBar
                    value={this.state.searchWord}
                    onChange={(value) => this.setState({ searchWord: value })}
                    onActionClick={this.search.bind(this,1)}
                />
                <Picker
                    mode='selector'
                    range={this.searchTypesTips}
                    onChange={(e) => this.setState({ searchType: this.searchTypes[e.detail.value] })}
                >
                    <View className='search-type'>
                        搜索类型:{this.searchTypesTips[this.searchTypes.indexOf(this.state.searchType)]}[点击切换]
                    </View>
                </Picker>
            </View>

            {(this.state.searchResults?.length !== 0) && <AtCard
                isFull
                className='card'
                title='搜索结果'
            >
                {this.state.searchResults && <AtList hasBorder={false}>
                    {this.state.searchResults?.map((result, index) => <AtListItem
                        hasBorder={false}
                        title={`${index + (this.state.page - 1) * this.pagesize + 1}.${result.name}`}
                        note={result.info}
                        arrow='right'
                        onClick={async () => {
                            if (this.state.searchType === 'Teacher') await this.getTeacherSchedule(result.name);
                            else await this.getSchedule(result);
                        }}
                    />)}
                    {this.state.searchType !== 'Classes' && <AtPagination 
                        current={this.state.page} 
                        total={this.state.total} 
                        pageSize={this.pagesize}
                        onPageChange={(e)=>this.search(e.current)}
                    />}
                </AtList>}
                {!this.state.searchResults && <Blank tips='没有搜索到哦，换个词试试？' />}
            </AtCard>}

            <AtFloatLayout
                isOpened={Boolean(this.state.schedule)}
                title={`${this.state.showWord}课表`}
                onClose={() => this.setState({ schedule: undefined })}
            >
                {this.state.schedule && <>
                    <View style={{
                        height: '1300rpx'
                    }}>
                        <Schedule
                            schedule={this.state.schedule}
                            lessons={['第1-2节', '第3-4节', '第5-6节', '第7-8节', '第9-10节',]}
                            days={['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',]}
                            colors={utils.constants.ScheduleColors}
                        />
                    </View>
                    {this.state.searchType == 'Teacher' && <View style={{ marginTop: '10px' }}>本页面课表数据不是实时更新，仅供参考！</View>}
                </>}
                {!this.state.schedule && <Blank tips='没找到课表哦！' />}
            </AtFloatLayout>

        </>
    }
}