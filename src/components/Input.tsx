import * as React from 'react';
import { CSSProperties } from 'react';

interface Props {
  label: string;
}

export default function Input({label, ...props}: Props & React.InputHTMLAttributes<HTMLInputElement>) {
  
  const style: CSSProperties = {
  
  };
  
  return (
    <>
      <label>{label}</label>
      <input {...props} style={style} />
    </>
  )
}
