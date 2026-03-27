import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

interface LoginFormState {
  email: string;
  password: string;
}

const initialState: LoginFormState = {
  email: '',
  password: '',
};

/**
 * Ephemeral form state — synced from react-hook-form via watch().
 * NOT persisted to localStorage (intentionally omitted from PERSISTED_KEYS).
 */
export const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setLoginFormValues(state, action: PayloadAction<LoginFormState>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    clearLoginForm(state) {
      state.email = '';
      state.password = '';
    },
  },
});

export const { setLoginFormValues, clearLoginForm } = loginFormSlice.actions;
