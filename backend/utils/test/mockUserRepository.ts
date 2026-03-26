import { mockUsers } from './mockUsers';

import type { NewUser } from '@backend/types/newUser';

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

  create: async (
    email: string,
    name: string,
    _hashedPassword: string,
  ): Promise<NewUser> => {
    return {
      id: '123e4567-e89b-12d3-a456-426614174002',
      email,
      name,
      password: 'hashed_password_new',
      createdAt: new Date('2024-01-03T00:00:00Z'),
      updatedAt: new Date('2024-01-03T00:00:00Z'),
    };
  },

  updatePassword: async (
    _id: string,
    _hashedPassword: string,
  ): Promise<void> => {
    return;
  },
};
