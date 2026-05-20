import { and, desc, eq } from 'drizzle-orm';
import type { VisualStamp } from '$lib/stamps';
import type { FeedPost } from '$lib/types';
import { db } from '$lib/server/db';
import { evidencePosts, goals, profiles } from '$lib/server/db/schema';
import { user } from '$lib/server/db/auth.schema';
import { assertOwnsEvidencePost, AuthzError, requireSessionUser } from '$lib/server/authz';
import { getGoalForUser } from '$lib/server/goals';

export async function listFeedPosts(sessionUserId: string): Promise<FeedPost[]> {
	requireSessionUser(sessionUserId);

	const rows = await db
		.select({
			id: evidencePosts.id,
			goalId: evidencePosts.goalId,
			goalTitle: goals.title,
			authorUsername: profiles.username,
			authorDisplayName: user.name,
			content: evidencePosts.content,
			visualStamp: evidencePosts.visualStamp,
			createdAt: evidencePosts.createdAt
		})
		.from(evidencePosts)
		.innerJoin(goals, eq(evidencePosts.goalId, goals.id))
		.innerJoin(profiles, eq(evidencePosts.userId, profiles.id))
		.innerJoin(user, eq(evidencePosts.userId, user.id))
		.orderBy(desc(evidencePosts.createdAt));

	return rows.map((row) => ({
		id: row.id,
		goalId: row.goalId,
		goalTitle: row.goalTitle,
		authorUsername: row.authorUsername,
		authorDisplayName: row.authorDisplayName,
		content: row.content,
		visualStamp: row.visualStamp as VisualStamp,
		createdAt: row.createdAt.toISOString(),
		cheerCount: 0,
		cheeredByMe: false
	}));
}

export async function createEvidencePost(
	sessionUserId: string,
	input: { goalId: string; content: string; visualStamp: string }
) {
	requireSessionUser(sessionUserId);

	const goal = await getGoalForUser(input.goalId, sessionUserId);
	if (!goal) {
		throw new AuthzError('Goal not found or not owned by you');
	}

	const [post] = await db
		.insert(evidencePosts)
		.values({
			userId: sessionUserId,
			goalId: input.goalId,
			content: input.content,
			visualStamp: input.visualStamp
		})
		.returning({ id: evidencePosts.id });

	return post;
}

export async function getEvidencePostForUser(postId: string, userId: string) {
	const [post] = await db
		.select()
		.from(evidencePosts)
		.where(and(eq(evidencePosts.id, postId), eq(evidencePosts.userId, userId)))
		.limit(1);
	return post ?? null;
}

export async function updateEvidencePost(
	sessionUserId: string,
	postId: string,
	input: { content: string; visualStamp: string }
) {
	requireSessionUser(sessionUserId);

	const existing = await getEvidencePostForUser(postId, sessionUserId);
	if (!existing) {
		throw new AuthzError('Evidence post not found');
	}
	assertOwnsEvidencePost(existing.userId, sessionUserId);

	await db
		.update(evidencePosts)
		.set({
			content: input.content,
			visualStamp: input.visualStamp
		})
		.where(eq(evidencePosts.id, postId));
}

export async function deleteEvidencePost(sessionUserId: string, postId: string) {
	requireSessionUser(sessionUserId);

	const existing = await getEvidencePostForUser(postId, sessionUserId);
	if (!existing) {
		throw new AuthzError('Evidence post not found');
	}
	assertOwnsEvidencePost(existing.userId, sessionUserId);

	await db.delete(evidencePosts).where(eq(evidencePosts.id, postId));
}
