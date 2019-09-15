# React translate

Uses the [@ewb/translate](https://github.com/EmilsWebbod/react-translate) library in the background to translate words and texts.

## Setup

```
import reactTranslate, { handleNoMatch, handleNoTranslation } from '@ewb/react-translate';
import words from './words.json';
import texts from './texts.json';

const Translate = reactTranslate({
  fileServerURL: 'http://localhost:3001',
  validLocales: {
    'no': 'Norwegian', // Norwegian is just a label for popup
    'sv': 'Swedish'
  },
  googleAPIKey: '...'
});

const translate = new Translate({
    defaultLocale: 'en',
    locale: 'no',
    words: words,
    texts: texts,
    noWord: handleNoWord,
    noTranslation: handleNoTranlnslation
})

export default translate;
```

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

You also need to start a server in development environment.
```
DIST=%PATH% PORT=$PORT$ node node_modules/@ewb/react-translate/server
```
This server will save 2 files `words.json` and `texts.json` when you add translations in the front-end.  
PATH is default src/translate  
PORT is default 3001

## Translate
```
translate.word('Word') // Ord
translate.text('This is a sentence') // Dette er en setning
```

## Production
You dont need `handleNoMatch` and `handleNoTranslation` function in production mode.
App will not crash if there is no translation. Only give you N/W or N/T of not found.

You can also skip `TranslateSpawn`

## Google supported Language locale (ISO-639-1 Code)
If you want to use the google translation library you have to use locales in this list
[Supported google api lang](https://cloud.google.com/translate/docs/languages)
