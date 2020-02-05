import React from 'react'
import { Link } from 'react-router-dom'
// import axios from 'axios'
import { API } from '../../utils/api'

import { Toast } from 'antd-mobile'

import Nav from '../../components/NavBar'
import HouseItem from '../../components/HouseItem'
import { getCurrentCity } from '../../utils'
import styles from './index.module.scss'

const BMap = window.BMap

class ShowMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      housesList: [], // 小区房屋数据列表
      shouwBoard: false // 显示房屋数据组件
    }
  }

  // 1.7 房屋信息面板jsx
  housesListBoard = () => {
    const { housesList, shouwBoard } = this.state
    return (
      <div
        className={`${styles.housesListBoard} ${
          shouwBoard ? styles.shouwBoard : ''
        }`}
      >
        <div className={styles.title}>
          <h1>房屋列表</h1>
          <Link to="/home/list">更多房源</Link>
        </div>
        <div className={styles.info}>
          {housesList.map(item => (
            <HouseItem
              key={item.houseCode}
              item={item}
              onClick={() =>
                this.props.history.push(`/detail/${item.houseCode}`)
              }
            />
          ))}
        </div>
      </div>
    )
  }

  // 1.6 渲染房屋数据列表
  getHouseList = async id => {
    Toast.loading('加载中……', 0)
    try {
      const { data: res } = await API.get('/houses', {
        params: { cityId: id }
      })
      Toast.hide()
      console.log(res)
      this.setState(() => {
        return {
          housesList: res.body.list,
          shouwBoard: true
        }
      })
    } catch (error) {
      Toast.hide()
      Toast.fail('加载失败', 2)
    }
  }

  // 1.5 根据类型做出不同的渲染
  label = (subPoint, _label, count, value, type) => {
    const opts = {
      position: subPoint, // 指定文本标注所在的地理位置
      offset:
        type === 'circle' ? new BMap.Size(-35, -35) : new BMap.Size(-50, -26) //设置文本偏移量
    }
    const label = new BMap.Label('', opts) // 创建文本覆盖物

    // 给每个lebel添加一个唯一标识
    label.id = value

    // 清除一些默认样式
    label.setStyle({
      padding: 0,
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    })

    // 文本覆盖物内容
    label.setContent(`
      <div class=${styles[type]}>
        <p>${_label}</p>
        <p>${count}套</p>
      </div>
    `)
    return label
  }

  // 1.4.2 渲染rect覆盖物
  createRect = (subPoint, _label, count, value) => {
    const label = this.label(subPoint, _label, count, value, 'rect')

    // 覆盖物点击事件
    label.addEventListener('click', e => {
      // 渲染房屋数据列表
      this.getHouseList(value)

      // 调用百度地图panBy()移动点击位置到中心点
      const { pageX, pageY } = e.changedTouches[0]
      const X = window.innerWidth / 2 - pageX
      const Y = window.innerHeight / 4 - pageY
      this.map.panBy(X, Y)
    })
    this.map.addOverlay(label) // 绘制覆盖物
  }

  // 1.4.1 渲染circle覆盖物
  createCircle = (subPoint, _label, count, value, zoom) => {
    const label = this.label(subPoint, _label, count, value, 'circle')

    // 覆盖物点击事件
    label.addEventListener('click', () => {
      this.renderOverlays(value)
      this.map.centerAndZoom(subPoint, zoom)
      // 异步清除地图上的覆盖物，不然百度地图会报错，虽然没什么影响
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
    })
    this.map.addOverlay(label) // 绘制覆盖物
  }

  // 1.3 创建覆盖物渲染方法
  createOverlay = (item, zoom, type) => {
    const {
      coord: { latitude, longitude },
      label: _label,
      count,
      value
    } = item
    const subPoint = new BMap.Point(longitude, latitude)
    if (type === 'circle') {
      this.createCircle(subPoint, _label, count, value, zoom)
    } else if (type === 'rect') {
      this.createRect(subPoint, _label, count, value)
    }
  }

  // 1.2 根据当前缩放级别，设置覆盖物类型和下一级缩放级别
  getMapZoom = () => {
    // console.log('当前级别', this.map.getZoom())
    const zoom = this.map.getZoom()
    let nextZoom = 0,
      type = ''
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14) {
      type = 'rect'
    }
    return { nextZoom, type }
  }

  // 1.1 获取参数id，根据id获取房源数据
  renderOverlays = async id => {
    // 使用antd的轻提示组件优化用户体验
    Toast.loading('加载中……', 0)
    try {
      const { data: res } = await API.get('/area/map', {
        params: { id }
      })
      Toast.hide()
      console.log(res)
      const { nextZoom, type } = this.getMapZoom()
      res.body.forEach(item => {
        this.createOverlay(item, nextZoom, type)
      })
    } catch (error) {
      Toast.hide()
      Toast.fail('加载失败', 2)
    }
  }

  init = async () => {
    const { label, value } = await getCurrentCity()

    // React脚手架不识别第三方挂载的全局对象,需要在前面加上window
    // var map = new window.BMap.Map('container') // 由于new window.BMap经常使用，所以在最开始直接就赋值给BMap常量
    const map = new BMap.Map('container')
    this.map = map
    const myGeo = new BMap.Geocoder()

    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label, // 传入详细地址，虽然这里不详细
      point => {
        if (point) {
          // console.log(point)
          map.centerAndZoom(point, 11) // 设置中心的
          map.addControl(new BMap.ScaleControl()) // 比例尺控件
          map.addControl(new BMap.NavigationControl()) // 缩放控件

          this.renderOverlays(value)
        }
      },
      label // 这里传入行政区域名称
    )

    // 地图移动事件 - 隐藏房屋数据组件
    map.addEventListener('touchmove', () => {
      // 条件判断，减少一些压力
      if (this.state.shouwBoard) {
        this.setState({
          shouwBoard: false
        })
      }
    })
  }

  render() {
    return (
      <div className={styles.map}>
        <Nav>地图找房</Nav>
        <div id="container" className={styles.container}></div>
        {this.housesListBoard()}
      </div>
    )
  }

  componentDidMount() {
    this.init()
  }
}

export default ShowMap
