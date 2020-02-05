import React from 'react'
import PropTypes from 'prop-types'

import { BASE_URL } from '../../utils/url'
import styles from './index.module.scss'

const NoHouse = ({ children }) => {
  return (
    <div className={styles.noHouse}>
      <img src={BASE_URL + '/img/not-found.png'} alt="没房" />
      <p>{children}</p>
    </div>
  )
}

NoHouse.propTypes = {
  children: PropTypes.string
}

export default NoHouse
