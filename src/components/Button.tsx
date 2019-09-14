import * as React from 'react';
import { CSSProperties } from 'react';

interface Props extends JSX.ElementChildrenAttribute {
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  onClick,
  disabled,
  children
}: Props) {
  
  const style: CSSProperties = {
    padding: '.5rem 1rem',
    background: 'transparent',
    borderRadius: '10px',
    border: '1px solid green',
    cursor: 'pointer'
  };
  
  return (
    <button style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
