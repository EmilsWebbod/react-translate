import { Branch, Empty, ISO_639_1 } from '@ewb/translate';
import { TranslationApi } from '@ewb/translate/lib/TranslationApi';

export async function getApiTranslations(branch: Empty | Branch, locale: ISO_639_1, localeKeys: ISO_639_1[]) {
  const translation = await branch.fromApi(locale, localeKeys);
  return TranslationApi.parseTranslations(translation);
}