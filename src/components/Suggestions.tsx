import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import MoreIcon from '@material-ui/icons/More';

interface Props {
  suggestions: string;
}

const INCREMENT = 5;

export default function Suggestions({
  suggestions
}: Props) {
  const [max, setMax] = React.useState(10)

  const allSuggestions = suggestions.split(',');
  const length = allSuggestions.length;
  const of = length > max ? max : length;

  return suggestions ? (
    <Grid container direction="column">
      <Typography variant="subtitle1">Suggestions {of}/{length}:</Typography>
      <Grid container spacing={1}>
        {allSuggestions.slice(0, max).map((suggestion, i) => (
          <Grid item key={i}>
            <Chip  label={suggestion} variant="outlined"/>
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

    </Grid>
  ) : <></>;
}
