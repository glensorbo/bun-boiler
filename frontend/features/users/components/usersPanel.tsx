import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  useGetUsersQuery,
  useResetUserPasswordMutation,
  useUpdateUserRoleMutation,
} from '../state/usersApi';
import { DeleteUserDialog } from './deleteUserDialog';
import { InviteUserDialog } from './inviteUserDialog';
import { SignupLinkDialog } from './signupLinkDialog';
import { selectUserId } from '@frontend/features/login/state/authSlice';
import { SurfaceCard } from '@frontend/shared/components/surfaceCard';
import { TableSkeleton } from '@frontend/shared/components/tableSkeleton';

import type { User } from '@backend/types/user';

export const UsersPanel = () => {
  const currentUserId = useSelector(selectUserId);
  const { data: users, isLoading } = useGetUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [resetPassword] = useResetUserPasswordMutation();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [resetingId, setResetingId] = useState<string | null>(null);

  const handleRoleChange = async (user: User, role: 'admin' | 'user') => {
    try {
      await updateRole({ id: user.id!, role }).unwrap();
      toast.success(`${user.name}'s role updated to ${role}.`);
    } catch {
      toast.error('Failed to update role.');
    }
  };

  const handleResetPassword = async (user: User) => {
    setResetingId(user.id!);
    try {
      const data = await resetPassword(user.id!).unwrap();
      setResetLink(data.signupLink);
    } catch {
      toast.error('Failed to reset password.');
    } finally {
      setResetingId(null);
    }
  };

  return (
    <>
      <SurfaceCard
        title="Users"
        description="Manage who has access to this application."
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setInviteOpen(true)}
          >
            Invite User
          </Button>
        }
      >
        {isLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {user.name}
                          {isSelf ? (
                            <Chip
                              label="you"
                              size="small"
                              sx={{ ml: 1, height: 18, fontSize: 11 }}
                            />
                          ) : null}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          size="small"
                          disabled={isSelf}
                          onChange={(e) =>
                            handleRoleChange(
                              user,
                              e.target.value as 'admin' | 'user',
                            )
                          }
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value="admin">admin</MenuItem>
                          <MenuItem value="user">user</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(user.createdAt).format('D MMM YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Reset password">
                          <span>
                            <IconButton
                              size="small"
                              disabled={resetingId === user.id}
                              onClick={() => handleResetPassword(user)}
                            >
                              <LockResetIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            isSelf
                              ? 'Cannot delete your own account'
                              : 'Delete user'
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={isSelf}
                              onClick={() => setDeleteTarget(user)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </SurfaceCard>

      <InviteUserDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />

      <DeleteUserDialog
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <SignupLinkDialog
        open={resetLink !== null}
        signupLink={resetLink ?? ''}
        title="Password Reset"
        description="A reset email has been sent. Share this link directly if the email didn't arrive:"
        onClose={() => setResetLink(null)}
      />
    </>
  );
};
