import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { evidencePosts, goals } from '$lib/server/db/schema';
import type { GoalSummary } from '$lib/types';
import { assertOwnsGoal, AuthzError, requireSessionUser } from '$lib/server/authz';

export async function listGoalsForUser(userId: string): Promise<GoalSummary[]> {
	const rows = await db
		.select({
			id: goals.id,
			title: goals.title,
			description: goals.description,
			frequencyTarget: goals.frequencyTarget,
			createdAt: goals.createdAt,
			evidenceCount: count(evidencePosts.id)
		})
		.from(goals)
		.leftJoin(evidencePosts, eq(evidencePosts.goalId, goals.id))
		.where(eq(goals.userId, userId))
		.groupBy(goals.id)
		.orderBy(desc(goals.createdAt));

	return rows.map((row) => ({
		id: row.id,
		title: row.title,
		description: row.description,
		frequencyTarget: row.frequencyTarget,
		evidenceCount: Number(row.evidenceCount),
		createdAt: row.createdAt.toISOString()
	}));
}

export async function getGoalForUser(goalId: string, userId: string) {
	const [goal] = await db
		.select()
		.from(goals)
		.where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
		.limit(1);
	return goal ?? null;
}

export async function createGoal(
	sessionUserId: string,
	input: { title: string; description: string; frequencyTarget: string }
) {
	requireSessionUser(sessionUserId);

	const [goal] = await db
		.insert(goals)
		.values({
			userId: sessionUserId,
			title: input.title,
			description: input.description,
			frequencyTarget: input.frequencyTarget
		})
		.returning({ id: goals.id });

	return goal;
}

export async function updateGoal(
	sessionUserId: string,
	goalId: string,
	input: { title: string; description: string; frequencyTarget: string }
) {
	requireSessionUser(sessionUserId);

	const existing = await getGoalForUser(goalId, sessionUserId);
	if (!existing) {
		throw new AuthzError('Goal not found');
	}
	assertOwnsGoal(existing.userId, sessionUserId);

	await db
		.update(goals)
		.set({
			title: input.title,
			description: input.description,
			frequencyTarget: input.frequencyTarget
		})
		.where(eq(goals.id, goalId));
}

export async function deleteGoal(sessionUserId: string, goalId: string) {
	requireSessionUser(sessionUserId);

	const existing = await getGoalForUser(goalId, sessionUserId);
	if (!existing) {
		throw new AuthzError('Goal not found');
	}
	assertOwnsGoal(existing.userId, sessionUserId);

	await db.delete(goals).where(eq(goals.id, goalId));
}
