import React from 'react';
import { LinearProgress, Typography } from '@material-ui/core';

import { ReactTranslateContext } from '../../context/ReactTranslateContext.js';
import Translate from './translations/Translate.js';
import { TranslateProvider } from '../../context/TranslateContext.js';
import { Settings } from '../../utils/settings.js';

export default function Translations() {
  const [state, setState] = React.useContext(ReactTranslateContext);

  if (state.translations.length === 0) {
    return (
      <>
        <LinearProgress color="secondary" />
        <Typography>Saving translations and refreshing... Please wait</Typography>
      </>
    );
  }

  const onTranslated = React.useCallback(() => {
    setState((s) => {
      const translations = s.translations.slice(1, s.translations.length);
      if (translations.length === 0) {
        try {
          Settings.of().save();
          window.location.reload();
        } catch (e) {
          alert('API connection failed');
          setState((s) => ({ ...s, show: null }));
        }
      }
      return { ...s, translations };
    });
  }, []);

  const item = state.translations[0];
  return (
    <TranslateProvider key={item.branch.word} item={item} onTranslated={onTranslated}>
      <Translate last={state.translations.length === 1} />
    </TranslateProvider>
  );
}
