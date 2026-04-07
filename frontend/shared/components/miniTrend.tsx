import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface MiniTrendProps {
  points: number[];
  height?: number;
  color?: string;
  labels?: string[];
}

export const MiniTrend = ({
  points,
  height = 132,
  color = 'primary.main',
  labels,
}: MiniTrendProps) => {
  const max = Math.max(...points, 1);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ alignItems: 'end', gap: 1, height }}>
        {points.map((point, index) => (
          <Box
            key={`${point}-${index}`}
            sx={{ flex: 1, height: '100%', display: 'flex', alignItems: 'end' }}
          >
            <Box
              data-slot="mini-trend-bar"
              sx={{
                width: '100%',
                height: `${(point / max) * 100}%`,
                minHeight: 14,
                borderRadius: 999,
                backgroundColor: color,
                opacity: 0.32 + index / Math.max(points.length * 1.5, 1),
              }}
            />
          </Box>
        ))}
      </Stack>
      {labels?.length ? (
        <Stack direction="row" sx={{ gap: 1 }}>
          {labels.map((label) => (
            <Typography
              key={label}
              variant="caption"
              color="text.secondary"
              sx={{ flex: 1 }}
            >
              {label}
            </Typography>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
};
