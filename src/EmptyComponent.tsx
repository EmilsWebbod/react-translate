import * as React from 'react';
import { CSSProperties, FormEvent, useState } from 'react';
import Translate, { Empty } from '@ewb/translate';
import Button from './components/Button';
import Flex from './components/Flex';
import Input from './components/Input';
import { saveTextsToFile, saveWordsToFile } from './utils/file';
import { LOCALE_OBJECT } from './utils/settings';

interface EmptyProps {
  translate: Translate;
  empty: Empty;
}

const style: CSSProperties = {
  position: 'fixed',
  width: '400px',
  minHeight: '200px',
  right: '25px',
  bottom: '25px',
  border: '1px solid black',
  padding: '1rem'
};

export default function EmptyComponent({
  translate,
  empty
}: EmptyProps) {
  const [trans, setTrans] = useState(LOCALE_OBJECT);
  const [busy, setBusy] = useState(false);
  
  return (
    <form style={style} onSubmit={handleSave}>
      <Flex flexDirection="column" justifyContent="space-between" minHeight="200px">
        <Flex>
          <h4 style={{ margin: 0 }}>Add: {empty.addWord}</h4>
        </Flex>
        
        {Object.keys(trans).map(x => (
          <Input
            label={x}
            key={x}
            value={trans[x]}
            onChange={e => {
              setTrans({...trans, [x]: e.target.value });
            }}
            required
          />
        ))}
        <Flex justifyContent="flex-end">
          <Button disabled={busy}>{busy ? 'Busy...' : 'Add'}</Button>
        </Flex>
      </Flex>
    </form>
  );
  
  async function handleSave(e: FormEvent) {
    e.preventDefault();
    empty.add(trans);
    setBusy(true);
    
    if (empty.isTreeText) {
      const texts = translate.exportTexts();
      await saveTextsToFile(texts);
    } else {
      const words = translate.exportWords();
      await saveWordsToFile(words);
    }
    
    setBusy(false);
  }
}


