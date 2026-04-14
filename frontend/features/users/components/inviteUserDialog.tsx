import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod/v4';
import { useInviteUserMutation } from '../state/usersApi';
import { SignupLinkDialog } from './signupLinkDialog';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1, 'Email is required').email('Must be a valid email'),
});

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export const InviteUserDialog = ({ open, onClose }: InviteUserDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [signupLink, setSignupLink] = useState<string | null>(null);

  const [inviteUser, { isLoading }] = useInviteUserMutation();

  const handleClose = () => {
    setName('');
    setEmail('');
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    const result = schema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'name' | 'email';
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      const data = await inviteUser({ name, email }).unwrap();
      setSignupLink(data.signupLink);
      handleClose();
    } catch {
      toast.error('Failed to invite user. They may already have an account.');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the new user's details. They'll receive an email with a link
            to set their password.
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
              autoFocus
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            loading={isLoading}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      <SignupLinkDialog
        open={signupLink !== null}
        signupLink={signupLink ?? ''}
        title="User Invited"
        description="The user has been invited. Share this link if the email didn't arrive:"
        onClose={() => setSignupLink(null)}
      />
    </>
  );
};
