import * as React from 'react';
import { CSSProperties, FormEvent, useState } from 'react';
import Translate, { Branch, Translations } from '@ewb/translate';
import Button from './components/Button';
import Flex from './components/Flex';
import Input from './components/Input';
import { saveTextsToFile, saveWordsToFile } from './utils/file';
import { Settings } from './utils/settings';
import { VALID_LOCALES } from './utils/google';

interface EmptyProps {
  translate: Translate;
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
  translate,
  branch
}: EmptyProps) {
  const settings = new Settings();
  const locales = settings.validLocales;
  const [trans, setTrans] = useState<Translations>(
    Object.keys(locales).reduce((obj, x) => ({ ...obj, [x]: '' }), {})
  );
  const [busy, setBusy] = useState(false);
  
  return (
    <form style={style} onSubmit={handleSave}>
      <Flex flexDirection="column" justifyContent="space-between" minHeight="200px">
        <Flex>
          <h4 style={{ margin: 0 }}>Translate: {branch.word}</h4>
        </Flex>
        
        {Object.keys(locales).map(x => (
          <Input
            label={locales[x as VALID_LOCALES] || ''}
            key={x}
            value={trans[x]}
            onChange={value => {
              setTrans({...trans, [x]: value });
            }}
            required
            googleTranslate={{
              source: translate.defaultLocale as VALID_LOCALES,
              target: x as VALID_LOCALES,
              word: branch.word
            }}
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
      await saveTextsToFile(texts);
    } else {
      const words = translate.exportWords();
      await saveWordsToFile(words);
    }
    
    setBusy(false);
  }
}


