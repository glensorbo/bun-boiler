import { CssBaseline, ThemeProvider } from '@mui/material';
import { renderToString } from 'react-dom/server';

import { buildTheme } from '@frontend/providers/theme';

import type { PaletteMode } from '@mui/material/styles';
import type { ReactElement } from 'react';

interface RenderOptions {
  mode?: PaletteMode;
}

export const renderWithTheme = (
  element: ReactElement,
  { mode = 'light' }: RenderOptions = {},
) =>
  renderToString(
    <ThemeProvider theme={buildTheme(mode)}>
      <CssBaseline />
      {element}
    </ThemeProvider>,
  );
