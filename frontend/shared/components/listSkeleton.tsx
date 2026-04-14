import Box from '@mui/material/Box';
import MuiSkeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const ListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Stack spacing={1.75}>
    {Array.from({ length: rows }).map((_, i) => (
      <Box
        key={i}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1.5,
          borderRadius: 3,
          backgroundColor: 'surface.sunken',
        }}
      >
        <MuiSkeleton variant="circular" width={40} height={40} />
        <Stack sx={{ flex: 1 }} spacing={0.5}>
          <MuiSkeleton variant="text" width="60%" height={20} />
          <MuiSkeleton variant="text" width="40%" height={16} />
        </Stack>
      </Box>
    ))}
  </Stack>
);
