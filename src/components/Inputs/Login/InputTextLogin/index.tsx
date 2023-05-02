import React, { ChangeEvent } from 'react';
import styles from './styles.module.scss';

interface IPropsInput {
  id: string;
  name: string;
  label: string;
  type: string;
  onChange: (e: string | React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
}

export default function InputTextLogin({
  id,
  name,
  label,
  type,
  onChange,
  onBlur, 
  value, 
  placeholder,
}: IPropsInput) {

  return (
    <div className={styles.input__container}>
      <span>{label}</span>
      <input 
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </div>
  );
}
