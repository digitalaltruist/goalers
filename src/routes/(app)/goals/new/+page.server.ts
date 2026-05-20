import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthzError } from '$lib/server/authz';
import { createGoal } from '$lib/server/goals';

function parseGoalForm(formData: FormData) {
	const title = formData.get('title')?.toString().trim() ?? '';
	const description = formData.get('description')?.toString().trim() ?? '';
	const frequencyTarget = formData.get('frequency')?.toString().trim() ?? '';

	if (!title) {
		return { error: 'Goal title is required' as const };
	}
	if (title.length > 120) {
		return { error: 'Goal title must be 120 characters or fewer' as const };
	}
	if (description.length > 500) {
		return { error: 'Description must be 500 characters or fewer' as const };
	}
	if (frequencyTarget.length > 60) {
		return { error: 'Frequency target must be 60 characters or fewer' as const };
	}

	return { title, description, frequencyTarget };
}

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) {
			return fail(401, { message: 'Authentication required' });
		}

		const parsed = parseGoalForm(await event.request.formData());
		if ('error' in parsed) {
			return fail(400, { message: parsed.error });
		}

		try {
			await createGoal(userId, parsed);
		} catch (error) {
			if (error instanceof AuthzError) {
				return fail(403, { message: error.message });
			}
			return fail(500, { message: 'Could not create goal' });
		}

		throw redirect(303, '/my-goals');
	}
};
