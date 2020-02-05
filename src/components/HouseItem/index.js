import React from 'react'
import { BASE_URL } from '../../utils/url'
import Tags from '../Tags'
import styles from './index.module.scss'

const HouseItem = props => {
  const { item, onClick, style } = props
  return (
    <dl className={styles.dl} style={style ? style : {}} onClick={() => onClick && onClick()}>
      <dt>
        <img src={BASE_URL + item.houseImg} alt="" />
      </dt>
      <dd>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <Tags tags={item.tags} />
        <div className={styles.price}>
          <span>{item.price}</span> 元/月
        </div>
      </dd>
    </dl>
  )
}

export default HouseItem
