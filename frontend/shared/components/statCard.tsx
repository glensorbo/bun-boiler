import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';

type StatTone = 'default' | 'accent' | 'positive' | 'warning' | 'danger';

interface StatCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
  trend?: string;
  icon?: ReactNode;
  tone?: StatTone;
}

const toneStyles: Record<StatTone, { bg: string; fg: string }> = {
  default: { bg: 'text.primary', fg: '#ffffff' },
  accent: { bg: 'primary.main', fg: '#ffffff' },
  positive: { bg: 'success.main', fg: '#ffffff' },
  warning: { bg: 'warning.main', fg: '#ffffff' },
  danger: { bg: 'error.main', fg: '#ffffff' },
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
              backgroundColor: alpha(toneStyle.bg, 0.14),
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
              sx={{
                fontWeight: 700,
                color: toneStyle.fg,
                backgroundColor: toneStyle.bg,
              }}
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
