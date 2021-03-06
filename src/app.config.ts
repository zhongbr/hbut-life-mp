const StaticIconPath = `./static/icons`
export default {
  pages: [
    'pages/index/index',
    'pages/schedule/schedule',
    'pages/settings/settings',
    'pages/login/login',
    'pages/grades/grades',
    'pages/calendar/calendar',
    'pages/card/card',
    'pages/book/book',
    'pages/book/borrowed-books',
    'pages/book/search-books',
    'pages/study/study',
    'pages/exam/exam',
    'pages/lab/lab',
    'pages/elective/elective',
    'pages/elective/tables',
    'pages/elective/histories',
    'pages/about/about',
    'pages/keyword-schedule/keyword-schedule'
  ],
  window: {
    navigationStyle: 'custom',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#192ED4',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
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
        text: '我的',
        iconPath: `${StaticIconPath}/settings.png`,
        selectedIconPath: `${StaticIconPath}/settings.png`
      }
    ]
  }
}
