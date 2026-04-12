import DarkModeIcon from '@mui/icons-material/DarkMode';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightModeIcon from '@mui/icons-material/LightMode';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { decodeJwt } from 'jose';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLogout } from '../hooks/useLogout';
import { ChangePasswordModal } from './changePasswordModal';
import { SetPasswordModal } from './setPasswordModal';
import { useAnalytics } from '@frontend/features/analytics/useAnalytics';
import { setThemeMode } from '@frontend/redux/slices/themeSlice';
import { UserAvatar } from '@frontend/shared/components/userAvatar';

import type { AppDispatch, RootState } from '@frontend/redux/store';

type ThemeMode = 'system' | 'light' | 'dark';

const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: React.ReactElement;
}[] = [
  {
    value: 'system',
    label: 'System',
    icon: <SettingsBrightnessIcon fontSize="small" />,
  },
  { value: 'light', label: 'Light', icon: <LightModeIcon fontSize="small" /> },
  { value: 'dark', label: 'Dark', icon: <DarkModeIcon fontSize="small" /> },
];

const decodeTokenField = <T,>(
  token: string | null,
  field: string,
  fallback: T,
): T => {
  if (!token) {
    return fallback;
  }
  try {
    return (decodeJwt(token)[field] as T | undefined) ?? fallback;
  } catch {
    return fallback;
  }
};

export const UserMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useLogout();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const token = useSelector((state: RootState) => state.auth.token);
  const { trackEvent } = useAnalytics();

  const email = decodeTokenField<string>(token, 'email', 'guest');
  const name = decodeTokenField<string>(token, 'name', '');
  const role = decodeTokenField<string>(token, 'role', '');
  const isSignupToken =
    decodeTokenField<string>(token, 'tokenType', '') === 'signup';

  const displayName = name || email.split('@')[0] || 'User';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [setPasswordOpen, setSetPasswordOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const closeMenu = () => setAnchorEl(null);

  const handleThemeModeSelect = (mode: ThemeMode) => {
    trackEvent('theme_changed', { mode });
    dispatch(setThemeMode(mode));
  };

  const handlePasswordAction = () => {
    closeMenu();
    if (isSignupToken) {
      setSetPasswordOpen(true);
    } else {
      setChangePasswordOpen(true);
    }
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <>
      {/* ── Trigger button ── */}
      <ButtonBase
        onClick={openMenu}
        aria-label="Open user menu"
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.5,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: menuOpen
            ? theme.palette.border.strong
            : theme.palette.border.subtle,
          backgroundColor: menuOpen
            ? alpha(theme.palette.primary.main, 0.08)
            : 'transparent',
          transition: theme.transitions.create(
            ['background-color', 'border-color'],
            { duration: 150 },
          ),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
            borderColor: theme.palette.border.strong,
          },
        })}
      >
        <UserAvatar seed={email} size={30} />
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-start',
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: 600, lineHeight: 1.2, maxWidth: 140 }}
          >
            {displayName}
          </Typography>
          {role && (
            <Typography
              variant="caption"
              sx={{
                lineHeight: 1.3,
                color: 'text.secondary',
                textTransform: 'capitalize',
              }}
            >
              {role}
            </Typography>
          )}
        </Box>
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            display: { xs: 'none', sm: 'block' },
            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
              duration: 200,
            }),
          })}
        />
      </ButtonBase>

      {/* ── Dropdown ── */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 260, mt: 0.75 } } }}
      >
        {/* ── Profile header ── */}
        <Box
          sx={(theme) => ({
            px: 2,
            py: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`,
            borderBottom: '1px solid',
            borderColor: 'divider',
            mx: 1,
            mt: 0.5,
            mb: 0.5,
            borderRadius: 2,
          })}
        >
          <UserAvatar seed={email} size={44} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}
            >
              <Typography
                variant="subtitle2"
                noWrap
                sx={{ fontWeight: 700, maxWidth: 140 }}
              >
                {displayName}
              </Typography>
              {role && (
                <Chip
                  label={role}
                  size="small"
                  color={role === 'admin' ? 'primary' : 'default'}
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block' }}
              noWrap
            >
              {email}
            </Typography>
          </Box>
        </Box>

        {/* ── Theme switcher ── */}
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              mb: 0.75,
            }}
          >
            Theme
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {THEME_OPTIONS.map(({ value, label, icon }) => (
              <Tooltip key={value} title={label} placement="top">
                <IconButton
                  size="small"
                  onClick={() => handleThemeModeSelect(value)}
                  aria-label={`${label} theme`}
                  sx={(theme) => ({
                    flex: 1,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor:
                      themeMode === value
                        ? theme.palette.primary.main
                        : theme.palette.border.subtle,
                    backgroundColor:
                      themeMode === value
                        ? alpha(theme.palette.primary.main, 0.12)
                        : 'transparent',
                    color:
                      themeMode === value
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  })}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mx: 1 }} />

        {/* ── Password action ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 0.5,
          }}
        >
          <MenuItem
            onClick={handlePasswordAction}
            sx={{ mx: 0.5, borderRadius: 1.5 }}
          >
            <ListItemIcon>
              {isSignupToken ? (
                <LockOpenIcon fontSize="small" />
              ) : (
                <LockIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={isSignupToken ? 'Set password' : 'Change password'}
              slotProps={{ primary: { variant: 'body2' } }}
            />
          </MenuItem>
        </Box>

        <Divider sx={{ mx: 1 }} />

        {/* ── Logout ── */}
        <MenuItem
          onClick={handleLogout}
          sx={(theme) => ({
            mx: 0.5,
            mb: 0.5,
            borderRadius: 1.5,
            color: theme.palette.error.main,
            '& .MuiListItemIcon-root': { color: theme.palette.error.main },
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          })}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            slotProps={{
              primary: { variant: 'body2', sx: { fontWeight: 600 } },
            }}
          />
        </MenuItem>
      </Menu>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <SetPasswordModal
        open={setPasswordOpen}
        onClose={() => setSetPasswordOpen(false)}
      />
    </>
  );
};
