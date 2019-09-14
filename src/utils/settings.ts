
interface LocaleObject {
  [key: string]: string;
}
export const validLocales = ['no-nb', 'se'];
export const localeObject = validLocales.reduce<LocaleObject>((obj, x) => ({ ...obj, [x]: '' }), {});
