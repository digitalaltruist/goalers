import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const deleted = await sql`
  DELETE FROM "user"
  WHERE id IN (
    SELECT u.id FROM "user" u
    LEFT JOIN profiles p ON p.id = u.id
    WHERE p.id IS NULL
  )
  RETURNING id, email
`;
console.log('Deleted orphan users:'); console.table(deleted);
