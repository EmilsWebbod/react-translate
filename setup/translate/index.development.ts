import reactTranslate, {
  handleNoMatch,
  handleNoTranslation
} from '@ewb/react-translate';

const words = require('./words.json');
const texts = require('./texts.json');

const Translate = reactTranslate({
  fileServerURL: process.env.REACT_APP_FILE_SERVER_URL,
  locales: {
    nb: { label: 'Norsk', googleLocale: 'no' }
  },
  googleAPIKey: process.env.REACT_APP_GOOGLE_API_KEY,
  apiServer: process.env.REACT_APP_API_SERVER // Under testing and may be available for everyone.
});

const devTranslate = Translate({
  defaultLocale: 'en',
  locale: 'nb',
  words,
  texts,
  noMatch: handleNoMatch,
  noTranslation: handleNoTranslation
});

export { devTranslate };
