import React from 'react'
// import axios from 'axios'
import { API } from '../../utils/api'

import { getCurrentCity } from '../../utils'

import { Toast } from 'antd-mobile'
import { List as VList, AutoSizer } from 'react-virtualized'

import Nav from '../../components/NavBar'
import './index.scss'

// 顶部导航
// class Nav extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {}
//   }
//   render() {
//     return (
//       <div className="navbar">
//         <NavBar
//           mode="light"
//           icon={<Icon type="left" />}
//           onLeftClick={() => this.props.history.go(-1)}
//         >
//           城市选择
//         </NavBar>
//       </div>
//     )
//   }
//   componentDidMount() {}
//   componentDidUpdate(prevProps, prevState) {}
// }

// const list = Array(100).fill('virtualized')
// function rowRenderer({
//   key, // Unique key within array of rows
//   index, // Index of row within collection
//   isScrolling, // The List is currently being scrolled
//   isVisible, // This row is visible within the List (eg it is not an overscanned row)
//   style // Style object to be applied to row (to position it)
// }) {
//   return (
//     <div key={key} style={style}>
//       {index + ' - ' + list[index] + ' - ' + isScrolling}
//     </div>
//   )
// }

// 数据格式化的方法
// list: [{}, {}]
const formatCityData = (list) => {
  const cityList = {}
  // const cityIndex = []

  // 1 遍历list数组
  list.forEach((item) => {
    // 2 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 3 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 4 如果有，直接往该分类中push数据
      // cityList[first] => [{}, {}]
      cityList[first].push(item)
    } else {
      // 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })

  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex,
  }
}

// 城市索引过滤器
const formatIndex = (i) => {
  switch (i) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return i.toUpperCase()
  }
}

// 城市索引高度
const INDEX_HEIGHT = 36

// 城市名称高度
const NAME_HEIGHT = 50

// 有房源的城市
const hasHouseInfoCity = ['北京', '上海', '广州', '深圳']

