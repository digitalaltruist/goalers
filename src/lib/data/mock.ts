export type VisualStamp = 'book' | 'workout' | 'study' | 'code' | 'healthy_meal';

export const VISUAL_STAMPS: {
	slug: VisualStamp;
	label: string;
	emoji: string;
}[] = [
	{ slug: 'book', label: 'Reading', emoji: '📚' },
	{ slug: 'workout', label: 'Workout', emoji: '💪' },
	{ slug: 'study', label: 'Study', emoji: '📝' },
	{ slug: 'code', label: 'Code', emoji: '💻' },
	{ slug: 'healthy_meal', label: 'Healthy meal', emoji: '🥗' }
];

export function stampEmoji(slug: VisualStamp): string {
	return VISUAL_STAMPS.find((s) => s.slug === slug)?.emoji ?? '✨';
}

export function getInitials(displayName: string): string {
	const parts = displayName.trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
	}
	const one = parts[0] ?? '?';
	return one.slice(0, 2).toUpperCase();
}

export interface MockGoal {
	id: string;
	title: string;
	description: string;
	frequencyTarget: string;
	evidenceCount: number;
	createdAt: string;
}

export interface MockEvidencePost {
	id: string;
	goalId: string;
	goalTitle: string;
	authorUsername: string;
	authorDisplayName: string;
	content: string;
	visualStamp: VisualStamp;
	createdAt: string;
	cheerCount: number;
	cheeredByMe: boolean;
}

/** Placeholder "current user" for Stage 1 shell */
export const CURRENT_USER = {
	username: 'alex',
	displayName: 'Alex Rivera'
};

export const MOCK_GOALS: MockGoal[] = [
	{
		id: 'goal-1',
		title: 'Ship capstone MVP',
		description: 'Build and deploy Goalers with a working accountability loop.',
		frequencyTarget: '5x/week',
		evidenceCount: 12,
		createdAt: '2026-05-01T10:00:00Z'
	},
	{
		id: 'goal-2',
		title: 'Morning movement',
		description: '30 minutes of cardio or strength before work.',
		frequencyTarget: '4x/week',
		evidenceCount: 8,
		createdAt: '2026-05-03T08:00:00Z'
	},
	{
		id: 'goal-3',
		title: 'Deep study blocks',
		description: 'Focused reading for distributed systems coursework.',
		frequencyTarget: '3x/week',
		evidenceCount: 5,
		createdAt: '2026-05-05T18:00:00Z'
	}
];

export const MOCK_FEED: MockEvidencePost[] = [
	{
		id: 'post-1',
		goalId: 'goal-1',
		goalTitle: 'Ship capstone MVP',
		authorUsername: 'jamie',
		authorDisplayName: 'Jamie Chen',
		content: 'Finished the database schema and RLS policies draft. Feels good to have the data model locked.',
		visualStamp: 'code',
		createdAt: '2026-05-18T14:30:00Z',
		cheerCount: 7,
		cheeredByMe: false
	},
	{
		id: 'post-2',
		goalId: 'goal-2',
		goalTitle: 'Morning movement',
		authorUsername: 'sam',
		authorDisplayName: 'Sam Okonkwo',
		content: '5K before breakfast. Legs are tired but the streak continues.',
		visualStamp: 'workout',
		createdAt: '2026-05-18T12:15:00Z',
		cheerCount: 12,
		cheeredByMe: true
	},
	{
		id: 'post-3',
		goalId: 'goal-3',
		goalTitle: 'Deep study blocks',
		authorUsername: 'alex',
		authorDisplayName: 'Alex Rivera',
		content: 'Two-hour focus block on consensus algorithms. Summarized key tradeoffs.',
		visualStamp: 'study',
		createdAt: '2026-05-18T09:00:00Z',
		cheerCount: 4,
		cheeredByMe: false
	},
	{
		id: 'post-4',
		goalId: 'goal-4',
		goalTitle: 'Cook at home',
		authorUsername: 'riley',
		authorDisplayName: 'Riley Park',
		content: 'Meal prepped grain bowls for the week. No takeout today.',
		visualStamp: 'healthy_meal',
		createdAt: '2026-05-17T20:45:00Z',
		cheerCount: 9,
		cheeredByMe: false
	},
	{
		id: 'post-5',
		goalId: 'goal-5',
		goalTitle: 'Read 20 pages daily',
		authorUsername: 'morgan',
		authorDisplayName: 'Morgan Lee',
		content: 'Chapter 4 done on habit design. Taking notes for my own accountability app.',
		visualStamp: 'book',
		createdAt: '2026-05-17T16:00:00Z',
		cheerCount: 6,
		cheeredByMe: false
	}
];

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
