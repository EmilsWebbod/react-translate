import Translate from '@ewb/translate-minify';
import words from './words.json';
import texts from './texts.json';

const translate = new Translate({
  defaultLocale: 'en',
  locale: 'no',
  words,
  texts
});

export default translate;
