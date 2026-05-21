import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthzError } from '$lib/server/authz';
import { listFeedPosts } from '$lib/server/evidence';
import { flagPost, toggleCheer } from '$lib/server/social';

export const load: PageServerLoad = async (event) => {
	const posts = await listFeedPosts(event.locals.user!.id);
	return { posts };
};

function parsePostId(formData: FormData): string | null {
	const postId = formData.get('postId')?.toString()?.trim();
	return postId || null;
}

export const actions: Actions = {
	cheer: async (event) => {
		const userId = event.locals.user!.id;
		const postId = parsePostId(await event.request.formData());

		if (!postId) {
			return fail(400, { message: 'Post is required' });
		}

		try {
			const result = await toggleCheer(userId, postId);
			return { postId, ...result };
		} catch (err) {
			if (err instanceof AuthzError) {
				return fail(403, { message: err.message });
			}
			return fail(500, { message: 'Could not update cheer' });
		}
	},
	flag: async (event) => {
		const userId = event.locals.user!.id;
		const postId = parsePostId(await event.request.formData());

		if (!postId) {
			return fail(400, { message: 'Post is required' });
		}

		try {
			const result = await flagPost(userId, postId);
			return { postId, ...result };
		} catch (err) {
			if (err instanceof AuthzError) {
				return fail(403, { message: err.message });
			}
			return fail(500, { message: 'Could not flag post' });
		}
	}
};
