export type VisualStamp = 'book' | 'workout' | 'study' | 'code' | 'healthy_meal';

const STAMP_SET = new Set<string>(['book', 'workout', 'study', 'code', 'healthy_meal']);

export function isVisualStamp(value: string): value is VisualStamp {
	return STAMP_SET.has(value);
}

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
