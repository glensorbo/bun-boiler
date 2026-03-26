import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email('Must be a valid email address'),
  name: z.string().min(1, 'name is required'),
});

export const loginSchema = z.object({
  email: z.email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const setPasswordSchema = z
  .object({
    password: z.string().min(12, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(12, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });
