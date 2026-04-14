import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email('Must be a valid email address'),
  name: z.string().min(1, 'name is required'),
});
