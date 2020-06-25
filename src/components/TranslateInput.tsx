import * as React from 'react';
import { LocaleObjectValue } from '../utils/settings';
import Input from './Input';
import { VALID_GOOGLE_LOCALES } from '../utils/google';
import Translate, { Branch, Empty, ISO_639_1 } from '@ewb/translate';
import Flex from './Flex';

interface Props {
  translate: Translate;
  branch: Empty | Branch;
  value: string;
  index: ISO_639_1;
  locale: LocaleObjectValue;
  onChange: (value: string) => void;
  translations: string[];
}

export default function TranslateInput({
  translate,
  branch,
  locale,
  onChange,
  value,
  index,
  translations
}: Props) {
  const label = locale.label || index;
  const googleLocale = locale.googleLocale;
  return (
    <Flex flexDirection="column">
      <Input
        label={label}
        value={value}
        onChange={onChange}
        required
        googleTranslate={googleLocale ? {
          source: translate.defaultLocale as VALID_GOOGLE_LOCALES,
          target: googleLocale,
          word: branch.word
        } : undefined}
      />
      <Flex>
        {translations.map((translation, i) => translation !== value ? (
          <button
            key={translation + i}
            type="button"
            onClick={() => onChange(translation)}
            style={{
              background: 'transparent',
              border: '1px solid red',
              borderRadius: '3px',
              margin: '2px 2px 2px 0'
            }}
          >
            {translation}
          </button>
        ) : null)}
      </Flex>
    </Flex>
  )
}
