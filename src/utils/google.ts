import { Settings } from './settings';

export type VALID_GOOGLE_LOCALES = 'af'
  | 'sq'
  | 'am'
  | 'ar'
  | 'hy'
  | 'az'
  | 'eu'
  | 'be'
  | 'bn'
  | 'bs'
  | 'bg'
  | 'ca'
  | 'ceb'
  | 'zh-CN'
  | 'zh'
  | 'zh-TW'
  | 'co'
  | 'hr'
  | 'cs'
  | 'da'
  | 'nl'
  | 'en'
  | 'eo'
  | 'et'
  | 'fi'
  | 'fr'
  | 'fy'
  | 'gl'
  | 'ka'
  | 'de'
  | 'el'
  | 'gu'
  | 'ht'
  | 'ha'
  | 'haw'
  | 'he'
  | 'iw'
  | 'hi'
  | 'hmn'
  | 'hu'
  | 'is'
  | 'ig'
  | 'id'
  | 'ga'
  | 'it'
  | 'ja'
  | 'jw'
  | 'kn'
  | 'kk'
  | 'km'
  | 'ko'
  | 'ku'
  | 'ky'
  | 'lo'
  | 'la'
  | 'lv'
  | 'lt'
  | 'lb'
  | 'mk'
  | 'mg'
  | 'ms'
  | 'ml'
  | 'mt'
  | 'mi'
  | 'mr'
  | 'mn'
  | 'my'
  | 'ne'
  | 'no'
  | 'ny'
  | 'ps'
  | 'fa'
  | 'pl'
  | 'pt'
  | 'pa'
  | 'ro'
  | 'ru'
  | 'sm'
  | 'gd'
  | 'sr'
  | 'st'
  | 'sn'
  | 'sd'
  | 'si'
  | 'sk'
  | 'sl'
  | 'so'
  | 'es'
  | 'su'
  | 'sw'
  | 'sv'
  | 'tl'
  | 'tg'
  | 'ta'
  | 'te'
  | 'th'
  | 'tr'
  | 'uk'
  | 'ur'
  | 'uz'
  | 'vi'
  | 'cy'
  | 'xh'
  | 'yi'
  | 'yo'
  | 'zu';

export default function getGoogleTranslation(sourceLocale: VALID_GOOGLE_LOCALES, targetLocale: VALID_GOOGLE_LOCALES, translate: string) {
  return new Promise<string>((res, rej) => {
    const settings = new Settings();
    
    if (!settings.googleAPIKey) {
      return rej('No google api key');
    }
    const googleTranslate = require('google-translate').gt(settings.googleAPIKey);
    googleTranslate.translate(translate, sourceLocale, targetLocale, (err: any, trans: any) => {
      if (!err) {
        res(trans.translatedText);
      } else {
        rej(handleError(err))
      }
    })
  })
}

function handleError(err: any) {
  console.error(err);
  try {
    const e = JSON.parse(err.body);
    return e.error.message;
  } catch (e) {
    return 'Major error :( Check console';
  }
}
