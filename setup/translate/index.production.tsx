import Translate from '@ewb/translate-minify';

const words = require('./words.json');
const texts = require('./texts.json');

const prodTranslate = new Translate({
  defaultLocale: 'en',
  locale: 'nb',
  words,
  texts
});

export { prodTranslate };
