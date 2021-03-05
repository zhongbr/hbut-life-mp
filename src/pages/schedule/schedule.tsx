import React from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { AtButton, AtFloatLayout, AtList, AtListItem, AtCard } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { request } from '../../utils/net/request'
import { GetTodayWeekday, CampusDateInfo, WeekdayToDate } from '../../utils/date'
import { Sha1Hash } from '../../utils/net/sha1'
import { CheckPasswordSync } from '../../utils/net/password'
import { SystemInfo, MenuButtonBoundingClientReact, ScheduleColors } from '../../utils/constants'
import { Blank } from '../../components/blank/blank'
import './schedule.scss'
import '../../static/icons/calendar.svg'

interface Schedule {
    weeks: number[],
    classroom: string;
    day: number;
    section: number[];
}

interface Course {
    code: string;
    name: string;
    schedules: Schedule[];
    teachers: string[];
}

interface Event {
    name: string;
    location: string;
    time: Date;
    members: string[];
    hash: string;
    color: string;
}

interface CoursePreviousInfo {
    Classes: string;
    CurName: string;
    Day: number;
    DayStr: string;
    DayTime: number;
    DayTimeStr: string;
    Place: string;
    TaskTimeType: number;
    Teacher: string;
    Week: string;
}

interface SchedulePageState {
    events: { [key: string]: Event };
    gridTemplate: string;
    week: number;
    showDetail: boolean;
    detail?: Event;
    hasLogin?: boolean;
}

export default class SchedulePage extends React.Component<any, SchedulePageState> {

