import { WordTranslation } from '@ewb/translate';

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
    xhr.open("POST", 'http://localhost:3001/' + path, true);
    xhr.send(form);
    xhr.addEventListener("loadend", res);
  })
}
