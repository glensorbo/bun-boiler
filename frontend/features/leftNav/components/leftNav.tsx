import BoltIcon from '@mui/icons-material/Bolt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import LayersIcon from '@mui/icons-material/Layers';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router';

import { DRAWER_WIDTH } from '@frontend/layout/constants';

const navItems = [
  { label: 'Overview', icon: <DashboardIcon fontSize="small" />, to: '/' },
  { label: 'Insights', icon: <InsightsIcon fontSize="small" />, to: '/' },
  { label: 'Foundations', icon: <LayersIcon fontSize="small" />, to: '/' },
] as const;

interface LeftNavProps {
  mobileOpen: boolean;
  onCloseNav: () => void;
}

const LeftNavContent = () => {
  const location = useLocation();
  const items = useMemo(() => navItems, []);
  const theme = useTheme();

  return (
    <Stack sx={{ height: '100%', p: 2, gap: 2 }}>
      <Box
        sx={{
          borderRadius: 4,
          px: 2,
          py: 2.5,
          background: theme.palette.gradient.hero,
          border: '1px solid',
          borderColor: 'border.subtle',
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              backgroundImage: theme.palette.gradient.accent,
              color: '#fff',
            }}
          >
            <BoltIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1">bun-boiler</Typography>
            <Typography variant="body2" sx={{ color: 'sidebar.muted' }}>
              Premium starter dashboard
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box>
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
        <List sx={{ display: 'grid', gap: 0.75 }}>
          {items.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={location.pathname === item.to}
              >
                <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'border.subtle' }} />

      <Box
        sx={{
          mt: 'auto',
          p: 2,
          borderRadius: 4,
          backgroundColor: 'sidebar.accent',
          border: '1px solid',
          borderColor: 'border.subtle',
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="subtitle1">Design system first</Typography>
            <Typography variant="body2" sx={{ color: 'sidebar.muted' }}>
              Use the shared dashboard components to keep new features fast and
              consistent.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<SupportAgentIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Implementation guide
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export const LeftNav = ({ mobileOpen, onCloseNav }: LeftNavProps) => (
  <>
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
      <LeftNavContent />
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', lg: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
      open
    >
      <LeftNavContent />
    </Drawer>
  </>
);
