import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthzError } from '$lib/server/authz';
import { createEvidencePost } from '$lib/server/evidence';
import { listGoalsForUser } from '$lib/server/goals';
import { isVisualStamp } from '$lib/stamps';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user!.id;
	const goals = await listGoalsForUser(userId);
	return { goals };
};

function parseEvidenceForm(formData: FormData) {
	const goalId = formData.get('goal')?.toString() ?? '';
	const content = formData.get('content')?.toString().trim() ?? '';
	const visualStamp = formData.get('visual_stamp')?.toString() ?? '';

	if (!goalId) {
		return { error: 'Select a goal' as const };
	}
	if (!content) {
		return { error: 'Describe what you did' as const };
	}
	if (content.length > 2000) {
		return { error: 'Content must be 2000 characters or fewer' as const };
	}
	if (!isVisualStamp(visualStamp)) {
		return { error: 'Select a visual stamp' as const };
	}

	return { goalId, content, visualStamp };
}

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) {
			return fail(401, { message: 'Authentication required' });
		}

		const parsed = parseEvidenceForm(await event.request.formData());
		if ('error' in parsed) {
			return fail(400, { message: parsed.error });
		}

		try {
			await createEvidencePost(userId, parsed);
		} catch (error) {
			if (error instanceof AuthzError) {
				return fail(403, { message: error.message });
			}
			return fail(500, { message: 'Could not post evidence' });
		}

		throw redirect(303, '/all-goals');
	}
};
