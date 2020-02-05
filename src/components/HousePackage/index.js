import React from 'react'
import _ from 'lodash'

import { HOUSE_PACKAGE_LIST } from './HOUSE_PACKAGE_LIST'

import styles from './index.module.scss'

class HousePackage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      housePackageList: []
    }
  }

  render() {
    return (
      <div className={styles.wrap}>
        {this.state.housePackageList.map((item, index) => (
          <div
            className={[styles.item, item.isCheck ? styles.check : ''].join(
              ' '
            )}
            key={item.id}
            onClick={() => this.checkItem(index)}
          >
            <i className={['iconfont', item.icon].join(' ')}></i>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    )
  }

  init = () => {
    if (this.props.list) {
      // 房屋详情展示，使用处理后的数据
      let list = []
      this.props.list.forEach(item => {
        let queryItem = HOUSE_PACKAGE_LIST.find(item1 => item1.name === item)
        if (queryItem) {
          list.push(queryItem)
        }
      })
      this.setState({
        housePackageList: list
      })
    } else {
      // 房东发布房源，展示全部选项
      this.setState({
        housePackageList: _.cloneDeep(HOUSE_PACKAGE_LIST)
      })
    }
  }

  checkItem = index => {
    if (!this.props.isPublish) return

    let housePackageList = [...this.state.housePackageList]
    housePackageList[index].isCheck = !housePackageList[index].isCheck

    let selectList = []
    for (const item of housePackageList) {
      if (item.isCheck) {
        selectList.push(item.name)
      }
    }

    this.setState(
      () => ({ housePackageList }),
      () => {
        this.props.onSelect(selectList)
      }
    )
  }

  componentDidMount() {
    this.init()
  }
  componentDidUpdate(prevProps, prevState) {}
}

export default HousePackage
