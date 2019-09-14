import React from 'react';
import ReactDOM from 'react-dom';
import Translate, { Branch, Empty } from '@ewb/translate';
import EmptyComponent from './EmptyComponent';
import TranslateComponent from './TranslateComponent';

function handleNoMatch(empty: Empty) {
  setTimeout(() => {
    const container = document.getElementById('translate-spawn');
    if (container) {
      ReactDOM.render(<EmptyComponent empty={empty} />, container);
    }
  }, 100)
}

function handleNoTranslation(branch: Branch) {
  setTimeout(() => {
    const container = document.getElementById('translate-spawn');
    if (container) {
      ReactDOM.render(<TranslateComponent branch={branch} />, container);
    }
  }, 100)
}

function TranslateSpawn() {
  return <div id="translate-spawn" />;
}

export default Translate;
export { TranslateSpawn, handleNoMatch, handleNoTranslation };
