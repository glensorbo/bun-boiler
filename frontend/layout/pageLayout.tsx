import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router';

import { LeftNav } from '../features/leftNav/components/leftNav';
import { TopNav } from '../features/topNav/components/topNav';
import { DRAWER_WIDTH } from './constants';

export const PageLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      />
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
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
