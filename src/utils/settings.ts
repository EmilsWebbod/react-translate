
interface LocaleObject {
  [key: string]: string;
}

export const FILE_SERVER_URL = process.env.REACT_APP_FILE_SERVER_URL || 'http://localhost:3001';
export const VALID_LOCALES: string[] = (process.env.REACT_APP_VALID_LOCALES || '').split(',');
export const LOCALE_OBJECT = VALID_LOCALES.reduce<LocaleObject>((obj, x) => ({ ...obj, [x]: '' }), {});
