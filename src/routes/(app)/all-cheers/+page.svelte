<script lang="ts">
	import FeedPost from '$lib/components/FeedPost.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>All Cheers — Goalers</title>
</svelte:head>

<header class="page-header">
	<h1>All Cheers</h1>
	<p>
		See proof from everyone on Goalers. Tap <strong>Cheer</strong> to encourage someone — tap again to
		remove it. Use the flag if something looks off.
	</p>
</header>

{#if data.posts.length === 0}
	<div class="empty-state card">
		<p>
			No progress posts yet. Create a goal on My Goals, post proof with the + button, then check back
			here for cheers from others.
		</p>
	</div>
{:else}
	<div class="feed-list">
		{#each data.posts as post (post.id)}
			<FeedPost {post} />
		{/each}
	</div>
{/if}

<style>
	.feed-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		max-width: 40rem;
		margin-inline: auto;
	}

	.feed-list :global(.feed-post) {
		width: 100%;
	}

	.empty-state {
		padding: 2rem 1.5rem;
		max-width: 28rem;
		margin-inline: auto;
		color: var(--color-text-muted);
		line-height: 1.5;
	}
</style>
