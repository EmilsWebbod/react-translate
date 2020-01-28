import Translate from '@ewb/translate-minify';
import words from './words.json';
import texts from './texts.json';

const prodTranslate = new Translate({
  defaultLocale: 'no',
  locale: 'no',
  words,
  texts
});

const TranslateSpawnProd = () => null;

export { prodTranslate, TranslateSpawnProd };
