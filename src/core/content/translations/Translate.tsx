import * as React from 'react';
import { Branch, Empty } from '@ewb/translate';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import TranslateInput from './TranslateInput';
import { TranslateContext } from '../../../context/TranslateContext';
import Suggestions from '../../../components/Suggestions';

const useStyle = makeStyles(() => ({
  form: {
    minHeight: '200px',
    border: '1px solid black',
    padding: '1rem'
  }
}))

export default function Translate() {
  const { localeKeys, item: { branch }, save, busy } = React.useContext(TranslateContext);
  const classes = useStyle();

  const isText = Boolean(branch.word.match(/\s/));
  const isSentence = branch instanceof Branch ? branch.sentence : branch.isTreeText;
  const warnings = [];
  const suggestions = branch instanceof Empty ? branch.suggestions() : '';

  if (isText !== isSentence) {
    if (isSentence) {
      warnings.push('Used t/text with single word as value.')
    } else {
      warnings.push('Used w/word with multiple words as value.')
    }
  }

  if (mismatchVariables(branch.word)) {
    warnings.push('Variable {{var}} mismatch. Check if missing { or }')
  }

  return (
    <form className={classes.form} onSubmit={save}>
      <DialogContent>
        <Grid container direction="column" justify="space-between" spacing={1}>
          {warnings.length > 0 && warnings.map((warning, i) =>
            <Grid item key={i}>
              <Alert severity="warning">{warning}</Alert>
            </Grid>
          )}
          <Grid item>
            <Typography variant="h6" display="inline">New {isText ? 'Text' : 'Word'}:</Typography>
            &nbsp;
            <Typography variant="h5" color="secondary" display="inline">{branch.word}</Typography>
          </Grid>
          {suggestions && (
            <Grid item>
              <Suggestions suggestions={suggestions} />
            </Grid>
          )}
          {localeKeys.map(locale => <TranslateInput locale={locale} key={locale}/>)}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          disabled={busy}
          variant="contained"
          color="primary"
        >{busy ? 'Busy...' : 'Add'}</Button>
      </DialogActions>
    </form>
  );
}

export const VARIABLE_REGEXP = /{{(.*?)}}/g;
export const WRONG_VARIABLE_REGEXP = /{(.*?)}/g;
function mismatchVariables(word: string) {
  const variables = word.match(VARIABLE_REGEXP)
  const variableLength = variables ? variables.length - 1 : 0;
  const variables2 = word.match(WRONG_VARIABLE_REGEXP)
  const variableLength2 = variables2 ? variables2.length - 1 : 0;
  return variableLength !== variableLength2;
}