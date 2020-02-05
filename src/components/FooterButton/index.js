import React from 'react'

import styles from './index.module.scss'

const FooterButton = props => {
  const { reset } = props || false
  const { enterName } = props || '确定'
  const { wrapCSS, onCancel, onSave, onReset } = props
  return (
    <div className={[styles.dblBtn, wrapCSS].join(' ')}>
      {reset ? (
        <span className={styles.cancel} onClick={() => onReset()}>
          重置
        </span>
      ) : (
        <span className={styles.cancel} onClick={() => onCancel()}>
          取消
        </span>
      )}
      <span className={styles.enter} onClick={() => onSave()}>
        {enterName}
      </span>
    </div>
  )
}

export default FooterButton
