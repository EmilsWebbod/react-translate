import { TranslationUsage } from '@ewb/translate';

export interface TranslateSettings {
  texts: {
    [key: string]: TranslateStat;
  };
  words: {
    [key: string]: TranslateStat;
  };
}

export interface TranslateStat {
  usages: TranslationUsage[];
}