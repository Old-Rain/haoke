import React from 'react'

import { PickerView } from 'antd-mobile'

import FooterButton from '../../../../components/FooterButton'

import styles from './index.module.scss'

class FilterPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.defaultValue
    }
  }
  changeValue = value => {
    this.setState({ value })
  }

  render() {
    const { onCancel, onSave, data, cols, openType } = this.props
    const { value } = this.state
    return (
      // <div className={[styles.picker, styles.show].join(' ')}>
      <div className={styles.picker}>
        <PickerView
          data={data} // picker数据源
          cols={cols} // 列数
          onChange={this.changeValue} // 改变事件参数为当前值
          value={value} // 当前值
        />
        <FooterButton
          onCancel={onCancel}
          onSave={() => onSave(openType, value)}
        ></FooterButton>
      </div>
    )
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
}

export default FilterPicker
