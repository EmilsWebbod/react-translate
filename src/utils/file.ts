import { WordTranslation } from '@ewb/translate';
import { FILE_SERVER_URL } from './settings';

export function saveWordsToFile(words: WordTranslation[]) {
  return post('words', words);
}

export function saveTextsToFile(texts: WordTranslation[]) {
  return post('texts', texts);
}

function post(path: string, data: any) {
  return new Promise((res) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    const blob = new Blob([JSON.stringify(data)],{type:'application/json'});
  
    form.append(path, blob);
    xhr.open("POST", `${FILE_SERVER_URL}/${path}`, true);
    xhr.send(form);
    xhr.addEventListener("loadend", res);
  })
}
