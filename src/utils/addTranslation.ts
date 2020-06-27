import Translate, { Branch, Empty } from '@ewb/translate';
import { TranslationItem } from '../types/translationItem';

export default function addTranslations(
  translations: TranslationItem[],
  translate: Translate,
  branch: Branch | Empty
): [boolean, TranslationItem[]] {
  const isNew = translations.every(x => x.branch.word !== branch.word);
  return [
    isNew,
    isNew ? [...translations, { branch, translate, translations: {} }]
    : translations
  ]
}