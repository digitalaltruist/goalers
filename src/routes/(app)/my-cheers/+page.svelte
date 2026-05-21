<script lang="ts">
	import { resolve } from '$app/paths';
	import FeedPost from '$lib/components/FeedPost.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Cheers — Goalers</title>
</svelte:head>

<header class="page-header">
	<h1>My Cheers</h1>
	<p>
		All evidence you've posted, with how many cheers each one received. Post new proof from My Goals
		with the + button.
	</p>
</header>

{#if data.posts.length === 0}
	<div class="empty-state card">
		<p>
			No evidence posts yet. Create a goal on <a href={resolve('/my-goals')}>My Goals</a>, post proof
			with the + button, then check back here for cheers you've received.
		</p>
	</div>
{:else}
	<div class="feed-list">
		{#each data.posts as post (post.id)}
			<FeedPost {post} readOnly />
		{/each}
	</div>
{/if}

<style>
	.feed-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 40rem;
	}

	.empty-state {
		padding: 2rem 1.5rem;
		max-width: 28rem;
		color: var(--color-text-muted);
		line-height: 1.5;
	}
</style>
