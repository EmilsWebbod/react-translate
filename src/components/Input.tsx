import * as React from 'react';
import { CSSProperties, useState } from 'react';
import Flex from './Flex';
import Button from './Button';
import Error from './Error';
import getGoogleTranslation, { VALID_GOOGLE_LOCALES } from '../utils/google';

interface Props {
  value: string;
  label: string;
  onChange: (value: string) => void;
  googleTranslate?: {
    source: VALID_GOOGLE_LOCALES;
    target: VALID_GOOGLE_LOCALES;
    word: string;
  };
  required?: boolean;
}

export default function Input({
  value,
  label,
  googleTranslate,
  onChange,
  required
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const style: CSSProperties = {
  
  };
  
  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between">
        <label>{label}</label>
        <Button type="button" onClick={handleGoogleTranslate} small>
          Google translate
        </Button>
      </Flex>
      <input value={value} onChange={e => onChange(e.target.value)} style={style} required={required} />
      {error && <Error error={error} />}
    </Flex>
  );
  
  async function handleGoogleTranslate() {
    if (!googleTranslate) {
      return;
    }
    
    try {
      const translation = await getGoogleTranslation(
        googleTranslate.source,
        googleTranslate.target,
        googleTranslate.word
      );
      onChange(translation);
    } catch (e) {
      setError(e);
    }
  }
}
