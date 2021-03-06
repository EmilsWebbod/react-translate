import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Translate, { Branch, Empty, TranslateOptions, TranslationApi } from '@ewb/translate';

import { LocaleObject, Settings } from './utils/settings';
import { ReactTranslateProvider } from './context/ReactTranslateContext';
import MenuFab from './core/MenuFab';
import Menu from './core/Menu';
import Content from './core/Content';
import { TranslateSettings } from './types/stat';

interface Options {
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
  )
}

export default ({
  locales,
  fileServerURL,
  googleAPIKey,
  apiServer,
  settings
}: Options) => {
  const translateSettings = new Settings(locales, fileServerURL, googleAPIKey, Boolean(apiServer));

  if (apiServer) {
    new TranslationApi(apiServer);
  }
  
  if (settings) {
    translateSettings.translateSettings = settings;
  }

  if (typeof document !== 'undefined') {
    const translateElem = document.createElement('div');
    translateElem.id = 'react-translate';
    document.body.appendChild(translateElem)
    ReactDOM.render(<SpawnMenu />, translateElem);
  }
  
  return (props: TranslateOptions) => {
    const translate = new Translate(props);
    translateSettings.setTranslate(translate);
    return translate;
  };
}
export { handleNoMatch, handleNoTranslation };
