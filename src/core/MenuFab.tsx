import * as React from 'react';
import TranslateIcon from '@material-ui/icons/Translate';
import Fab from '@material-ui/core/Fab';
import makeStyles from '@material-ui/core/styles/makeStyles';
import keyEvent from '../utils/keyEvent.js';

interface Props {
  show: boolean;
  onChange: (show: boolean) => void;
}

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(10),
    right: theme.spacing(2),
    zIndex: 1299
  }
}))

export default function MenuFab({
  show,
  onChange
}: Props) {
  const classes = useStyles();

  React.useEffect(() => {
    return keyEvent('t', () => {
      if (!show) {
        onChange(true)
      }
    });
  }, [onChange, show])

  return (
    <Fab
      color="secondary"
      aria-label="edit"
      onClick={() => onChange(!show)}
      className={classes.fab}
    >
      <TranslateIcon />
    </Fab>
  )
}
