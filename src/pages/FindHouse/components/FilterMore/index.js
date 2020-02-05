import React from 'react'

import { Spring } from 'react-spring/renderprops'

import FooterButton from '../../../../components/FooterButton'

import styles from './index.module.scss'

class FilterMore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValue: this.props.defaultValue,
      showAnimate: ''
    }
  }

  // 点击激活
  active = value => {
    const { defaultValue } = this.state
    const index = defaultValue.findIndex(x => x === value)
    const newValue = [...defaultValue]
    // console.log(newValue.push(value))
    if (index === -1) {
      this.setState({ defaultValue: [...newValue, value] })
    } else {
      this.setState(() => {
        newValue.splice(index, 1)
        return { defaultValue: newValue }
      })
    }
  }

  // 重置
  onReset = () => {
    this.setState({ defaultValue: ['null'] })
  }

  render() {
    const { data, onCancel, onSave } = this.props
    const { showAnimate } = this.state
    return (
      // <div className={[styles.more/* , styles.show */].join(' ')}>
      <div className={styles.more}>
        <div className={[styles.aside, this.state.showAnimate].join(' ')}>
          {/* <div className={styles.aside}> */}
          <div className={styles.item}>
            {data.map(x => (
              <dl key={x.title}>
                <dt>{x.title}</dt>
                <dd>
                  {x.data.map(y => {
                    const { defaultValue } = this.state
                    const isSelected = defaultValue.some(z => z === y.value)
                    return (
                      <span
                        key={y.value}
                        className={isSelected ? styles.active : ''}
                        onClick={() => this.active(y.value)}
                      >
                        <i>{y.label}</i>
                      </span>
                    )
                  })}
                </dd>
              </dl>
            ))}
          </div>
          <FooterButton
            onReset={this.onReset}
            reset
            onSave={() => onSave('more', this.state.defaultValue)}
          ></FooterButton>
        </div>

        <Spring from={{ opacity: 0 }} to={{ opacity: showAnimate ? 1 : 0 }}>
          {props => (
            <div
              style={props}
              className={styles.mask}
              onClick={() => {
                this.setState({
                  showAnimate: ''
                })
                this.cancle = setTimeout(() => {
                  onCancel()
                }, 600)
              }}
            ></div>
          )}
        </Spring>
      </div>
    )
  }
  componentDidMount() {
    this.show = setTimeout(() => {
      this.setState({
        showAnimate: styles.show
      })
    }, 0)
  }
  componentWillUnmount() {
    clearTimeout(this.show)
    clearTimeout(this.cancle)
  }
}

export default FilterMore
