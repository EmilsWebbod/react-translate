import * as React from 'react';
import { CSSProperties } from 'react';

interface Props extends JSX.ElementChildrenAttribute {
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
}

export default function Button({
  type,
  onClick,
  disabled,
  children,
  small
}: Props) {
  
  const style: CSSProperties = {
    padding: small ? '.25rem .25rem' : '.5rem 1rem',
    background: 'transparent',
    borderRadius: '10px',
    border: '1px solid green',
    cursor: 'pointer'
  };
  
  return (
    <button type={type} style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
