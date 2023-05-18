import React, { ChangeEvent } from 'react';
import styles from './styles.module.scss';

import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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

export default function InputMoneyMask({
  id,
  name,
  label,
  type,
  onChange,
  onBlur, 
  value, 
  placeholder,
}: IPropsInput) {

  const currentMask = createNumberMask({
    prefix: 'R$',
    sufix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    integerLimit: 13,
    allowNegative: false,
    allowLeadingZeroes: false
  });

  return (
    <div className={styles.input__container}>
      <span>{label}</span>
      <MaskedInput
        mask={currentMask}
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
