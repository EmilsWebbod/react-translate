import { prodTranslate, TranslateSpawnProd } from './index.production';

let TranslateSpawn = TranslateSpawnProd;
let translate = prodTranslate;

if (process.env.NODE_ENV === 'development') {
  const devImport = require('./index.development');
  TranslateSpawn = devImport.TranslateSpawnDev;
  translate = devImport.devTranslate;
}

export default translate;
export { TranslateSpawn };
