import React from 'react'
import PropTypes from 'prop-types'

// withRouter 源自于react-router-dom自带的高阶组件
// 可以把不是通过路由切换过来的组件中，将react-router的history、location、match三个对象传入到props上
import { withRouter } from 'react-router-dom'

import { NavBar, Icon } from 'antd-mobile'

// import './index.scss'

// [name].module.css/less/scss
import styles from './index.module.scss'
// console.log(styles) // [name].module.css/less/scss 中的类名都会被当做key存入这个对象 value为[filename]\_[classname]\_\_[hash]格式

const Nav = ({ children, history, onLeftClick, navWrapClass, navContentClass, rightContent }) => {
  // 默认事件 -> 回退
  const defaultLeftClick = () => history.go(-1)
  return (
    <div className={[styles.navbar, navWrapClass].join(' ')}>
      <NavBar
        className={navContentClass}
        mode="light"
        icon={<Icon type="left" />}
        // 如果传入了其他事件，则执行其他事件
        onLeftClick={onLeftClick || defaultLeftClick}
        rightContent={rightContent}
      >
        {children}
      </NavBar>
    </div>
  )
}

// 为props添加校验规则，方便后人乘凉
Nav.propTypes = {
  children: PropTypes.node.isRequired,
  onLeftClick: PropTypes.func
}

export default withRouter(Nav)
