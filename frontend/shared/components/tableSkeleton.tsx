import Box from '@mui/material/Box';
import MuiSkeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

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
