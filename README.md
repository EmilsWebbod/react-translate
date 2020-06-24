# React translate

Uses the [@ewb/translate](https://github.com/EmilsWebbod/translate) library in the background to translate words and texts.  
Can be used in combination with [@ewb/translate-minify](https://github.com/EmilsWebbod/translate-minify) in production.

## Install
```
yarn add @ewb/react-translate

npm install -s @ewb/react-translate
```

## Setup

```
import reactTranslate, { handleNoMatch, handleNoTranslation } from '@ewb/react-translate';
import words from './words.json';
import texts from './texts.json';

const Translate = reactTranslate({
  fileServerURL: 'http://localhost:3001',
  locales: {
    // Key with typeof ISO-639-1
    nb: { label: 'Norwegian', googleLocale: 'no' },
    sv: { label: 'Swedish' }
  },
  googleAPIKey: '...'
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

### TranslateSpawn
This is needed for spawning the GUI
```
import { TranslateSpawn } from '@ewb/react-translate';

function App() {
    return (
        <div id="App">
            ... Your app here
            <TranslateSpawn />
        </div>
    )
}
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
PORT is default 3001

## Translate
```
translate.word('Word') // "Ord"
translate.text('This is a sentence') // "Dette er en setning"
translate.text('Text with {{var}}', { var: 'variable' }) // "Tekst med variable"
```

## Production
See folder `setup` on [github](https://github.com/EmilsWebbod/react-translate) on how to setup the development and production loading of packages.

You dont need `handleNoMatch` and `handleNoTranslation` function in production mode.
App will not crash if there is no translation. Only give you N/W or N/T of not found.

You can also skip `TranslateSpawn`

## Google supported Language locale (ISO-639-1 Code)
If you want to use the google translation library you have to use locales in this list
[Supported google api lang](https://cloud.google.com/translate/docs/languages)
