import { describe, test, expect, spyOn, afterEach } from 'bun:test';

import { validateEnv } from '../env';

const REQUIRED_KEYS = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_SERVER',
  'POSTGRES_DB',
  'JWT_SECRET',
  'APP_URL',
] as const;

const saveEnv = () =>
  Object.fromEntries(REQUIRED_KEYS.map((k) => [k, Bun.env[k]]));

const restoreEnv = (saved: Record<string, string | undefined>) => {
  for (const key of REQUIRED_KEYS) {
    const val = saved[key];
    if (val !== undefined) {
      Bun.env[key] = val;
    } else {
      delete Bun.env[key as string];
    }
  }
};

const setAllRequired = () => {
  Bun.env.POSTGRES_USER = 'user';
  Bun.env.POSTGRES_PASSWORD = 'pass';
  Bun.env.POSTGRES_SERVER = 'localhost';
  Bun.env.POSTGRES_DB = 'db';
  Bun.env.JWT_SECRET = 'secret';
  Bun.env.APP_URL = 'http://localhost:3000';
};

let saved: Record<string, string | undefined>;

afterEach(() => {
  restoreEnv(saved);
});

describe('validateEnv', () => {
  test('does not exit when all required env vars are set', () => {
    saved = saveEnv();
    setAllRequired();

    const exitSpy = spyOn(process, 'exit').mockImplementation(
      () => undefined as never,
    );
    validateEnv();
    expect(exitSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  test('calls process.exit(1) when a required var is missing', () => {
    saved = saveEnv();
    setAllRequired();
    delete Bun.env.JWT_SECRET;

    const exitSpy = spyOn(process, 'exit').mockImplementation(
      () => undefined as never,
    );
    validateEnv();
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  test('calls process.exit(1) when multiple required vars are missing', () => {
    saved = saveEnv();
    setAllRequired();
    delete Bun.env.POSTGRES_USER;
    delete Bun.env.APP_URL;

    const exitSpy = spyOn(process, 'exit').mockImplementation(
      () => undefined as never,
    );
    validateEnv();
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  test('does not call process.exit when all vars are present', () => {
    saved = saveEnv();
    setAllRequired();

    const exitSpy = spyOn(process, 'exit').mockImplementation(
      () => undefined as never,
    );
    const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
    validateEnv();
    expect(consoleSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
