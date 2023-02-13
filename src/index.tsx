import React from 'react';
import ReactDOM from 'react-dom';
import Translate, { Branch, Empty, TranslateOptions, TranslationApi } from '@ewb/translate';

import { LocaleObject, Settings } from './utils/settings.js';
import { ReactTranslateProvider } from './context/ReactTranslateContext.js';
import MenuFab from './core/MenuFab.js';
import Menu from './core/Menu.js';
import Content from './core/Content.js';
import { TranslateSettings } from './types/stat.js';

export interface IReactTranslateOptions extends TranslateOptions {
  fileServerURL?: string;
  apiServer?: string;
  locales?: LocaleObject;
  googleAPIKey?: string;
  settings?: TranslateSettings;
}

function handleNoMatch(translate: Translate, empty: Empty) {
  Settings.of().addTranslation(translate, empty);
}

function handleNoTranslation(translate: Translate, branch: Branch) {
  Settings.of().addTranslation(translate, branch);
}

function SpawnMenu() {
  const [show, setShow] = React.useState(false);
  return (
    <ReactTranslateProvider>
      <MenuFab show={show} onChange={setShow} />
      <Menu show={show} onClose={() => setShow(false)} />
      <Content />
    </ReactTranslateProvider>
  );
}

export default class ReactTranslate extends Translate {
  settings: Settings;

  constructor(opts: IReactTranslateOptions) {
    super(opts);
    const { locales, fileServerURL, googleAPIKey, apiServer, settings } = opts;
    this.settings = new Settings(locales, fileServerURL, googleAPIKey, Boolean(apiServer));
    this.settings.setTranslate(this);

    if (apiServer) {
      new TranslationApi(apiServer);
    }

    if (settings) {
      this.settings.translateSettings = settings;
    }

    if (typeof document !== 'undefined') {
      const translateElem = document.createElement('div');
      translateElem.id = 'react-translate';
      document.body.appendChild(translateElem);
      ReactDOM.render(<SpawnMenu />, translateElem);
    }
  }
}

export { ReactTranslate, handleNoMatch, handleNoTranslation };
