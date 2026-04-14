import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MuiSkeleton from '@mui/material/Skeleton';

export const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        md: 'repeat(2, minmax(0, 1fr))',
        xl: 'repeat(3, minmax(0, 1fr))',
      },
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Card
        key={i}
        sx={{
          p: 2,
        }}
      >
        <MuiSkeleton
          variant="rectangular"
          height={140}
          sx={{ mb: 1, borderRadius: 0.5 }}
        />
        <MuiSkeleton variant="text" width="70%" height={24} />
        <MuiSkeleton variant="text" width="90%" height={16} />
        <MuiSkeleton variant="text" width="50%" height={16} />
      </Card>
    ))}
  </Box>
);
