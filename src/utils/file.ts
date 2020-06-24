import { WordTranslations } from '@ewb/translate';
import { Settings } from './settings';

export function saveWordsToFile(words: WordTranslations) {
  return post('words', words);
}

export function saveTextsToFile(texts: WordTranslations) {
  return post('texts', texts);
}

function post(path: string, data: any) {
  return new Promise((res, rej) => {
    const settings = new Settings();
    const url = settings.fileServerURL;
    const form = new FormData();
    const blob = new Blob([JSON.stringify(data)],{type:'application/json'});

    form.append(path, blob);
    fetch(`${url}/${path}`, {
      method: 'POST',
      credentials: 'omit',
      mode: 'no-cors',
      body: form,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
    }).then(res).catch(rej);
  })
}
