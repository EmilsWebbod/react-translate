# React translate

Uses the [@ewb/translate](https://www.npmjs.com/package/@ewb/translate) library in the background to translate words and texts.  
Can be used in combination with [@ewb/translate-minify](https://www.npmjs.com/package/@ewb/translate-minify) in production.

## Install
```
yarn add @ewb/react-translate

npm install -s @ewb/react-translate
```

## Setup

```
import reactTranslate, { handleNoMatch, handleNoTranslation } from '@ewb/react-translate';
import words from './words.json.js';
import texts from './texts.json.js';

const Translate = reactTranslate({
  fileServerURL: 'http://localhost:7345',
  locales: {
    // Key with typeof ISO-639-1
    nb: { label: 'Norwegian', googleLocale: 'no' },
    sv: { label: 'Swedish' }
  },
  googleAPIKey: '...',
  apiServer: '...' // API Server
});

const translate = new Translate({
    defaultLocale: 'en',
    locale: 'no',
    words: words,
    texts: texts,
    noWord: handleNoWord,
    noTranslation: handleNoTranslation
})

export default translate;
```

### Files
`words.json` & `texts.json` file needs to contain `{}` to load correctly.

### Live edit server

You also need to start a server in development environment.
```
DIST=%PATH% PORT=$PORT$ node node_modules/@ewb/react-translate/server
```
This server will save 2 files `words.json` and `texts.json` when you add translations in the front-end.  
PATH is default src/translate  
PORT is default 7345 (TRAS)

## Translate
```
translate.word('Word') // "Ord"
translate.text('This is a sentence') // "Dette er en setning"
translate.text('Text with {{var}}', { var: 'variable' }) // "Tekst med variable"
```

## API Server
Currently working on translation server that can be connected. Will fetch translation automatically and give options if found multiple  
Send me a message if you want to try it out. I want to build the translation, but have som kinks to work out.

## Production
See folder `setup` on [github](https://github.com/EmilsWebbod/react-translate) on how to setup the development and production loading of packages.

You dont need `handleNoMatch` and `handleNoTranslation` function in production mode.
App will not crash if there is no translation. Only give you N/W or N/T of not found.

You can also skip `TranslateSpawn`

## Google supported Language locale (ISO-639-1 Code)
If you want to use the google translation library you have to use locales in this list
[Supported google api lang](https://cloud.google.com/translate/docs/languages)
