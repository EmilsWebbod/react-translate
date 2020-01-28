import reactTranslate, {
  handleNoMatch,
  handleNoTranslation,
  TranslateSpawn as TranslateSpawnDev
} from '@ewb/react-translate';
import words from './words.json';
import texts from './texts.json';

const Translate = reactTranslate({
  fileServerURL: process.env.REACT_APP_FILE_SERVER_URL,
  validLocales: {
    en: 'Engelsk'
  },
  googleAPIKey: process.env.REACT_APP_GOOGLE_API_KEY
});

const devTranslate = new Translate({
  defaultLocale: 'no',
  locale: 'no',
  words,
  texts,
  noMatch: handleNoMatch,
  noTranslation: handleNoTranslation
});

export { devTranslate, TranslateSpawnDev };
