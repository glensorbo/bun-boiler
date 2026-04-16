import { decodeJwt } from 'jose';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken, setToken } from '@frontend/redux/slices/authSlice';
import type { ApiSuccessResponse } from '@backend/types/apiSuccessResponse';
import type { AppDispatch, RootState } from '@frontend/redux/store';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const REFRESH_BEFORE_EXPIRY_S = 60;

/**
 * Validates the stored JWT and proactively refreshes it before it expires.
 *
 * - Decodes the exp claim from the current token.
 * - If already expired: attempts a silent refresh immediately.
 * - If not yet expired: schedules a refresh REFRESH_BEFORE_EXPIRY_S seconds
 *   before the expiry time. When the new token arrives, the effect re-runs and
 *   re-schedules the next refresh — keeping the session alive indefinitely.
 * - If refresh fails: clears the token, triggering a redirect to /login via
 *   the app's protected-route layer.
 */
export const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      return;
    }

    let exp: number | undefined;
    try {
      ({ exp } = decodeJwt(token));
    } catch {
      dispatch(clearToken());
      return;
    }

    const doRefresh = async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'same-origin',
        });
        if (!res.ok) {
          dispatch(clearToken());
          return;
        }
        const body = (await res.json()) as ApiSuccessResponse<{
          token: string;
        }>;
        dispatch(setToken(body.data.token));
      } catch {
        dispatch(clearToken());
      }
    };

    const nowSeconds = Date.now() / 1000;

    if (exp !== undefined && nowSeconds >= exp) {
      void doRefresh();
      return;
    }

    if (exp !== undefined) {
      const msUntilRefresh = Math.max(
        0,
        (exp - REFRESH_BEFORE_EXPIRY_S - nowSeconds) * 1000,
      );
      const timer = setTimeout(() => {
        void doRefresh();
      }, msUntilRefresh);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [token, dispatch]);

  return <>{children}</>;
};
