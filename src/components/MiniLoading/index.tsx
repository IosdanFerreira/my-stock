import React from 'react';
import styles from './styles.module.scss';

export default function MiniLoading() {
  return (
    <div className={styles.spinner_wrapper}>
      <div className={styles.mini__loader}></div>
    </div>
  );
}
