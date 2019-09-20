import reactTranslate, { handleNoMatch, handleNoTranslation, TranslateSpawn } from '@ewb/react-translate';
import words from './words.json';
import texts from './texts.json';

const Translate = reactTranslate({
  fileServerURL: process.env.REACT_APP_FILE_SERVER_URL,
  validLocales: {
    'no': 'Norsk',
    'sv': 'Svensk'
  },
  googleAPIKey: process.env.REACT_APP_GOOGLE_API_KEY
});

const translate = new Translate({
  defaultLocale: 'en',
  locale: 'no',
  words,
  texts,
  noMatch: handleNoMatch,
  noTranslation: handleNoTranslation
});

export default translate;
export { TranslateSpawn };
