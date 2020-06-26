import * as React from 'react';
import { CSSProperties, FormEvent, useEffect, useState } from 'react';
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
  padding: '1rem',
  background: 'white',
  zIndex: 1000000000
};

export default function TranslateComponent({
  translate,
  branch
}: EmptyProps) {
  const locale = translate.defaultLocale as ISO_639_1;
  const settings = new Settings();
  const locales = settings.locales;
  const localeKeys = Object.keys(locales) as Array<ISO_639_1>;

  const [trans, setTrans] = useState<Translations>(
    localeKeys.reduce((obj, x) => ({ ...obj, [x]: branch.translations[x] || '' }), {})
  );
  const [busy, setBusy] = useState(false);
  const [apiTranslations, setApiTranslations] = useState<Translations>({});

  useEffect(() => {checkApi().then();}, []);
  
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
              translations={apiTranslations[x] ? apiTranslations[x].split(',') : []}
            />
          )
        })}
        <Flex justifyContent="flex-end">
          <Button disabled={busy}>{busy ? 'Busy...' : 'Add'}</Button>
        </Flex>
      </Flex>
    </form>
  );
  
  async function handleSave(e: FormEvent) {
    e.preventDefault();
    branch.addTranslations(trans);
    setBusy(true);
    try {
      if (settings.apiServer) {
        await branch.toApi(translate.defaultLocale as ISO_639_1);
      }
    } catch (e) {
      console.error(e);
    }

    try {
      if (branch.sentence) {
        const texts = translate.exportTexts();
        await saveTextsToFile(texts);
      } else {
        const words = translate.exportWords();
        await saveWordsToFile(words);
      }
    } catch (e) {
      console.error(e);
    }

    
    setBusy(false);
  }

  async function checkApi() {
    setBusy(true);
    try {
      const translations = await getApiTranslations(branch, locale, localeKeys);
      await setTrans(localeKeys.reduce((obj, key) => ({
        ...obj,
        key: translations[key] ? translations[key].split(',')[0] : trans[key]
      }), {}))
      setApiTranslations(translations);
    } catch (e) {
      console.warn('No translations');
    }
    setBusy(false);
  }
}


