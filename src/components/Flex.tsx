import * as React from 'react';
import { CSSProperties } from 'react';

export default function Flex({ children, ...properties}: JSX.ElementChildrenAttribute & CSSProperties) {
  
  const style: CSSProperties = {
    display: 'flex',
    ...properties
  };
  
  return (
    <div style={style}>
      {children}
    </div>
  )
}
