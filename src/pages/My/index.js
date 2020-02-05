import React from 'react'

import { API } from '../../utils/api'
import { isAuth, removeToken } from '../../utils/token'
import { BASE_URL } from '../../utils/url'
import { Grid, Modal } from 'antd-mobile'

import styles from './index.module.scss'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/mycollect' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/myrent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity' },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 背景图
const BG = BASE_URL + '/img/profile/bg.png'

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

class My extends React.Component {
  state = {
    isLogin: isAuth(),
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }
  render() {
    const { history } = this.props
    const {
      isLogin,
      userInfo: { avatar, nickname }
    } = this.state

    return (
      <div className={styles.my}>
        {/* 背景图 */}
        <img src={BG} alt="" />

        {/* 信息面板 */}
        <div className={styles.infoBoard}>
          <div className={styles.avatar}>
            <img src={avatar || DEFAULT_AVATAR} alt="" />
          </div>
          <span>{nickname || '游客'}</span>
          {isLogin ? (
            <>
              <button onClick={() => this.logout()}>退出</button>
              <p>
                <i>编辑个人资料</i>
                <i className="iconfont icon-arrow"></i>
              </p>
            </>
          ) : (
            <button onClick={() => history.push('/login')}>去登录</button>
          )}
        </div>

        {/* 菜单 */}
        <Grid
          className={styles.menus}
          data={menus}
          columnNum={3}
          square={false}
          hasLine={false}
          renderItem={item => (
            <div
              className={styles.menuItem}
              onClick={() => this.toMenu(item.to)}
            >
              <i className={`iconfont ${item.iconfont}`}></i>
              <div>{item.name}</div>
            </div>
          )}
        />

        {/* 广告 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }

  // 获取用户信息
  getUserInfo = () => {
    return API.get('/user')
  }

  // 初始化
  init = async () => {
    // 是否有token
    if (!this.state.isLogin) return

    // 根据token获取信息
    const { data: res } = await this.getUserInfo()
    console.log(res)

    // token无效
    if (res.status !== 200) {
      return this.setState({
        isLogin: false
      })
    }

    // token有效
    const { avatar, nickname } = res.body
    this.setState({
      userInfo: {
        avatar: BASE_URL + avatar,
        nickname
      }
    })
  }

  // 退出
  logout = () => {
    const alert = Modal.alert
    alert('提示', '是否确定退出?', [
      { text: '取消' },
      {
        text: '确定',
        onPress: async () => {
          await API.post('/user/logout')
          removeToken()
          this.setState({
            isLogin: false,
            userInfo: {}
          })
        }
      }
    ])
  }

  // 进入到对应菜单
  toMenu = async path => {
    // 菜单是否有对应路由
    if (!path) return
    
    // 已登录，进入对应菜单项
    if (this.state.isLogin) return this.props.history.push(path)
    
    // 未登录，提升登录
    const alert = Modal.alert
    alert('提示', '您还没有进行登录，是否现在登录？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: async () => this.props.history.push(path)
      }
    ])
  }

  componentDidMount() {
    this.init()
  }
}

export default My