    private today: CampusDateInfo = {
        week: 3,
        day: 1,
        hour: 12,
        minute: 30,
        second: 0,
        dayString: '星期二'
    }
    private courses: Course[] = [];
    private previous: CoursePreviousInfo[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            events: {},
            week: this.today.week,
            gridTemplate: '. . . . . . .\n'.repeat(10),
            showDetail: false,
            hasLogin: false
        }
    }

    async onLoad() {
        let courses: Course[] = [];
        let previous: CoursePreviousInfo[] = [];
        try {
            // 先尝试从本地缓存里读取课表
            courses = (await Taro.getStorage({ key: 'courses_schedule' })).data;
            previous = (await Taro.getStorage({ key: 'previous_schedule' })).data;
        } catch (e) {
            let res = await this.RefreshScheduleFromServer();
            courses = res.courses;
            previous = res.previous;
        }
        this.courses = courses;
        this.previous = previous;
        this.GenerateScheduleTable(this.today.week);
    }

    async componentDidShow() {
        let hasLogin = CheckPasswordSync('005');
        this.setState({ hasLogin });
    }

    private async ClickRefreshSchedule() {
        let res = await Taro.showModal({
            title: '更新课表确认',
            content: '确认更新课表和教务处同步吗？',
            confirmText: '确认',
            cancelText: '取消'
        });
        if (res.confirm) {
            Taro.showLoading({ title: '更新中' });
            try {
                await this.RefreshScheduleFromServer();
                Taro.hideLoading();
                Taro.showToast({ title: '更新成功' });
                this.GenerateScheduleTable(this.state.week, this.courses);
            } catch (e) {
                Taro.hideLoading();
                Taro.showToast({ title: '更新失败', icon: 'none' });
            }
        }
        else {
            Taro.showToast({ title: '取消更新课表', icon: 'none' })
        }
    }

    private async RefreshScheduleFromServer() {
        let resp = await request({
            data: {
                group: 'base',
                action: 'courseTable',
                data: {
                    accounts: ['005']
                }
            }
        });
        let courses = resp.data.courses as Course[];
        let previous = resp.data.previous_data as CoursePreviousInfo[];
        // 缓存到本地
        await Taro.setStorage({ key: 'courses_schedule', data: courses });
        await Taro.setStorage({ key: 'previous_schedule', data: previous });
        return { courses, previous };
    }

    // 生成指定周的课表
    private GenerateScheduleTable(week: number, courses: Course[] = this.courses, previous = this.previous) {
        week = week > 0 ? week : 1;
        let template: string[][] = [];
        for (let i = 0; i < 11; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) row.push('blank');
            template.push(row);
        }
        let events: { [key: string]: Event } = {};
        // 遍历课程列表，将本周有安排的课程加入grid模板
        let colors: { [key: string]: string } = {};
        courses.forEach(course => {
            course.schedules.forEach(schedule => {
                if (schedule.weeks.indexOf(week) !== -1) {
                    schedule.section?.forEach(section => {
                        let hash = `cell_${Sha1Hash(`${course.name}${schedule.classroom}${week}${schedule.day}${course.teachers}`).slice(0, 5)}`;
                        if (!colors[course.name]) colors[course.name] = ScheduleColors[Object.keys(events).length % ScheduleColors.length];
                        template[section][schedule.day] = hash;
                        events[hash] = {
                            name: course.name,
                            location: schedule.classroom,
                            time: WeekdayToDate(week, schedule.day),
                            members: course.teachers,
                            hash: hash,
                            color: colors[course.name]
                        }
                    });
                }
            })
        });
        // 设置表头
        template[0][0] = '.';
        for (let i = 1; i < 11; i++) template[i][0] = `section_${i}`;
        for (let i = 1; i < 8; i++) template[0][i] = `day_${i}`;
        // 为空格子编号
        let count = 0;
        for (let i = 1; i < 11; i++)
            for (let j = 1; j < 8; j++)
                if (template[i][j] === 'blank') template[i][j] += `${count++}`;
        // 转换成字符串
        let grid = '';
        template.forEach(row => {
            let row_ = ''
            row.forEach(cell => row_ += `${cell} `);
            grid += `'${row_.slice(0, row_.length - 1)}'`;
        })
        this.setState({ gridTemplate: grid, events: events, week: week })
    }

    render() {
        return (<>
            <CustomNavigationBar title='课程表' opacity={1} />
            {/* 课表 */}
            {this.state.hasLogin &&
                <ScrollView
                    scrollY
                    className='schedule-scroll'
                    style={{
                        height: `${SystemInfo.windowHeight - MenuButtonBoundingClientReact.bottom + 25}px`
                    }}
                >
                    <View className='operations card'>
                        <View className='schedule-operations'>
                            <AtButton type='primary' onClick={this.GenerateScheduleTable.bind(this, this.state.week - 1, this.courses)} className='operator' size='small' circle>上周</AtButton>
                            <View className='week'><Text>{`第${this.state.week}周`}</Text></View>
                            <AtButton type='primary' onClick={this.GenerateScheduleTable.bind(this, this.state.week + 1, this.courses)} className='operator' size='small' circle>下周</AtButton>
                        </View>
                        <AtButton
                            circle
                            size='small'
                            className='refresh-schedule'
                            type='secondary'
                            onClick={this.ClickRefreshSchedule.bind(this)}
                        >获取最新课表</AtButton>
                    </View>
                    <View className='schedule-content' style={{
                        gridTemplateAreas: this.state.gridTemplate
                    }}>
                        {/* 星期表头 */}
                        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => (
                            <View className='schedule-header-day' style={{ gridArea: `day_${index + 1}` }}>{day}</View>
                        ))}
                        {/* 节次  */}
                        {[...new Array(10)].map((_, index) => (
                            <View className='schedule-header-section' style={{ gridArea: `section_${index + 1}` }}>{index + 1}</View>
                        ))}
                        {/* 事件 */}
                        {Object.keys(this.state.events).map(hash => (
                            <View
                                className='schedule-cell animation-scale-up'
                                style={{ gridArea: hash, backgroundColor: this.state.events[hash].color }}
                                onClick={() => this.setState({ showDetail: true, detail: this.state.events[hash] })}
                            >
                                <View className='schedule-event-name'>{this.state.events[hash].name}</View>
                                <View className='schedule-event-location'>{this.state.events[hash].location}</View>
                            </View>
                        ))}
                        {/* 空白格子  */}
                        {[...new Array(70 - Object.keys(this.state.events).length)].map((_, index) => (
                            <View className='schedule-cell animation-scale-up blank-cell' style={{
                                gridArea: `blank${index}`
                            }}></View>
                        ))}
                    </View>
                    {/* 整周的课程 */}
                    <AtCard
                        className='other-schedule-content'
                        title='其他课程'
                        thumb='../../static/icons/calendar.svg'
                        isFull
                    >
                        {this.previous.filter(course => course.TaskTimeType === 2).length !== 0 && <AtList
                            hasBorder={false}
                        >
                            {this.previous.filter(course => course.TaskTimeType === 2).map(course => <AtListItem
                                hasBorder={false}
                                title={course.CurName}
                                note={`${course.Week} ${course.DayStr} ${course.DayTimeStr}`}
                                onClick={() => this.setState({
                                    showDetail: true, detail: {
                                        name: course.CurName,
                                        location: `${course.Week} ${course.DayStr} ${course.DayTimeStr}`,
                                        members: [course.Teacher],
                                        time: new Date(),
                                        hash: '',
                                        color: course.Classes
                                    }
                                })}
                            />)}
                        </AtList>}
                    </AtCard>
                </ScrollView>
            }
            {/* 课程详情浮层 */}
            <AtFloatLayout
                isOpened={this.state.showDetail}
                scrollY
                title='课程详情'
                onClose={() => this.setState({ detail: undefined, showDetail: false })}
            >
                <AtList hasBorder={false}>
                    <AtListItem hasBorder={false} title='课程名称' note={this.state.detail?.name} />
                    {this.state.detail?.hash === '' && <AtListItem hasBorder={false} title='上课教室' note={this.state.detail?.location} />}
                    <AtListItem hasBorder={false} title='授课老师' note={this.state.detail?.members.join(',')} />
                    {this.state.detail?.hash === '' && <>
                        <AtListItem hasBorder={false} title='上课时间' note={this.state.detail?.location} />
                        <AtListItem hasBorder={false} title='上课班级' note={this.state.detail?.color} />
                    </>}
                </AtList>
            </AtFloatLayout>
            {/* 登录提示 */}
            {!this.state.hasLogin && <View className='no-login'>
                <Blank tips='登录学号后才能看课表哦！' buttonTips='登录' onClick={() => Taro.navigateTo({
                    url: '../login/login?code=005'
                })}></Blank>
            </View>}
        </>)
    }
}