import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

class Sticky extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.placeholder = React.createRef()
    this.content = React.createRef()
  }
  sticky = () => {
    const { height } = this.props
    const placeholder = this.placeholder.current
    const content = this.content.current
    const top = placeholder.getBoundingClientRect().top
    // console.log(content.getBoundingClientRect()) // getBoundingClientRect 原生DOM API，用来获取DOM元素的宽高，坐标，偏移量等属性
    if (top <= 0) {
      placeholder.style.height = `${height}px`
      content.classList.add(styles.fixed)
    } else {
      placeholder.style.height = `0px`
      content.classList.remove(styles.fixed)
    }
  }
  render() {
    const { children } = this.props
    return (
      <div>
        <div ref={this.placeholder}></div>
        <div ref={this.content}>{children}</div>
      </div>
    )
  }
  componentDidMount() {
    window.addEventListener('scroll', this.sticky)
  }
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {
    window.removeEventListener('scroll', this.sticky)
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}

export default Sticky
