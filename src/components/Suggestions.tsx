import React from 'react';
import { Avatar, Button, Chip, Typography, Grid, Tooltip } from '@material-ui/core';
import {
  More as MoreIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons';
import { Branch, ISO_639_1, Translations } from '@ewb/translate';
import { TranslateContext } from '../context/TranslateContext.js';

interface Props {
  suggestions: Branch[];
}

const INCREMENT = 5;

export default function Suggestions({ suggestions }: Props) {
  const { onChange } = React.useContext(TranslateContext);
  const [max, setMax] = React.useState(10);
  const [state, setState] = React.useState<{
    word: string;
    translations: Translations | null;
  }>({ word: '', translations: null });

  const length = suggestions.length;
  const of = length > max ? max : length;
  const suggestionList = suggestions.slice(0, max);

  const showTranslations = React.useCallback((suggestion: Branch) => {
    setState({
      translations: suggestion.translations,
      word: suggestion.word,
    });
  }, []);

  return suggestions && suggestions.length > 0 ? (
    <Grid container direction="column" spacing={1}>
      <Typography variant="subtitle1">
        Suggestions {of}/{length}:
      </Typography>
      <Grid container spacing={1}>
        {suggestionList.map((suggestion, i) => (
          <Grid item key={i}>
            <Tooltip title="Show translations" placement="top">
              <Chip
                label={suggestion.word}
                variant="outlined"
                onClick={() => showTranslations(suggestion)}
                icon={state.word === suggestion.word ? <VisibilityIcon /> : <VisibilityOutlinedIcon />}
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
              onClick={() => setMax((s) => s + INCREMENT)}
            >
              Mer
            </Button>
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
  ) : (
    <></>
  );
}
