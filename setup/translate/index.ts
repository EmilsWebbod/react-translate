let translate;

if (process.env.NODE_ENV === 'production') {
  translate = require('./index.production');
} else {
  translate = require('./index.development');
}

const TranslateSpawn = translate.TranslateSpawn;

export default translate.default;
export { TranslateSpawn };
