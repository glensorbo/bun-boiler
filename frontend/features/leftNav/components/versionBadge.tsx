import Typography from '@mui/material/Typography';

import { useGetVersionQuery } from '@frontend/redux/api/versionApi';

export const VersionBadge = () => {
  const { data } = useGetVersionQuery();
  const version = data?.version ?? '…';
  const env = data?.environment ?? '';
  const label = env === 'prod' ? version : `${env} · ${version}`;

  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        px: 1.5,
        py: 0.5,
        color: 'sidebar.muted',
        opacity: 0.6,
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </Typography>
  );
};
