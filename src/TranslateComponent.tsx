import { Branch } from '@ewb/translate';
import React, { CSSProperties, FormEvent, useState } from 'react';
import translate from './index';
import Button from './components/Button';
import Flex from './components/Flex';
import Input from './components/Input';
import { saveTextsToFile, saveWordsToFile } from './utils/file';
import { localeObject } from './utils/settings';

interface EmptyProps {
  branch: Branch;
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

export default function TranslateComponent({
  branch
}: EmptyProps) {
  const [trans, setTrans] = useState(localeObject);
  const [busy, setBusy] = useState(false);
  
  return (
    <form style={style} onSubmit={handleSave}>
      <Flex flexDirection="column" justifyContent="space-between" minHeight="200px">
        <Flex>
          <h4 style={{ margin: 0 }}>Translate: {branch.word}</h4>
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
    Object.keys(trans).forEach(x => {
      branch.addTranslation(x, trans[x]);
    });
    setBusy(true);
    
    if (branch.sentence) {
      const texts = translate.exportTexts();
      console.log(texts)
      await saveTextsToFile(texts);
    } else {
      const words = translate.exportWords();
      await saveWordsToFile(words);
    }
  }
}


