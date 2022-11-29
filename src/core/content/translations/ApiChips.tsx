import React from 'react';
import { ISO_639_1 } from '@ewb/translate';
import { SwapVert as SwapIcon, ArrowUpward as ArrowUpwardIcon } from '@material-ui/icons';
import { Chip, Grid } from '@material-ui/core';
import { TranslateContext } from '../../../context/TranslateContext.js';

interface Props {
  locale: ISO_639_1;
}

export default function ApiChips({ locale }: Props) {
  const [init, setInit] = React.useState(false);
  const ctx = React.useContext(TranslateContext);
  const value = ctx.translations[locale];
  const translations = ctx.apiTranslations[locale] ? ctx.apiTranslations[locale].split(',') : [];

  React.useEffect(() => {
    if (!init && translations.length === 1 && translations[0] !== value) {
      setInit(true);
      ctx.onChange(locale, translations[0]);
    }
  }, [translations, value, ctx.onChange, locale, init]);

  return (
    <Grid container spacing={1}>
      {translations.map((translation, i) =>
        translation !== value ? (
          <Grid item key={translation + i}>
            <Chip
              icon={value ? <SwapIcon /> : <ArrowUpwardIcon />}
              label={translation}
              onClick={() => ctx.onChange(locale, translation)}
              variant="outlined"
              color="secondary"
            />
          </Grid>
        ) : null,
      )}
    </Grid>
  );
}
