import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import CircularProgress from '@material-ui/core/CircularProgress';

import getGoogleTranslation, { VALID_GOOGLE_LOCALES } from '../utils/google.js';
import { Alert } from '@material-ui/lab';

interface Props {
  value: string;
  label: string;
  onChange: (value: string) => void;
  googleTranslate?: {
    source: VALID_GOOGLE_LOCALES;
    target: VALID_GOOGLE_LOCALES;
    word: string;
  };
  required?: boolean;
  autoFocus?: boolean;
}

export default function Input({
  value,
  label,
  googleTranslate,
  onChange,
  required,
  autoFocus
}: Props) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  return (
    <>
    <FormControl variant="outlined">
      <InputLabel htmlFor={label} color="secondary">{label}</InputLabel>
      <OutlinedInput
        id={label}
        type="text"
        color="secondary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        endAdornment={googleTranslate ? (
          <InputAdornment position="end">
            <IconButton onClick={handleGoogleTranslate} color="default">
              {busy ? <CircularProgress size={25} color="secondary" /> : <GTranslateIcon />}
            </IconButton>
          </InputAdornment>
        ) : undefined}
        required={required}
        labelWidth={150}
        autoFocus={autoFocus}
      />
    </FormControl>
    {error && <Alert severity="error">{error}</Alert>}
    </>
  )
  
  async function handleGoogleTranslate() {
    if (!googleTranslate) {
      return;
    }

    const timer = setTimeout(() => {
      setBusy(true);
    }, 150)
    try {
      const translation = await getGoogleTranslation(
        googleTranslate.source,
        googleTranslate.target,
        googleTranslate.word
      );
      onChange(translation.charAt(0).toUpperCase() + translation.slice(1));
    } catch (e: any) {
      setError(e.message);
    }
    clearTimeout(timer);
    setBusy(false);
  }
}
