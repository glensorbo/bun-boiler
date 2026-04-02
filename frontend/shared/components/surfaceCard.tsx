import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';

interface SurfaceCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  footer?: ReactNode;
  tone?: 'default' | 'accent';
  children: ReactNode;
}

export const SurfaceCard = ({
  title,
  description,
  action,
  footer,
  tone = 'default',
  children,
}: SurfaceCardProps) => (
  <Card
    sx={{
      p: 2.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderColor: tone === 'accent' ? 'primary.main' : 'border.subtle',
      background: (theme) =>
        tone === 'accent'
          ? theme.palette.gradient.hero
          : theme.palette.surface.overlay,
    }}
  >
    {title || description || action ? (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          {title ? <Typography variant="h6">{title}</Typography> : null}
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action ? <Box>{action}</Box> : null}
      </Stack>
    ) : null}
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
    {footer ? <Box sx={{ mt: 2.5 }}>{footer}</Box> : null}
  </Card>
);
