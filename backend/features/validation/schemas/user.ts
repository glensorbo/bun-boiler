import { z } from 'zod';

export const uuidSchema = z.uuid({ error: 'Must be a valid UUID' });

export const updateRoleSchema = z.object({
  role: z.enum(['admin', 'user'], { error: 'Role must be admin or user' }),
});
