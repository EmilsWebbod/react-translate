import { VALID_GOOGLE_LOCALES } from './google';
import Translate, { Branch, Empty, ISO_639_1 } from '@ewb/translate';
import { saveTextsToFile, saveWordsToFile } from './file';

export type LocaleObject = {
  [key in ISO_639_1]?: LocaleObjectValue;
}

export interface LocaleObjectValue {
  label: string;
  googleLocale?: VALID_GOOGLE_LOCALES;
}

let settings: Settings;

type SubFn = (translate: Translate, branch: Branch | Empty) => void;

export class Settings {

  public static of() {
    return new Settings();
  }

  private sub: SubFn | null = null;
  private _translate: Translate | undefined;
  private _queue: Array<{ translate: Translate; branch: Branch | Empty; }> = []
  readonly localeKeys: ISO_639_1[] = [];
  
  constructor(
    public locales: LocaleObject = {},
    public fileServerURL: string = 'http://localhost:3001',
    public googleAPIKey?: string,
    public apiServer?: boolean
  ) {
    if (settings) {
      return settings;
    }

    this.localeKeys = Object.keys(locales) as Array<ISO_639_1>;
    settings = this;
    return settings;
  }

  public subscribe(fn: SubFn) {
    this.sub = fn;
    for(const item of this._queue) {
      fn(item.translate, item.branch)
    }
    this._queue = [];
    return () => {
      this.sub = null;
    }
  }

  public addTranslation(translate: Translate, branch: Branch | Empty) {
    if (this.sub) {
      this.sub(translate, branch);
    } else {
      this._queue.push({ translate, branch });
    }
  }

  public setTranslate(translate: Translate) {
    this._translate = translate;
  }

  get translate(): Translate {
    return this._translate as Translate;
  }

  public async save() {
    try {
      if (this._translate) {
        const texts = this._translate.exportTexts();
        const words = this._translate.exportWords();
        await Promise.all([
          saveTextsToFile(texts),
          saveWordsToFile(words)
        ])
      }
    } catch (e) {
      alert('Translate file server error')
      console.error(e);
    }
  }
}
