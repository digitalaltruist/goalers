import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		const redirectTo = encodeURIComponent(event.url.pathname);
		return redirect(302, `/login?redirectTo=${redirectTo}`);
	}

	const [profile] = await db
		.select()
		.from(profiles)
		.where(eq(profiles.id, event.locals.user.id))
		.limit(1);

	return {
		user: event.locals.user,
		profile: profile ?? null
	};
};
