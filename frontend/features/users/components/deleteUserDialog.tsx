import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { useDeleteUserMutation } from '../state/usersApi';
import type { User } from '@backend/types/user';

interface DeleteUserDialogProps {
  user: User | null;
  onClose: () => void;
}

export const DeleteUserDialog = ({ user, onClose }: DeleteUserDialogProps) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleConfirm = async () => {
    if (!user) {
      return;
    }
    try {
      await deleteUser(user.id!).unwrap();
      toast.success(`${user.name} has been deleted.`);
      onClose();
    } catch {
      toast.error('Failed to delete user.');
    }
  };

  return (
    <Dialog open={user !== null} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{user?.name}</strong> (
          {user?.email})? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirm}
          loading={isLoading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