// 城市列表项
class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.listComponent = React.createRef()
    this.vListComponent = React.createRef()
  }

  // 获取城市列表
  getCityList = async () => {
    const { data: res } = await API.get('/area/city', { params: { level: 1 } }).catch((err) => err)
    // console.log(res)
    const { cityList, cityIndex } = formatCityData(res.body)
    const hotRes = await API.get('/area/hot')
    // console.log('热门城市数据：', hotRes)
    cityList['hot'] = hotRes.data.body
    // 将索引添加到 cityIndex 中
    cityIndex.unshift('hot')
    const currentCity = await getCurrentCity()
    cityList['#'] = [currentCity]
    cityIndex.unshift('#')
    console.log(cityList)
    console.log(cityIndex)
    // console.log(currentCity)
    this.props.init({ cityIndex, cityList })
  }

  // 切换城市
  changeCity = ({ label, value }) => {
    if (!hasHouseInfoCity.includes(label)) return Toast.info('暂无该城市的房源信息', 2)
    sessionStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
    this.props.history.go(-1)
  }

  // 城市列表数据项
  rowRenderer = ({
    key, // Unique key within array of rows 当前项的key
    index, // Index of row within collection 当前项的索引
    isScrolling, // The List is currently being scrolled 当前行是否正则滚动中
    isVisible, // This row is visible within the List (eg it is not an overscanned row) 当前行是否可见
    style, // Style object to be applied to row (to position it) 默认样式
  }) => {
    console.log('昂贵的计算');
    const { cityIndex, cityList } = this.props
    const _index = cityIndex[index]
    return (
      <div key={key} style={style} className="list-item">
        <div className="list-item-index">{formatIndex(_index)}</div>
        {cityList[_index].map((x) => (
          <div key={x.value} className="list-item-context" onClick={() => this.changeCity(x)}>
            {x.label}
          </div>
        ))}
      </div>
    )
  }

  // 城市列表项高度计算
  getRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.props

    // 每一项城市的数量 * 每个城市的高度 + 城市索引的高度
    return cityList[cityIndex[index]].length * NAME_HEIGHT + INDEX_HEIGHT
  }

  // 滚动带动索引
  onRowsRendered = ({ startIndex }) => {
    // console.log(overscanStartIndex, overscanStopIndex, startIndex, stopIndex)
    // 当前索引与滚动索引不同才会执行
    if (this.props.startIndex !== startIndex) {
      this.props.onRowsRendered(startIndex)
    }
  }

  // 滚动触底事件 这里不能用箭头函数，里面的this要指向DOM元素
  onPullUpBottom(e) {
    // console.log(e.target.scrollTop)
    // console.log(e.target.offsetHeight)
    // console.log(e.target.offsetHeight + e.target.scrollTop)
    // console.log(list.getElementsByClassName('ReactVirtualized__Grid__innerScrollContainer')[0].offsetHeight)
    let totalHeight = this.getElementsByClassName('ReactVirtualized__Grid__innerScrollContainer')[0].offsetHeight
    console.log(e.target.offsetHeight + e.target.scrollTop, totalHeight)
    if (e.target.offsetHeight + e.target.scrollTop >= totalHeight) {
      console.log('到底啦啦啦啦')
    }
  }

  render() {
    // console.log('索引项高亮发生变化我才会被打印 => List.render()')
    return (
      <div className="list" ref={this.listComponent}>
        {/* AutoSizer组件，设置当前组件盒子宽高与父元素相等 */}
        <AutoSizer>
          {({ width, height }) => (
            <VList
              ref={this.vListComponent}
              width={width} // 设置列表项所在盒子的宽高
              height={height}
              rowCount={this.props.cityIndex.length} // 设置总行数（这里的每行代表每个首字母索引的所有城市）
              rowHeight={this.getRowHeight} // 动态设置行高
              rowRenderer={this.rowRenderer} // 需要渲染内容
              onRowsRendered={this.onRowsRendered} // 滚动时返回列表项位置的4个索引
              scrollToAlignment="start" // 显示索引项定位到开始位置（顶部）
            />
          )}
        </AutoSizer>
      </div>
    )
  }
  async componentDidMount() {
    this.props.setVListComponent(this.vListComponent) // 将此ref传递给父组件需要在初始化之前
    await this.getCityList()
    let list = this.listComponent.current
    // console.log(list)
    // 终于拿到滚动高度了
    list.addEventListener('scroll', this.onPullUpBottom, true)
  }
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {
    let list = this.listComponent.current
    list.removeEventListener('scroll', this.onPullUpBottom, true)
  }
}

// 右侧城市索引
class CityIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { cityIndex, startIndex } = this.props
    return (
      <div className="city-index">
        <ul>
          {cityIndex.map((x, y) => {
            return (
              <li
                key={x}
                className={`city-index-item`}
                onClick={() => this.props.vListComponent.current.scrollToRow(y)}
              >
                <span className={startIndex === y ? 'active' : ''}>{x === 'hot' ? '热' : x.toUpperCase()}</span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
}

// 城市列表页根组件
class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityIndex: [],
      cityList: {},
      startIndex: 0,
    }
    this.vListComponent = {}
  }
  init = ({ cityIndex, cityList }) => {
    this.setState(() => {
      return { cityIndex, cityList }
    })
  }
  onRowsRendered = (startIndex) => {
    this.setState(() => {
      return { startIndex }
    })
  }
  setVListComponent = (v) => {
    this.vListComponent = v
  }
  render() {
    return (
      <div className="citylist">
        <Nav>城市选择</Nav>
        <List
          {...this.props}
          {...this.state}
          init={this.init}
          onRowsRendered={this.onRowsRendered}
          setVListComponent={this.setVListComponent}
        />
        <CityIndex {...this.props} {...this.state} vListComponent={this.vListComponent} />
      </div>
    )
  }
  componentDidMount() {}
  componentDidUpdate(prevProps) {}
}

export default CityList
