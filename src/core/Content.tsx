import * as React from 'react';
import { ReactTranslateContext } from '../context/ReactTranslateContext.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Translations from './content/Translations.js';
import List from './content/List.js';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Csv from './content/Csv.js';

const useStyles = makeStyles(() => ({
  dialog: {
    zIndex: 1301
  }
}))

export default function Content() {
  const classes = useStyles();
  const [state, setState] = React.useContext(ReactTranslateContext);

  const handleClose = React.useCallback(() => {
    setState(s => ({ ...s, show: null }))
  }, [])

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
            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      {state.show === 'translation' && <Translations />}
      {state.show === 'list' && <List />}
      {state.show === 'csv' && <Csv />}
    </Dialog>
  )
}