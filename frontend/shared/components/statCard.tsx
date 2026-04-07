import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
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

export const StatCard = ({
  label,
  value,
  helper,
  trend,
  icon,
  tone = 'default',
}: StatCardProps) => {
  const { palette } = useTheme();

  const bgColor: Record<StatTone, string> = {
    default: palette.text.primary,
    accent: palette.primary.main,
    positive: palette.success.main,
    warning: palette.warning.main,
    danger: palette.error.main,
  };

  const bg = bgColor[tone];

  const chipColor: Record<StatTone, MuiChipColor> = {
    default: 'default',
    accent: 'primary',
    positive: 'success',
    warning: 'warning',
    danger: 'error',
  };

  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
        }}
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
              backgroundColor: alpha(bg, 0.14),
              color: bg,
            }}
          >
            {icon}
          </Box>
        ) : null}
      </Stack>
      {helper || trend ? (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 2 }}>
          {trend ? (
            <Chip
              label={trend}
              size="small"
              color={chipColor[tone]}
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
