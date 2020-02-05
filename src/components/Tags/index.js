import React from 'react'
import styles from './index.module.scss'

const Tags = props => (
  <>
    {props.tags.map((tag, index) => {
      const t = (index % 3) + 1
      return (
        <span key={tag} className={`${styles.tag} ${styles['tag' + t]}`}>
          {tag}
        </span>
      )
    })}
  </>
)

Tags.defaultProps = {
  tags: []
}

export default Tags
