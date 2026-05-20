import type { PageServerLoad } from './$types';
import { listGoalsForUser } from '$lib/server/goals';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user!.id;
	const goals = await listGoalsForUser(userId);

	return { goals };
};
