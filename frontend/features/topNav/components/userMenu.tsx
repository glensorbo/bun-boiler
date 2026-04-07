import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightModeIcon from '@mui/icons-material/LightMode';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { decodeJwt } from 'jose';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLogout } from '../hooks/useLogout';
import { ChangePasswordModal } from './changePasswordModal';
import { SetPasswordModal } from './setPasswordModal';
import { useAnalytics } from '@frontend/features/analytics/useAnalytics';
import {
  selectUserEmail,
  selectUserName,
  selectUserRole,
} from '@frontend/features/login/state/authSlice';
import { setThemeMode } from '@frontend/redux/slices/themeSlice';

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

const dicebearUrl = (email: string) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(email)}`;

const ROLE_CHIP_COLORS: Record<string, 'error' | 'default'> = {
  admin: 'error',
};

export const UserMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useLogout();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const token = useSelector((state: RootState) => state.auth.token);
  const displayName = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);
  const role = useSelector(selectUserRole);
  const { trackEvent } = useAnalytics();

  const isSignupToken =
    !!token &&
    (() => {
      try {
        return decodeJwt(token).tokenType === 'signup';
      } catch {
        return false;
      }
    })();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [setPasswordOpen, setSetPasswordOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const closeMenu = () => setAnchorEl(null);

  const handleThemeModeSelect = (
    _: React.MouseEvent<HTMLElement>,
    mode: ThemeMode | null,
  ) => {
    if (!mode) {
      return;
    }
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

  const avatarSrc = email ? dicebearUrl(email) : undefined;

  return (
    <>
      {/* ── Pill trigger button ── */}
      <ButtonBase
        onClick={openMenu}
        aria-label="Open user menu"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 99,
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          transition: 'background-color 0.2s',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
        }}
      >
        <Avatar src={avatarSrc} sx={{ width: 28, height: 28 }}>
          <AccountCircleIcon fontSize="small" />
        </Avatar>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            display: { xs: 'none', sm: 'block' },
            maxWidth: 120,
          }}
          noWrap
        >
          {displayName ?? email ?? ''}
        </Typography>
        {role && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            {role}
          </Typography>
        )}
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            color: 'text.secondary',
            transition: 'transform 0.2s',
            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 260, mt: 0.5 } } }}
      >
        {/* ── Profile header ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
          }}
        >
          <Avatar src={avatarSrc} sx={{ width: 44, height: 44 }}>
            <AccountCircleIcon />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
              {displayName ?? email ?? ''}
            </Typography>
            {email && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
                noWrap
              >
                {email}
              </Typography>
            )}
            {role && (
              <Chip
                label={role}
                size="small"
                color={ROLE_CHIP_COLORS[role] ?? 'default'}
                sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }}
              />
            )}
          </Box>
        </Box>

        <Divider />

        {/* ── Inline theme toggle ── */}
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.75 }}
          >
            Theme
          </Typography>
          <ToggleButtonGroup
            value={themeMode}
            exclusive
            onChange={handleThemeModeSelect}
            size="small"
            fullWidth
          >
            {THEME_OPTIONS.map(({ value, label, icon }) => (
              <Tooltip key={value} title={label}>
                <ToggleButton value={value} aria-label={label}>
                  {icon}
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Divider />

        {/* ── Password action ── */}
        <MenuItem onClick={handlePasswordAction}>
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

        <Divider />

        {/* ── Sign out (red-tinted) ── */}
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            slotProps={{ primary: { variant: 'body2' } }}
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
