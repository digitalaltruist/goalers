import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthzError } from '$lib/server/authz';
import { createEvidencePost } from '$lib/server/evidence';
import { listGoalsForUser } from '$lib/server/goals';

export const load: PageServerLoad = async (event) => {
	const goals = await listGoalsForUser(event.locals.user!.id);
	return { goals };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user!.id;
		const formData = await event.request.formData();

		const goalId = formData.get('goal')?.toString() ?? '';
		const content = formData.get('content')?.toString() ?? '';
		const photo = formData.get('photo');

		if (!goalId) {
			return fail(400, { message: 'Select a goal' });
		}
		if (!content.trim()) {
			return fail(400, { message: 'Describe what you did' });
		}
		if (!(photo instanceof File)) {
			return fail(400, { message: 'Photo is required' });
		}

		try {
			await createEvidencePost(userId, event.url.origin, {
				goalId,
				content,
				photo
			});
		} catch (err) {
			if (err instanceof AuthzError) {
				return fail(403, { message: err.message });
			}
			if (err instanceof Error) {
				return fail(400, { message: err.message });
			}
			return fail(500, { message: 'Could not post evidence' });
		}

		return redirect(303, '/all-cheers');
	}
};
