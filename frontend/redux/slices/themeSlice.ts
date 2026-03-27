import { createSlice } from '@reduxjs/toolkit';

import { loadSliceState } from '../middleware/localStorageMiddleware';

import type { PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = loadSliceState('theme', {
  mode: 'system' as ThemeMode,
});

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    toggleMode(state) {
      if (state.mode === 'light') {
        state.mode = 'dark';
      } else {
        state.mode = 'light';
      }
    },
  },
});

export const { setMode, toggleMode } = themeSlice.actions;
