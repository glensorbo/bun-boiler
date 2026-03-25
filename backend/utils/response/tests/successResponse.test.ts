import { describe, test, expect } from 'bun:test';

import { successResponse } from '../successResponse';

describe('successResponse', () => {
  test('returns a Response instance', () => {
    const res = successResponse({ ok: true });
    expect(res).toBeInstanceOf(Response);
  });

  test('default status is 200', () => {
    const res = successResponse({ ok: true });
    expect(res.status).toBe(200);
  });

  test('accepts custom status code', () => {
    const res = successResponse({ id: 1 }, 201);
    expect(res.status).toBe(201);
  });

  test('body is valid JSON matching the input data', async () => {
    const data = { name: 'Alice', age: 30 };
    const res = successResponse(data);
    const body = await res.json();
    expect(body).toEqual(data);
  });

  test('content-type is application/json', () => {
    const res = successResponse({});
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
