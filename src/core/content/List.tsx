import * as React from 'react';
import { Settings } from '../../utils/settings';
import { AppBar } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useState } from 'react';
import { WordTranslations } from '@ewb/translate';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { ReactTranslateContext } from '../../context/ReactTranslateContext';
import addTranslations from '../../utils/addTranslation';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import BackspaceIcon from '@material-ui/icons/Backspace';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';

export default function List() {
  const translate = Settings.of().translate;
  const [search, setSearch] = React.useState('');
  const [state, setState] = React.useContext(ReactTranslateContext);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(0);
  const [deleteList, setDelete] = React.useState<Set<string>>(new Set())

  const words = translate.exportWords();
  const texts = translate.exportTexts();

  const handleChange = React.useCallback((_, newValue) => {
    setActive(newValue);
  }, []);

  const removeDelete = React.useCallback((word) => {
    setDelete(s => {
      s.delete(word);
      return new Set([...s]);
    });
  }, []);

  const addDelete = React.useCallback((word: string) => {
    setDelete(s => {
      s.add(word);
      return new Set([...s]);
    })
  }, []);

  const onDelete = React.useCallback(async () => {
    if (confirm(`Are you sure you want to delete ${deleteList.size} items? (Window will refresh)`)) {
      setBusy(true)
      for(const word of deleteList) {
        const branch = translate.getBranch(word)
        if (branch) {
          branch.isWord = false;
        }
      }
      if (!(await Settings.of().save())) {
        setBusy(false)
      }
    }
  }, [deleteList]);

  const onClear = React.useCallback(() => {
    setDelete(new Set());
  }, [])

  if (busy) return (
    <>
      <LinearProgress color="secondary" />
      Please wait... Deleting items and refreshing.
    </>
  );

  const onEdit = React.useCallback(() => {
    setState(s => ({ ...s, show: 'translation' }))
  }, [])

  return (
    <>
      <Grid container justify="space-between" alignItems="center" style={{ padding: '5px'}}>
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <TextField
                label="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEdit}
                color="primary"
                disabled={state.translations.length === 0}
              >Edit translations</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item justify="flex-end">
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<BackspaceIcon />}
                onClick={onClear}
                color="primary"
                disabled={deleteList.size === 0}
              >Clear delete list</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                color="secondary"
                disabled={deleteList.size === 0}
              >Delete {deleteList.size} translations!</Button>
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
      {active === 0 && <TranslationTable
        deleteList={deleteList}
        translation={search ? filter(words, search) : words}
        removeDelete={removeDelete}
        addDelete={addDelete}
      />}
      {active === 1 && <TranslationTable
        deleteList={deleteList}
        translation={search ? filter(texts, search) : texts}
        removeDelete={removeDelete}
        addDelete={addDelete}
      />}
    </>
  )
}

function filter<T extends object>(obj: T, matchKey: string) {
  const ret: any = {};
  for(const key in obj) {
    if (obj.hasOwnProperty(key) && key.match(new RegExp(matchKey, 'i'))) {
      ret[key] = obj[key];
    }
  }
  return ret;
}

interface Props {
  translation: WordTranslations;
  deleteList: Set<string>;
  removeDelete: (word: string) => void;
  addDelete: (word: string) => void;
}

function TranslationTable({
  translation,
  removeDelete,
  addDelete,
  deleteList
}: Props) {
  const [state, setState] = React.useContext(ReactTranslateContext);
  const settings = Settings.of();
  const localeKeys = Settings.of().localeKeys;
  const translations = Object.keys(translation).sort((a, b) => {
    if (a > b) return 1;
    return a < b ? -1 : 0;
  });

  const onEdit = React.useCallback((word: string) => {
    const branch = settings.translate.getBranch(word)
    if (!branch) return;

    setState(s => {
      const [, translations] =
        addTranslations(s.translations, settings.translate, branch)
      return { ...s, translations }
    })
  }, [settings.translate])

  const onRemove = React.useCallback((word) => {
    setState(s => ({
      ...s,
      translations: s.translations.filter(x => x.branch.word !== word)
    }))
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '130px'}}><strong>Actions</strong></TableCell>
            <TableCell><strong>Base</strong></TableCell>
            {localeKeys.map((x) => <TableCell key={x}><strong>{x}</strong></TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {translations.map((trans) => (
            <TableRow key={trans}>
              <TableCell>
                {state.translations.some(x => x.branch.word === trans) ? (
                  <IconButton onClick={() => onRemove(trans)}><CancelIcon /></IconButton>
                ) : (
                  <IconButton onClick={() => onEdit(trans)}><EditIcon /></IconButton>
                )}
                {deleteList.has(trans) ? (
                  <IconButton onClick={() => removeDelete(trans)}><DeleteForeverIcon color="secondary" /></IconButton>
                ) : (
                  <IconButton onClick={() => addDelete(trans)}><DeleteIcon /></IconButton>
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
  )
}