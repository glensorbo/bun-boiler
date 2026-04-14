import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AnalyticsProvider } from './features/analytics/analyticsProvider';
import { WsProvider } from './features/websocket/wsProvider';
import { PageLayout } from './layout/pageLayout';
import { HomePage } from './pages/homePage';
import { LoginPage } from './pages/loginPage';
import { NotFoundPage } from './pages/notFoundPage';
import { SignupPage } from './pages/signupPage';
import { ProtectedRoute } from './shared/components/protectedRoute';

const IntegrationsPage = lazy(() => import('./pages/integrationsPage'));
const UsersPage = lazy(() => import('./pages/usersPage'));

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
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<WsProvider />}>
          <Route element={<PageLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="integrations"
              element={
                <Suspense fallback={null}>
                  <IntegrationsPage />
                </Suspense>
              }
            />
            <Route
              path="users"
              element={
                <Suspense fallback={null}>
                  <UsersPage />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
