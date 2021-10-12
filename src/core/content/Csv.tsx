import * as React from 'react';
import { Parser } from 'json2csv';
import * as csv from 'csvtojson';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Settings } from '../../utils/settings';
import { ISO_639_1, Translations, WordTranslations } from '@ewb/translate';
import ImportList from './csv/ImportList';
import { Typography } from '@material-ui/core';

interface State {
  words: WordTranslations;
  texts: WordTranslations;
}

export default function Csv() {
  const [busy, setBusy] = React.useState(false);
  const [state, setState] = React.useState<State>({ words: {}, texts: {} });
  const settings = new Settings();
  const locale = settings.translate.defaultLocale;
  const locales = settings.localeKeys;
  const translate = settings.translate;
  const noItems =
    Object.keys(state.words).length === 0 &&
    Object.keys(state.texts).length === 0;

  const exportTranslations = React.useCallback(() => {
    const words = translate.exportWords();
    const texts = translate.exportTexts();

    const connected = { ...words, ...texts };
    const rows = Object.keys(connected).reduce(
      (arr, x) => [...arr, { [locale]: x, ...connected[x] }],
      [] as any[]
    );

    const fields = [locale, ...locales];
    const parser = new Parser({ fields, delimiter: ';' });
    const csv = parser.parse(rows);
    download(csv);
  }, [translate, settings, locales, locale]);

  const importTranslations = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const fr = new FileReader();
        fr.onloadend = async () => {
          if (fr.result) {
            const translations = await csv({ delimiter: ';' }).fromString(
              String(fr.result)
            );
            const words: WordTranslations = { ...state.words };
            const texts: WordTranslations = { ...state.texts };
            for (const translation of translations) {
              const word = translation[locale];
              if (!word) {
                return alert(`Missing default locale "${locale}" column`);
              }
              const trans = locales.reduce(toTranslations(translation), {});
              if (word.match(/\s/)) {
                texts[word] = { ...(texts[word] || {}), ...trans };
              } else {
                words[word] = { ...(words[word] || {}), ...trans };
              }
            }
            setState({ texts, words });
          } else {
            alert('File read error. No FileReader result');
          }
        };
        fr.readAsText(file, 'utf-8');
      }
    },
    [state, translate, locales, locale]
  );

  const onSave = React.useCallback(async () => {
    for (const word in state.words) {
      if (state.words.hasOwnProperty(word)) {
        const item = translate.getWord(word);
        if (item) {
          item.addTranslations(state.words[word]);
        } else {
          translate.tree.addWord(word, state.words[word]);
        }
      }
    }
    for (const text in state.texts) {
      if (state.texts.hasOwnProperty(text)) {
        const item = translate.getText(text);
        if (item) {
          item.addTranslations(state.texts[text]);
        } else {
          translate.tree.addText(text, state.texts[text]);
        }
      }
    }
    try {
      setBusy(true);
      if (await settings.save()) {
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  }, [state]);

  return (
    <>
      <input
        accept="text/csv"
        style={{ display: 'none' }}
        id="import-csv"
        multiple
        type="file"
        onChange={importTranslations}
      />
      <DialogContent>
        {busy && (
          <>
            <LinearProgress color="secondary" />
            Please wait... Importing items and refreshing.
          </>
        )}
        <Grid container spacing={1}>
          <Grid item container justify="space-between">
            <Grid item>
              <Button
                onClick={onSave}
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={noItems || busy}
              >
                Save
              </Button>
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <label htmlFor="import-csv">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      component="span"
                      disabled={busy}
                    >
                      Import CSV
                    </Button>
                  </label>
                </Grid>
                <Grid item>
                  <Button
                    onClick={exportTranslations}
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloudDownloadIcon />}
                    disabled={busy}
                  >
                    Export CSV
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item>
            {noItems ? (
              <Grid container alignItems="center" direction="column">
                <Grid item>
                  <label htmlFor="import-csv">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      component="span"
                    >
                      Import CSV
                    </Button>
                  </label>
                </Grid>
                <Typography variant="h5">Import translations</Typography>
              </Grid>
            ) : (
              <ImportList texts={state.texts} words={state.words} />
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
}

function toTranslations(row: Translations) {
  return (translations: Translations, locale: ISO_639_1) => ({
    ...translations,
    [locale]: row[locale],
  });
}

function download(csv: string) {
  const blob = new Blob([csv]);
  const a = window.document.createElement('a');
  // @ts-ignore
  a.href = window.URL.createObjectURL(blob, { type: 'text/csv;charset=utf-8' });
  a.download = 'translation-export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
