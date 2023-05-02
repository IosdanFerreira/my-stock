import React from 'react';
import styles from './styles.module.scss';

export default function Loader() {
  return (
    <div className={styles.loader__wraper}>
      <span className={styles.loader}></span>
      <span className={styles.loader__text}>Carregando</span>
    </div>
  );
}
