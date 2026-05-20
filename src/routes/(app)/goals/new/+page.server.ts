import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createGoal } from '$lib/server/goals';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() ?? '';
		const frequencyTarget = formData.get('frequency')?.toString().trim() ?? '';

		if (!title) {
			return fail(400, { message: 'Goal title is required' });
		}

		await createGoal(event.locals.user!.id, {
			title,
			description,
			frequencyTarget
		});

		return redirect(303, '/my-goals');
	}
};
