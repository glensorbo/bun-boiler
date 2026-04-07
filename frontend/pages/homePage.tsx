import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BoltIcon from '@mui/icons-material/Bolt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { DashboardPage } from '@frontend/shared/components/dashboardPage';
import { DashboardTable } from '@frontend/shared/components/dashboardTable';
import { EmptyState } from '@frontend/shared/components/emptyState';
import { MiniTrend } from '@frontend/shared/components/miniTrend';
import { ProgressList } from '@frontend/shared/components/progressList';
import { StatCard } from '@frontend/shared/components/statCard';
import { SurfaceCard } from '@frontend/shared/components/surfaceCard';

const pipelineHealth = [
  { label: 'Activation', value: '74%', progress: 74, tone: 'primary' as const },
  {
    label: 'Retention',
    value: '61%',
    progress: 61,
    tone: 'secondary' as const,
  },
  { label: 'Automation', value: '89%', progress: 89, tone: 'success' as const },
  {
    label: 'Revenue ops',
    value: '42%',
    progress: 42,
    tone: 'warning' as const,
  },
];

const workstreams = [
  {
    name: 'Growth loop',
    owner: 'Product',
    status: 'Healthy',
    impact: '+18.4%',
  },
  {
    name: 'Lifecycle journeys',
    owner: 'Marketing',
    status: 'Reviewing',
    impact: '+9.2%',
  },
  {
    name: 'Workspace roles',
    owner: 'Platform',
    status: 'Shipping',
    impact: '+12.8%',
  },
  {
    name: 'Audit trail',
    owner: 'Security',
    status: 'Scoping',
    impact: '+4.1%',
  },
] as const;

const statusTone = {
  Healthy: 'success',
  Reviewing: 'warning',
  Shipping: 'primary',
  Scoping: 'default',
} as const;

export const HomePage = () => (
  <DashboardPage
    eyebrow="Modern dashboard starter"
    title="Build beautiful product dashboards from day one"
    description="This template now ships with a richer visual language, reusable dashboard primitives, and a polished shell so future features can plug into a system instead of starting from scratch."
    actions={
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button variant="contained">Create workspace</Button>
        <Button variant="outlined">View patterns</Button>
      </Stack>
    }
  >
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          xl: '1.5fr minmax(320px, 0.9fr)',
        },
      }}
    >
      <SurfaceCard
        tone="accent"
        title="Design-rich by default"
        description="Use this showcase page as a living reference for spacing, card composition, tone, and dashboard density."
        action={<Chip label="New theme system" color="primary" />}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ gap: 3, alignItems: { md: 'center' } }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ maxWidth: 560 }}>
                A refined dashboard aesthetic with layered surfaces, glassy
                panels, and richer hierarchy.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5, maxWidth: 620 }}
              >
                The shared component set keeps features visually aligned without
                forcing giant prop APIs.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                minWidth: { md: 260 },
              }}
            >
              <Chip
                icon={<ShieldMoonIcon />}
                label="Dark + light tuned"
                variant="outlined"
              />
              <Chip
                icon={<PsychologyIcon />}
                label="Small, composable primitives"
                variant="outlined"
              />
              <Chip
                icon={<BoltIcon />}
                label="Ready for feature teams"
                variant="outlined"
              />
            </Box>
          </Stack>
        </Stack>
      </SurfaceCard>

      <SurfaceCard
        title="Release momentum"
        description="A quick signal card for your template starter metrics."
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h2">84%</Typography>
            <Typography variant="body2" color="text.secondary">
              overall adoption score across your first-run experience
            </Typography>
          </Box>
          <MiniTrend
            points={[18, 28, 24, 42, 36, 54, 76, 84]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Now']}
            color="secondary.main"
          />
        </Stack>
      </SurfaceCard>
    </Box>

    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      <StatCard
        label="Active workspaces"
        value="128"
        trend="+12.6%"
        helper="vs last 30 days"
        tone="accent"
        icon={<PeopleAltIcon fontSize="small" />}
      />
      <StatCard
        label="Automations shipped"
        value="42"
        trend="+8.4%"
        helper="new shared patterns ready"
        tone="positive"
        icon={<BoltIcon fontSize="small" />}
      />
      <StatCard
        label="Dashboard coverage"
        value="91%"
        trend="Stable"
        helper="core components documented"
        tone="warning"
        icon={<Inventory2Icon fontSize="small" />}
      />
      <StatCard
        label="Insight velocity"
        value="2.8x"
        trend="+19.3%"
        helper="faster feature implementation"
        tone="default"
        icon={<TrendingUpIcon fontSize="small" />}
      />
    </Box>

    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
        },
      }}
    >
      <SurfaceCard
        title="Weekly growth pulse"
        description="Example of a compact chart panel built from a shared primitive."
        action={<Chip label="Revenue signal" variant="outlined" />}
      >
        <MiniTrend
          points={[32, 54, 36, 61, 48, 70, 84]}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        />
      </SurfaceCard>
      <SurfaceCard
        title="Pipeline health"
        description="Typical progress composition for funnels, onboarding, or rollout status."
      >
        <ProgressList items={pipelineHealth} />
      </SurfaceCard>
    </Box>

    <DashboardTable
      title="High-impact workstreams"
      description="A reusable table wrapper for dashboard pages that need a lightweight activity view."
      columns={['Initiative', 'Owner', 'Status', 'Impact']}
      action={<Button variant="text">See all</Button>}
    >
      {workstreams.map((workstream) => (
        <TableRow key={workstream.name}>
          <TableCell>
            <Typography variant="subtitle2">{workstream.name}</Typography>
          </TableCell>
          <TableCell>{workstream.owner}</TableCell>
          <TableCell>
            <Chip
              label={workstream.status}
              color={statusTone[workstream.status]}
              size="small"
            />
          </TableCell>
          <TableCell>{workstream.impact}</TableCell>
        </TableRow>
      ))}
    </DashboardTable>

    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: 'repeat(2, minmax(0, 1fr))',
        },
      }}
    >
      <SurfaceCard
        title="Opportunity map"
        description="Use concise cards for richer narrative context, not only metrics."
      >
        <Stack spacing={1.5}>
          <Typography variant="body1">
            The next feature teams should focus on reusable table patterns,
            detail side panels, and dashboard filters.
          </Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<AutoGraphIcon />} label="Charts" variant="outlined" />
            <Chip
              icon={<PeopleAltIcon />}
              label="Collaboration"
              variant="outlined"
            />
            <Chip
              icon={<Inventory2Icon />}
              label="Operational views"
              variant="outlined"
            />
          </Stack>
        </Stack>
      </SurfaceCard>

      <SurfaceCard
        title="Automations"
        description="Example empty state composition for blank dashboard modules."
      >
        <EmptyState
          icon={<BoltIcon fontSize="small" />}
          title="No automations connected yet"
          description="Use this shared empty state for dashboards, detail pages, and settings screens when a module has not been configured."
          actionLabel="Create automation"
          onAction={() => undefined}
        />
      </SurfaceCard>
    </Box>
  </DashboardPage>
);
