import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Translate, { Branch, Empty } from '@ewb/translate';
import EmptyComponent from './EmptyComponent';
import TranslateComponent from './TranslateComponent';
import { LocaleObject, Settings } from './utils/settings';

interface Options {
  fileServerURL: string;
  validLocales: LocaleObject;
  googleAPIKey?: string;
}

function handleNoMatch(translate: Translate, empty: Empty) {
  setTimeout(() => {
    const container = document.getElementById('translate-spawn');
    if (container) {
      ReactDOM.render(<EmptyComponent translate={translate} empty={empty} />, container);
    }
  }, 100)
}

function handleNoTranslation(translate: Translate, branch: Branch) {
  setTimeout(() => {
    const container = document.getElementById('translate-spawn');
    if (container) {
      ReactDOM.render(<TranslateComponent translate={translate} branch={branch} />, container);
    }
  }, 100)
}

function TranslateSpawn() {
  return <div id="translate-spawn" />;
}

export default ({
  validLocales,
  fileServerURL,
  googleAPIKey
}: Options) => {
  new Settings(validLocales, fileServerURL, googleAPIKey);
  
  return Translate;
}
export { TranslateSpawn, handleNoMatch, handleNoTranslation };
