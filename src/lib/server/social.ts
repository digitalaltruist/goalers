import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { cheers, evidencePosts, postFlags } from '$lib/server/db/schema';
import { AuthzError, requireSessionUser } from '$lib/server/authz';

export async function getEvidencePostExists(postId: string): Promise<boolean> {
	const [row] = await db
		.select({ id: evidencePosts.id })
		.from(evidencePosts)
		.where(eq(evidencePosts.id, postId))
		.limit(1);
	return Boolean(row);
}

export async function getCheerCountForPost(postId: string): Promise<number> {
	const [row] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(cheers)
		.where(eq(cheers.postId, postId));
	return row?.count ?? 0;
}

export async function toggleCheer(
	sessionUserId: string,
	postId: string
): Promise<{ cheeredByMe: boolean; cheerCount: number }> {
	requireSessionUser(sessionUserId);

	if (!(await getEvidencePostExists(postId))) {
		throw new AuthzError('Post not found');
	}

	const [existing] = await db
		.select({ id: cheers.id })
		.from(cheers)
		.where(and(eq(cheers.postId, postId), eq(cheers.userId, sessionUserId)))
		.limit(1);

	if (existing) {
		await db.delete(cheers).where(eq(cheers.id, existing.id));
	} else {
		await db.insert(cheers).values({ postId, userId: sessionUserId });
	}

	const cheerCount = await getCheerCountForPost(postId);
	return {
		cheeredByMe: !existing,
		cheerCount
	};
}

export async function flagPost(
	sessionUserId: string,
	postId: string
): Promise<{ flaggedByMe: boolean }> {
	requireSessionUser(sessionUserId);

	if (!(await getEvidencePostExists(postId))) {
		throw new AuthzError('Post not found');
	}

	const [existing] = await db
		.select({ id: postFlags.id })
		.from(postFlags)
		.where(and(eq(postFlags.postId, postId), eq(postFlags.userId, sessionUserId)))
		.limit(1);

	if (existing) {
		return { flaggedByMe: true };
	}

	await db.insert(postFlags).values({ postId, userId: sessionUserId });
	return { flaggedByMe: true };
}

export type PostSocialMeta = {
	cheerCounts: Map<string, number>;
	cheeredPostIds: Set<string>;
	flaggedPostIds: Set<string>;
};

export async function loadPostSocialMeta(
	sessionUserId: string,
	postIds: string[]
): Promise<PostSocialMeta> {
	const empty: PostSocialMeta = {
		cheerCounts: new Map(),
		cheeredPostIds: new Set(),
		flaggedPostIds: new Set()
	};

	if (postIds.length === 0) {
		return empty;
	}

	const [countRows, myCheerRows, myFlagRows] = await Promise.all([
		db
			.select({
				postId: cheers.postId,
				count: sql<number>`count(*)::int`
			})
			.from(cheers)
			.where(inArray(cheers.postId, postIds))
			.groupBy(cheers.postId),
		db
			.select({ postId: cheers.postId })
			.from(cheers)
			.where(and(inArray(cheers.postId, postIds), eq(cheers.userId, sessionUserId))),
		db
			.select({ postId: postFlags.postId })
			.from(postFlags)
			.where(and(inArray(postFlags.postId, postIds), eq(postFlags.userId, sessionUserId)))
	]);

	const cheerCounts = new Map<string, number>();
	for (const row of countRows) {
		cheerCounts.set(row.postId, row.count);
	}

	return {
		cheerCounts,
		cheeredPostIds: new Set(myCheerRows.map((r) => r.postId)),
		flaggedPostIds: new Set(myFlagRows.map((r) => r.postId))
	};
}
