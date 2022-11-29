import React from 'react';
import { ReactTranslateContext } from '../context/ReactTranslateContext.js';
import { Dialog, DialogTitle, Grid, IconButton, makeStyles } from '@material-ui/core';
import Translations from './content/Translations.js';
import List from './content/List.js';
import { Close as CloseIcon } from '@material-ui/icons';
import Csv from './content/Csv.js';

const useStyles = makeStyles(() => ({
  dialog: {
    zIndex: 1301,
  },
}));

export default function Content() {
  const classes = useStyles();
  const [state, setState] = React.useContext(ReactTranslateContext);

  const handleClose = React.useCallback(() => {
    setState((s) => ({ ...s, show: null }));
  }, []);

  return (
    <Dialog
      maxWidth={state.show === 'list' ? 'lg' : 'md'}
      fullWidth
      onClose={handleClose}
      open={state.show !== null}
      disableBackdropClick={state.show === 'translation'}
      className={classes.dialog}
      disableEnforceFocus
      disableRestoreFocus
      disableAutoFocus
    >
      <DialogTitle>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>{state.show?.toUpperCase()}</Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      {state.show === 'translation' && <Translations />}
      {state.show === 'list' && <List />}
      {state.show === 'csv' && <Csv />}
    </Dialog>
  );
}
