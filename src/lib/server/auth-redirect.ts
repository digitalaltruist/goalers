/** Safe in-app redirect target from ?redirectTo= query param. */
export function safeRedirectPath(redirectTo: string | null): string {
	if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
		return '/my-goals';
	}
	return redirectTo;
}
