import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { db } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { safeRedirectPath } from '$lib/server/auth-redirect';
import { normalizeUsername, validateUsername } from '$lib/server/username';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		const redirectTo = safeRedirectPath(event.url.searchParams.get('redirectTo'));
		return redirect(302, redirectTo);
	}
	return {};
};

export const actions: Actions = {
	signUpEmail: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const usernameRaw = formData.get('username')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		const usernameError = validateUsername(usernameRaw);
		if (usernameError) {
			return fail(400, { message: usernameError });
		}
		const username = normalizeUsername(usernameRaw);

		const existing = await db
			.select({ id: profiles.id })
			.from(profiles)
			.where(eq(profiles.username, username))
			.limit(1);

		if (existing.length > 0) {
			return fail(400, { message: 'Username is already taken' });
		}

		let signUpResult;
		try {
			signUpResult = await auth.api.signUpEmail({
				body: { email, password, name },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Registration failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		if (!signUpResult?.user?.id) {
			return fail(500, { message: 'Account created but session could not be established' });
		}

		try {
			await db.insert(profiles).values({ id: signUpResult.user.id, username });
		} catch (error) {
			const message = error instanceof Error ? error.message : '';
			if (/profiles_username_unique|duplicate key/i.test(message)) {
				return fail(400, { message: 'Username is already taken' });
			}
			return fail(500, {
				message: 'Account created but profile setup failed. Please contact support.'
			});
		}

		return redirect(302, '/my-goals');
	}
};
