import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { UserMenu } from './userMenu';

interface TopNavProps {
  onOpenNav: () => void;
}

export const TopNav = ({ onOpenNav }: TopNavProps) => {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 72, md: 84 },
          px: { xs: 2, md: 4 },
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'border.subtle',
          backdropFilter: 'blur(18px)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <IconButton
          onClick={onOpenNav}
          sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
        <Stack spacing={0.2} sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Workspace
          </Typography>
          <Typography variant="h6" noWrap>
            Dashboard command center
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          placeholder="Search dashboards, reports, people..."
          size="small"
          sx={{ display: { xs: 'none', md: 'flex' }, width: 320 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          New report
        </Button>
        <Box>
          <UserMenu />
        </Box>
      </Toolbar>
    </Box>
  );
};
