import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email('Must be a valid email address'),
  name: z.string().min(1, 'name is required'),
});

export const setPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
