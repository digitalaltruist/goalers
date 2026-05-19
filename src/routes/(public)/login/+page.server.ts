import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { safeRedirectPath } from '$lib/server/auth-redirect';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		const redirectTo = safeRedirectPath(event.url.searchParams.get('redirectTo'));
		return redirect(302, redirectTo);
	}
	return {};
};

export const actions: Actions = {
	signInEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const redirectTo = safeRedirectPath(
			formData.get('redirectTo')?.toString() ?? event.url.searchParams.get('redirectTo')
		);

		try {
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Sign in failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, redirectTo);
	}
};
