import { VALID_LOCALES } from './google';

export type LocaleObject = {
  [key in VALID_LOCALES]?: string;
}

let settings: Settings;

export class Settings {
  
  constructor(
    public validLocales: LocaleObject = {},
    public fileServerURL: string = 'http://localhost:3001',
    public googleAPIKey?: string
  ) {
    if (settings) {
      return settings;
    }

    settings = this;
    return settings;
  }
}
