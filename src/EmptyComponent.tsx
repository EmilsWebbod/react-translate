import * as React from 'react';
import { CSSProperties, FormEvent, useMemo, useState } from 'react';
import Translate, { Empty, ISO_639_1, Translations } from '@ewb/translate';
import Button from './components/Button';
import Flex from './components/Flex';
import { saveTextsToFile, saveWordsToFile } from './utils/file';
import Suggestions from './components/Suggestions';
import { LocaleObjectValue, Settings } from './utils/settings';
import TranslateInput from './components/TranslateInput';
import { getApiTranslations } from './utils/api';

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
  const locale = translate.defaultLocale as ISO_639_1;
  const settings = new Settings();
  const locales = settings.locales;
  const [trans, setTrans] = useState<Translations>(
    Object.keys(locales).reduce((obj, x) => ({ ...obj, [x]: '' }), {})
  );
  const [busy, setBusy] = useState(false);
  
  const suggestions = useMemo(() => empty.suggestions(), []);
  const localeKeys = Object.keys(locales) as Array<ISO_639_1>;
  
  return (
    <form style={style} onSubmit={handleSave}>
      <Flex flexDirection="column" justifyContent="space-between" minHeight="200px">
        <h4 style={{ margin: 0 }}>Add: {empty.word}</h4>
        {localeKeys.map((x) => {
          return (
            <TranslateInput
              translate={translate}
              branch={empty}
              locale={locales[x] as LocaleObjectValue}
              index={x}
              key={x}
              onChange={value => {
                setTrans({...trans, [x]: value });
              }}
              value={trans[x]}
            />
          )
        })}
        <Flex justifyContent="space-between">
          <div>{settings.apiServer && (
            <Button type="button" disabled={busy} onClick={checkApi}>Fra API</Button>
          )}</div>
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

    try {
      if (settings.apiServer) {
        await empty.toApi(locale);
      }

      if (empty.isTreeText) {
        const texts = translate.exportTexts();
        await saveTextsToFile(texts);
      } else {
        const words = translate.exportWords();
        await saveWordsToFile(words);
      }
    } catch (e) {
      alert(JSON.stringify(e));
      console.error(e);
    }

    setBusy(false);
  }

  async function checkApi() {
    setBusy(true);
    try {
      const translations = await getApiTranslations(empty, locale, localeKeys);
      setTrans(translations);
    } catch (e) {
      console.warn('No translations');
    }
    setBusy(false);
  }
}


