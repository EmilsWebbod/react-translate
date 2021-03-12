import * as React from 'react';
import { TranslationItem } from '../types/translationItem';
import { Branch, ISO_639_1, Translations } from '@ewb/translate';
import { LocaleObject, Settings } from '../utils/settings';
import { getApiTranslations } from '../utils/api';

interface Context extends State {
  item: TranslationItem;
  locales: LocaleObject;
  localeKeys: Array<ISO_639_1>;
  locale: ISO_639_1;
  save: (e?: React.FormEvent) => void;
  onChange: (key: ISO_639_1, value: string) => void;
}

const defaultContext: Context = {
  item: {} as TranslationItem,
  locales: {},
  localeKeys: [],
  locale: 'aa',
  save: () => {},
  onChange: () => () => {},

  translations: {},
  apiTranslations: {},
  busy: false
}

export const TranslateContext = React.createContext(defaultContext);

interface Props extends JSX.ElementChildrenAttribute {
  item: TranslationItem;
  onTranslated: () => void;
}

interface State {
  translations: Translations;
  busy: boolean;
  apiTranslations: Translations;
}

export function TranslateProvider({
  children,
  item,
  onTranslated
}: Props) {
  const settings = new Settings();

  const locale = item.translate.defaultLocale as ISO_639_1;
  const locales = settings.locales;
  const localeKeys = settings.localeKeys;

  const [state, setState] = React.useState<State>({
    translations: localeKeys.reduce((obj, x) => ({ ...obj, [x]: item.branch.translations[x] || '' }), {}),
    busy: false,
    apiTranslations: {}
  });

  const save = React.useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (item.branch instanceof Branch) {
      item.branch.addTranslations(state.translations);
    } else {
      item.branch.add(state.translations);
    }
    setState(s => ({ ...s, busy: true }));

    try {
      if (settings.apiServer) {
        await item.branch.toApi(locale);
      }
    } catch (e) {
      console.error(e);
    }

    setState(s => ({ ...s, busy: false }));
    onTranslated();
  }, [state.translations, settings.apiServer, locale, onTranslated, item])

  const checkApi = React.useCallback(async () => {
    setState(s => ({ ...s, busy: true }));
    try {
      const translations = await getApiTranslations(item.branch, locale, localeKeys);
      setState(s => ({
        busy: false,
        translations: localeKeys.reduce((obj, key) => ({
          ...obj,
          [key]: translations[key]
            ? translations[key].split(',')[0]
            : s.translations[key]
        }), {}),
        apiTranslations: translations
      }))
    } catch (e) {
      setState(s => ({ ...s, busy: false }));
      console.warn('No translations');
    }
  }, [item.branch, locale, localeKeys])

  const onChange = React.useCallback((key: ISO_639_1, value: string) => {
    setState(s => ({
      ...s,
      translations: {...s.translations, [key]: value }
    }));
  }, [])

  React.useEffect(() => {checkApi().then();}, []);

  return (
    <TranslateContext.Provider
      value={{
        item,
        locale,
        locales,
        localeKeys,
        save,
        onChange,
        ...state
      }}>
      {children}
    </TranslateContext.Provider>
  )
}