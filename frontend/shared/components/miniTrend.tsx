import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import type { Theme } from '@mui/material/styles';

interface MiniTrendProps {
  points: number[];
  height?: number;
  color?: string;
  labels?: string[];
}

const resolveColor = (color: string | undefined, theme: Theme): string => {
  if (!color) {
    return theme.palette.primary.main;
  }
  const [palette, variant] = color.split('.');
  if (palette && variant) {
    const entry = theme.palette[palette as keyof typeof theme.palette];
    if (entry && typeof entry === 'object' && variant in entry) {
      return (entry as Record<string, string>)[variant] ?? color;
    }
  }
  return color;
};

export const MiniTrend = ({
  points,
  height = 132,
  color,
  labels,
}: MiniTrendProps) => {
  const theme = useTheme();
  const resolvedColor = resolveColor(color, theme);

  return (
    <BarChart
      series={[{ data: points, color: resolvedColor }]}
      xAxis={[
        {
          data: labels ?? points.map((_, i) => String(i + 1)),
          scaleType: 'band',
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: labels ? { fontSize: 11 } : { display: 'none' },
        },
      ]}
      yAxis={[
        {
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: { display: 'none' },
        },
      ]}
      height={height}
      margin={{ top: 4, bottom: labels ? 28 : 4, left: 4, right: 4 }}
    />
  );
};
