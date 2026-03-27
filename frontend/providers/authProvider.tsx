import { decodeJwt } from 'jose';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearToken } from '../features/login/state/authSlice';

import type { AppDispatch, RootState } from '@frontend/redux/store';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Validates the stored JWT on mount and whenever it changes.
 * Clears the token from Redux (and localStorage) if it is expired or malformed.
 */
export const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      return;
    }
    try {
      const { exp } = decodeJwt(token);
      if (exp !== undefined && Date.now() / 1000 > exp) {
        dispatch(clearToken());
      }
    } catch {
      dispatch(clearToken());
    }
  }, [token, dispatch]);

  return <>{children}</>;
};
