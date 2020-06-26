import * as React from 'react';
import { Settings } from '../../utils/settings';
import { AppBar } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useState } from 'react';
import { WordTranslations } from '@ewb/translate';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

export default function List() {
  const translate = Settings.of().translate;
  const [active, setActive] = useState(0);

  const words = translate.exportWords();
  const texts = translate.exportTexts();

  const handleChange = React.useCallback((_, newValue) => {
    setActive(newValue);
  }, []);

  return (
    <>
      <AppBar position="static">
        <Tabs value={active} onChange={handleChange} aria-label="simple tabs example">
          <Tab label={`Words (${Object.keys(words).length})`} />
          <Tab label={`Texts (${Object.keys(texts).length})`} />
        </Tabs>
      </AppBar>
      {active === 0 && <TranslationTable translation={words} />}
      {active === 1 && <TranslationTable translation={texts} />}
    </>
  )
}

interface Props {
  translation: WordTranslations;
}

function TranslationTable({
  translation
}: Props) {
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
            <TableCell><strong>Base</strong></TableCell>
            {localeKeys.map((x) => <TableCell key={x}><strong>{x}</strong></TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {translations.map(trans => (
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
  )
}