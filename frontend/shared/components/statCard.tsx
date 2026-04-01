import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';

type StatTone = 'default' | 'accent' | 'positive' | 'warning' | 'danger';

type MuiChipColor = 'default' | 'primary' | 'success' | 'warning' | 'error';

interface StatCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
  trend?: string;
  icon?: ReactNode;
  tone?: StatTone;
}

const toneStyles: Record<
  StatTone,
  { bg: string; bgAlpha: string; chipColor: MuiChipColor }
> = {
  default: {
    bg: 'text.primary',
    bgAlpha: 'rgba(var(--mui-palette-text-primaryChannel) / 0.14)',
    chipColor: 'default',
  },
  accent: {
    bg: 'primary.main',
    bgAlpha: 'rgba(var(--mui-palette-primary-mainChannel) / 0.14)',
    chipColor: 'primary',
  },
  positive: {
    bg: 'success.main',
    bgAlpha: 'rgba(var(--mui-palette-success-mainChannel) / 0.14)',
    chipColor: 'success',
  },
  warning: {
    bg: 'warning.main',
    bgAlpha: 'rgba(var(--mui-palette-warning-mainChannel) / 0.14)',
    chipColor: 'warning',
  },
  danger: {
    bg: 'error.main',
    bgAlpha: 'rgba(var(--mui-palette-error-mainChannel) / 0.14)',
    chipColor: 'error',
  },
};

export const StatCard = ({
  label,
  value,
  helper,
  trend,
  icon,
  tone = 'default',
}: StatCardProps) => {
  const toneStyle = toneStyles[tone];

  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        {icon ? (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: toneStyle.bgAlpha,
              color: toneStyle.bg,
            }}
          >
            {icon}
          </Box>
        ) : null}
      </Stack>
      {helper || trend ? (
        <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 2 }}>
          {trend ? (
            <Chip
              label={trend}
              size="small"
              color={toneStyle.chipColor}
              sx={{ fontWeight: 700 }}
            />
          ) : null}
          {helper ? (
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
    </Card>
  );
};
