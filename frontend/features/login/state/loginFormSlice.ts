import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialState: LoginFormState = {
  email: '',
  password: '',
  rememberMe: false,
};

/**
 * Ephemeral form state — controlled inputs dispatch here on every onChange.
 * NOT persisted to localStorage (intentionally omitted from PERSISTED_KEYS).
 */
export const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setLoginFormField(state, action: PayloadAction<Partial<LoginFormState>>) {
      Object.assign(state, action.payload);
    },
    clearLoginForm(state) {
      state.email = '';
      state.password = '';
      state.rememberMe = false;
    },
  },
});

export const { setLoginFormField, clearLoginForm } = loginFormSlice.actions;
