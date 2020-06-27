import { prodTranslate } from './index.production';

let translate = prodTranslate;

if (process.env.NODE_ENV === 'development') {
  const devImport = require('./index.development');
  translate = devImport.devTranslate;
}

export default translate;
