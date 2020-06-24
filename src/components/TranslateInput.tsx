import * as React from 'react';
import { LocaleObjectValue } from '../utils/settings';
import Input from './Input';
import { VALID_GOOGLE_LOCALES } from '../utils/google';
import Translate, { Branch, Empty, ISO_639_1 } from '@ewb/translate';

interface Props {
  translate: Translate;
  branch: Empty | Branch;
  value: string;
  index: ISO_639_1;
  locale: LocaleObjectValue;
  onChange: (value: string) => void;
}

export default function TranslateInput({
  translate,
  branch,
  locale,
  onChange,
  value,
  index
}: Props) {
  const label = locale.label || index;
  const googleLocale = locale.googleLocale;
  return (
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
  )
}