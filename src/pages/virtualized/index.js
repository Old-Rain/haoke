import React from 'react'
import { List as VList, AutoSizer } from 'react-virtualized'

import './index.css'

// import styles from './index.module.scss'
// console.log(styles)
const list = Array(100).fill('virtualized')
function rowRenderer({
  key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style // Style object to be applied to row (to position it)
}) {
  return (
    <div key={key} style={style}>
      {index + ' - ' + list[index] + ' - ' + isScrolling}
    </div>
  )
}

class VirtualizedList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="virtualizedlist">
        <AutoSizer>
          {({ width, height }) => (
            <VList
              width={width}
              height={height}
              rowCount={list.length}
              rowHeight={30}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
}

export default VirtualizedList
