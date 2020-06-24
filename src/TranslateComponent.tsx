import * as React from 'react';
import { CSSProperties, FormEvent, useState } from 'react';
import Translate, { Branch, ISO_639_1, Translations } from '@ewb/translate';
import Button from './components/Button';
import Flex from './components/Flex';
import { saveTextsToFile, saveWordsToFile } from './utils/file';
import { LocaleObjectValue, Settings } from './utils/settings';
import TranslateInput from './components/TranslateInput';
import { getApiTranslations } from './utils/api';

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
  const locale = translate.defaultLocale as ISO_639_1;
  const settings = new Settings();
  const locales = settings.locales;
  const [trans, setTrans] = useState<Translations>(
    Object.keys(locales).reduce((obj, x) => ({ ...obj, [x]: '' }), {})
  );
  const [busy, setBusy] = useState(false);
  const localeKeys = Object.keys(locales) as Array<ISO_639_1>;
  
  return (
    <form style={style} onSubmit={handleSave}>
      <Flex flexDirection="column" justifyContent="space-between" minHeight="200px">
        <Flex>
          <h4 style={{ margin: 0 }}>Translate: {branch.word}</h4>
        </Flex>
        {localeKeys.map((x) => {
          return (
            <TranslateInput
              translate={translate}
              locale={locales[x] as LocaleObjectValue}
              branch={branch}
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
    </form>
  );
  
  async function handleSave(e: FormEvent) {
    e.preventDefault();
    Object.keys(trans).forEach(x => {
      branch.addTranslation(x, trans[x]);
    });
    setBusy(true);

    if (settings.apiServer) {
      await branch.toApi(translate.defaultLocale as ISO_639_1);
    }

    if (branch.sentence) {
      const texts = translate.exportTexts();
      await saveTextsToFile(texts);
    } else {
      const words = translate.exportWords();
      await saveWordsToFile(words);
    }
    
    setBusy(false);
  }

  async function checkApi() {
    try {
      setBusy(true);
      const translations = await getApiTranslations(branch, locale, localeKeys);
      setTrans(translations);
      setBusy(false);
    } catch (e) {
      console.warn('No translations');
    }
  }
}


