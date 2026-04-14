import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(['admin', 'user'], { error: 'Role must be admin or user' }),
});
