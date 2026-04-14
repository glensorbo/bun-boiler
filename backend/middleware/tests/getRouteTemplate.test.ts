import { describe, test, expect } from 'bun:test';
import { getRouteTemplate } from '../getRouteTemplate';
import type { BunRequest } from '../types/BunRequest';

const makeRequest = (
  url: string,
  params: Record<string, string> = {},
): BunRequest => Object.assign(new Request(url), { params }) as BunRequest;

describe('getRouteTemplate', () => {
  test('returns the path unchanged when there are no params', () => {
    const req = makeRequest('http://localhost/api/auth/login');
    expect(getRouteTemplate(req)).toBe('/api/auth/login');
  });

  test('replaces a single param value with its :key placeholder', () => {
    const req = makeRequest('http://localhost/api/users/42', { id: '42' });
    expect(getRouteTemplate(req)).toBe('/api/users/:id');
  });

  test('replaces multiple param values', () => {
    const req = makeRequest('http://localhost/api/orgs/acme/users/42', {
      orgId: 'acme',
      userId: '42',
    });
    expect(getRouteTemplate(req)).toBe('/api/orgs/:orgId/users/:userId');
  });

  test('handles a root path with no segments', () => {
    const req = makeRequest('http://localhost/');
    expect(getRouteTemplate(req)).toBe('/');
  });

  test('handles UUID-style param values', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const req = makeRequest(`http://localhost/api/users/${id}`, { id });
    expect(getRouteTemplate(req)).toBe('/api/users/:id');
  });
});
