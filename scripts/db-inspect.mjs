import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const users = await sql`SELECT id, email, name, created_at FROM "user" ORDER BY created_at DESC LIMIT 10`;
console.log('USERS:'); console.table(users);

const profs = await sql`SELECT id, username, created_at FROM profiles ORDER BY created_at DESC LIMIT 10`;
console.log('PROFILES:'); console.table(profs);

const orphans = await sql`SELECT u.id, u.email FROM "user" u LEFT JOIN profiles p ON p.id = u.id WHERE p.id IS NULL`;
console.log('USERS WITHOUT PROFILES:'); console.table(orphans);
