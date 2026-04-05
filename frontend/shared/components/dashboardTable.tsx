import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Children } from 'react';

import { SurfaceCard } from './surfaceCard';

import type { ReactNode } from 'react';

interface DashboardTableProps {
  title: string;
  description?: string;
  columns: string[];
  action?: ReactNode;
  children?: ReactNode;
  emptyState?: ReactNode;
}

export const DashboardTable = ({
  title,
  description,
  columns,
  action,
  children,
  emptyState,
}: DashboardTableProps) => {
  const hasRows = Children.count(children) > 0;

  return (
    <SurfaceCard title={title} description={description} action={action}>
      {hasRows ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </Table>
        </TableContainer>
      ) : (
        emptyState
      )}
    </SurfaceCard>
  );
};
