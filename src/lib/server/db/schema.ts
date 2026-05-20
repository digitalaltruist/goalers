import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const profiles = pgTable('profiles', {
	id: text('id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	username: text('username').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const goals = pgTable('goals', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	frequencyTarget: text('frequency_target').notNull().default(''),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const evidencePosts = pgTable('evidence_posts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	goalId: text('goal_id')
		.notNull()
		.references(() => goals.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	photoUrl: text('photo_url').notNull(),
	photoKey: text('photo_key').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const cheers = pgTable(
	'cheers',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		postId: text('post_id')
			.notNull()
			.references(() => evidencePosts.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('cheers_post_user_idx').on(table.postId, table.userId)]
);

export const postFlags = pgTable(
	'post_flags',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		postId: text('post_id')
			.notNull()
			.references(() => evidencePosts.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		reason: text('reason').notNull().default(''),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('post_flags_post_user_idx').on(table.postId, table.userId)]
);

export const profilesRelations = relations(profiles, ({ one }) => ({
	user: one(user, { fields: [profiles.id], references: [user.id] })
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
	user: one(user, { fields: [goals.userId], references: [user.id] }),
	evidencePosts: many(evidencePosts)
}));

export const evidencePostsRelations = relations(evidencePosts, ({ one, many }) => ({
	user: one(user, { fields: [evidencePosts.userId], references: [user.id] }),
	goal: one(goals, { fields: [evidencePosts.goalId], references: [goals.id] }),
	cheers: many(cheers),
	flags: many(postFlags)
}));

export const cheersRelations = relations(cheers, ({ one }) => ({
	post: one(evidencePosts, { fields: [cheers.postId], references: [evidencePosts.id] }),
	user: one(user, { fields: [cheers.userId], references: [user.id] })
}));

export const postFlagsRelations = relations(postFlags, ({ one }) => ({
	post: one(evidencePosts, { fields: [postFlags.postId], references: [evidencePosts.id] }),
	user: one(user, { fields: [postFlags.userId], references: [user.id] })
}));

export * from './auth.schema';
