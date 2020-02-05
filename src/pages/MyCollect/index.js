import React from 'react'

import { Modal } from 'antd-mobile'
import { API } from '../../utils/api'

const alert = Modal.alert

class MyCollect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: true
    }
  }
  render() {
    return <div className="">我的收藏</div>
  }

  init = async () => {
    const { data: res } = await API.get('/user')
    if (res.status === 200) return
    const { history, location } = this.props
    alert('提示', '身份验证已过期，请重新登录', [
      { text: '取消', onPress: () => history.push('/home/my') },
      {
        text: '登录',
        onPress: () => history.push('/login', { from: location, reLogin: true })
      }
    ])
  }

  componentDidMount() {
    this.init()
  }
  componentDidUpdate(prevProps, prevState) {}
}

export default MyCollect
