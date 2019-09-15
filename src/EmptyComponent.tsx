import * as React from 'react';
import { CSSProperties, FormEvent, useMemo, useState } from 'react';
import Translate, { Empty, Translations } from '@ewb/translate';
import Button from './components/Button';
import Flex from './components/Flex';
import Input from './components/Input';
import { saveTextsToFile, saveWordsToFile } from './utils/file';
import Suggestions from './components/Suggestions';
import { Settings } from './utils/settings';
import { VALID_LOCALES } from './utils/google';

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
  const settings = new Settings();
  const locales = settings.validLocales;
  const [trans, setTrans] = useState<Translations>(
    Object.keys(locales).reduce((obj, x) => ({ ...obj, [x]: '' }), {})
  );
  const [busy, setBusy] = useState(false);
  
  const suggestions = useMemo(() => empty.suggestions(), []);
  
  return (
    <form style={style} onSubmit={handleSave}>
      <Flex flexDirection="column" justifyContent="space-between" minHeight="200px">
        <h4 style={{ margin: 0 }}>Add: {empty.addWord}</h4>
        
        {Object.keys(locales).map((x) => (
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
              word: empty.addWord
            }}
          />
        ))}
        <Flex justifyContent="flex-end">
          <Button disabled={busy}>{busy ? 'Busy...' : 'Add'}</Button>
        </Flex>
      </Flex>
      <Suggestions suggestions={suggestions}/>
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


