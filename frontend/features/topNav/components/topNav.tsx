import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const TopNav = () => (
  <AppBar position="fixed">
    <Toolbar>
      <Typography variant="h6" noWrap component="div">
        Dashboard
      </Typography>
    </Toolbar>
  </AppBar>
);
