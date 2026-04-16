import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { SurfaceCard } from '@frontend/shared/components/surfaceCard';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export const InsightsPage = () => {
  return (
    <SurfaceCard
      title="Release momentum"
      description="A quick signal card for your template starter metrics."
    >
      <Box sx={{ width: '100%', height: 300 }}>
        <BarChart
          series={[
            { data: pData, label: 'pv', id: 'pvId' },
            { data: uData, label: 'uv', id: 'uvId' },
          ]}
          xAxis={[{ data: xLabels, height: 28 }]}
          yAxis={[{ width: 50 }]}
        />
      </Box>
    </SurfaceCard>
  );
};
