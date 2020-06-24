import { VALID_GOOGLE_LOCALES } from './google';
import { ISO_639_1 } from '@ewb/translate';

export type LocaleObject = {
  [key in ISO_639_1]?: LocaleObjectValue;
}

export interface LocaleObjectValue {
  label: string;
  googleLocale?: VALID_GOOGLE_LOCALES;
}

let settings: Settings;

export class Settings {
  
  constructor(
    public locales: LocaleObject = {},
    public fileServerURL: string = 'http://localhost:3001',
    public googleAPIKey?: string,
    public apiServer?: boolean
  ) {
    if (settings) {
      return settings;
    }

    settings = this;
    return settings;
  }
}
