import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { Blank } from '../../components/blank/blank'
import { CampusCalendar } from '../../utils/constants'
import './calendar.scss'

interface Calendar {
    semester: string;
    url: string;
}

interface CalendarPageState {
    Calendars: Calendar[];
}

export default class CalendarPage extends React.Component<any, CalendarPageState>{
    constructor(props: any) {
        super(props);
        this.state = {
            Calendars: CampusCalendar,
        }
    }

    render() {
        return (<>
            <CustomNavigationBar opacity={1} hasBack title='校历' />
            {this.state.Calendars.length === 0 && <Blank tips='这里空空如也' />}
            <View className='calendar-page'>
                {this.state.Calendars.map(calendar => (
                    <View className='calendar animation-scale-up' onClick={()=>Taro.previewImage({urls: [calendar.url]})}>
                        <View className='title'>{calendar.semester}</View>
                        <Image className='image' src={calendar.url} mode='scaleToFill' />
                    </View>
                ))}
            </View>
        </>)
    }
}
