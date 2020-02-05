import React from 'react'

import { BASE_URL } from '../../utils/url'

import { Carousel, WingBlank } from 'antd-mobile'

import './index.scss'

class Swiper extends React.Component {
  state = {
    height: 0
  }

  setHeight = () => {
    let width = this.refs.swiper.offsetWidth
    this.setState({
      height:
        width >= 750
          ? this.props.height * 2
          : (width / 750) * this.props.height * 2
    })
  }

  render() {
    return (
      <div className="swiper" ref="swiper">
        {this.props.isLoading ? (
          <WingBlank>
            <Carousel autoplay infinite>
              {this.props.data.map(val => (
                <a
                  key={val.id}
                  className="swiper-img"
                  href="http://www.baidu.com"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: this.state.height
                      ? this.state.height + 'px'
                      : this.props.height + 'px'
                  }}
                >
                  <img
                    ref="swiperImg"
                    src={BASE_URL + val.imgSrc}
                    alt={val.alt}
                  />
                </a>
              ))}
            </Carousel>
          </WingBlank>
        ) : (
          ''
        )}
      </div>
    )
  }
  componentDidMount() {
    let width = document.documentElement.offsetWidth
    this.setState({
      height:
        width >= 750
          ? this.props.height * 2
          : (width / 750) * this.props.height * 2
    })
    window.addEventListener('resize', this.setHeight)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setHeight)
  }
}

export default Swiper
