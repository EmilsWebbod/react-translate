import * as React from 'react';
import { CSSProperties, useEffect, useState } from 'react';
import Flex from './Flex';
import Button from './Button';

interface Props {
  error: string;
}

export default function Error({
  error
}: Props) {
  const [closed, setClosed] = useState(false);
  const style: CSSProperties = {
    position: 'absolute',
    right: '0',
    top: '-80px',
    width: '300px',
    height: '30px',
    border: '1px solid black',
    borderRadius: '10px',
    padding: '1rem',
    color: 'red'
  };
  
  useEffect(() => {
    setClosed(false);
  }, [error])
  
  return !closed ? (
    <div style={style}>
      <Flex justifyContent="space-between">
        Error: {error}
        <Button onClick={() => setClosed(true)}>Lukk</Button>
      </Flex>
    </div>
  ) : <></>;
}
