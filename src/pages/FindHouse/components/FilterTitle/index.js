import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.scss'

const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mothed' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

class FilterTitle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { titleSelectorStatus, onTitleClick } = this.props
    // titleSelectorStatustitle项的状态
    // Filter传递的点击高亮事件

    return (
      <div className={styles.title}>
        <Flex justify="between" align="center">
          {titleList.map(x => {
            return (
              <Flex.Item key={x.type}>
                <span
                  className={titleSelectorStatus[x.type] ? styles.active : ''}
                  onClick={() => onTitleClick(x.type)}
                >
                  {x.title} <i className="iconfont icon-arrow"></i>
                </span>
              </Flex.Item>
            )
          })}
        </Flex>
      </div>
    )
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
}

export default FilterTitle
