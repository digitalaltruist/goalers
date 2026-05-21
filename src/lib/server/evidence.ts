import { and, desc, eq } from 'drizzle-orm';
import type { FeedPost } from '$lib/types';
import { db } from '$lib/server/db';
import { evidencePosts, goals, profiles } from '$lib/server/db/schema';
import { user } from '$lib/server/db/auth.schema';
import { assertOwnsEvidencePost, AuthzError, requireSessionUser } from '$lib/server/authz';
import { buildPhotoUrl, deleteEvidencePhoto, uploadEvidencePhoto } from '$lib/server/blobs';
import { getGoalForUser } from '$lib/server/goals';
import { loadPostSocialMeta } from '$lib/server/social';

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
			photoUrl: evidencePosts.photoUrl,
			createdAt: evidencePosts.createdAt
		})
		.from(evidencePosts)
		.innerJoin(goals, eq(evidencePosts.goalId, goals.id))
		.innerJoin(profiles, eq(evidencePosts.userId, profiles.id))
		.innerJoin(user, eq(evidencePosts.userId, user.id))
		.orderBy(desc(evidencePosts.createdAt));

	const postIds = rows.map((row) => row.id);
	const social = await loadPostSocialMeta(sessionUserId, postIds);

	return rows.map((row) => ({
		id: row.id,
		goalId: row.goalId,
		goalTitle: row.goalTitle,
		authorUsername: row.authorUsername,
		authorDisplayName: row.authorDisplayName,
		content: row.content,
		photoUrl: row.photoUrl,
		createdAt: row.createdAt.toISOString(),
		cheerCount: social.cheerCounts.get(row.id) ?? 0,
		cheeredByMe: social.cheeredPostIds.has(row.id),
		flaggedByMe: social.flaggedPostIds.has(row.id)
	}));
}

export async function listMyEvidencePosts(sessionUserId: string): Promise<FeedPost[]> {
	requireSessionUser(sessionUserId);

	const rows = await db
		.select({
			id: evidencePosts.id,
			goalId: evidencePosts.goalId,
			goalTitle: goals.title,
			authorUsername: profiles.username,
			authorDisplayName: user.name,
			content: evidencePosts.content,
			photoUrl: evidencePosts.photoUrl,
			createdAt: evidencePosts.createdAt
		})
		.from(evidencePosts)
		.innerJoin(goals, eq(evidencePosts.goalId, goals.id))
		.innerJoin(profiles, eq(evidencePosts.userId, profiles.id))
		.innerJoin(user, eq(evidencePosts.userId, user.id))
		.where(eq(evidencePosts.userId, sessionUserId))
		.orderBy(desc(evidencePosts.createdAt));

	const postIds = rows.map((row) => row.id);
	const social = await loadPostSocialMeta(sessionUserId, postIds);

	return rows.map((row) => ({
		id: row.id,
		goalId: row.goalId,
		goalTitle: row.goalTitle,
		authorUsername: row.authorUsername,
		authorDisplayName: row.authorDisplayName,
		content: row.content,
		photoUrl: row.photoUrl,
		createdAt: row.createdAt.toISOString(),
		cheerCount: social.cheerCounts.get(row.id) ?? 0,
		cheeredByMe: social.cheeredPostIds.has(row.id),
		flaggedByMe: social.flaggedPostIds.has(row.id)
	}));
}

export async function createEvidencePost(
	sessionUserId: string,
	origin: string,
	input: { goalId: string; content: string; photo: File }
) {
	requireSessionUser(sessionUserId);

	const goal = await getGoalForUser(input.goalId, sessionUserId);
	if (!goal) {
		throw new AuthzError('Goal not found or not owned by you');
	}

	const { photoKey } = await uploadEvidencePhoto(sessionUserId, input.photo);
	const photoUrl = buildPhotoUrl(origin, photoKey);

	const [post] = await db
		.insert(evidencePosts)
		.values({
			userId: sessionUserId,
			goalId: input.goalId,
			content: input.content.trim(),
			photoUrl,
			photoKey
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
	input: { content: string }
) {
	requireSessionUser(sessionUserId);

	const existing = await getEvidencePostForUser(postId, sessionUserId);
	if (!existing) {
		throw new AuthzError('Evidence post not found');
	}
	assertOwnsEvidencePost(existing.userId, sessionUserId);

	await db
		.update(evidencePosts)
		.set({ content: input.content.trim() })
		.where(eq(evidencePosts.id, postId));
}

export async function deleteEvidencePost(sessionUserId: string, postId: string) {
	requireSessionUser(sessionUserId);

	const existing = await getEvidencePostForUser(postId, sessionUserId);
	if (!existing) {
		throw new AuthzError('Evidence post not found');
	}
	assertOwnsEvidencePost(existing.userId, sessionUserId);

	await deleteEvidencePhoto(existing.photoKey);
	await db.delete(evidencePosts).where(eq(evidencePosts.id, postId));
}
