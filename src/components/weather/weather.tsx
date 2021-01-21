import { View, Image, Text } from '@tarojs/components';
import React from 'react'
import {request} from '../../utils/net/request'
import {OriginItem} from '../origin-icon-container/item'
import './weather.scss'
import '../../static/icons/weather-sunny.svg';
import '../../static/icons/weather-cloudy.svg';
import '../../static/icons/weather-raniy-large.svg';
import '../../static/icons/weather-rainy-storm.svg';
import '../../static/icons/weather-raniy-mid.svg';
import '../../static/icons/weather-raniy-small.svg';
import '../../static/icons/weather-snow.svg';
import '../../static/icons/weather-raniy-lightning.svg';

const BackgroundColors = {
    'sunny': '#F6D48A',
    'cloudy': '#B9C4D5',
    'rainy-storm': '#ADBFDD',
    'raniy-large': '#ADBFDD',
    'raniy-lightning': '#ADBFDD',
    'raniy-mid': '#ADBFDD',
    'raniy-small': '#ADBFDD',
    'snow': '#85B0EC'
}

const Keywords = {
    'sunny': /晴/,
    'cloudy': /阴|多云/,
    'rainy-storm': /暴/,
    'raniy-large': /大雨/,
    'raniy-lightning': /雷|电/,
    'raniy-mid': /中雨/,
    'raniy-small': /小雨/,
    'snow': /雪/
}

interface WeatherCardProps {
    city: string;
    name: string;
}

interface Forecast {
    data?: string;
    fengli?: string;
    fengxiang?: string;
    high?: string;
    low?: string;
    type?: string;
}

interface WeatherCardState {
    forecasts: Forecast[];
    temperature: string;
    tips: string;
    weather: string;
    today: Forecast;
}

export class WeatherCard extends React.Component<WeatherCardProps, WeatherCardState> {

    constructor(props: WeatherCardProps){
        super(props);
        this.state = {
            forecasts: [],
            temperature: '0',
            tips: '',
            weather: 'sunny',
            today: {}
        }
    }

    render(){
        return (
            <OriginItem name={this.props.name} backgrondColor={BackgroundColors[this.state.weather]}>
                <View className='weather-card'>
                    <View className='weather-icon'>
                        <Image src={`../../static/icons/weather-${this.state.weather}.svg`} mode='aspectFit' />
                    </View>
                    <View className='weather-info'>
                        <Text className='type'>{this.state.today.type}</Text>
                        <Text className='info'>{this.props.city} {this.state.today.low} {this.state.today.high}</Text>
                    </View>
                </View>
            </OriginItem>
        )
    }

    async componentDidMount(){
        let serverresponse = await request({
            data:{
                group: 'base',
                action: 'get-weather-info',
                data: {
                    accounts: ['001'],
                    city: this.props.city
                }
            }
        });
        console.log(serverresponse.data.data?.forecast);
        let forecasts = serverresponse.data.data?.forecast as Forecast[];
        let today = forecasts[0];
        let type = '';
        for(let weather in Keywords) if(Keywords[weather].test(today.type)) type = weather;
        this.setState({
            temperature: serverresponse.data.data?.wendu,
            forecasts: forecasts,
            tips: serverresponse.data.data?.ganmao,
            today: today,
            weather: type
        })
    }
}