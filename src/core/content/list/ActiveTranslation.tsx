import React from 'react';
import { Branch } from '@ewb/translate';
import {
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  DialogActions,
  Button,
  Dialog,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  Badge,
  Tooltip,
} from '@material-ui/core';
import { Print as PrintIcon, Info } from '@material-ui/icons';

import { Settings } from '../../../utils/settings.js';

interface Props {
  active: Branch | null;
  setActive: (branch: Branch | null) => void;
}

export default function ActiveTranslation({ active, setActive }: Props) {
  const settings = Settings.of();
  const onClose = React.useCallback(() => {
    setActive(null);
  }, []);

  const word = active ? active.word : '';
  const type = active && active.sentence ? 'texts' : 'words';
  const usageStack = active ? active.usageStack : [];
  const usage = (active ? settings.getUsage(type, active.word) : []).filter(
    (x) => !usageStack.some((y) => x.file === y.file),
  );
  const size = '30px';

  return (
    <Dialog open={Boolean(active)} maxWidth="sm" onClose={onClose} fullWidth>
      {active && (
        <>
          <DialogTitle>{word}</DialogTitle>
          <DialogContent>
            {active.packageName && <Typography variant="subtitle1">NPM pakke: {active.packageName}</Typography>}
            <Badge
              badgeContent={
                <Tooltip
                  placement="top"
                  title="Will only show once per file, to reduce duplicates. And may be outdated if not loaded in current session."
                >
                  <Info />
                </Tooltip>
              }
            >
              <Typography variant="subtitle1">Usages (Click to print stacktrace to console)</Typography>
            </Badge>
            <List>
              {[...usageStack, ...usage].map((usage) => (
                <ListItem key={usage.file} button onClick={() => console.info(usage.stack)}>
                  <ListItemIcon>
                    <PrintIcon />
                  </ListItemIcon>
                  <ListItemText primary={usage.file} />
                </ListItem>
              ))}
            </List>
            <Typography variant="subtitle1">Translations</Typography>
            <List>
              {Object.keys(active.translations).map((trans) =>
                trans !== 'key' ? (
                  <ListItem key={trans}>
                    <ListItemAvatar>
                      <Avatar style={{ width: size, height: size }}>{trans}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={active.translations[trans]} />
                  </ListItem>
                ) : null,
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
