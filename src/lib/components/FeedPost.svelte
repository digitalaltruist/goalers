<script lang="ts">
	import type { MockEvidencePost } from '$lib/data/mock';
	import { formatRelativeTime } from '$lib/data/mock';
	import VisualStamp from './VisualStamp.svelte';

	interface Props {
		post: MockEvidencePost;
	}

	let { post }: Props = $props();
</script>

<article class="feed-post card">
	<header>
		<VisualStamp stamp={post.visualStamp} size="md" />
		<div class="author-block">
			<span class="author">{post.authorDisplayName}</span>
			<span class="username">@{post.authorUsername}</span>
		</div>
		<time datetime={post.createdAt}>{formatRelativeTime(post.createdAt)}</time>
	</header>

	<p class="goal-ref">toward <strong>{post.goalTitle}</strong></p>
	<p class="content">{post.content}</p>

	<footer>
		<button
			type="button"
			class="cheer-btn"
			class:cheered={post.cheeredByMe}
			disabled
			title="Cheers coming in a later stage"
		>
			🙌 Cheer
			<span class="cheer-count">{post.cheerCount}</span>
		</button>
		<button
			type="button"
			class="flag-btn"
			disabled
			title="Flagging coming in a later stage"
			aria-label="Flag post"
		>
			⚑
		</button>
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
		cursor: not-allowed;
		opacity: 0.85;
	}

	.cheer-btn.cheered {
		background: var(--color-success-soft);
		border-color: var(--color-success);
		color: var(--color-success);
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
		cursor: not-allowed;
		opacity: 0.55;
		flex-shrink: 0;
	}

	.flag-btn:hover {
		opacity: 0.75;
	}
</style>
