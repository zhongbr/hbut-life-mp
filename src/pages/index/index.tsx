import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image, Swiper, SwiperItem, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'
import { OriginIconsContainer, CreateGridTemplate } from '../../components/origin-icon-container/container';
import { OriginItem } from '../../components/origin-icon-container/item';
import { OriginIcon } from '../../components/origin-icon/icon';
import { Icons } from '../../utils/icons';
import { WeatherCard } from '../../components/weather/weather';
import { NavigationBarHeight, SystemInfo } from '../../utils/constants';
import { GridTemplate } from './grid-icons-template'
import { request } from '../../utils/net/request';
import { ReadPassword } from '../../utils/net/password'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'
import '../../static/icons/login.svg'

interface Banner {
  id: number;
  type: string;
  url: string;
  desc: string;
  target: string;
}

interface Notification {
  id: number;
  send_time: string;
  title: string;
  text: string;
  image_url: string;
}

interface IndexState {
  scrolledHeight: number,
  banners: Banner[],
  notification?: Notification,
  notificationAlarm?: boolean,
  hasLoginStudentNumber?: boolean
}

export default class Index extends Component<any, IndexState> {

  private notifications: Notification[] = [];

  constructor(props) {
    super(props);
    this.state = {
      scrolledHeight: 0,
      banners: [{
        id: 1,
        type: 'img',
        url: 'http://pic.zhongbr.cn/banner-default.png',
        desc: '湖工life，简洁高效',
        target: 'http://pic.zhongbr.cn/banner-default.png'
      }],
      hasLoginStudentNumber: true
    }
  }

  componentWillMount() { }

  componentDidMount() {}

  componentWillUnmount() { }

  async componentDidShow() {
    await this.GetBanners();
    await this.GetNotification();
    await this.CheckHasLoginStudentNumber();
  }

  componentDidHide() { }

  private async GetBanners(){
    let res = await request({
      data:{
        group: 'base',
        action: 'banner',
        data: {
          accounts: ['001']
        }
      }
    })
    this.setState({banners: res.data.banners});
    console.log('获取banner成功')
  }

  private async GetNotification(){
    let res = await request({
      data:{
        group: 'base',
        action: 'notification',
        data: {
          accounts: ['001']
        }
      }
    });
    let notifications = res.data as Notification[];
    this.notifications = notifications;
    this.setState({notification: notifications[0]});
    // 如果第一个通知没有弹窗提示过用户，就弹窗提醒用户
    let alarmed = false;
    try{
      let res = await Taro.getStorage({key: 'alarm_notification_id_recently'});
      if(res.data === notifications[0].id) alarmed = true
    } catch(e) {}
    if(!alarmed) this.setState({notificationAlarm: true});
    console.log('获取notifications成功')
  }

  private async CheckHasLoginStudentNumber() {
    let passwords = await ReadPassword(['001']);
    this.setState({hasLoginStudentNumber: passwords.length !== 0});
  }

  private async readNotification(id){
    try{
      await Taro.setStorage({key: 'alarm_notification_id_recently', data: id});
      this.setState({notificationAlarm: false});
    } catch(e) {}
  }

  render() {
    let screenWidth = Taro.getSystemInfoSync().screenWidth;
    return (
      <>
        <CustomNavigationBar
          // opacity={(this.state.scrolledHeight>(NavigationBarHeight*5)?1:(this.state.scrolledHeight/(NavigationBarHeight*5)))}
        />

        {/* 未登录学号的弹窗 */}
        <AtModal isOpened={!this.state.hasLoginStudentNumber}>
          <AtModalHeader>学号登录</AtModalHeader>
          <AtModalContent>
            <View className='login-modal'>
              <Image src={'../../static/icons/login.svg'} mode='aspectFit' className='login-modal-icon' />
              <Text className='login-modal-text'>当前未登录学号，只可使用少部分功能，登录学号后，可以使用完整的功能服务哦！</Text>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={()=>this.setState({hasLoginStudentNumber: true})}>我先看看</Button>
            <Button onClick={()=>Taro.navigateTo({url:'../login/login?code=001'})}>现在登录</Button>
          </AtModalAction>
        </AtModal>

        {/* 通知弹窗 */}
        <AtModal isOpened={this.state.notificationAlarm}>
          <AtModalHeader>开发者通知</AtModalHeader>
          <AtModalContent>
            <View className='notification-title'>{this.state.notification?.title}</View>
            <View className='notification-sendtime'>发送时间: {new Date(this.state.notification?.send_time).toLocaleString()}</View>
            {/* 通知中的图片 */this.state.notification?.image_url && (
              <Image src={this.state.notification?.image_url} className='notification-image' mode='aspectFit'></Image>
            )}
            <View className='notification-text'>
              {this.state.notification?.text}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.readNotification.bind(this, this.state.notification?.id)}>我知道了</Button>
          </AtModalAction>
        </AtModal>
        
        {/* 图标区 */}
        <ScrollView scrollY 
          onScroll={(event)=>{
            this.setState({scrolledHeight: event.detail.scrollTop})
          }}
          className='index'
          style={{
            height: `${SystemInfo.screenHeight-NavigationBarHeight}px`
          }}
        >

          <OriginIconsContainer
              columns={4}
              rows={8}
              templateAreas={GridTemplate}
            >
              {/*通知*/}
              <OriginItem name='notification' backgrondColor='#7C8CE9'>
                <View
                 className='notification'
                 onClick={()=>this.setState({notificationAlarm: true})}
                >
                  <Text className='title'>{this.state.notification?.title}</Text>
                  <Text className='content'>
                    {this.state.notification?.text?.length>20?this.state.notification?.text.slice(0,20)+'...':this.state.notification?.text}
                  </Text>
                </View>
              </OriginItem>

              {/*轮播图*/}
              <OriginItem name='swiper' backgrondColor='rgba(255, 255, 255, 0.6)'>
                <Swiper
                  className='swiper'
                  autoplay
                  interval={3000}
                  circular
                >
                  {this.state.banners.map(banner => (
                    <SwiperItem>
                      <Image className='swiper-image' src={banner.url} mode='scaleToFill'></Image>
                      <View className='swiper-text'><Text>{banner.desc}</Text></View>
                    </SwiperItem>
                  ))}
                </Swiper>
              </OriginItem>

              {/*天气图标*/}
              <WeatherCard city='武汉' name='weather'></WeatherCard>
              {/*功能图标*/}
              {Icons.map(icon => (
                <OriginItem name={icon.name} backgrondColor={icon.backgroundColor}>
                  <OriginIcon
                    tag={icon.tag}
                    direction={icon.direction}
                    square={icon.square}
                    icon={icon.iconFile('../../static/icons')}
                    onClick={()=>Taro.navigateTo({url: icon.navigate('/pages')})}
                  />
                </OriginItem>
              ))}
            </OriginIconsContainer>

        </ScrollView>
      </>
    )
  }
}
