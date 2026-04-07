import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MuiSkeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

/**
 * Skeleton for a data table — mimics rows of tabular content.
 */
export const TableSkeleton = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) => (
  <Stack spacing={1.5}>
    <Box sx={{ display: 'flex', gap: 2, pb: 1 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <MuiSkeleton
          key={i}
          variant="text"
          width={`${100 / cols}%`}
          height={24}
        />
      ))}
    </Box>
    {Array.from({ length: rows }).map((_item, row) => (
      <Box
        key={row}
        sx={{
          display: 'flex',
          gap: 2,
          p: 1.25,
          borderRadius: 3,
          backgroundColor: 'surface.sunken',
        }}
      >
        {Array.from({ length: cols }).map((_col, col) => (
          <MuiSkeleton
            key={col}
            variant="text"
            width={`${100 / cols}%`}
            height={20}
          />
        ))}
      </Box>
    ))}
  </Stack>
);

/**
 * Skeleton for a list of items — mimics a vertically stacked list.
 */
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

/**
 * Skeleton for a content card — mimics a card with a title and body text.
 */
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
