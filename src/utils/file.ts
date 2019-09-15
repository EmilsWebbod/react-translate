import { WordTranslations } from '@ewb/translate';
import { Settings } from './settings';

export function saveWordsToFile(words: WordTranslations) {
  return post('words', words);
}

export function saveTextsToFile(texts: WordTranslations) {
  return post('texts', texts);
}

function post(path: string, data: any) {
  return new Promise((res) => {
    const settings = new Settings();
    const url = settings.fileServerURL;
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    const blob = new Blob([JSON.stringify(data)],{type:'application/json'});
  
    form.append(path, blob);
    xhr.open("POST", `${url}/${path}`, true);
    xhr.send(form);
    xhr.addEventListener("loadend", res);
  })
}
