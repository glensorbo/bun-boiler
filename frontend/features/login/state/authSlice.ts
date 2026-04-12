import { createSlice } from '@reduxjs/toolkit';

import { loadSliceState } from '@frontend/redux/middleware/localStorageMiddleware';

import type { UserRole } from '@backend/types/appJwtPayload';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  rememberedEmail: string | null;
}

const initialState: AuthState = loadSliceState('auth', {
  token: null,
  rememberedEmail: null,
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
    setRememberedEmail(state, action: PayloadAction<string | null>) {
      state.rememberedEmail = action.payload;
    },
  },
});

export const { setToken, clearToken, setRememberedEmail } = authSlice.actions;

const decodePayload = (token: string): Record<string, unknown> => {
  const b64 = token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
    ),
  ) as Record<string, unknown>;
};

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.token !== null;

export const selectUserRole = (state: { auth: AuthState }): UserRole | null => {
  if (!state.auth.token) {
    return null;
  }
  try {
    const payload = decodePayload(state.auth.token);
    return (payload.role as UserRole) ?? null;
  } catch {
    return null;
  }
};

export const selectUserName = (state: { auth: AuthState }): string | null => {
  if (!state.auth.token) {
    return null;
  }
  try {
    const payload = decodePayload(state.auth.token);
    if (payload.name) {
      return payload.name as string;
    }
    if (payload.email) {
      return (payload.email as string).split('@')[0] ?? null;
    }
    return null;
  } catch {
    return null;
  }
};

export const selectUserEmail = (state: { auth: AuthState }): string | null => {
  if (!state.auth.token) {
    return null;
  }
  try {
    const payload = decodePayload(state.auth.token);
    return (payload.email as string) ?? null;
  } catch {
    return null;
  }
};
