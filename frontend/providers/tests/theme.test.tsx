import { describe, expect, test } from 'bun:test';

import { buildTheme } from '../theme';

describe('buildTheme', () => {
  test('provides dashboard-specific palette tokens in light mode', () => {
    const theme = buildTheme('light');

    expect(theme.vars).toBeDefined();
    expect(theme.palette.surface.raised).toBeDefined();
    expect(theme.palette.border.subtle).toBeDefined();
    expect(theme.palette.sidebar.background).toBeDefined();
    expect(theme.palette.gradient.hero).toContain('linear-gradient');
    expect(theme.palette.chart.length).toBeGreaterThanOrEqual(5);
  });

  test('provides dashboard-specific palette tokens in dark mode', () => {
    const theme = buildTheme('dark');

    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.background.default).toBe('#080b14');
    expect(theme.palette.sidebar.foreground).toBe('#f8fafc');
    expect(theme.palette.gradient.accent).toContain('linear-gradient');
  });
});
