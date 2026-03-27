import { createSlice } from '@reduxjs/toolkit';

import { loadSliceState } from '../middleware/localStorageMiddleware';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = loadSliceState('theme', {
  mode: 'system' as ThemeMode,
});

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
});
