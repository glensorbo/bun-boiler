const STORAGE_KEY = 'redux_state';

/**
 * Load a single slice's persisted state from localStorage.
 * Called from each slice's `initialState` to self-hydrate on startup.
 */
export const loadSliceState = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return (parsed[key] as T) ?? fallback;
  } catch {
    return fallback;
  }
};
