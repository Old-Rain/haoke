import React from 'react'

import { List as VList, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'

import { Toast } from 'antd-mobile'

import { API } from '../../utils/api'
import { getCurrentCity } from '../../utils/index'

import Search from '../../components/Search'
import Filter from './components/Filter'
import Sticky from './components/Sticky'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'
import styles from './index.module.scss'

class FindHouse extends React.Component {
  constructor() {
    super()
    this.state = {
      positionValue: '', // 初始化当前城市code值
      list: [], // 初始化筛选结果
      count: 0, // 初始化筛选结果数量
      isLoading: false, // 判断是否加载中，控制空页面的显示
    }

    // 初始化filters
    this.filters = {}
  }
  setPositionValue = (value) => {
    this.setState(() => {
      return {
        positionValue: value,
      }
    })
  }
  toPages = (pahtname) => {
    this.props.history.push(pahtname)
  }

  // 获取筛选项并查询筛选结果
  onFilter = (filters) => {
    this.filters = filters
    this.searchHouses()
  }

  // 根据条件查询房源
  searchHouses = async () => {
    Toast.loading('正在加载', 0, null, true)
    this.state.isLoading = true
    const { value } = await getCurrentCity()
    const { data: res } = await API.get('/houses', {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    })

    console.log(res)
    
    const { list, count } = res.body
    this.state.isLoading = false
    Toast.hide()

    if (count !== 0) {
      Toast.info('共找到' + count + '套房源', 2, null, true)
    }

    this.setState({
      list,
      count,
    })
  }

  // 渲染房源list
  rowRenderer = ({
    key, // Unique key within array of rows 当前项的key
    index, // Index of row within collection 当前项的索引
    style, // Style object to be applied to row (to position it) 默认样式
  }) => {
    console.log('昂贵的计算');
    if (!this.state.list[index])
      // 如果list中当前索引项不存在，则渲染一个遮罩
      return (
        <div className={styles.mask} style={style} key={key}>
          <p></p>
        </div>
      )
    return (
      <HouseItem
        style={style}
        key={key}
        item={this.state.list[index]}
        onClick={() => this.toPages('/detail/' + this.state.list[index].houseCode)}
      />
    )
  }

  // 用来判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    // console.log(index)
    // console.log(!!this.state.list[index])
    // 通过索引判断当前行是否有数据
    return !!this.state.list[index]
  }

  // 获取更多行数据
  // 该方法需要返回一个promise，并且这个对象应该在数据加载完成时，来调用resolve让promise出于完成状态
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // startIndex = 通过isRowLoaded来计算出已完成渲染的最后一项的索引
    // stopIndex = startIndex + minimumBatchSize（InfiniteLoader中设置的每次加载数量）
    console.log(startIndex, stopIndex)
    const { value } = JSON.parse(sessionStorage.getItem('hkzf_city'))
    return new Promise((resolve) => {
      API.get('/houses', {
        params: {
          cityId: value,
          ...this.filters,
          start: startIndex,
          end: stopIndex,
        },
      }).then((res) => {
        console.log(res)

        // 将新获取的数据添加到list
        this.setState(() => {
          return {
            list: [...this.state.list, ...res.data.body.list],
          }
        })

        // 调用resolve，使promise处于完成状态
        resolve()
      })
    })
  }

  ScrollWrap = () => {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没找到您想要的房源，换个搜索条件试试~</NoHouse>
    }
    return (
      <div className={styles.scrollWrap}>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded} // 判断每一项是否完成渲染
          loadMoreRows={this.loadMoreRows} // 调用加载更多的函数
          rowCount={count} // 总行数
          minimumBatchSize={20} // 每次加载的数量
        >
          {/* 使用InfiniteLoader组件完成无限滚动 */}
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {/* 使Table或List组件能够基于窗口的滚动位置进行滚动的组件 */}
              {({ height, isScrolling, scrollTop }) => (
                <AutoSizer>
                  {/* 由于WindowScroller不提供宽度，所以需要使用AutoSizer提供宽度 */}
                  {({ width }) => (
                    <VList
                      ref={registerChild}
                      autoHeight
                      width={width} // 设置列表项所在盒子的宽高
                      height={height}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      onRowsRendered={onRowsRendered}
                      rowCount={count} // 设置总行数
                      rowHeight={120} // 动态设置行高
                      rowRenderer={this.rowRenderer} // 需要渲染内容
                      onRowsRendered={(index) => console.log('indexindexindex', index)} // 滚动时返回列表项位置的个索引
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.findhouse}>
        <Search
          {...this.props}
          {...this.state}
          setPositionValue={this.setPositionValue}
          toPages={this.toPages}
          bgColor={'#f2f2f2'}
          position={'static'}
        />
        <Sticky height={40}>
          {/* 对变化点进行封装 */}
          <Filter onFilter={this.onFilter} />
        </Sticky>
        <this.ScrollWrap />
      </div>
    )
  }
  componentDidMount() {
    this.searchHouses()
  }
  componentDidUpdate(prevProps) {}
}

export default FindHouse
