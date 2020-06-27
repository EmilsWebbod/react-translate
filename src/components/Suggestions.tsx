import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import MoreIcon from '@material-ui/icons/More';
import { Branch, ISO_639_1, Translations } from '@ewb/translate';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { TranslateContext } from '../context/TranslateContext';

interface Props {
  suggestions: Branch[];
}

const INCREMENT = 5;

export default function Suggestions({
  suggestions
}: Props) {
  const { onChange } = React.useContext(TranslateContext);
  const [max, setMax] = React.useState(10)
  const [state, setState] = React.useState<{
    word: string;
    translations: Translations | null;
  }>({ word: '', translations: null })

  const length = suggestions.length;
  const of = length > max ? max : length;
  const suggestionList = suggestions.slice(0, max);

  const showTranslations = React.useCallback((suggestion: Branch) => {
    setState({
      translations: suggestion.translations,
      word: suggestion.word
    });
  }, [])

  return suggestions && suggestions.length > 0 ? (
    <Grid container direction="column" spacing={1}>
      <Typography variant="subtitle1">Suggestions {of}/{length}:</Typography>
      <Grid container spacing={1}>
        {suggestionList.map((suggestion, i) => (
          <Grid item key={i}>
            <Tooltip title="Show translations" placement="top">
              <Chip
                label={suggestion.word}
                variant="outlined"
                onClick={() => showTranslations(suggestion)}
                icon={state.word === suggestion.word
                  ? <VisibilityIcon />
                  : <VisibilityOutlinedIcon />
                }
              />
            </Tooltip>
          </Grid>
        ))}
        {of < length && (
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<MoreIcon />}
              size="small"
              onClick={() => setMax(s => s + INCREMENT)}
            >Mer</Button>
          </Grid>
        )}
      </Grid>
      {state.translations && (
        <Grid container item spacing={1}>
          {Object.keys(state.translations).map((locale) => (
            <Grid item key={locale}>
              <Chip
                onClick={() => onChange(locale as ISO_639_1, state.translations![locale])}
                avatar={<Avatar>{locale}</Avatar>}
                label={state.translations![locale]}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  ) : <></>;
}
