import type { PageServerLoad } from './$types';
import { listFeedPosts } from '$lib/server/evidence';

export const load: PageServerLoad = async (event) => {
	const posts = await listFeedPosts(event.locals.user!.id);
	return { posts };
};
