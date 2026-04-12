import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExtensionIcon from '@mui/icons-material/Extension';
import InsightsIcon from '@mui/icons-material/Insights';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';

import { VersionBadge } from './versionBadge';
import { selectUserRole } from '@frontend/features/login/state/authSlice';
import {
  COLLAPSED_DRAWER_WIDTH,
  DRAWER_WIDTH,
} from '@frontend/layout/constants';

const navItems = [
  { label: 'Overview', icon: <DashboardIcon fontSize="small" />, to: '/' },
  { label: 'Insights', icon: <InsightsIcon fontSize="small" />, to: '/' },
  { label: 'Foundations', icon: <LayersIcon fontSize="small" />, to: '/' },
] as const;

const adminNavItems = [
  { label: 'Users', icon: <PeopleIcon fontSize="small" />, to: '/users' },
  {
    label: 'Integrations',
    icon: <ExtensionIcon fontSize="small" />,
    to: '/integrations',
  },
] as const;

interface LeftNavProps {
  mobileOpen: boolean;
  onCloseNav: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface LeftNavContentProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const LeftNavContent = ({
  collapsed,
  onToggleCollapse,
}: LeftNavContentProps) => {
  const location = useLocation();
  const items = useMemo(() => navItems, []);
  const userRole = useSelector(selectUserRole);

  const navButton = (item: {
    label: string;
    icon: React.ReactNode;
    to: string;
  }) => (
    <ListItem key={item.label} disablePadding>
      <Tooltip title={collapsed ? item.label : ''} placement="right">
        <ListItemButton
          component={Link}
          to={item.to}
          selected={location.pathname === item.to}
          sx={{
            justifyContent: collapsed ? 'center' : undefined,
            px: collapsed ? 1.5 : 2,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 34,
              color: 'inherit',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { sx: { fontWeight: 600 } } }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );

  return (
    <Stack sx={{ height: '100%', p: collapsed ? 1 : 2, gap: 2 }}>
      {/* Title row — always visible; chevron lives here */}
      <Stack
        direction="row"
        sx={{ alignItems: 'center', px: collapsed ? 0 : 0.5, minHeight: 32 }}
      >
        {!collapsed && (
          <Typography
            component={Link}
            to="/"
            variant="subtitle1"
            sx={{ flex: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Bun kitchen
          </Typography>
        )}
        <Tooltip
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          placement="right"
        >
          <IconButton
            size="small"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            sx={{
              color: 'text.secondary',
              ml: collapsed ? 'auto' : 0,
              mr: collapsed ? 'auto' : 0,
            }}
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      <Box>
        {!collapsed && (
          <Typography
            variant="subtitle2"
            sx={{
              color: 'sidebar.muted',
              px: 1.5,
              mb: 1,
              textTransform: 'uppercase',
            }}
          >
            Navigation
          </Typography>
        )}
        <List sx={{ display: 'grid', gap: 0.75 }}>{items.map(navButton)}</List>
      </Box>

      {userRole === 'admin' ? (
        <>
          <Divider sx={{ borderColor: 'border.subtle' }} />
          <Box>
            {!collapsed && (
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'sidebar.muted',
                  px: 1.5,
                  mb: 1,
                  textTransform: 'uppercase',
                }}
              >
                Admin
              </Typography>
            )}
            <List sx={{ display: 'grid', gap: 0.75 }}>
              {adminNavItems.map(navButton)}
            </List>
          </Box>
        </>
      ) : null}

      <Box sx={{ mt: 'auto', alignItems: collapsed ? 'center' : 'flex-start' }}>
        {!collapsed && <VersionBadge />}
      </Box>
    </Stack>
  );
};

export const LeftNav = ({
  mobileOpen,
  onCloseNav,
  collapsed = false,
  onToggleCollapse = () => {},
}: LeftNavProps) => (
  <>
    {/* Mobile: always full-width temp drawer, no collapse */}
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onCloseNav}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', lg: 'none' },
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <LeftNavContent collapsed={false} onToggleCollapse={onCloseNav} />
    </Drawer>

    {/* Desktop: permanent drawer, collapsible */}
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', lg: 'block' },
        width: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
        },
      }}
      open
    >
      <LeftNavContent
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </Drawer>
  </>
);
