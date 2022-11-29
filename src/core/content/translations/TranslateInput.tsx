import React from 'react';
import { ISO_639_1 } from '@ewb/translate';
import { Grid } from '@material-ui/core';

import Input from '../../../components/Input.js';
import { VALID_GOOGLE_LOCALES } from '../../../utils/google.js';
import { TranslateContext } from '../../../context/TranslateContext.js';
import ApiChips from './ApiChips.js';

interface Props {
  locale: ISO_639_1;
  autoFocus?: boolean;
}

export default function TranslateInput({ locale, autoFocus }: Props) {
  const { item, translations, onChange, locales } = React.useContext(TranslateContext);
  const value = translations[locale];
  const { branch, translate } = item;

  const localeItem = locales[locale];
  if (!localeItem) return null;

  return (
    <Grid container direction="column">
      <Input
        label={localeItem.label || locale}
        value={value || ''}
        onChange={(value) => onChange(locale, value)}
        required
        googleTranslate={
          localeItem.googleLocale
            ? {
                source: translate.defaultLocale as VALID_GOOGLE_LOCALES,
                target: localeItem.googleLocale,
                word: branch.word,
              }
            : undefined
        }
        autoFocus={autoFocus}
      />
      <Grid item>
        <ApiChips locale={locale} />
      </Grid>
    </Grid>
  );
}
