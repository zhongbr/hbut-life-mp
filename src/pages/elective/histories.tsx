import React from 'react'
import Taro from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import { AtSearchBar, AtList, AtListItem, AtFloatLayout, AtCard } from 'taro-ui'
import { request } from '../../utils/net/request'
import * as utils from '../../utils/index'
import './table.scss'
import '../../static/icons/study.svg'
import '../../static/icons/elective.svg'
import '../../static/icons/calculator.svg'

interface Subject {
    subject_name: string;
    semester: string;
    host_teacher: string;
    others_info: string;
    subject_type: string;
    source: string;
}

interface ElectiveHistoriesPageState {
    semesterState: { [semester: string]: boolean };
    electiveCourses: { [semester: string]: utils.userinfo.Subject };
    creditsConter: { [type: string]: number };
    coursesEachType: { [type: string]: string[] };
    detail?: string;
}

export default class ElectiveHistoriesPage extends React.Component<any, ElectiveHistoriesPageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            semesterState: {},
            electiveCourses: {},
            creditsConter: {},
            coursesEachType: {}
        }
    }

    async componentDidShow() {
        await this.LoadLocalGrades();
        await this.CountCredits();
    }

    private async LoadLocalGrades() {
        let currentSubjects = {};
        let currentStates = {};
        for (let semester_ of utils.constants.Semesters) {
            try {
                let semester = semester_;
                // 如果学期格式不是纯数字
                if (!/^\d+$/.test(semester_)) {
                    let year = semester_.slice(0, 4);
                    let half = { '一': '1', '二': '2' }[semester_[12]];
                    semester = year + half;
                }
                let subjects = (await Taro.getStorage({ key: `grades_${semester}` })).data;
                if (subjects) {
                    subjects.forEach((subject) => {
                        subject.extra_data.forEach(data => {
                            if (data.key === '类型' && data.value === '公选课') {
                                currentSubjects[semester_] = subject;
                                currentStates[semester_] = true;
                            }
                        })
                    })
                }
            } catch (e) { }
        }
        this.setState({ electiveCourses: currentSubjects, semesterState: currentStates })
    }

    private async GetElectiveCourseScoreOfSemester(semester: string) {
        let currentSubjects = this.state.electiveCourses;
        let currentStates = this.state.semesterState;
        Taro.showLoading({ title: '加载中' });
        let { subjects } = await utils.userinfo.GetGrades(semester);
        Taro.hideLoading();
        subjects.forEach((subject) => {
            subject.extra_data.forEach(data => {
                if (data.key === '类型' && data.value === '公选课') {
                    currentSubjects[semester] = subject;
                    currentStates[semester] = true;
                }
            })
        })
        await this.CountCredits();
        this.setState({ electiveCourses: currentSubjects, semesterState: currentStates })
    }

    private async CountCredits() {
        let subjectsQuery = [];
        let semesters = {};
        let subjectsOfEachType = {};
        let res = {};
        for (let semester in this.state.electiveCourses) {
            let subject = this.state.electiveCourses[semester];
            semesters[subject.name] = semester;
            subjectsQuery.push(subject.name);
        }
        let resp = await utils.net.request({
            data: {
                group: 'study',
                action: 'get-elective-courses-types',
                data: {
                    accounts: ['005'],
                    courses: subjectsQuery
                }
            }
        });
        let courses = resp.data.courses as any[];
        courses.forEach((course, index) => {
            let subjects = course.courses as Subject[];
            let clearly = false;
            subjects.forEach(subject => {
                if (subject.semester === semesters[subject.subject_name]) {
                    res[subject.subject_type] = res[subject.subject_type] ? res[subject.subject_type] : 0;
                    res[subject.subject_type] += this.state.electiveCourses[subject.semester].grade >= 60 ? this.state.electiveCourses[subject.semester].credit : 0;
                    if (!subjectsOfEachType[subject.subject_type]) subjectsOfEachType[subject.subject_type] = [];
                    subjectsOfEachType[subject.subject_type].push(subject.subject_name);
                    clearly = true;
                }
            });
            if (!clearly) {
                if (!subjectsOfEachType['未知类别']) {
                    subjectsOfEachType['未知类别'] = [];
                    res['未知类别'] = 0;
                }
                subjectsOfEachType['未知类别'].push(subjectsQuery[index]);
                res['未知类别'] += this.state.electiveCourses[semesters[subjectsQuery[index]]].grade >= 60 ? this.state.electiveCourses[semesters[subjectsQuery[index]]].grade.credit : 0;
            }
        })
        this.setState({ creditsConter: res, coursesEachType: subjectsOfEachType });
    }

    render() {
        return <>
            <CustomNavigationBar hasBack title='已修选修课' opacity={1} />
            <AtCard
                isFull
                className='card'
                title='使用说明'
                thumb='../../static/icons/calculator.svg'
            >
                <Text>本页面提供的数据仅供参考，统计前请手动查询所有学期的成绩，小程序将自动统计其中的公选课，并统计学分。</Text>
            </AtCard>
            {/* 学分统计 */}
            <AtCard
                isFull
                className='card'
                title='学分统计'
                thumb='../../static/icons/elective.svg'
            >
                {Object.keys(this.state.creditsConter).length === 0 && <Blank tips='你还没有选修课记录哦' />}
                <AtList hasBorder={false}>
                    {Object.keys(this.state.creditsConter).map((type, index) => <AtListItem
                        title={`${index + 1}.${type}`}
                        extraText={`${this.state.creditsConter[type] ? this.state.creditsConter[type] : 0}学分`}
                        onClick={()=>this.setState({detail: type})}
                        arrow='right'
                    />)}
                </AtList>
            </AtCard>
            {/* 学期查询状态 */}
            <AtCard
                isFull
                className='card'
                title='各学期选修课'
                thumb='../../static/icons/study.svg'
            >
                <AtList hasBorder={false}>
                    {utils.constants.Semesters.map((semester, index) => <AtListItem
                        title={`${index + 1}.${semester}`}
                        extraText={this.state.semesterState[semester] ? this.state.electiveCourses[semester]?.grade + '分' : '查询'}
                        arrow='right'
                        onClick={this.GetElectiveCourseScoreOfSemester.bind(this, semester)}
                        iconInfo={{ size: 25, color: this.state.electiveCourses[semester]?.credit ? 'green' : 'red', value: 'bookmark', }}
                        note={`${this.state.electiveCourses[semester]?.name ? this.state.electiveCourses[semester]?.name : '未查询到'} ${this.state.electiveCourses[semester]?.credit ? this.state.electiveCourses[semester]?.credit : 0}学分`}
                    />)}
                </AtList>
            </AtCard>
            {/* 各类别课程的弹出层 */}
            <AtFloatLayout
                isOpened={Boolean(this.state.detail)}
                title={`${this.state.detail} 公选课`}
                onClose={() => this.setState({ detail: undefined })}
            >
                <AtList hasBorder={false}>
                    {this.state.coursesEachType[this.state.detail] && this.state.coursesEachType[this.state.detail].map((course, index) => <AtListItem
                        title={`${index + 1}.${course}`}
                    />)}
                </AtList>
            </AtFloatLayout>
        </>
    }
}