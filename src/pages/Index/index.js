import React from 'react'
// import axios from 'axios'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import Search from '../../components/Search'
import Swiper from '../../components/Swiper'

import { List } from 'antd-mobile'

import nav1 from '../../assets/img/nav-1.png'
import nav2 from '../../assets/img/nav-2.png'
import nav3 from '../../assets/img/nav-3.png'
import nav4 from '../../assets/img/nav-4.png'
import './index.scss'

// 导航菜单
const navData = [
  {
    text: '整租',
    icon: nav1,
    path: '/home/findhouse'
  },
  {
    text: '合租',
    icon: nav2,
    path: '/home/findhouse'
  },
  {
    text: '地图找房',
    icon: nav3,
    path: '/showmap'
  },
  {
    text: '去出租',
    icon: nav4,
    path: '/rent'
  }
]
const navItem = that => {
  return navData.map((item, index) => (
    <div
      key={index}
      className="nav-item"
      onClick={() => that.props.toPages(item.path)}
    >
      <img src={item.icon} alt="" />
      <span>{item.text}</span>
    </div>
  ))
}
class Nav extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
    return <div className="nav">{navItem(this)}</div>
  }
  componentDidMount() {}
  componentDidUpdate(prevProps) {}
}

// 租房小组
const groupsItem = that => {
  return that.state.groups.map(item => (
    <div key={item.id} className="groups-item">
      <div className="groups-item-item">
        <div className="desc">
          <h5>{item.title}</h5>
          <span>{item.desc}</span>
        </div>
        <div className="img">
          <img src={BASE_URL + item.imgSrc} alt="" />
        </div>
      </div>
    </div>
  ))
}
class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: []
    }
  }
  getGroups = async () => {
    const { data: res } = await API.get('/home/groups', {
      params: { area: this.props.positionValue }
    })
    // console.log(res)
    if (res.status !== 200) return alert('请求失败')
    this.setState({
      groups: res.body
    })
  }
  render() {
    return (
      <div className="groups">
        <div className="groups-title">
          <h3>租房小组</h3>
          <span>更多</span>
        </div>
        <div className="groups-bd">{groupsItem(this)}</div>
      </div>
    )
  }
  componentDidMount() {
    this.getGroups()
  }
  componentDidUpdate(prevProps) {}
}

// 最新资讯
const Item = List.Item
const newsItem = that => {
  return that.state.news.map(item => (
    <Item
      key={item.id}
      arrow="empty"
      multipleLine
      onClick={() => {}}
      platform="android"
    >
      <div className="newsItem">
        <div className="img">
          <img src={BASE_URL + item.imgSrc} alt="" />
        </div>
        <div className="title">
          <h5>{item.title}</h5>
          <div className="info">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </Item>
  ))
}
class News extends React.Component {
  state = {
    news: []
  }
  getNews = async () => {
    const { data: res } = await API.get('/home/news', {
      params: { area: this.props.positionValue }
    }).catch(err => err)
    // console.log(res)
    if (res.status !== 200) return alert('获取数据失败')
    this.setState({
      news: res.body
    })
  }
  render() {
    return (
      <div className="news">
        <List renderHeader={() => '最新资讯'} className="my-list">
          {newsItem(this)}
        </List>
      </div>
    )
  }
  componentDidMount() {
    this.getNews()
  }
}

// 首页根组件
class Index extends React.Component {
  constructor() {
    super()
    this.state = {
      bgColor: 'transparent',
      positionValue: '',
      data: [], // 轮播图数据动态加载，数据前后数量不一致，导致不会自动播放，且还会出现高度问题
      isLoading: false // 添加一个条件，让数据加载完成后再进行渲染
    }
  }
  getSwiper = async () => {
    const { data: res } = await API.get('/home/swiper')
    // console.log(res)
    if (res.status !== 200) return alert('获取数据失败')
    this.setState({
      data: res.body,
      isLoading: true
    })
  }
  setBgCollor = scrollTop => {
    this.setState(() => {
      return {
        bgColor: scrollTop <= 0 ? 'transparent' : '#21b97a'
      }
    })
  }
  setPositionValue = value => {
    this.setState(() => {
      return {
        positionValue: value
      }
    })
  }
  toPages = pahtname => {
    this.props.history.push(pahtname)
  }
  render() {
    return (
      <div className="index" ref="index">
        <div>
          <Search
            {...this.props}
            {...this.state}
            setPositionValue={this.setPositionValue}
            toPages={this.toPages}
            mapIconColor={'#fff'}
          />
          <Swiper
            height={212}
            data={this.state.data}
            isLoading={this.state.isLoading}
          />
          <Nav {...this.props} toPages={this.toPages} />
          <Groups {...this.state} />
          <News {...this.state} />
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.getSwiper()
    this.refs.index.addEventListener('scroll', () =>
      this.setBgCollor(this.refs.index.scrollTop)
    )
  }
  componentDidUpdate(prevProps) {}
  componentWillUnmount() {
    this.refs.index.removeEventListener('scroll', () =>
      this.setBgCollor(this.refs.index.scrollTop)
    )
  }
}

export default Index
