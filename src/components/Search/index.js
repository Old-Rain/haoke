import React from 'react'
import PropTypes from 'prop-types'

import { getCurrentCity } from '../../utils'
import { Icon } from 'antd-mobile'
import './index.scss'

// 搜索框
class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      positionLabel: ''
    }
  }
  getPosition = async () => {
    const { label, value } = await getCurrentCity()
    this.setState({ positionLabel: label })
    this.props.setPositionValue(value)
  }
  render() {

    // map图标颜色、背景色和定位的默认值
    const mapIconColor = this.props.mapIconColor || '#ccc'
    const bgColor = this.props.bgColor || 'transparent'
    const position = this.props.position || 'fixed'
    return (
      <div className="search" style={{ background: bgColor, position }}>
        <div className="searchLeft">
          <div className="city" onClick={() => this.props.toPages('/citylist')}>
            <span>
              {this.state.positionLabel ? (this.state.positionLabel) : (<Icon type="loading" />)}
            </span>
            <i className="iconfont icon-arrow" />
          </div>
          <div
            className="magnify"
            onClick={() => this.props.toPages('/search')}
          >
            <i className="iconfont icon-seach" />
            <span>请输入小区或地址</span>
          </div>
        </div>
        <i
          className="iconfont icon-map"
          style={{ color: mapIconColor }}
          onClick={() => this.props.toPages('/showmap')}
        />
      </div>
    )
  }
  componentDidMount() {
    this.getPosition()
  }
  componentDidUpdate(prevProps, prevState) {}
}

Search.propTypes = {
  mapIconColor: PropTypes.string,
  bgColor: PropTypes.string,
  position: PropTypes.string
}

export default Search
