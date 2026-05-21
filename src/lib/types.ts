export interface GoalSummary {
	id: string;
	title: string;
	description: string;
	frequencyTarget: string;
	evidenceCount: number;
	createdAt: string;
}

export interface FeedPost {
	id: string;
	goalId: string;
	goalTitle: string;
	authorUsername: string;
	authorDisplayName: string;
	content: string;
	photoUrl: string;
	createdAt: string;
	cheerCount: number;
	cheeredByMe: boolean;
	flaggedByMe: boolean;
}
