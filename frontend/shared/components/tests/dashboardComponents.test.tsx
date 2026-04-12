import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { describe, expect, test } from 'bun:test';

import { DashboardPage } from '../dashboardPage';
import { DashboardTable } from '../dashboardTable';
import { EmptyState } from '../emptyState';
import { MiniTrend } from '../miniTrend';
import { ProgressList } from '../progressList';
import { StatCard } from '../statCard';
import { SurfaceCard } from '../surfaceCard';
import { renderWithTheme } from '@frontend/shared/tests/renderWithTheme';

describe('dashboard shared components', () => {
  test('DashboardPage renders title, description, and actions', () => {
    const html = renderWithTheme(
      <DashboardPage
        title="Executive overview"
        description="Key product metrics"
        actions={<button type="button">Action</button>}
      >
        <div>Child content</div>
      </DashboardPage>,
    );

    expect(html).toContain('Executive overview');
    expect(html).toContain('Key product metrics');
    expect(html).toContain('Action');
    expect(html).toContain('Child content');
  });

  test('SurfaceCard renders header and footer sections', () => {
    const html = renderWithTheme(
      <SurfaceCard
        title="Release radar"
        description="Deployment confidence"
        footer={<span>Footer copy</span>}
      >
        <div>Body copy</div>
      </SurfaceCard>,
    );

    expect(html).toContain('Release radar');
    expect(html).toContain('Deployment confidence');
    expect(html).toContain('Body copy');
    expect(html).toContain('Footer copy');
  });

  test('StatCard renders metric content and trend chip', () => {
    const html = renderWithTheme(
      <StatCard
        label="Monthly recurring revenue"
        value="$42k"
        helper="Compared to last month"
        trend="+11%"
      />,
    );

    expect(html).toContain('Monthly recurring revenue');
    expect(html).toContain('$42k');
    expect(html).toContain('Compared to last month');
    expect(html).toContain('+11%');
  });

  test('DashboardTable renders rows when provided', () => {
    const html = renderWithTheme(
      <DashboardTable title="Projects" columns={['Name', 'Owner']}>
        <TableRow>
          <TableCell>Alpha</TableCell>
          <TableCell>Product</TableCell>
        </TableRow>
      </DashboardTable>,
    );

    expect(html).toContain('Projects');
    expect(html).toContain('Alpha');
    expect(html).toContain('Product');
  });

  test('DashboardTable renders empty state when rows are absent', () => {
    const html = renderWithTheme(
      <DashboardTable
        title="Projects"
        columns={['Name', 'Owner']}
        emptyState={<div>No rows yet</div>}
      />,
    );

    expect(html).toContain('No rows yet');
    expect(html).not.toContain('<tbody><tr');
  });

  test('EmptyState renders the optional action', () => {
    const html = renderWithTheme(
      <EmptyState
        title="No alerts"
        description="Everything is healthy."
        icon={<AutoGraphIcon />}
        actionLabel="Create alert"
        onAction={() => undefined}
      />,
    );

    expect(html).toContain('No alerts');
    expect(html).toContain('Everything is healthy.');
    expect(html).toContain('Create alert');
  });

  test('ProgressList renders all items', () => {
    const html = renderWithTheme(
      <ProgressList
        items={[
          { label: 'Activation', value: '72%', progress: 72 },
          { label: 'Retention', value: '61%', progress: 61, tone: 'secondary' },
        ]}
      />,
    );

    expect(html).toContain('Activation');
    expect(html).toContain('72%');
    expect(html).toContain('Retention');
    expect(html).toContain('61%');
  });

  test('MiniTrend renders a chart wrapper without crashing', () => {
    const html = renderWithTheme(
      <MiniTrend points={[10, 20, 30, 40]} labels={['Q1', 'Q2', 'Q3', 'Q4']} />,
    );

    expect(html).toContain('<svg');
  });
});
