import React from 'react'
import { Route } from 'react-router-dom'

import { TabBar } from 'antd-mobile'

import Index from '../Index'
import FindHouse from '../FindHouse'
import News from '../News'
import My from '../My'

import '../../assets/fonts/iconfont.css'
import './index.css'

const tarBarData = [{
  title: '首页',
  key: 'index',
  icon: 'icon-ind',
  path: '/home'
}, {
  title: '找房',
  key: 'findhouse',
  icon: 'icon-findHouse',
  path: '/home/findhouse'
}, {
  title: '资讯',
  key: 'news',
  icon: 'icon-infom',
  path: '/home/news'
}, {
  title: '我的',
  key: 'my',
  icon: 'icon-my',
  path: '/home/my'
}]

class TabBarWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.location.pathname,
      fullScreen: true,
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
          {tarBarData.map(item => {
            return (
              <TabBar.Item
                title={item.title}
                key={item.key}
                icon={<i className={`iconfont ${item.icon}`} />}
                selectedIcon={<i className={`iconfont ${item.icon}`} />}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                  this.setState({
                    selectedTab: item.path,
                  })
                  this.props.history.push(item.path)
                }}
              />
            )
          })}
        </TabBar>
      </div>
    )
  }
}

class Home extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
    return (
      <div className="home">
        <Route exact path="/home" component={Index} />
        <Route path="/home/findhouse" component={FindHouse} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        <TabBarWrap {...this.props} />
      </div>
    )
  }
  componentDidMount() { }
  componentDidUpdate(prevProps) { }
}

export default Home