import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker, Button } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtForm, AtFloatLayout } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Buildings } from '../../utils/constants'
import { request } from '../../utils/net/request'
import { DateFormat } from '../../utils/date'
import './study.scss'

interface StudyPageState {
    area: string;
    build: string;
    week: number;
    day: string;
    lesson: string;
    freeClassrooms: ClassroomInfo[];
    classroomSchedule?: Schedule;
    classroomBusyWeeks?: number[];
}

interface ClassroomInfo {
    room: string;
    update_time: number;
}

type Schedule = { [lesson: string]: { [day: string]: string[][] } }

const Tips = {
    area: { tips: '校区', range: (state: StudyPageState) => Object.keys(Buildings) },
    build: { tips: '楼栋', range: (state: StudyPageState) => Buildings[state.area] },
    week: { tips: '周数', range: (state: StudyPageState) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    day: { tips: '星期', range: (state: StudyPageState) => ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',] },
    lesson: { tips: '节次', range: (state: StudyPageState) => ['第1-2节', '第3-4节', '第5-6节', '第7-8节', '第9-10节'] }
}

export default class StudyPage extends React.Component<any, StudyPageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            area: Object.keys(Buildings)[0],
            build: Buildings[Object.keys(Buildings)[0]][0],
            week: 1,
            day: '星期一',
            lesson: '第1-2节',
            freeClassrooms: []
        }
    }

    async GetFreeClassroomsOfBuilding(form: any) {
        Taro.showLoading({ title: '查询中' });
        let resp = await request({
            data: {
                group: 'study',
                action: 'free_classrooms',
                data: {
                    accounts: ['001'],
                    area: form.area,
                    build: form.build,
                    week: form.week,
                    day: form.day,
                    lesson: form.lesson,
                }
            }
        })
        Taro.hideLoading();
        console.log(resp);
        this.setState({ freeClassrooms: resp.data.classrooms });
    }

    private async GetNewestClassroomSchedule(classroom: string) {
        Taro.showLoading({ title: '查询中' });
        let resp = await request({
            data: {
                group: 'study',
                action: 'classroom_schedule',
                data: {
                    accounts: ['005'],
                    area: this.state.area,
                    build: this.state.build,
                    classroom
                }
            }
        });
        Taro.hideLoading();
        this.setState({ classroomBusyWeeks: resp.data.busy_weeks, classroomSchedule: resp.data.courses })
    }

    render() {
        return <>
            <CustomNavigationBar title='自习室' opacity={1} hasBack />

            <View className='card'>
                <AtForm
                    // onSubmit={(event) => this.GetFreeClassroomsOfBuilding(event[0].detail.value)}
                    className='form'
                >
                    <AtList>
                        {Object.keys(Tips).map(param => <Picker
                            name={param}
                            mode='selector'
                            range={Tips[param].range(this.state)}
                            value={Tips[param].range(this.state).indexOf(this.state[param])}
                            onChange={event => {
                                let range = Tips[param].range(this.state);
                                let property = range[event.detail.value];
                                let setter = {};
                                setter[param] = property;
                                this.setState(setter);
                            }}
                        >
                            <AtListItem title={Tips[param].tips} extraText={this.state[param]} />
                        </Picker>)}
                    </AtList>

                    <AtButton
                        className='form-button'
                        circle
                        type='primary'
                        onClick={this.GetFreeClassroomsOfBuilding.bind(this, this.state)}
                    >查询</AtButton>

                </AtForm>
            </View>

            {/* 显示结果 */}
            {this.state.freeClassrooms && <View className='card'>
                <AtList hasBorder={false}>
                    {this.state.freeClassrooms && this.state.freeClassrooms.map((classroom, index) => <AtListItem
                        title={`${index + 1}.${classroom.room}`}
                        note={`更新时间:${DateFormat(new Date(classroom.update_time * 1000), 'yyyy-MM-dd hh:mm:ss')}`}
                        arrow='right'
                        extraText='更新'
                        onClick={this.GetNewestClassroomSchedule.bind(this, classroom.room)}
                    />)}
                </AtList>
            </View>}

            {/* 最新的课表 */}
            <AtFloatLayout
                title={'教室课表'}
                isOpened={Boolean(this.state.classroomSchedule)}
                onClose={() => this.setState({ classroomSchedule: undefined, classroomBusyWeeks: undefined })}
            >
                {this.state.classroomBusyWeeks && <View className='state-info'>
                    {(
                        (this.state.classroomBusyWeeks[this.state.lesson][this.state.day]==null?
                        []:this.state.classroomBusyWeeks[this.state.lesson][this.state.day])?.indexOf(this.state.week) != -1)
                         ? '教室占用' : '教室空闲'}
                </View>}
                <AtList>
                    {this.state.classroomSchedule && this.state.classroomSchedule[this.state.lesson][this.state.day]?.map(
                        (courses: string[], index: number) => <AtListItem
                            title={courses[0]}
                            note={`${courses[3]} ${courses[2]}`}
                            extraText={courses[1]}
                        />
                    )}
                </AtList>
            </AtFloatLayout>
        </>
    }
}