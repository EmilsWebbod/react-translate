import { VALID_GOOGLE_LOCALES } from './google';
import Translate, {
  Branch,
  Empty,
  ISO_639_1,
  TranslationUsage,
} from '@ewb/translate';
import { saveSettingsToFile, saveTextsToFile, saveWordsToFile } from './file';
import { TranslateSettings } from '../types/stat';

export type LocaleObject = {
  [key in ISO_639_1]?: LocaleObjectValue;
};

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
  private _queue: Array<{ translate: Translate; branch: Branch | Empty }> = [];
  private _translateSettings: TranslateSettings = { texts: {}, words: {} };
  readonly localeKeys: ISO_639_1[] = [];

  constructor(
    public locales: LocaleObject = {},
    public fileServerURL: string = 'http://localhost:7345',
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
    for (const item of this._queue) {
      fn(item.translate, item.branch);
    }
    this._queue = [];
    return () => {
      this.sub = null;
    };
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

  set translateSettings(settings: TranslateSettings) {
    this._translateSettings = settings;
  }

  get translateSettings() {
    return this._translateSettings;
  }

  public async save() {
    try {
      if (this._translate) {
        const texts = this._translate.exportTexts({
          packageName: null,
        });
        const words = this._translate.exportWords({
          packageName: null,
        });
        const settings = this.getSettings();
        await Promise.all([
          saveTextsToFile(texts),
          saveWordsToFile(words),
          saveSettingsToFile(settings),
        ]);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public getUsage(type: 'words' | 'texts', word: string) {
    if (
      this._translateSettings &&
      this._translateSettings[type] &&
      this._translateSettings[type][word]
    ) {
      return this._translateSettings[type][word].usages || [];
    }
    return [];
  }

  public getSettings() {
    if (this._translate) {
      const branches = this._translate.exportBranches();
      const usages = branches.filter(
        (x) => x.usageStack && x.usageStack.length > 0
      );

      for (const branch of usages) {
        if (branch.sentence) {
          const stat = this._translateSettings.texts[branch.word] || {
            usages: [],
          };
          stat.usages = combineUsages(stat.usages, branch);
          this._translateSettings.texts[branch.word] = stat;
        } else {
          const stat = this._translateSettings.words[branch.word] || {
            usages: [],
          };
          stat.usages = combineUsages(stat.usages, branch);
          this._translateSettings.words[branch.word] = stat;
        }
      }
    }

    return this._translateSettings;
  }
}

function combineUsages(oldUsages: TranslationUsage[], branch: Branch) {
  const usageStack = branch.usageStack;
  const old = (oldUsages || []).filter(
    (x) => !usageStack.some((y) => x.file === y.file)
  );
  return [...old, ...usageStack];
}
