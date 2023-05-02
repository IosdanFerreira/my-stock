import React from 'react';
import Alert from 'react-bootstrap/Alert';

import styles from './styles.module.scss';

// icons
import {AiFillCloseCircle} from 'react-icons/ai';

interface IAlertProps {
    message: string;
}

export default function AlertErrorMessage({ message}: IAlertProps) {
  return (
    <Alert className={styles.alert}  variant='danger'>
      {message}
    </Alert>
  );
}
