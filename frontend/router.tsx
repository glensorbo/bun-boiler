import { BrowserRouter, Route, Routes } from 'react-router';

import { AnalyticsProvider } from './features/analytics/analyticsProvider';
import { PageLayout } from './layout/pageLayout';
import { HomePage } from './pages/homePage';
import { LoginPage } from './pages/loginPage';
import { NotFoundPage } from './pages/notFoundPage';
import { ProtectedRoute } from './shared/components/protectedRoute';

/**
 * Application router.
 * Public routes sit outside ProtectedRoute.
 * Add authenticated pages as children of the PageLayout route.
 * The * route inside PageLayout catches all unmatched authenticated paths.
 */
export const AppRouter = () => (
  <BrowserRouter>
    <AnalyticsProvider />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
