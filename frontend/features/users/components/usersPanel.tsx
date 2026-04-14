import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
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
import { dayjs } from '@frontend/shared/utils/dayjs';
import type { User } from '@backend/types/user';
import type { GridColDef } from '@mui/x-data-grid';

export const UsersPanel = () => {
  const currentUserId = useSelector(selectUserId);
  const { data: users, isLoading } = useGetUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [resetPassword] = useResetUserPasswordMutation();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [resetingId, setResetingId] = useState<string | null>(null);

  const handleRoleChange = useCallback(
    async (user: User, role: 'admin' | 'user') => {
      try {
        await updateRole({ id: user.id!, role }).unwrap();
        toast.success(`${user.name}'s role updated to ${role}.`);
      } catch {
        toast.error('Failed to update role.');
      }
    },
    [updateRole],
  );

  const handleResetPassword = useCallback(
    async (user: User) => {
      setResetingId(user.id!);
      try {
        const data = await resetPassword(user.id!).unwrap();
        setResetLink(data.signupLink);
      } catch {
        toast.error('Failed to reset password.');
      } finally {
        setResetingId(null);
      }
    },
    [resetPassword],
  );

  const columns = useMemo<GridColDef<User>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {params.row.name}
            </Typography>
            {params.row.id === currentUserId && (
              <Chip
                label="you"
                size="small"
                sx={{ height: 18, fontSize: 11 }}
              />
            )}
          </Box>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.5,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 140,
        sortable: false,
        renderCell: (params) => {
          const isSelf = params.row.id === currentUserId;
          return (
            <Select
              value={params.row.role}
              size="small"
              disabled={isSelf}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                handleRoleChange(params.row, e.target.value as 'admin' | 'user')
              }
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="admin">admin</MenuItem>
              <MenuItem value="user">user</MenuItem>
            </Select>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Joined',
        width: 120,
        valueFormatter: (value: string) => dayjs(value).format('YYYY-MM-DD'),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => {
          const isSelf = params.row.id === currentUserId;
          return (
            <>
              <Tooltip title="Reset password">
                <span>
                  <IconButton
                    size="small"
                    disabled={resetingId === params.row.id}
                    onClick={() => handleResetPassword(params.row)}
                  >
                    <LockResetIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  isSelf ? 'Cannot delete your own account' : 'Delete user'
                }
              >
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={isSelf}
                    onClick={() => setDeleteTarget(params.row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          );
        },
      },
    ],
    [currentUserId, resetingId, handleRoleChange, handleResetPassword],
  );

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
        <DataGrid
          rows={users ?? []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id!}
          disableRowSelectionOnClick
          hideFooter
          sx={{ border: 'none' }}
        />
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
