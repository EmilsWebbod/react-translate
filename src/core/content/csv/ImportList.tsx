import React from 'react';
import { WordTranslations } from '@ewb/translate';
import {
  AppBar,
  Grid,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@material-ui/core';

import { Settings } from '../../../utils/settings.js';

interface Props {
  words: WordTranslations;
  texts: WordTranslations;
}

export default function ImportList({ words, texts }: Props) {
  const [active, setActive] = React.useState(0);
  const handleChange = React.useCallback((_, newValue) => {
    setActive(newValue);
  }, []);

  return (
    <Grid container direction="column">
      <AppBar position="static">
        <Tabs value={active} onChange={handleChange}>
          <Tab label={`Words (${Object.keys(words).length})`} />
          <Tab label={`Texts (${Object.keys(texts).length})`} />
        </Tabs>
      </AppBar>
      <Grid item>
        {active === 0 && <TranslationForm translation={words} />}
        {active === 1 && <TranslationForm translation={texts} />}
      </Grid>
    </Grid>
  );
}

interface TranslationFormProps {
  translation: WordTranslations;
}

function TranslationForm({ translation }: TranslationFormProps) {
  const localeKeys = Settings.of().localeKeys;
  const translations = Object.keys(translation).sort((a, b) => {
    if (a > b) return 1;
    return a < b ? -1 : 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Base</strong>
            </TableCell>
            {localeKeys.map((x) => (
              <TableCell key={x}>
                <strong>{x}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {translations.map((trans) => (
            <TableRow key={trans}>
              <TableCell>{trans}</TableCell>
              {localeKeys.map((x: any) => (
                <TableCell key={x}>{translation[trans][x]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
