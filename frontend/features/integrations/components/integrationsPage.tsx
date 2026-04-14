import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  useGetIntegrationsQuery,
  useSendTestEmailMutation,
} from '@frontend/redux/api/integrationsApi';
import { DashboardPage } from '@frontend/shared/components/dashboardPage';
import { ListSkeleton } from '@frontend/shared/components/listSkeleton';
import { SurfaceCard } from '@frontend/shared/components/surfaceCard';
import type { Integration } from '@frontend/redux/api/integrationsApi';

const statusChip = (status: Integration['status']) => {
  if (status === 'healthy') {
    return (
      <Chip
        label="Healthy"
        color="success"
        size="small"
        icon={<CheckCircleOutlineIcon fontSize="small" />}
      />
    );
  }
  if (status === 'degraded') {
    return (
      <Chip
        label="Degraded"
        color="error"
        size="small"
        icon={<ErrorOutlineIcon fontSize="small" />}
      />
    );
  }
  return (
    <Chip
      label="Disabled"
      color="default"
      size="small"
      icon={<RemoveCircleOutlineIcon fontSize="small" />}
    />
  );
};

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const [sendTestEmail, { isLoading, isSuccess, isError }] =
    useSendTestEmailMutation();

  return (
    <SurfaceCard>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">{integration.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {integration.description}
            </Typography>
          </Stack>
          {statusChip(integration.status)}
        </Stack>

        {integration.config !== null ? (
          <Stack spacing={0.25}>
            {Object.entries(integration.config).map(([key, value]) => (
              <Typography key={key} variant="caption" color="text.secondary">
                <strong>{key}:</strong> {value}
              </Typography>
            ))}
          </Stack>
        ) : null}

        {integration.id === 'smtp' && integration.status !== 'disabled' ? (
          <Stack spacing={1} sx={{ pt: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              loading={isLoading}
              onClick={() => sendTestEmail()}
              sx={{ alignSelf: 'flex-start' }}
            >
              Send test email
            </Button>
            {isSuccess ? (
              <Alert severity="success">Test email sent to your account.</Alert>
            ) : null}
            {isError ? (
              <Alert severity="error">Failed to send test email.</Alert>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </SurfaceCard>
  );
};

export const IntegrationsPage = () => {
  const { data: integrations, isLoading } = useGetIntegrationsQuery();
  const hasDegraded =
    integrations?.some((i) => i.status === 'degraded') ?? false;

  return (
    <DashboardPage
      eyebrow="Settings"
      title="Integrations"
      description="Live status of all backend and frontend integrations."
    >
      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : (
        <Stack sx={{ gap: 2 }}>
          {hasDegraded && (
            <Alert severity="warning">
              One or more active integrations are reporting issues.
            </Alert>
          )}
          {integrations?.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </Stack>
      )}
    </DashboardPage>
  );
};
