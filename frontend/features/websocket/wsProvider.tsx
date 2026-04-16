import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import { wsManager } from './wsManager';
import { useRefreshTokenMutation } from '@frontend/redux/api/authApi';
import { setToken } from '@frontend/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@frontend/redux/store';

const REFRESH_BEFORE_MS = 2 * 60 * 1000;

const decodeExp = (token: string): number | null => {
  try {
    const segment = token.split('.')[1];
    if (!segment) {
      return null;
    }
    const payload = JSON.parse(
      atob(segment.replace(/-/g, '+').replace(/_/g, '/')),
    ) as { exp?: number };
    return payload.exp ?? null;
  } catch {
    return null;
  }
};

export const WsProvider = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const [doRefresh] = useRefreshTokenMutation();

  useEffect(() => {
    if (!token) {
      wsManager.disconnect();
      return;
    }
    wsManager.connect(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    const exp = decodeExp(token);
    if (!exp) {
      return;
    }

    const delay = exp * 1000 - Date.now() - REFRESH_BEFORE_MS;

    const performRefresh = async () => {
      const result = await doRefresh();
      if ('data' in result && result.data) {
        dispatch(setToken(result.data.token));
      }
    };

    if (delay <= 0) {
      void performRefresh();
      return;
    }

    const timer = setTimeout(() => void performRefresh(), delay);
    return () => clearTimeout(timer);
  }, [token, doRefresh, dispatch]);

  return <Outlet />;
};
