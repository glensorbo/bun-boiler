import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AnalyticsProvider } from './features/analytics/analyticsProvider';
import { WsProvider } from './features/websocket/wsProvider';
import { PageLayout } from './layout/pageLayout';
import { ProtectedRoute } from './shared/components/protectedRoute';
import type React from 'react';

const HomePage = lazy(() =>
  import('./pages/homePage').then((m) => ({ default: m.HomePage })),
);
const LoginPage = lazy(() =>
  import('./pages/loginPage').then((m) => ({ default: m.LoginPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/notFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const SignupPage = lazy(() =>
  import('./pages/signupPage').then((m) => ({ default: m.SignupPage })),
);
const IntegrationsPage = lazy(() =>
  import('./pages/integrationsPage').then((m) => ({
    default: m.IntegrationsPage,
  })),
);
const UsersPage = lazy(() =>
  import('./pages/usersPage').then((m) => ({ default: m.UsersPage })),
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={null}>{element}</Suspense>
);

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
    <Routes>
      <Route path="/login" element={withSuspense(<LoginPage />)} />
      <Route path="/signup" element={withSuspense(<SignupPage />)} />
      <Route element={<ProtectedRoute />}>
        <Route element={<WsProvider />}>
          <Route element={<PageLayout />}>
            <Route index element={withSuspense(<HomePage />)} />
            <Route
              path="integrations"
              element={withSuspense(<IntegrationsPage />)}
            />
            <Route path="users" element={withSuspense(<UsersPage />)} />
            <Route path="*" element={withSuspense(<NotFoundPage />)} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
