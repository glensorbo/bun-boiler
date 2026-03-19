import type { Order } from '../types/order';
import type { User } from '../types/user';

/**
 * Mock user data for testing
 * These are safe to use in tests without requiring a database
 */
export const mockUsers: User[] = [
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
 * Mock order data for testing
 */
export const mockOrders: Order[] = [
  {
    id: '223e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    orderNumber: 'ORD-001',
    totalAmount: '99.99',
    status: 'pending',
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-10T00:00:00Z'),
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    orderNumber: 'ORD-002',
    totalAmount: '149.99',
    status: 'completed',
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z'),
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174002',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    orderNumber: 'ORD-003',
    totalAmount: '299.99',
    status: 'pending',
    createdAt: new Date('2024-01-20T00:00:00Z'),
    updatedAt: new Date('2024-01-20T00:00:00Z'),
  },
];

/**
 * Mock repository for testing services without database
 */
export const mockUserRepository = {
  getAll: async (): Promise<User[]> => {
    return mockUsers;
  },

  getById: async (id: string): Promise<User | undefined> => {
    return mockUsers.find((user) => user.id === id);
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    return mockUsers.find((user) => user.email === email);
  },
};

/**
 * Mock order repository for testing services without database
 */
export const mockOrderRepository = {
  getAll: async (): Promise<Order[]> => {
    return mockOrders;
  },

  getById: async (id: string): Promise<Order | undefined> => {
    return mockOrders.find((order) => order.id === id);
  },

  getByUserId: async (userId: string): Promise<Order[]> => {
    return mockOrders.filter((order) => order.userId === userId);
  },
};
