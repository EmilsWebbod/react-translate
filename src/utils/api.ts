import { Branch, Empty, ISO_639_1, Translations } from '@ewb/translate';
import { TranslationApi } from '@ewb/translate/lib/TranslationApi';

export async function getApiTranslations(branch: Empty | Branch, locale: ISO_639_1, localeKeys: ISO_639_1[]) {
  const translation = await branch.fromApi(locale, localeKeys);
  const translations = TranslationApi.parseTranslations(translation, localeKeys)
  return Object.keys(translations).reduce((obj, key) => ({
    ...obj,
    [key]: translations[key].split(',').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(',')
  }), {}) as Translations;
}
