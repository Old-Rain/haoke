import React from 'react'

import { Modal, Toast } from 'antd-mobile'

import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
import { isAuth } from '../../utils/token'

import NavBar from '../../components/NavBar'
import Swiper from '../../components/Swiper'
import Tags from '../../components/Tags'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import styles from './index.module.scss'

const BMap = window.BMap

// 基本信息组件
const BaseInfo = props => (
  <div className={styles.baseInfo}>
    <div className={styles.title}>{props.title}</div>
    <div className={styles.tagsWrap}>
      <Tags tags={props.tags} />
    </div>

    {/* 三大金刚信息 */}
    <div className={styles.info1}>
      <div className={styles.info1Item}>
        <div className={styles.info1Top}>
          {props.price}
          <span>/月</span>
        </div>
        <div className={styles.info1Bottom}>租金</div>
      </div>
      <div className={styles.info1Item}>
        <div className={styles.info1Top}>{props.roomType}</div>
        <div className={styles.info1Bottom}>房型</div>
      </div>
      <div className={styles.info1Item}>
        <div className={styles.info1Top}>{props.size}平米</div>
        <div className={styles.info1Bottom}>面积</div>
      </div>
    </div>

    {/* 某些信息 */}
    <div className={styles.info2}>
      {props.someData.map(item => (
        <div key={item.key} className={styles.info2Item}>
          <span>{item.key}：</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
)

// 地图
const Map = props => (
  <div className={styles.map}>
    <div className={styles.title}>
      小区：<span>{props.community}</span>
    </div>
    <div id="map" className={styles.content}></div>
  </div>
)

// 房屋配套
const Mating = props => (
  <div className={styles.house}>
    <div className={styles.title}>房屋配套</div>
    {props.supporting && props.supporting.length ? (
      <HousePackage list={props.supporting} />
    ) : (
      <div className={styles.content}>暂无数据</div>
    )}
    <div className={styles.line10px}></div>
  </div>
)

// 房源概况
const Status = props => (
  <div className={styles.house}>
    <div className={styles.title}>房源概况</div>
    <div className={styles.author}>
      <img src={BASE_URL + '/img/avatar.png'} alt="" />
      <div className={styles.attestation}>
        <p>王女士</p>
        <p>
          {' '}
          <i className="iconfont icon-auth"></i> 已认证房主
        </p>
      </div>
      <button>发信息</button>
    </div>
    <div className={styles.content}>{props.description || '暂无数据'}</div>
    <div className={styles.line10px}></div>
  </div>
)

// 猜你喜欢
const recommendHouses = [
  {
    houseCode: '5cc44ed41439630e5b3d5f20',
    houseImg: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    houseCode: '5cc450a81439630e5b3dcbff',
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    houseCode: '5cc46b491439630e5b43bf95',
    houseImg: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]
const Like = props => (
  <div className={styles.like}>
    <div className={styles.title}>猜你喜欢</div>
    <div className={styles.content}>
      {recommendHouses.map(item => (
        <HouseItem
          key={item.houseCode}
          item={item}
          onClick={() => {
            props.history.push('/detail/' + item.houseCode)
            props._ref.current.scrollTop = 0
            setTimeout(() => {
              props.update()
            }, 0)
          }}
        />
      ))}
    </div>
  </div>
)

// 底部3按钮
class BottomBtnX3 extends React.Component {
  state = {
    isCollect: false 
  }

  render() {
    const { isCollect } = this.state
    return (
      <div className={styles.bottomBtnX3}>
        <div className={styles.bottomBtnItem} onClick={this.collect}>
          <img
            src={BASE_URL + (isCollect ? '/img/star.png' : '/img/unstar.png')}
            alt=""
          ></img>
          {isCollect ? '已收藏' : '收藏'}
        </div>
        <div className={styles.bottomBtnItem}>在线咨询</div>
        <div className={styles.bottomBtnItem}>电话预约</div>
      </div>
    )
  }

  // 检查是否收藏
  checkCollect = async () => {
    if (!isAuth()) return
    const { id } = this.props.match.params
    const { data: res } = await API.get(`/user/favorites/${id}`)
    // console.log(res)
    if (res.status !== 200 || !res.body.isFavorite) return
    this.setState({
      isCollect: true
    })
  }

  // 收藏/取消
  collect = async () => {
    if (!this.state.isCollect) {
      if (!isAuth()) return this.errorModal('登录后才能收藏房源，是否去登录？')
      const { data: res } = await API.post(`/user/favorites/${this.props.match.params.id}`)
      if (res.status !== 200) return this.errorModal('身份验证失效，请重新登录')
      await this.setState({ isCollect: true })
      Toast.success('收藏成功！', 1.5)
    } else {
      const { data: res } = await API.delete(`/user/favorites/${this.props.match.params.id}`)
      if (res.status !== 200) return this.errorModal('身份验证失效，请重新登录')
      this.setState({ isCollect: false })
      Toast.success('删除成功！', 1.5)
    }
  }

  // 错误对话框
  errorModal = tip => {
    Modal.alert('提示', tip, [
      { text: '取消' },
      { text: '登录', onPress: () => this.props.history.push('/login') }
    ])
  }
  
  componentWillMount() {
    this.checkCollect()
  }
}

// 详情页面根组件
class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgData: [],
      isLoading: false,
      someData: [
        { key: '装修', value: '精装' },
        { key: '朝向', value: '东南 南' },
        { key: '楼层', value: '中层' },
        { key: '类型', value: '普通住宅' }
      ],
      otherData: {}
    }
    this.detailRef = React.createRef()
  }

  render() {
    const { imgData, isLoading, someData } = this.state
    const {
      community,
      title,
      tags,
      price,
      roomType,
      size,
      coord,
      supporting,
      description
    } = this.state.otherData
    return (
      <div className={styles.detail} ref={this.detailRef}>
        <div style={{ position: 'relative' }}>
          <NavBar
            navWrapClass={styles.navWrap}
            navContentClass={styles.navContent}
            rightContent={<i className="iconfont icon-share"></i>}
          >
            <span style={{ color: '#fff' }}>{community}</span>
          </NavBar>
          <Swiper height={211} data={imgData} isLoading={isLoading} />
        </div>
        <BaseInfo
          title={title}
          tags={tags}
          price={price}
          roomType={roomType}
          size={size}
          someData={someData}
        />
        <Map community={community} coord={coord} />
        <Mating supporting={supporting} />
        <Status description={description} />
        <Like {...this.props} _ref={this.detailRef} update={this.init} />
        <BottomBtnX3 {...this.props} />
      </div>
    )
  }

  // 初始化
  init = async () => {
    await this.getHouseDetail()
    this.drawMap()
  }

  // 获取房屋信息
  getHouseDetail = async () => {
    console.log(this.props)

    const { id } = this.props.match.params
    const { data: res } = await API.get(`/houses/${id}`)
    console.log(res)

    // 处理轮播图
    let imgData = []
    for (const item of res.body.houseImg) {
      imgData.push({
        id: item,
        imgSrc: item
      })
    }

    // 处理某些信息
    let someData = [...this.state.someData]

    someData.forEach(item => {
      if (item.key === '楼层') {
        item.value = res.body['floor']
      } else if (item.key === '朝向') {
        item.value = res.body['oriented'].join(' ')
      }
    })
    // res.body.supporting = ['沙发', '空调', '热水器']
    this.setState({
      otherData: res.body,
      imgData,
      isLoading: true,
      someData
    })
  }

  // 绘制地图
  drawMap = () => {
    const {
      community,
      coord: { longitude, latitude }
    } = this.state.otherData
    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label()
    label.setStyle({
      padding: '0 8px',
      borderRadius: '2px',
      background: 'rgb(238, 93, 91)',
      lineHeight: '22px',
      color: '#fff'
    })
    label.setContent(`
      <span>${community}</span>
      <div class=${styles.sharp}></div>
    `)
    label.setPosition(point)
    label.setOffset(new BMap.Size(-16, -32))
    map.addOverlay(label)
  }

  componentDidMount() {
    this.init()
  }
}

export default Detail
