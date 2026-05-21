export function formatRelativeTime(iso: string): string {
	const date = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	const diffHours = Math.floor(diffMs / 3_600_000);
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const FREQUENCY_LABELS: Record<string, string> = {
	daily: 'Every day',
	weekly: 'Every week',
	biweekly: 'Every two weeks',
	monthly: 'Every month'
};

export function formatFrequencyLabel(value: string): string {
	const key = value.trim().toLowerCase();
	return FREQUENCY_LABELS[key] ?? value;
}

export function getInitials(displayName: string): string {
	const parts = displayName.trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
	}
	const one = parts[0] ?? '?';
	return one.slice(0, 2).toUpperCase();
}
