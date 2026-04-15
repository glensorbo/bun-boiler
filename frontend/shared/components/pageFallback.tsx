import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

/** Top-of-page progress bar shown while a lazy route chunk is being fetched */
export const PageFallback = () => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
);
