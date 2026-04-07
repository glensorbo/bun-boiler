import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';

interface DashboardPageProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const DashboardPage = ({
  title,
  description,
  eyebrow,
  actions,
  children,
}: DashboardPageProps) => (
  <Stack spacing={3}>
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
      }}
    >
      <Box>
        {eyebrow ? (
          <Typography
            variant="subtitle2"
            sx={{ color: 'primary.main', textTransform: 'uppercase', mb: 1 }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h3">{title}</Typography>
        {description ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
    {children}
  </Stack>
);
