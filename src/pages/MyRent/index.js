import React from 'react'
import { Link } from 'react-router-dom'

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

import { Modal } from 'antd-mobile'

import NavBar from '../../components/NavBar'
import HouseItem from '../../components/HouseItem'

import styles from './index.module.scss'

class MyRent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }
  render() {
    const { list } = this.state
    const { history } = this.props
    return (
      <div className={styles.myRent}>
        <NavBar>我的出租</NavBar>
        <div className={styles.listWrap}>
          {list.length ? (
            <>
              {list.map(item => (
                <HouseItem
                  key={item.houseCode}
                  item={item}
                  onClick={() => history.push(`/detail/${item.houseCode}`)}
                />
              ))}
              <Link className={styles.add} to="/myrent/publish">
                添加
              </Link>
            </>
          ) : (
            <div className={styles.notHouse}>
              <img src={BASE_URL + '/img/not-found.png'} alt="" />
              <p>
                没有发布房源，去
                <Link className={styles.publish} to="/myrent/publish">
                  发布
                </Link>
                ~
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 初始化
  init = async () => {
    const { data: res } = await API.get('/user/houses')
    // console.log(res)
    if (res.status !== 200) {
      const { history, location } = this.props
      Modal.alert('提示', '身份验证已过期，请重新登录', [
        { text: '取消', onPress: () => history.push('/home/my') },
        {
          text: '登录',
          onPress: () =>
            history.push('/login', { from: location, reLogin: true })
        }
      ])
      return
    }
    this.setState({ list: res.body })
  }

  componentDidMount() {
    this.init()
  }
  componentDidUpdate(prevProps, prevState) {}
}

export default MyRent
