import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { buildTheme } from './theme';

import type { RootState } from '@frontend/redux/store';
import type { PaletteMode } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const resolvedMode: PaletteMode =
    mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

  const theme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
