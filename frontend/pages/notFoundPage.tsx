import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import { SurfaceCard } from '@frontend/shared/components/surfaceCard';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <SurfaceCard tone="accent">
      <Stack
        sx={{
          minHeight: '70vh',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
        spacing={2}
      >
        <Typography
          component="p"
          sx={{
            fontSize: 'clamp(7rem, 22vw, 14rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            userSelect: 'none',
            background: theme.palette.gradient.accent,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mt: -1 }}>
          Page not found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 420 }}
        >
          The page you&apos;re looking for doesn&apos;t exist, or it has moved
          inside the new dashboard shell.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          sx={{ mt: 2, px: 4 }}
        >
          Back to home
        </Button>
      </Stack>
    </SurfaceCard>
  );
};

export { NotFoundPage };
export default NotFoundPage;
