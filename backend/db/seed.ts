import { userRepository } from '../repositories/userRepository';

/**
 * Seed script — creates an initial admin user if one does not already exist.
 *
 * Credentials are read from env vars:
 *   SEED_ADMIN_EMAIL    (required)
 *   SEED_ADMIN_PASSWORD (required)
 *   SEED_ADMIN_NAME     (optional, defaults to "Admin")
 *
 * Safe to run multiple times — exits cleanly if the user already exists.
 */

const email = Bun.env.SEED_ADMIN_EMAIL;
const password = Bun.env.SEED_ADMIN_PASSWORD;
const name = Bun.env.SEED_ADMIN_NAME ?? 'Admin';

if (!email || !password) {
  console.error('❌ SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required');
  process.exit(1);
}

const existing = await userRepository.getByEmail(email);

if (existing) {
  console.log(`✅ Admin user already exists: ${email}`);
  process.exit(0);
}

const hashedPassword = await Bun.password.hash(password);
await userRepository.create(email, name, hashedPassword, 'admin');

console.log(`🌱 Admin user seeded: ${email}`);
process.exit(0);
