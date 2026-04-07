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

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.token !== null;

export const selectUserRole = (state: { auth: AuthState }): UserRole | null => {
  if (!state.auth.token) {
    return null;
  }
  try {
    const payload = JSON.parse(
      atob(
        state.auth.token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/'),
      ),
    ) as { role: UserRole };
    return payload.role;
  } catch {
    return null;
  }
};

export const selectUserName = (state: { auth: AuthState }): string | null => {
  if (!state.auth.token) {
    return null;
  }
  try {
    const payload = JSON.parse(
      atob(
        state.auth.token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/'),
      ),
    ) as { name?: string; email?: string };
    if (payload.name) {
      return payload.name;
    }
    if (payload.email) {
      return payload.email.split('@')[0] ?? null;
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
    const payload = JSON.parse(
      atob(
        state.auth.token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/'),
      ),
    ) as { email?: string };
    return payload.email ?? null;
  } catch {
    return null;
  }
};
