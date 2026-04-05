import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { SurfaceCard } from './surfaceCard';

import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <Box
    sx={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      p: 3,
    }}
  >
    <Box sx={{ width: 'min(100%, 560px)' }}>
      <SurfaceCard tone="accent" title="Something went wrong 😕">
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="body2" color="text.secondary">
            {(error as Error).message}
          </Typography>
          <Button variant="contained" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Stack>
      </SurfaceCard>
    </Box>
  </Box>
);

interface Props {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: Props) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);
