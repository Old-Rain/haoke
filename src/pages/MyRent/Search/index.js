import React from 'react'

import { API } from '../../../utils/api'
import { getCurrentCity } from '../../../utils'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.scss'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      result: [],
      notResult: false
    }
    this.timer = null
  }
  render() {
    const { result, notResult } = this.state
    const { history } = this.props
    return (
      <div className={styles.search}>
        <SearchBar
          placeholder="请输入关键词"
          value={this.state.keyword}
          onChange={this.onChange}
          ref={ref => (this.autoFocusInst = ref)}
          onCancel={() => history.replace('/myrent/publish')}
        />

        {/* 没有结果 */}
        {notResult ? (
          <div className={styles.notResult}>没有结果，换个关键词试试？</div>
        ) : (
          ''
        )}

        {/* 结果列表 */}
        {result.map(item => (
          <div
            key={item.community}
            className={styles.resultList}
            dangerouslySetInnerHTML={{ __html: item.enhanceCommunityName }}
            onClick={() => this.selectRes(item.community, item.communityName)}
          ></div>
        ))}
      </div>
    )
  }

  // 输入框改变
  onChange = keyword => {
    clearTimeout(this.timer)
    this.setState({ keyword, notResult: false })

    if (!keyword) return this.setState({ result: [], notResult: false })

    this.timer = setTimeout(async () => {
      const { value } = await getCurrentCity()
      const { data: res } = await API.get('/area/community', {
        params: {
          name: keyword,
          id: value
        }
      })
      // console.log(res)
      if (res.status !== 200) return

      // 关键词高亮处理
      let result = []
      for (const item of res.body) {
        item.enhanceCommunityName = item.communityName.replace(
          RegExp(keyword, 'g'),
          `<b>${keyword}</b>`
        )
        result.push(item)
      }
      // console.log(result)
      this.setState({
        result,
        notResult: keyword && !res.body.length
      })
    }, 500)
  }

  // 选择结果
  selectRes = (community, communityName) => {
    this.props.history.replace('/myrent/publish', { community, communityName })
  }

  componentDidMount() {
    this.autoFocusInst.focus()
  }
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
}

export default Search
