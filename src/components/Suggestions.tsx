import * as React from 'react';
import { CSSProperties } from 'react';
import Flex from './Flex';

interface Props {
  suggestions: string;
}

export default function Suggestions({
  suggestions
}: Props) {
  
  const style: CSSProperties = {
    position: 'absolute',
    top: '-225px',
    left: 0,
    width: '400px',
    minHeight: '100px',
    border: '1px solid black',
    borderRadius: '10px',
    padding: '1rem',
    background: 'white',
    zIndex: 100000000000
  };
  
  return suggestions ? (
    <div style={style}>
      <Flex flexDirection="column">
        <strong>Suggestions:</strong>
        { suggestions.slice(0, 250) }
      </Flex>
    </div>
  ) : <></>;
}
