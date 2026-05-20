import type { PageServerLoad } from './$types';
import { listGoalsForUser } from '$lib/server/goals';

export const load: PageServerLoad = async (event) => {
	const goals = await listGoalsForUser(event.locals.user!.id);
	return { goals };
};
