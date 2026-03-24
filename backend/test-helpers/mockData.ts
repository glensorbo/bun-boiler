import type { NewUser } from '@backend/types/users';

/**
 * Mock user data for testing
 * These are safe to use in tests without requiring a database
 */
export const mockUsers: NewUser[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed_password_123',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'jane@example.com',
    name: 'Jane Smith',
    password: 'hashed_password_456',
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
];

/**
 * Mock repository for testing services without database
 */
export const mockUserRepository = {
  getAll: async (): Promise<NewUser[]> => {
    return mockUsers;
  },

  getById: async (id: string): Promise<NewUser | undefined> => {
    return mockUsers.find((user) => user.id === id);
  },

  getByEmail: async (email: string): Promise<NewUser | undefined> => {
    return mockUsers.find((user) => user.email === email);
  },
};
