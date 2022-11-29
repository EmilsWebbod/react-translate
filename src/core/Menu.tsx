import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import {
  Spellcheck as SpellcheckIcon,
  List as ListIcon,
  ImportExport as ImportExportIcon,
  AddCircle as AddIcon,
} from '@material-ui/icons';

import { MenuStates, ReactTranslateContext } from '../context/ReactTranslateContext.js';
import keyEvent from '../utils/keyEvent.js';
import { TranslateContext } from '../context/TranslateContext.js';
import { Settings } from '../utils/settings.js';
import { TranslationItem } from '../types/translationItem.js';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function Menu({ show, onClose }: Props) {
  const [state, setState] = React.useContext(ReactTranslateContext);
  const tState = React.useContext(TranslateContext);
  const classes = useStyles();

  const setContent = React.useCallback(
    (state: MenuStates) => () => {
      setState((s) => ({ ...s, show: state }));
    },
    [],
  );

  const translateAll = React.useCallback(() => {
    const settings = Settings.of();
    const translate = settings.translate;
    const texts = translate.exportTexts();
    const words = translate.exportWords();
    const translations: TranslationItem[] = [];
    for (const key in words) {
      const branch = settings.translate.getBranch(key);
      if (branch) {
        translations.push({ branch, translate, translations: branch.translations });
      }
    }
    for (const key in texts) {
      const branch = settings.translate.getBranch(key, true);
      if (branch) {
        translations.push({ branch, translate, translations: branch.translations });
      }
    }

    setState(() => {
      return { show: 'translation', translations };
    });
  }, [tState]);

  React.useEffect(() => {
    return keyEvent('t', () => {
      if (state.translations.length > 0 && state.show !== 'translation') {
        setState((s) => ({ ...s, show: 'translation' }));
      }
    });
  }, [state.show, state.translations]);

  React.useEffect(() => {
    return keyEvent('l', () => {
      if (state.show !== 'list') {
        setState((s) => ({ ...s, show: 'list' }));
      }
    });
  }, [state.show, state.translations]);

  return (
    <Drawer anchor="right" open={show} onClose={onClose}>
      <div className={classes.list}>
        <List>
          {state.translations.length > 0 && (
            <ListItem button onClick={setContent('translation')}>
              <ListItemIcon>
                <SpellcheckIcon />
              </ListItemIcon>
              <ListItemText primary={`${state.translations.length} translation(s)`} />
            </ListItem>
          )}
          <ListItem button onClick={setContent('list')}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="List" />
          </ListItem>
          <ListItem button onClick={setContent('csv')}>
            <ListItemIcon>
              <ImportExportIcon />
            </ListItemIcon>
            <ListItemText primary="Export/Import CSV" />
          </ListItem>
          <ListItem button onClick={translateAll}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Edit All" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
