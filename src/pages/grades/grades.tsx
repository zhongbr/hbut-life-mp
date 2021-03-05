import React from 'react'
import taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtListItem, AtList, AtFloatLayout, AtIcon, AtNoticebar } from 'taro-ui'
import { request } from '../../utils/net/request'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { CurrentSemester, Semesters, MainColor } from '../../utils/constants'
import { GpaHBUT, Subject as SubjectGpaCalculate } from '../../utils/gpa'
import { Blank } from '../../components/blank/blank'
import './grades.scss'
import { CheckPasswordWithoutReplaceSync } from '../../utils/net/password'

interface ExtraData {
    key: string;
    value: string;
}

interface Subject extends SubjectGpaCalculate {
    name: string;
    course_code: string;
    extra_data: ExtraData[];
}

interface GradePageStates {
    semester: string;
    subjects: Subject[];
    totalGpa: number;
    credits: number;
    gpa: number;
    yearGpa: number;
    yearCredits: number;
    detail?: Subject;
    aaoLogined: Boolean;
}

export default class GradePage extends React.Component<any, GradePageStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            semester: '选择学期',
            subjects: [],
            totalGpa: 0,
            credits: 0,
            gpa: 0,
            yearGpa: 0,
            yearCredits: 0,
            aaoLogined: CheckPasswordWithoutReplaceSync('005')
        }
    }

    async onLoad() {
        let res = await this.GetGradeFromServer(CurrentSemester.code); // 获取当前学期的成绩单
    }

    async componentDidShow() {

    }

    async GetGradeFromServer(semester: string) {
        // 如果学期格式不是纯数字
        if (!/^\d+$/.test(semester)) {
            let year = semester.slice(0, 4);
            let half = { '一': '1', '二': '2' }[semester[12]];
            semester = year + half;
        }
        taro.showLoading({ title: '查询中' });
        let resp = await request({
            data: {
                group: 'base',
                action: 'score',
                data: {
                    accounts: ['005'],
                    semester: semester
                }
            }
        });
        taro.hideLoading();
        let subjects = resp.data.courses as Subject[];
        let totalGpa = resp.data.totalGpa as number;
        // 转换学期格式
        let semesterString = `${semester.slice(0, 4)}-${parseInt(semester.slice(0, 4)) + 1}学年第${{ '1': '一', '2': '二' }[semester[4]]}学期`
        // 计算学年绩点
        try {
            let otherSemesterGrades = await taro.getStorage({ key: `grades_${semester.slice(0, 4)}${semester[4] === '1' ? '2' : '1'}` });
            let [yearCredits, yearGpa] = GpaHBUT((otherSemesterGrades.data as Subject[]).concat(subjects));
            this.setState({ yearGpa, yearCredits })
        } catch (e) { }
        this.setState({ subjects, totalGpa, semester: semesterString });
        // 缓存查询过的成绩
        await taro.setStorage({ key: `grades_${semester}`, data: subjects });
        // 计算绩点信息
        this.CalculateGpaInfo(subjects);
        return { subjects };
    }

    private CalculateGpaInfo(subjects: Subject[]) {
        let [credits, gpa] = GpaHBUT(subjects);
        this.setState({ credits, gpa })
    }

    render() {
        return (
            <>
                <CustomNavigationBar title='成绩查询' opacity={1} hasBack></CustomNavigationBar>

                {/* 登录教务处账号的提示框 */}
                {!this.state.aaoLogined && <AtNoticebar 
                    icon={'tag'} 
                    moreText={'点击登录'} 
                    showMore 
                    single
                    onGotoMore={()=>taro.navigateTo({url:'../login/login?code=005'})}
                >登录教务处账号</AtNoticebar>}

                <Picker mode='selector' range={Semesters} value={0} onChange={event => this.GetGradeFromServer(Semesters[event.detail.value])}>
                    <View className='semester-selector'>
                        <AtIcon value='clock' size={12.5}></AtIcon>
                        <Text>{this.state.semester}</Text>
                    </View>
                </Picker>

                <View className='gpa-info'>
                    <View className='title'>
                        绩点信息
                    </View>
                    <View className='at-row at-row__align--center'>
                        <View className='at-col'>
                            <Text className='tags'>学科数目</Text>
                            <Text className='value'>{this.state.subjects.length}</Text>
                        </View>
                        <View className='at-col text-right'>
                            <Text className='tags'>总体绩点</Text>
                            <Text className='value'>{this.state.totalGpa.toFixed(4)}</Text>
                        </View>
                    </View>
                    <View className='at-row at-row__align--center'>
                        <View className='at-col'>
                            <Text className='tags'>学分小计</Text>
                            <Text className='value'>{this.state.credits}</Text>
                        </View>
                        <View className='at-col text-right'>
                            <Text className='tags'>学期绩点</Text>
                            <Text className='value'>{this.state.gpa.toFixed(4)}</Text>
                        </View>
                    </View>
                    {this.state.yearCredits !== 0 && this.state.yearGpa !== 0 && (
                        <View className='at-row at-row__align--center'>
                            <View className='at-col'>
                                <Text className='tags'>学年学分</Text>
                                <Text className='value'>{this.state.yearCredits}</Text>
                            </View>
                            <View className='at-col text-right'>
                                <Text className='tags'>学年绩点</Text>
                                <Text className='value'>{this.state.yearGpa.toFixed(4)}</Text>
                            </View>
                        </View>
                    )}
                    {this.state.yearCredits === 0 && this.state.yearGpa === 0 && (
                        <View className='year-gpa-tips'>查询该学年的其他学期成绩后可显示学年绩点</View>
                    )}
                </View>

                <View className='grades-list'>
                    {this.state.subjects.length > 0 && <AtList hasBorder={false}>
                        {this.state.subjects.map((subject, index) => (
                            <AtListItem
                                onClick={() => this.setState({ detail: subject })}
                                title={`${index + 1}.${subject.name}`}
                                note={`编号: ${subject.course_code} 学分: ${subject.credit}`}
                                extraText={`${subject.grade}分`}
                                iconInfo={{
                                    value: 'tags',
                                    color: `rgb(${MainColor})`,
                                    size: 40
                                }}
                                arrow={'right'}
                            ></AtListItem>
                        ))}
                    </AtList>}
                    {this.state.subjects.length === 0 && <Blank tips='成绩还没出哦！请耐心等待' />}
                </View>

                <AtFloatLayout
                    isOpened={Boolean(this.state.detail)}
                    title='成绩详情'
                    onClose={() => this.setState({ detail: undefined })}
                >
                    <AtList hasBorder={false}>
                        <AtListItem title='课程名称' note={this.state.detail?.name} />
                        <AtListItem title='课程编号' note={this.state.detail?.course_code} />
                        <AtListItem title='课程学分' note={`${this.state.detail?.credit}`} />
                        <AtListItem title='课程分数' note={`${this.state.detail?.grade}`} />
                        {this.state.detail?.extra_data.map(data => (
                            <AtListItem title={data.key} note={data.value} />
                        ))}
                    </AtList>
                </AtFloatLayout>
            </>
        )
    }
}