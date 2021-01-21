const StaticIconPath = `./static/icons`
export default {
  pages: [
    'pages/index/index',
    'pages/schedule/schedule',
    'pages/settings/settings'
  ],
  window: {
    navigationStyle: 'custom',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar:{
    color: '#000000',
    selectedColor: '#192ED4',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '发现',
        iconPath: `${StaticIconPath}/home.png`,
        selectedIconPath: `${StaticIconPath}/home.png`
      },
      {
        pagePath: 'pages/schedule/schedule',
        text: '课表',
        iconPath: `${StaticIconPath}/schedule.png`,
        selectedIconPath: `${StaticIconPath}/schedule.png`
      },
      {
        pagePath: 'pages/settings/settings',
        text: '设置',
        iconPath: `${StaticIconPath}/settings.png`,
        selectedIconPath: `${StaticIconPath}/settings.png`
      }
    ]
  }
}
