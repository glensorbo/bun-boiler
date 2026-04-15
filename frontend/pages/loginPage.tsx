import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { LoginForm } from '@frontend/features/login/components/loginForm';
import { selectIsAuthenticated } from '@frontend/features/login/state/authSlice';
import { SurfaceCard } from '@frontend/shared/components/surfaceCard';
import type { RootState } from '@frontend/redux/store';

const LoginPage = () => {
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state),
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        height: '100dvh',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'grid',
        alignItems: 'stretch',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: '1.1fr minmax(420px, 0.9fr)',
        },
        gap: 3,
        p: { xs: 2, md: 3 },
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <SurfaceCard tone="accent">
          <Stack sx={{ justifyContent: 'space-between', height: '100%' }}>
            <Box>
              <Chip label="bun-boiler dashboard starter" color="primary" />
              <Typography variant="h2" sx={{ mt: 3, maxWidth: 640 }}>
                Build a premium dashboard product without designing every screen
                from scratch.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 2, maxWidth: 560 }}
              >
                The new theme foundation ships with layered surfaces, modern
                navigation, and reusable dashboard primitives ready for new
                features.
              </Typography>
            </Box>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              sx={{ gap: 2, mt: 4 }}
            >
              <SurfaceCard
                title="Reusable UI"
                description="Shared components cover cards, stats, tables, trends, and empty states."
              >
                <Typography variant="body2" color="text.secondary">
                  Build faster while keeping pages visually consistent.
                </Typography>
              </SurfaceCard>
              <SurfaceCard
                title="Token-driven theme"
                description="Light and dark schemes are tuned for dense product dashboards."
              >
                <Typography variant="body2" color="text.secondary">
                  Future features inherit the same spacing, color, and surface
                  system.
                </Typography>
              </SurfaceCard>
            </Stack>
          </Stack>
        </SurfaceCard>
      </Box>

      <SurfaceCard
        title="Welcome back"
        description="Sign in to continue building from the new dashboard foundation."
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 460,
            mx: 'auto',
            py: { xs: 1, md: 4 },
          }}
        >
          <LoginForm />
        </Box>
      </SurfaceCard>
    </Box>
  );
};

export { LoginPage };
export default LoginPage;
