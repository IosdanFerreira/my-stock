import React, { useState } from 'react';
import styles from './styles.module.scss';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface IPropsInput {
  id: string;
  name: string;
  label: string;
  onChange: (e: string | React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
}

export default function InputPasswordLogin({
  id,
  name,
  label,
  onChange,
  onBlur,
  value,
  placeholder,
}: IPropsInput) {

  const [type, setType] = useState('password');

  const handleMouseDown = () => {
    setType('text');
  };

  const handleMouseUp = () => {
    setType('password');
  };

  return (
    <div className={styles.input__container}>
      <span>{label}</span>

      <div className={styles.input__flex__container}>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
        <button 
          type="button" 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={styles.btn__show__password}>
          {type === 'password' ? (
            <AiOutlineEye />
          ) : (
            <AiOutlineEyeInvisible />
          )}
          
        </button>
      </div>
    </div>
  );
}
