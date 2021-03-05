import React from 'react'
import Taro from '@tarojs/taro'
import * as utils from '../../utils/index'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { AtCard, AtListItem, AtList } from 'taro-ui'
import { Blank } from '../../components/blank/blank'
import '../../static/icons/exam.svg'


interface ExamPageStateInterface {
    exams: Exam[],
    reExams: ReExam[], // 补考
}

interface Exam {
    Name: string;
    Class: string;
    Extra: string;
}

interface ReExam {
    course_name: string;
    others_info: string;
}

export default class ExamPage extends React.Component<any, ExamPageStateInterface> {
    constructor(parameters: any) {
        super(parameters);
        this.state  = {
            exams: [],
            reExams: []
        }
    }

    async onLoad(){
        Taro.showLoading({title: '加载中'});
        await this.GetExam();
        await this.GetReExams();
        Taro.hideLoading();
    }

    private async GetExam(){
        let userinfo = await utils.userinfo.GetUserInfo();
        let res = await utils.net.request({
            data: {
                group: 'base',
                action: 'exam',
                data: {
                    accounts: ['005'],
                    className: userinfo.class
                }
            }
        });
        let exams = res.data.exams?res.data.exams:[];
        this.setState({exams})
    }

    private async GetReExams(){
        let res = await utils.net.request({
            data: {
                group: 'base',
                action: 'make-up-subjects',
                data: {
                    accounts: ['005'],
                }
            }
        });
        let reExams = res.data.subjects?res.data.subjects:[];
        this.setState({reExams});
    }

    render(){
        return <>
            <CustomNavigationBar title='考试安排' hasBack opacity={1} />
            {/* 考试安排 */}
            <AtCard
                title='考试安排'
                thumb='../../static/icons/exam.svg'
                isFull
                className='card'
            >
                {this.state.exams.length !== 0 && <AtList>
                    {this.state.exams.map((exam, index)=><AtListItem 
                        title={`${index+1}. ${exam.Name}`}
                        note={`${exam.Class} ${exam.Extra}`}
                    />)}    
                </AtList>}
                {this.state.exams.length === 0 && <Blank tips='暂时没有考试安排'></Blank>}
            </AtCard>
            {/* 补考安排 */}
            <AtCard
                title='补考安排'
                thumb='../../static/icons/exam.svg'
                isFull
                className='card'
            >
                {this.state.reExams.length !== 0 && <AtList>
                    {this.state.reExams.map((exam, index)=><AtListItem 
                        title={`${index+1}. ${exam.course_name}`}
                        note={`${exam.others_info}`}
                    />)}    
                </AtList>}
                {this.state.reExams.length === 0 && <Blank tips='暂时没有补考安排'></Blank>}
            </AtCard>
        </>
    }
}