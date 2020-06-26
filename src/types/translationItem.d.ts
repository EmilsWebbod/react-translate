import Translate, { Branch, Empty, Translations } from '@ewb/translate';

export interface TranslationItem {
  translate: Translate;
  branch: Branch | Empty;
  translations: Translations;
}