import React from 'react'
import { Route } from 'react-router-dom'

import { TabBar } from 'antd-mobile'

import Index from '../Index' // 一进来就加载的页面，就不用懒加载了
// import FindHouse from '../FindHouse'
// import News from '../News'
// import My from '../My'

import '../../assets/fonts/iconfont.css'
import './index.css'

const FindHouse = React.lazy(() => import('../FindHouse'))
const News = React.lazy(() => import('../News'))
const My = React.lazy(() => import('../My'))


const tarBarData = [
  {
    title: '首页',
    key: 'index',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    key: 'findhouse',
    icon: 'icon-findHouse',
    path: '/home/findhouse'
  },
  {
    title: '资讯',
    key: 'news',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    key: 'my',
    icon: 'icon-my',
    path: '/home/my'
  }
]

const tabBarItem = that => {
  return tarBarData.map(item => (
    <TabBar.Item
      title={item.title}
      key={item.key}
      icon={<i className={`iconfont ${item.icon}`} />}
      selectedIcon={<i className={`iconfont ${item.icon}`} />}
      selected={that.state.selectedTab === item.path}
      onPress={() => {
        that.setState({
          selectedTab: item.path
        })
        that.props.history.push(item.path)
      }}
    />
  ))
}

class TabBarWrap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 1.当从首页导航点击切换到找房时，并没有更新这个属性，所以导致不会高亮
      selectedTab: this.props.location.pathname,
      fullScreen: true
    }
  }
  render() {
    return (
      <div className="tar-bar-wrap">
        <TabBar
          unselectedTintColor="#999"
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
          {tabBarItem(this)}
        </TabBar>
      </div>
    )
  }

  // 2.每次路由切换，都会引发组件更新，在更新完成的钩子中重新设置selectedTab（判断更新前后路由是否不同避免递归渲染）
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
}

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      pathname: ''
    }
  }
  setPathName = v => {
    this.setState({
      pathname: this.props.location.pathname
    })
  }
  render() {
    return (
      <div className={this.state.pathname !== '/home/findhouse' ? 'home' : ''}>
        <Route exact path="/home" component={Index} />
        <Route path="/home/findhouse" component={FindHouse} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        <TabBarWrap {...this.props} />
      </div>
    )
  }
  componentDidMount() {
    this.setPathName()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname)
      return this.setPathName()
  }
}

export default Home
