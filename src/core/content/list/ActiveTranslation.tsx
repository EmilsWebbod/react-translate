import * as React from 'react';
import { Branch } from '@ewb/translate';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText  from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PrintIcon from '@material-ui/icons/Print';

import { Settings } from '../../../utils/settings';
import { Badge } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';

interface Props {
  active: Branch | null;
  setActive: (branch: Branch | null) => void;
}

export default function ActiveTranslation({
  active,
  setActive
}: Props) {
  const settings = Settings.of()
  const onClose = React.useCallback(() => {
    setActive(null);
  }, []);
  
  const word = active ? active.word : '';
  const type = active && active.sentence ? 'texts' : 'words';
  const usageStack = active ? active.usageStack : [];
  const usage = (active ? settings.getUsage(type, active.word) : [])
    .filter(x => !usageStack.some(y => x.file === y.file));
  const size = '30px';
  if (active) {
    console.log(usageStack)
    console.log(settings.getUsage(type, active.word))
  }
  
  return (
    <Dialog open={Boolean(active)} maxWidth="sm" onClose={onClose} fullWidth>
      {active && (
        <>
          <DialogTitle>{word}</DialogTitle>
          <DialogContent>
            <Badge
              badgeContent={<Tooltip
                placement="top"
                title="Will only show once per file, to reduce duplicates. And may be outdated if not loaded in current session."><Info /></Tooltip>
              }>
              <Typography variant="subtitle1">Usages (Click to print stacktrace to console)</Typography>
            </Badge>
            <List>
              {[...usageStack, ...usage].map((usage) => (
                <ListItem
                  key={usage.file}
                  button
                  onClick={() => console.info(usage.stack)}
                >
                  <ListItemIcon><PrintIcon /></ListItemIcon>
                  <ListItemText primary={usage.file} />
                </ListItem>
              ))}
            </List>
            <Typography variant="subtitle1">Translations</Typography>
            <List>
              {Object.keys(active.translations).map(trans => trans !== 'key' ? (
                <ListItem key={trans}>
                  <ListItemAvatar><Avatar style={{ width: size, height: size }}>{trans}</Avatar></ListItemAvatar>
                  <ListItemText primary={active.translations[trans]} />
                </ListItem>
              ) : null)}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}