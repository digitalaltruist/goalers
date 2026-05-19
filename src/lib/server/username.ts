const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export function validateUsername(username: string): string | null {
	const normalized = username.trim().toLowerCase();
	if (!USERNAME_RE.test(normalized)) {
		return 'Username must be 3–30 characters: lowercase letters, numbers, and underscores only.';
	}
	return null;
}

export function normalizeUsername(username: string): string {
	return username.trim().toLowerCase();
}
