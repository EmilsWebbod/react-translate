import React from 'react';
import {
  AppBar,
  Button,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { Tabs, Tab } from '@material-ui/core';
import { Branch, WordTranslations } from '@ewb/translate';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  DeleteForever as DeleteForeverIcon,
  Backspace as BackspaceIcon,
  OpenInNew as OpenInNew,
} from '@material-ui/icons';

import { Settings } from '../../utils/settings.js';
import { ReactTranslateContext } from '../../context/ReactTranslateContext.js';
import addTranslations from '../../utils/addTranslation.js';
import ActiveTranslation from './list/ActiveTranslation.js';

export default function List() {
  const translate = Settings.of().translate;
  const [search, setSearch] = React.useState('');
  const [state, setState] = React.useContext(ReactTranslateContext);
  const [busy, setBusy] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [deleteList, setDelete] = React.useState<{
    words: Set<string>;
    texts: Set<string>;
  }>({ words: new Set(), texts: new Set() });
  const deleteSize = deleteList.texts.size + deleteList.words.size;

  const words = translate.exportWords();
  const texts = translate.exportTexts();

  const handleChange = React.useCallback((_, newValue) => {
    setActive(newValue);
  }, []);

  const removeDelete = React.useCallback(
    (type: 'words' | 'texts') => (word: string) => {
      setDelete((s) => {
        s[type].delete(word);
        return { ...s, [type]: new Set([...s[type]]) };
      });
    },
    [],
  );

  const addDelete = React.useCallback(
    (type: 'words' | 'texts') => (word: string) => {
      setDelete((s) => {
        s[type].add(word);
        return { ...s, [type]: new Set([...s[type]]) };
      });
    },
    [],
  );

  const onDelete = React.useCallback(async () => {
    if (
      confirm(
        `Are you sure you want to delete ${deleteList.words.size + deleteList.texts.size} items? (Window will refresh)`,
      )
    ) {
      try {
        setBusy(true);
        for (const word of deleteList.words) {
          const branch = translate.getBranch(word);
          if (branch) {
            branch.isWord = false;
          }
        }
        for (const word of deleteList.texts) {
          const branch = translate.getBranch(word, true);
          if (branch) {
            branch.isWord = false;
          }
        }
        await Settings.of().save();
        window.location.reload();
      } finally {
        setBusy(false);
      }
    }
  }, [deleteList]);

  const onClear = React.useCallback(() => {
    setDelete({ texts: new Set(), words: new Set() });
  }, []);

  const onEdit = React.useCallback(() => {
    setState((s) => ({ ...s, show: 'translation' }));
  }, []);

  return (
    <DialogContent>
      {busy && (
        <>
          <LinearProgress color="secondary" />
          Please wait... Deleting items and refreshing.
        </>
      )}
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} variant="outlined" />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEdit}
                color="primary"
                disabled={busy || state.translations.length === 0}
              >
                Edit translations
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1} alignItems="center" justify="flex-end">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<BackspaceIcon />}
                onClick={onClear}
                color="primary"
                disabled={busy || deleteSize === 0}
              >
                Clear delete list
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                color="secondary"
                disabled={busy || deleteSize === 0}
              >
                Delete {deleteSize} translations!
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AppBar position="static">
        <Tabs value={active} onChange={handleChange} aria-label="simple tabs example">
          <Tab label={`Words (${Object.keys(words).length})`} />
          <Tab label={`Texts (${Object.keys(texts).length})`} />
        </Tabs>
      </AppBar>
      {active === 0 && (
        <TranslationTable
          deleteList={deleteList.words}
          translation={search ? filter(words, search) : words}
          removeDelete={removeDelete('words')}
          addDelete={addDelete('words')}
        />
      )}
      {active === 1 && (
        <TranslationTable
          deleteList={deleteList.texts}
          translation={search ? filter(texts, search) : texts}
          removeDelete={removeDelete('texts')}
          addDelete={addDelete('texts')}
          isText
        />
      )}
    </DialogContent>
  );
}

function filter<T extends object>(obj: T, matchKey: string) {
  const ret: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key.match(new RegExp(matchKey, 'i'))) {
      ret[key] = obj[key];
    }
  }
  return ret;
}

interface Props {
  isText?: boolean;
  translation: WordTranslations;
  deleteList: Set<string>;
  removeDelete: (word: string) => void;
  addDelete: (word: string) => void;
}

function TranslationTable({ translation, removeDelete, addDelete, deleteList, isText }: Props) {
  const [state, setState] = React.useContext(ReactTranslateContext);
  const [active, setActive] = React.useState<Branch | null>(null);
  const settings = Settings.of();
  const localeKeys = Settings.of().localeKeys;
  const translations = Object.keys(translation).sort((a, b) => {
    if (a > b) return 1;
    return a < b ? -1 : 0;
  });

  const onEdit = React.useCallback(
    (word: string) => {
      const branch = settings.translate.getBranch(word);
      if (!branch) return;

      setState((s) => {
        const [, translations] = addTranslations(s.translations, settings.translate, branch);
        return { ...s, translations };
      });
    },
    [settings.translate],
  );

  const onRemove = React.useCallback((word) => {
    setState((s) => ({
      ...s,
      translations: s.translations.filter((x) => x.branch.word !== word),
    }));
  }, []);

  const handleActive = React.useCallback((trans: string) => {
    return () => {
      const branch = settings.translate.getBranch(trans, isText);
      if (branch) {
        setActive(branch);
      }
    };
  }, []);

  return (
    <>
      <ActiveTranslation active={active} setActive={setActive} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: '180px' }}>
                <strong>Actions</strong>
              </TableCell>
              <TableCell>
                <strong>Base</strong>
              </TableCell>
              {localeKeys.map((x) => (
                <TableCell key={x}>
                  <strong>{x}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {translations.map((trans) => (
              <TableRow key={trans}>
                <TableCell>
                  <IconButton onClick={handleActive(trans)}>
                    <OpenInNew />
                  </IconButton>
                  {state.translations.some((x) => x.branch.word === trans) ? (
                    <IconButton onClick={() => onRemove(trans)}>
                      <CancelIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => onEdit(trans)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {deleteList.has(trans) ? (
                    <IconButton onClick={() => removeDelete(trans)}>
                      <DeleteForeverIcon color="secondary" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => addDelete(trans)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>{trans}</TableCell>
                {localeKeys.map((x: any) => (
                  <TableCell key={x}>{translation[trans][x]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
