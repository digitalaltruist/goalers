/**
 * Server-side authorization rules for Goalers MVP.
 * Enforced in SvelteKit loads and form actions via event.locals.user.
 * See plan.md "Authorization Rules (Server-Side)" for full policy.
 *
 * profiles: read all (authenticated); write own only (profiles.id === session user id)
 * goals: read all; create/update/delete own only (goals.user_id === session user id)
 * evidence_posts: read all; create when user_id matches and goal belongs to user; write own only
 * cheers: read all; create/delete own only (cheers.user_id === session user id)
 * post_flags: create own only; one per user per post (unique constraint)
 */

export class AuthzError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthzError';
	}
}

export function requireSessionUser(sessionUserId: string | undefined): asserts sessionUserId is string {
	if (!sessionUserId) {
		throw new AuthzError('Authentication required');
	}
}

export function assertSessionUser(resourceUserId: string, sessionUserId: string): void {
	if (resourceUserId !== sessionUserId) {
		throw new AuthzError('Not authorized to access this resource');
	}
}

export function assertOwnsGoal(goalUserId: string, sessionUserId: string): void {
	assertSessionUser(goalUserId, sessionUserId);
}

export function assertOwnsEvidencePost(postUserId: string, sessionUserId: string): void {
	assertSessionUser(postUserId, sessionUserId);
}

export function assertOwnsProfile(profileId: string, sessionUserId: string): void {
	assertSessionUser(profileId, sessionUserId);
}
