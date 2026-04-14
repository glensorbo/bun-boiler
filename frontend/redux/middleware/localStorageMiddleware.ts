import type { Middleware } from '@reduxjs/toolkit';

/**
 * Keys of the Redux state that should be persisted to localStorage.
 * Add a key here whenever a new slice should survive page refreshes.
 */
const PERSISTED_KEYS = ['theme', 'auth'] as const;

const STORAGE_KEY = 'redux_state';

/** Middleware that writes whitelisted slices to localStorage after every action. */
export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    const state = store.getState() as Record<string, unknown>;
    const toSave: Record<string, unknown> = {};
    for (const key of PERSISTED_KEYS) {
      if (key in state) {
        toSave[key] = state[key];
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Silently ignore — storage quota exceeded or private browsing
    }

    return result;
  };
