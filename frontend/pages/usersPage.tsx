import { UsersPanel } from '@frontend/features/users/components/usersPanel';
import { DashboardPage } from '@frontend/shared/components/dashboardPage';

export const UsersPage = () => (
  <DashboardPage
    eyebrow="Admin"
    title="Users"
    description="Manage user accounts and access."
  >
    <UsersPanel />
  </DashboardPage>
);
