<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatRelativeTime } from '$lib/format';
	import type { FeedPost } from '$lib/types';

	interface Props {
		post: FeedPost;
	}

	let { post }: Props = $props();

	let photoBroken = $state(false);
	let cheerCount = $state(0);
	let cheeredByMe = $state(false);
	let flaggedByMe = $state(false);
	let cheering = $state(false);
	let flagging = $state(false);

	$effect(() => {
		cheerCount = post.cheerCount;
		cheeredByMe = post.cheeredByMe;
		flaggedByMe = post.flaggedByMe;
	});

	function isCheerResult(
		data: unknown
	): data is { postId: string; cheerCount: number; cheeredByMe: boolean } {
		return (
			typeof data === 'object' &&
			data !== null &&
			'postId' in data &&
			'cheerCount' in data &&
			'cheeredByMe' in data
		);
	}

	function isFlagResult(data: unknown): data is { postId: string; flaggedByMe: boolean } {
		return typeof data === 'object' && data !== null && 'postId' in data && 'flaggedByMe' in data;
	}
</script>

<article class="feed-post card">
	<header>
		<div class="author-block">
			<span class="author">{post.authorDisplayName}</span>
			<span class="username">@{post.authorUsername}</span>
		</div>
		<time datetime={post.createdAt}>{formatRelativeTime(post.createdAt)}</time>
	</header>

	<p class="goal-ref">toward <strong>{post.goalTitle}</strong></p>

	<figure class="photo-frame">
		{#if photoBroken}
			<div class="photo-fallback" role="img" aria-label="Evidence photo unavailable">
				<span aria-hidden="true">📷</span>
				<p>Photo unavailable</p>
			</div>
		{:else}
			<img
				src={post.photoUrl}
				alt="Evidence from {post.authorDisplayName} for {post.goalTitle}"
				loading="lazy"
				onerror={() => {
					photoBroken = true;
				}}
			/>
		{/if}
	</figure>

	<p class="content">{post.content}</p>

	<footer>
		<form
			method="POST"
			action="?/cheer"
			class="cheer-form"
			use:enhance={() => {
				cheering = true;
				return async ({ result, update }) => {
					cheering = false;
					if (result.type === 'success' && isCheerResult(result.data) && result.data.postId === post.id) {
						cheerCount = result.data.cheerCount;
						cheeredByMe = result.data.cheeredByMe;
					}
					await update();
				};
			}}
		>
			<input type="hidden" name="postId" value={post.id} />
			<button
				type="submit"
				class="cheer-btn"
				class:cheered={cheeredByMe}
				disabled={cheering}
				aria-pressed={cheeredByMe}
				aria-busy={cheering}
				title={cheeredByMe ? 'Remove your cheer' : 'Cheer this post'}
			>
				🙌 {cheering ? '…' : 'Cheer'}
				<span class="cheer-count">{cheerCount}</span>
			</button>
		</form>
		<form
			method="POST"
			action="?/flag"
			class="flag-form"
			use:enhance={() => {
				flagging = true;
				return async ({ result, update }) => {
					flagging = false;
					if (result.type === 'success' && isFlagResult(result.data) && result.data.postId === post.id) {
						flaggedByMe = result.data.flaggedByMe;
					}
					await update();
				};
			}}
		>
			<input type="hidden" name="postId" value={post.id} />
			<button
				type="submit"
				class="flag-btn"
				class:flagged={flaggedByMe}
				disabled={flaggedByMe || flagging}
				aria-pressed={flaggedByMe}
				aria-busy={flagging}
				aria-label={flaggedByMe ? 'Post flagged' : 'Flag post'}
				title={flaggedByMe ? 'You flagged this post' : 'Flag inappropriate content'}
			>
				⚑
			</button>
		</form>
	</footer>
</article>

<style>
	.feed-post {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.author-block {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.author {
		font-weight: 600;
		font-size: 0.9375rem;
	}

	.username {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	time {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.goal-ref {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.photo-frame {
		margin: 0;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-surface-muted);
		aspect-ratio: 4 / 3;
	}

	.photo-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.photo-fallback {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		width: 100%;
		height: 100%;
		min-height: 8rem;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.photo-fallback span {
		font-size: 1.5rem;
	}

	.content {
		font-size: 0.9375rem;
		line-height: 1.55;
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--color-border);
		margin-top: 0.125rem;
	}

	.cheer-form,
	.flag-form {
		margin: 0;
	}

	.cheer-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: inherit;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: var(--color-surface);
		color: var(--color-text-muted);
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.cheer-btn:hover:not(:disabled) {
		background: var(--color-surface-muted);
		color: var(--color-text);
	}

	.cheer-btn.cheered {
		background: var(--color-success-soft);
		border-color: var(--color-success);
		color: var(--color-success);
	}

	.cheer-btn:disabled {
		cursor: wait;
		opacity: 0.75;
	}

	.cheer-count {
		font-variant-numeric: tabular-nums;
	}

	.flag-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		font-size: 1.125rem;
		line-height: 1;
		font-family: inherit;
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		opacity: 0.55;
		flex-shrink: 0;
		transition:
			opacity 0.15s ease,
			color 0.15s ease;
	}

	.flag-btn:hover:not(:disabled) {
		opacity: 0.85;
		color: var(--color-text);
	}

	.flag-btn.flagged,
	.flag-btn:disabled:not([aria-busy='true']) {
		opacity: 0.35;
		cursor: default;
	}

	.flag-btn:disabled[aria-busy='true'] {
		cursor: wait;
		opacity: 0.45;
	}
</style>
