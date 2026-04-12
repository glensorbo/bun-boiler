import Avatar from '@mui/material/Avatar';
import { memo } from 'react';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x';
const BG_COLORS = 'b6e3f4,c0aede,d1d4f9';
const SKIN_COLORS = 'edb98a,ffdbb4';

const buildAvatarUrl = (seed: string): string =>
  `${DICEBEAR_BASE}/avataaars/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=${BG_COLORS}&skinColor=${SKIN_COLORS}`;

type UserAvatarProps = {
  seed: string;
  size?: number;
};

export const UserAvatar = memo(({ seed, size = 32 }: UserAvatarProps) => (
  <Avatar
    src={buildAvatarUrl(seed)}
    alt={seed}
    sx={{ width: size, height: size }}
  >
    {seed.charAt(0).toUpperCase()}
  </Avatar>
));

UserAvatar.displayName = 'UserAvatar';
