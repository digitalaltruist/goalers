/**
 * Wipe all goals and progress from the database (keeps user accounts).
 * Also deletes evidence photos from Netlify Blobs when run with --confirm.
 *
 * Does NOT touch: "user", profiles, session, account.
 *
 * --- Production runbook ---
 *
 * 1. Set env vars from Netlify/Neon production (never commit these):
 *    - DATABASE_URL
 *    - NETLIFY_SITE_ID (or SITE_ID)
 *    - NETLIFY_AUTH_TOKEN (or NETLIFY_API_TOKEN)
 *
 * 2. Dry-run (counts only):
 *    DATABASE_URL="..." pnpm db:wipe-demo
 *
 * 3. Execute wipe:
 *    DATABASE_URL="..." NETLIFY_SITE_ID="..." NETLIFY_AUTH_TOKEN="..." pnpm db:wipe-demo:confirm
 *
 * 4. Smoke-check prod: empty feed/goals, logins still work, then post demo content.
 *
 * Optional: create a Neon branch snapshot before step 3 for rollback.
 */

import { neon } from '@neondatabase/serverless';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'evidence-photos';
const confirm = process.argv.includes('--confirm');

function requireEnv(name, ...fallbacks) {
	const value = [name, ...fallbacks].map((key) => process.env[key]).find(Boolean);
	if (!value) {
		console.error(`Missing required env: ${name}${fallbacks.length ? ` (or ${fallbacks.join(', ')})` : ''}`);
		process.exit(1);
	}
	return value;
}

if (!process.env.DATABASE_URL) {
	console.error('Missing required env: DATABASE_URL');
	process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function printCounts(label) {
	const [goalsRows, evidenceRows, cheersRows, postFlagsRows] = await Promise.all([
		sql`SELECT COUNT(*)::int AS count FROM goals`,
		sql`SELECT COUNT(*)::int AS count FROM evidence_posts`,
		sql`SELECT COUNT(*)::int AS count FROM cheers`,
		sql`SELECT COUNT(*)::int AS count FROM post_flags`
	]);
	const goals = goalsRows[0].count;
	const evidencePosts = evidenceRows[0].count;
	const cheers = cheersRows[0].count;
	const postFlags = postFlagsRows[0].count;
	console.log(label);
	console.table({ goals, evidence_posts: evidencePosts, cheers, post_flags: postFlags });
	return { goals, evidencePosts, cheers, postFlags };
}

function evidencePhotoStore() {
	const siteID = process.env.NETLIFY_SITE_ID ?? process.env.SITE_ID;
	const token = process.env.NETLIFY_AUTH_TOKEN ?? process.env.NETLIFY_API_TOKEN;
	if (siteID && token) {
		return getStore({ name: STORE_NAME, siteID, token });
	}
	return getStore(STORE_NAME);
}

console.log(confirm ? 'MODE: confirm (will delete)' : 'MODE: dry-run (counts only)');

const before = await printCounts('Before:');

if (!confirm) {
	console.log('\nNo changes made. Re-run with --confirm to wipe content.');
	process.exit(0);
}

requireEnv('NETLIFY_SITE_ID', 'SITE_ID');
requireEnv('NETLIFY_AUTH_TOKEN', 'NETLIFY_API_TOKEN');

const rows = await sql`
	SELECT photo_key FROM evidence_posts
	WHERE photo_key IS NOT NULL AND photo_key != ''
`;
const photoKeys = rows.map((r) => r.photo_key);
console.log(`\nDeleting ${photoKeys.length} blob(s) from store "${STORE_NAME}"...`);

const store = evidencePhotoStore();
let blobsDeleted = 0;
let blobsFailed = 0;

for (const photoKey of photoKeys) {
	try {
		await store.delete(photoKey);
		blobsDeleted++;
	} catch (err) {
		blobsFailed++;
		console.warn(`  failed: ${photoKey} — ${err instanceof Error ? err.message : err}`);
	}
}
console.log(`Blobs: ${blobsDeleted} deleted, ${blobsFailed} failed (best-effort).`);

console.log('\nDeleting all goals (cascades evidence_posts, cheers, post_flags)...');
const deletedGoals = await sql`DELETE FROM goals RETURNING id`;
console.log(`Deleted ${deletedGoals.length} goal(s).`);

const after = await printCounts('\nAfter:');
const remaining =
	after.goals + after.evidencePosts + after.cheers + after.postFlags;

if (remaining > 0) {
	console.error('Wipe incomplete: some rows remain.');
	process.exit(1);
}

console.log('\nDone. User accounts were not modified.');
