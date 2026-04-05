import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type ProgressTone = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface ProgressListItem {
  label: string;
  value: string;
  progress: number;
  tone?: ProgressTone;
}

interface ProgressListProps {
  items: ProgressListItem[];
}

export const ProgressList = ({ items }: ProgressListProps) => (
  <Stack spacing={2}>
    {items.map(({ label, value, progress, tone = 'primary' }) => (
      <Stack key={label} spacing={0.75}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {value}
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progress} color={tone} />
      </Stack>
    ))}
  </Stack>
);
