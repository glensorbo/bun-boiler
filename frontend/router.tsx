import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AnalyticsProvider } from './features/analytics/analyticsProvider';
import { WsProvider } from './features/websocket/wsProvider';
import { PageLayout } from './layout/pageLayout';
import { ProtectedRoute } from './shared/components/protectedRoute';

const HomePage = lazy(() => import('./pages/homePage'));
const LoginPage = lazy(() => import('./pages/loginPage'));
const NotFoundPage = lazy(() => import('./pages/notFoundPage'));
const SignupPage = lazy(() => import('./pages/signupPage'));
const IntegrationsPage = lazy(() => import('./pages/integrationsPage'));
const UsersPage = lazy(() => import('./pages/usersPage'));

/**
 * Application router.
 * Public routes sit outside ProtectedRoute.
 * Add authenticated pages as children of the PageLayout route.
 * The * route inside PageLayout catches all unmatched authenticated paths.
 * All pages are lazy-loaded so Bun emits separate chunks per route (code splitting).
 */
export const AppRouter = () => (
  <BrowserRouter>
    <AnalyticsProvider />
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<WsProvider />}>
            <Route element={<PageLayout />}>
              <Route index element={<HomePage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);
