import { users } from '@backend/db/schemas/users';

export type NewUser = typeof users.$inferInsert;
export type User = Omit<NewUser, 'password'>;
