import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import ListIcon from '@material-ui/icons/List';

import { MenuStates, ReactTranslateContext } from '../context/ReactTranslateContext';
import keyEvent from '../utils/keyEvent';

const useStyles = makeStyles({
  list: {
    width: 250,
  }
});

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function Menu({
  show,
  onClose
}: Props) {
  const [state, setState] = React.useContext(ReactTranslateContext);
  const classes = useStyles();

  const setTranslation = React.useCallback((state: MenuStates) => () => {
    setState(s => ({...s, show: state}))
  }, [])

  React.useEffect(() => {
    return keyEvent('t', () => {
      if (state.translations.length > 0 && state.show !== 'translation') {
        setState(s => ({...s, show: 'translation'}))
      }
    });
  }, [state.show, state.translations])

  React.useEffect(() => {
    return keyEvent('l', () => {
      if (state.show !== 'list') {
        setState(s => ({...s, show: 'list'}))
      }
    });
  }, [state.show, state.translations])

  return (
    <Drawer anchor="right" open={show} onClose={onClose}>
      <div className={classes.list}>
        <List>
          {state.translations.length > 0 && (
            <ListItem button onClick={setTranslation('translation')}>
              <ListItemIcon><SpellcheckIcon /></ListItemIcon>
              <ListItemText primary={`Add ${state.translations.length} translations`} />
            </ListItem>
          )}
          <ListItem button onClick={setTranslation('list')}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary="List" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  )
}