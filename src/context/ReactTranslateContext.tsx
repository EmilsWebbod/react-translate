import * as React from 'react';
import Translate, { Branch, Empty } from '@ewb/translate';

import { TranslationItem } from '../types/translationItem';
import { Settings } from '../utils/settings';

type Context = [State, React.Dispatch<React.SetStateAction<State>>]

export type MenuStates = 'translation' | 'list' | null;
interface State {
  show: MenuStates;
  translations: TranslationItem[];
}

const defaultState: State = {
  show: null,
  translations: []
}

const defaultContext: Context = [defaultState, () => {}]

export const ReactTranslateContext = React.createContext<Context>(defaultContext);

export function ReactTranslateProvider({
  children
}: JSX.ElementChildrenAttribute) {
  const state = React.useState<State>(defaultState);

  const addTranslation = React.useCallback((translate: Translate, branch: Branch | Empty) => {
    state[1](s => {
      const isNew = s.translations.every(x => x.branch.word !== branch.word);
      return {
          ...s,
          show: isNew ? 'translation' : s.show,
          translations: isNew ? [...s.translations, {
          branch,
          translate,
          translations: {}
        }] : s.translations
      }
    })
  }, []);

  React.useEffect(() => {
    return Settings.of().subscribe(addTranslation);
  }, [addTranslation])

  return <ReactTranslateContext.Provider value={state}>
    {children}
  </ReactTranslateContext.Provider>
}
