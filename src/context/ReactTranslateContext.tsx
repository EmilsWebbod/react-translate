import React from 'react';
import Translate, { Branch, Empty } from '@ewb/translate';

import { TranslationItem } from '../types/translationItem.js';
import { Settings } from '../utils/settings.js';
import addTranslations from '../utils/addTranslation.js';

type Context = [State, React.Dispatch<React.SetStateAction<State>>];

export type MenuStates = 'translation' | 'list' | 'csv' | null;
interface State {
  show: MenuStates;
  translations: TranslationItem[];
}

const defaultState: State = {
  show: null,
  translations: [],
};

const defaultContext: Context = [defaultState, () => {}];

export const ReactTranslateContext = React.createContext<Context>(defaultContext);

export function ReactTranslateProvider({ children }: JSX.ElementChildrenAttribute) {
  const state = React.useState<State>(defaultState);

  const addTranslation = React.useCallback((translate: Translate, branch: Branch | Empty) => {
    state[1]((s) => {
      const [isNew, translations] = addTranslations(s.translations, translate, branch);
      return { ...s, translations, show: isNew ? 'translation' : s.show };
    });
  }, []);

  React.useEffect(() => {
    return Settings.of().subscribe(addTranslation);
  }, [addTranslation]);

  return <ReactTranslateContext.Provider value={state}>{children}</ReactTranslateContext.Provider>;
}
