import React from 'react'

import { API } from './../../../../utils/api'
import { getCurrentCity } from '../../../../utils/index'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { Spring } from 'react-spring/renderprops'

import styles from './index.module.scss'

// 初始筛选项高亮状态
const titleSelectorStatus = {
  area: false,
  mothed: false,
  price: false,
  more: false
}

// 初始picker默认值
const defaultValue = {
  area: ['area', 'null'],
  mothed: ['null'],
  price: ['null'],
  more: []
}

class Filter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      titleSelectorStatus,
      openType: '',
      filterData: {},
      defaultValue
    }
  }

  // 获取城市房源信息
  init = async () => {
    const { value } = await getCurrentCity()
    const { data: res } = await API.get('/houses/condition', {
      params: { id: value }
    })
    // console.log(res)
    this.setState({
      filterData: res.body
    })
  }

  // 封装渲染picker的函数
  renderPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      defaultValue
    } = this.state
    if (openType !== 'area' && openType !== 'mothed' && openType !== 'price')
      return null
    let data = [],
      cols = 0
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mothed':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }
    return (
      <FilterPicker
        /*
					在前面三个标签之间来回切换时候，默认选中值不会生效，当点击确定，重新打开FilterPicker组件时候，才会生效

					分析：两种操作方式的区别在于有没有重新创建FilterPicker组件，重新创建的时候，会生效，不重新创建，不会生效
					原因：不重新创建FilterPicker组件时，不会再次执行state初始化，也就拿不到最新的props
					解决方式：给FilterPicker组件添加key值为openType，这样，在不同标题之间切换时候，key值都不相同，React内部会在key不同时候，重新创建该组件
					<FilterPicker
						key={openType}
						...
					/>
				*/
        key={openType} // 添加唯一标识，这样一个组件就变成了伪3个组件，每次props更新时都会重新进行渲染
        onCancel={this.onCancel}
        onSave={this.onSave}
        openType={openType}
        defaultValue={defaultValue[openType]}
        data={data}
        cols={cols}
      />
    )
  }

  // 渲染封装mask的函数
  renderMask = () => {
    const { openType } = this.state
    const opacity = openType === 'more' || openType === '' ? 0 : 1
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity }}>
        {props => {
          if (props.opacity === 0) return null
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel()}
            ></div>
          )
        }}
      </Spring>
    )
  }

  // 传递给FilterPicked 取消按钮 隐藏picker
  onCancel = () => {
    this.setTitleHigh()
    this.setState({ openType: '' })
  }

  // 传递给FilterPicked 确认按钮 获取picker中选中项的值 隐藏picker
  onSave = (openType, value) => {
    this.setState(
      () => ({
        openType: '',
        defaultValue: {
          ...this.state.defaultValue,
          [openType]: value
        }
      }),
      () => {
        this.setTitleHigh()

        // 获取当前所选条件
        const { area, mothed, price, more } = this.state.defaultValue
        const filters = {}

        // 区域
        const areaKey = area[0]
        let areaValue = 'null'
        if (area.length === 3) {
          areaValue = area[2] === 'null' ? area[1] : area[2]
        }
        filters[areaKey] = areaValue

        // 方式
        filters.mothed = mothed[0]

        // 价格
        filters.price = price[0]

        // 更多筛选条件
        filters.more = more.join(',')

        this.props.onFilter(filters)
      }
    )
  }

  // 传递给FilterTitle 点击高亮 并显示picker
  onTitleClick = type => {
    this.setTitleHigh(type)
    this.setState({ openType: type })
  }

  // FilterTitle高亮
  setTitleHigh = type => {
    const { titleSelectorStatus, defaultValue } = this.state
    const newTitleSelectorStatus = {}
    const titleList = Object.keys(titleSelectorStatus)
    for (const i of titleList) {
      if (i === 'area') {
        if (defaultValue[i].length !== 2 || defaultValue[i][0] !== 'area') {
          newTitleSelectorStatus[i] = true
        } else {
          newTitleSelectorStatus[i] = false
        }
      } else if (i === 'mothed' || i === 'price') {
        if (defaultValue[i][0] !== 'null') {
          newTitleSelectorStatus[i] = true
        } else {
          newTitleSelectorStatus[i] = false
        }
      } else if (i === 'more') {
        if (defaultValue[i].length >= 1) {
          newTitleSelectorStatus[i] = true
        } else {
          newTitleSelectorStatus[i] = false
        }
      }
    }
    if (type) {
      newTitleSelectorStatus[type] = true
    }

    this.setState(() => {
      return {
        titleSelectorStatus: newTitleSelectorStatus
      }
    })
  }

  // 封装渲染more的函数
  renderMore = () => {
    const {
      openType,
      filterData: { roomType, oriented, floor, characteristic }
    } = this.state

    if (openType !== 'more') return null

    const _roomType = {
      title: '户型',
      data: roomType
    }
    const _oriented = {
      title: '朝向',
      data: oriented
    }
    const _floor = {
      title: '楼层',
      data: floor
    }
    const _characteristic = {
      title: '房屋亮点',
      data: characteristic
    }

    const data = [_characteristic, _floor, _oriented, _roomType]
    return (
      <FilterMore
        data={data}
        onCancel={this.onCancel}
        defaultValue={this.state.defaultValue['more']}
        onSave={this.onSave}
      />
    )
  }

  render() {
    const { titleSelectorStatus /* , openType  */ } = this.state
    return (
      // <React.Fragment></React.Fragment>只作为一个空的根容器，不会在页面渲染出任何标签
      // <></>是React.Fragment的语法糖
      <div className={styles.filter}>
        <FilterTitle
          titleSelectorStatus={titleSelectorStatus}
          onTitleClick={this.onTitleClick}
        />
        {this.renderPicker()}
        {this.renderMore()}
        {this.renderMask()}
      </div>
    )
  }
  componentDidMount() {
    this.init()
  }
}

export default Filter
