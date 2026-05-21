import type { PageServerLoad } from './$types';
import { listMyEvidencePosts } from '$lib/server/evidence';

export const load: PageServerLoad = async (event) => {
	const posts = await listMyEvidencePosts(event.locals.user!.id);
	return { posts };
};
