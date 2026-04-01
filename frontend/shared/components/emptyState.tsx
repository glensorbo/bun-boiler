import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <Stack
    spacing={1.5}
    alignItems="flex-start"
    sx={{
      borderRadius: 4,
      border: '1px dashed',
      borderColor: 'border.strong',
      backgroundColor: 'surface.sunken',
      p: 3,
    }}
  >
    {icon ? (
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          display: 'grid',
          placeItems: 'center',
          color: 'primary.main',
          backgroundColor: 'sidebar.accent',
        }}
      >
        {icon}
      </Box>
    ) : null}
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
    {actionLabel && onAction ? (
      <Button variant="outlined" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);
