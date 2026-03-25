import { describe, test, expect } from 'bun:test';
import { z } from 'zod';

import { parseBody } from '../parseBody';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

describe('parseBody', () => {
  test('returns { success: true, data } for valid input', () => {
    const result = parseBody(schema, { name: 'Alice', age: 30 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Alice');
      expect(result.data.age).toBe(30);
    }
  });

  test('returns { success: false, response } for invalid input', () => {
    const result = parseBody(schema, { name: 123 });
    expect(result.success).toBe(false);
  });

  test('response is a Response instance with status 400 on failure', () => {
    const result = parseBody(schema, { name: 123 });
    if (result.success) throw new Error('expected failure');
    expect(result.response).toBeInstanceOf(Response);
    expect(result.response.status).toBe(400);
  });

  test('only failing fields appear in the error response', async () => {
    const result = parseBody(schema, { name: 'Alice' }); // age is missing
    if (result.success) throw new Error('expected failure');
    const body = (await result.response.json()) as {
      error: { errors: { field: string }[] };
    };
    const fields = body.error.errors.map((e) => e.field);
    expect(fields).toContain('age');
    expect(fields).not.toContain('name');
  });

  test('null body returns failure', () => {
    const result = parseBody(schema, null);
    expect(result.success).toBe(false);
  });
});
