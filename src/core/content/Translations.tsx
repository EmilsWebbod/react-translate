import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { ReactTranslateContext } from '../../context/ReactTranslateContext';
import Translate from './translations/Translate';
import { TranslateProvider } from '../../context/TranslateContext';
import { Settings } from '../../utils/settings';

export default function Translations() {
  const [state, setState] = React.useContext(ReactTranslateContext);

  if (state.translations.length === 0) {
    return <>
      <LinearProgress color="secondary" />
      <Typography>
        Saving translations and refreshing... Please wait
      </Typography>
    </>;
  }

  const onTranslated = React.useCallback(() => {
    setState(s => {
      const translations = s.translations.slice(1, s.translations.length);
      if (translations.length === 0) {
        Settings.of().save();
      }
      return { ...s, translations };
    })
  }, [])

  const item = state.translations[0];
  return (
    <TranslateProvider
      key={item.branch.word}
      item={item}
      onTranslated={onTranslated}
    >
      <Translate last={state.translations.length === 1} />
    </TranslateProvider>
  )
}