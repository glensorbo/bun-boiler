import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

interface SignupLinkDialogProps {
  open: boolean;
  signupLink: string;
  title: string;
  description: string;
  onClose: () => void;
}

export const SignupLinkDialog = ({
  open,
  signupLink,
  title,
  description,
  onClose,
}: SignupLinkDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(signupLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
        <TextField
          value={signupLink}
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                    <IconButton onClick={handleCopy} edge="end">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
