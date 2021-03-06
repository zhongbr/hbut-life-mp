import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtFloatLayout, AtList, AtListItem, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { hash } from '../../utils/index'
import './schedule.scss'

export type ScheduleData = { [lesson: string]: { [day: string]: string[][] } }

interface ScheduleHeader {
    grid: string;
    text: string;
}

interface ScheduleCell {
    grid: string;
    name: string;
    info: string;
    badage: number;
    data: string[][];
    color: string;
}

interface ScheduleProps {
    schedule: ScheduleData;
    lessons: string[];
    days: string[];
    colors: string[];
}

interface ScheduleState {
    gridTemplate?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    name?: string;
    headers?: ScheduleHeader[];
    cells?: ScheduleCell[];
    detail?: string[];
    choosements?: string[][];
}

export class Schedule extends React.Component<ScheduleProps, ScheduleState> {
    constructor(props: ScheduleProps) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.generateGridTemplate();
    }

    private generateGridTemplate() {
        const columns = this.props.days.length;
        const rows = this.props.lessons.length;
        const gridTemplateColumns = `repeat(${columns + 1}, ${(100 / (columns + 1)).toFixed(2)}%)`;
        const gridTemplateRows = `7% repeat(${rows}, ${(93 / rows).toFixed(2)}%)`;
        const template = [['name'].concat(Array.from(new Array(columns), (_, i) => `chead${i + 1}`))];
        const cells: ScheduleCell[] = [];
        const headers: ScheduleHeader[] = Array.from(new Array(columns), (_, i) => {
            return {
                grid: `chead${i + 1}`,
                text: this.props.days[i]
            }
        });
        const colors = this.props.colors;
        // 遍历课表
        let rowCount = 1, colorsMap = {}, colorCount = 0;
        for (let lesson of this.props.lessons) {
            const rhead = `rhead${rowCount++}`;
            let row = [rhead];
            headers.push({ grid: rhead, text: lesson });
            for (let day of this.props.days) {
                let cellDatas = this.props.schedule[lesson][day];
                if (cellDatas.length > 0) {
                    const grid = 'g' + hash.Sha1Hash(cellDatas[0].join('') + day + lesson).slice(0, 5);
                    if (!colorsMap[cellDatas[0].join('')]) colorsMap[cellDatas[0].join('')] = colors[(colorCount++) % colors.length];
                    cells.push({
                        grid,
                        name: cellDatas[0][0],
                        info: cellDatas[0][cellDatas[0].length-1],
                        badage: cellDatas.length - 1,
                        data: cellDatas,
                        color: colorsMap[cellDatas[0].join('')],
                    });
                    row.push(grid);
                } else {
                    row.push('.');
                }
            }
            template.push(row);
        }
        // 连接成grid模板
        console.log(template);
        const gridTemplate = template.map(row => `'${row.join(' ')}'`).join('');
        this.setState({ gridTemplate, headers, cells, gridTemplateColumns, gridTemplateRows })
    }

    async showDetail(courses: string[][]) {
        if (courses.length > 1) {
            this.setState({ choosements: courses })
        } else {
            this.setState({ detail: courses[0] })
        }
    }

    render() {
        return <>
            <View
                className='schedule-box'
                style={{
                    gridTemplateColumns: this.state.gridTemplateColumns,
                    gridTemplateRows: this.state.gridTemplateRows,
                    gridTemplateAreas: this.state.gridTemplate
                }}
            >
                <View
                    className='schedule-cell column-header header'
                    style={{
                        gridArea: 'name'
                    }}
                >
                    <Text>{this.state.name}</Text>
                </View>
                {/* 表头 */}
                {this.state.headers?.map(header => <View
                    className={`schedule-cell header ${header.grid.startsWith('c') ? 'column-header' : ''}`}
                    style={{
                        gridArea: header.grid
                    }}
                >
                    <View className='header'>{header.text}</View>
                </View>)}
                {/* 表格 */}
                {this.state.cells?.map(cell => <View
                    style={{
                        gridArea: cell.grid,
                        backgroundColor: cell.color
                    }}
                    className='schedule-cell'
                    onClick={this.showDetail.bind(this, cell.data)}
                >
                    <View className='name'>{cell.name}</View>
                    <View className='info'>{cell.info}</View>

                </View>)}

                {/* 课程选择 */}
                <AtActionSheet
                    isOpened={Boolean(this.state.choosements)}
                    title='课程详情选择'
                    onCancel={() => this.setState({ choosements: undefined })}
                    onClose={() => this.setState({ choosements: undefined })}
                >
                    {this.state.choosements && this.state.choosements.map(choose => <AtActionSheetItem
                        onClick={() => this.setState({ detail: choose, choosements: undefined })}
                    >
                        {choose[0]}
                    </AtActionSheetItem>)}
                </AtActionSheet>

                {/* 详情 */}
                <AtFloatLayout
                    isOpened={Boolean(this.state.detail)}
                    onClose={() => this.setState({ detail: undefined })}
                    title='课程详情'
                >
                    {this.state.detail?.length >= 3 && <AtList>
                        <AtListItem title='课程名称' note={(this.state.detail ? this.state.detail : [])[0]} />
                        <AtListItem title='主讲老师' note={(this.state.detail ? this.state.detail : [])[1]} />
                        <AtListItem title='上课班级' note={(this.state.detail ? this.state.detail : [])[2]} />
                        <AtListItem title='上课周数' note={(this.state.detail ? this.state.detail : [])[3]} />
                        {this.state.detail?.length > 4 && <AtListItem title='上课地点' note={(this.state.detail ? this.state.detail : {})[4]} />}
                    </AtList>}
                    {this.state.detail?.length == 2 && <AtList>
                        <AtListItem title='课程名称' note={(this.state.detail ? this.state.detail : [])[0]} />
                        <AtListItem title='地点周数' note={(this.state.detail ? this.state.detail : [])[1]} />
                    </AtList>}
                </AtFloatLayout>
            </View>
        </>
    }
}
