import * as React from 'react';
import { ISO_639_1 } from '@ewb/translate';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import SwapIcon from '@material-ui/icons/SwapVert';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import { TranslateContext } from '../../../context/TranslateContext';

interface Props {
  locale: ISO_639_1;
}

export default function ApiChips({
  locale
}: Props) {
  const [init, setInit] = React.useState(false);
  const ctx = React.useContext(TranslateContext);
  const value = ctx.translations[locale];
  const translations = ctx.apiTranslations[locale]
    ? ctx.apiTranslations[locale].split(',') : []

  React.useEffect(() => {
    if (!init && translations.length === 1 && translations[0] !== value) {
      setInit(true);
      ctx.onChange(locale, translations[0]);
    }
  }, [translations, value, ctx.onChange, locale, init])

  return (
    <Grid container spacing={1}>
      {translations.map((translation, i) => translation !== value ? (
        <Grid item key={translation + i}>
          <Chip
            icon={value ? <SwapIcon /> : <ArrowUpwardIcon />}
            label={translation}
            onClick={() => ctx.onChange(locale, translation)}
            variant="outlined"
            color="secondary"
          />
        </Grid>
      ) : null)}
    </Grid>
  )
}
