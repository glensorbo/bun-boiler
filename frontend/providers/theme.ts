import { alpha, createTheme, darken, lighten } from '@mui/material/styles';

import type { PaletteMode, Shadows, Theme } from '@mui/material/styles';

const FONT_STACK = [
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  'sans-serif',
].join(',');

const createDashboardShadows = (mode: PaletteMode): Shadows => {
  const shadows = [...createTheme().shadows] as Shadows;
  const ambient =
    mode === 'dark'
      ? '0 22px 60px rgba(0, 0, 0, 0.42)'
      : '0 24px 64px rgba(15, 23, 42, 0.12)';
  const soft =
    mode === 'dark'
      ? '0 14px 32px rgba(0, 0, 0, 0.32)'
      : '0 14px 32px rgba(15, 23, 42, 0.08)';

  shadows[1] = `0 2px 6px ${alpha('#020617', mode === 'dark' ? 0.32 : 0.06)}`;
  shadows[2] = `0 8px 20px ${alpha('#020617', mode === 'dark' ? 0.36 : 0.08)}`;
  shadows[4] = soft;
  shadows[8] = ambient;

  return shadows;
};

export const buildTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';
  const primary = isDark ? '#8b5cf6' : '#6d28d9';
  const secondary = isDark ? '#22d3ee' : '#0891b2';
  const success = isDark ? '#34d399' : '#059669';
  const warning = isDark ? '#fbbf24' : '#d97706';
  const error = isDark ? '#fb7185' : '#e11d48';
  const backgroundDefault = isDark ? '#080b14' : '#f4f7fb';
  const backgroundPaper = isDark ? '#111827' : '#ffffff';
  const surfaceSunken = isDark ? '#0f172a' : '#eef2ff';
  const surfaceRaised = isDark ? '#111827' : '#ffffff';
  const surfaceOverlay = isDark
    ? alpha('#1f2937', 0.72)
    : alpha('#ffffff', 0.74);
  const borderSubtle = isDark ? alpha('#cbd5e1', 0.12) : alpha('#0f172a', 0.08);
  const borderStrong = isDark ? alpha('#cbd5e1', 0.24) : alpha('#0f172a', 0.16);
  const sidebarBackground = isDark ? '#0b1120' : '#f8faff';
  const sidebarForeground = isDark ? '#f8fafc' : '#0f172a';
  const sidebarMuted = isDark ? alpha('#cbd5e1', 0.72) : alpha('#0f172a', 0.58);
  const sidebarAccent = alpha(primary, isDark ? 0.18 : 0.1);
  const heroGradient = isDark
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.26) 0%, rgba(34, 211, 238, 0.18) 48%, rgba(8, 11, 20, 0.92) 100%)'
    : 'linear-gradient(135deg, rgba(109, 40, 217, 0.12) 0%, rgba(34, 211, 238, 0.12) 48%, rgba(255, 255, 255, 0.96) 100%)';
  const accentGradient = isDark
    ? 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)'
    : 'linear-gradient(135deg, #6d28d9 0%, #0ea5e9 100%)';

  return createTheme({
    shape: {
      borderRadius: 10,
    },
    shadows: createDashboardShadows(mode),
    typography: {
      fontFamily: FONT_STACK,
      h1: {
        fontSize: 'clamp(2.8rem, 4vw, 4rem)',
        fontWeight: 800,
        letterSpacing: '-0.05em',
      },
      h2: {
        fontSize: 'clamp(2.25rem, 3vw, 3rem)',
        fontWeight: 800,
        letterSpacing: '-0.04em',
      },
      h3: {
        fontSize: 'clamp(1.85rem, 2vw, 2.4rem)',
        fontWeight: 750,
        letterSpacing: '-0.04em',
      },
      h4: { fontSize: '1.5rem', fontWeight: 720, letterSpacing: '-0.03em' },
      h5: { fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em' },
      h6: { fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' },
      subtitle1: { fontSize: '1rem', fontWeight: 600 },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.65 },
      button: {
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: '-0.01em',
      },
    },
    palette: {
      mode,
      primary: {
        main: primary,
        light: lighten(primary, 0.18),
        dark: darken(primary, 0.18),
      },
      secondary: {
        main: secondary,
        light: lighten(secondary, 0.18),
        dark: darken(secondary, 0.18),
      },
      success: { main: success },
      warning: { main: warning },
      error: { main: error },
      background: {
        default: backgroundDefault,
        paper: backgroundPaper,
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? alpha('#e2e8f0', 0.72) : alpha('#0f172a', 0.64),
      },
      divider: borderSubtle,
      surface: {
        sunken: surfaceSunken,
        raised: surfaceRaised,
        overlay: surfaceOverlay,
      },
      border: {
        subtle: borderSubtle,
        strong: borderStrong,
      },
      sidebar: {
        background: sidebarBackground,
        foreground: sidebarForeground,
        muted: sidebarMuted,
        accent: sidebarAccent,
      },
      gradient: {
        hero: heroGradient,
        accent: accentGradient,
      },
      chart: [primary, secondary, success, warning, error],
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          ':root': {
            colorScheme: mode,
          },
          html: {
            backgroundColor: theme.palette.background.default,
          },
          body: {
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            backgroundImage: `
              radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12)}, transparent 32%),
              radial-gradient(circle at top right, ${alpha(theme.palette.secondary.main, isDark ? 0.16 : 0.08)}, transparent 28%),
              linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${theme.palette.background.default} 100%)
            `,
            color: theme.palette.text.primary,
          },
          '*': {
            scrollbarColor: `${alpha(theme.palette.primary.main, 0.55)} transparent`,
          },
          '::-webkit-scrollbar': {
            width: 10,
            height: 10,
          },
          '::-webkit-scrollbar-thumb': {
            borderRadius: 999,
            backgroundColor: alpha(theme.palette.primary.main, 0.34),
            border: `2px solid ${theme.palette.background.default}`,
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
        }),
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backdropFilter: 'blur(18px)',
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'dark' ? 0.76 : 0.74,
            ),
            backgroundImage: 'none',
            borderBottom: `1px solid ${theme.palette.border.subtle}`,
            boxShadow: 'none',
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            background: theme.palette.sidebar.background,
            backgroundImage: 'none',
            color: theme.palette.sidebar.foreground,
            borderRight: `1px solid ${theme.palette.border.subtle}`,
          }),
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            background: theme.palette.surface.overlay,
            backgroundImage: 'none',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.border.subtle}`,
            boxShadow: theme.shadows[2],
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: () => ({
            backgroundImage: 'none',
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 42,
            borderRadius: 8,
            paddingInline: 18,
          },
          containedPrimary: ({ theme }) => ({
            boxShadow: theme.shadows[1],
          }),
          outlined: ({ theme }) => ({
            borderColor: theme.palette.border.strong,
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 6,
            fontWeight: 600,
            border: `1px solid ${theme.palette.border.subtle}`,
          }),
          colorDefault: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, 0.46),
          }),
          colorPrimary: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderColor: 'transparent',
          }),
          colorSuccess: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            borderColor: 'transparent',
          }),
          colorWarning: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            borderColor: 'transparent',
          }),
          colorError: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            borderColor: 'transparent',
          }),
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: () => ({
            borderRadius: 8,
          }),
          input: ({ theme }: { theme: Theme }) => ({
            '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus':
              {
                WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
                caretColor: theme.palette.text.primary,
              },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'dark' ? 0.78 : 0.9,
            ),
            transition: theme.transitions.create([
              'border-color',
              'box-shadow',
              'background-color',
            ]),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.border.subtle,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.border.strong,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          shrink: ({ theme }: { theme: Theme }) => ({
            color: theme.palette.text.secondary,
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 10,
            border: `1px solid ${theme.palette.border.subtle}`,
            backdropFilter: 'blur(20px)',
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'dark' ? 0.9 : 0.92,
            ),
            boxShadow: theme.shadows[4],
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            color: theme.palette.sidebar.muted,
            '&.Mui-selected': {
              color: theme.palette.sidebar.foreground,
              backgroundColor: theme.palette.sidebar.accent,
            },
            '&.Mui-selected:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.22),
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.border.subtle}`,
            color: theme.palette.text.secondary,
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
          }),
          body: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.border.subtle}`,
          }),
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: ({ theme }) => ({
            height: 10,
            borderRadius: 999,
            backgroundColor: alpha(
              theme.palette.text.primary,
              theme.palette.mode === 'dark' ? 0.12 : 0.08,
            ),
          }),
          bar: {
            borderRadius: 999,
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(
              theme.palette.text.primary,
              theme.palette.mode === 'dark' ? 0.14 : 0.08,
            ),
          }),
        },
      },
    },
  });
};
