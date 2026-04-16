import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { LeftNav } from '../features/leftNav/components/leftNav';
import { TopNav } from '../features/topNav/components/topNav';
import { drawerConfig } from './drawerConfig';

export const PageLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <LeftNav
        mobileOpen={mobileNavOpen}
        onCloseNav={() => setMobileNavOpen(false)}
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed((c) => !c)}
      />
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: {
            lg: `calc(100% - ${navCollapsed ? drawerConfig.collapsedDrawerWidth : drawerConfig.drawerWidth}px)`,
          },
          transition: 'width 0.2s ease',
        }}
      >
        <TopNav onOpenNav={() => setMobileNavOpen(true)} />
        <Box
          component="main"
          sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
