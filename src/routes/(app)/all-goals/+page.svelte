<script lang="ts">
	import FeedPost from '$lib/components/FeedPost.svelte';
	import { MOCK_FEED } from '$lib/data/mock';
</script>

<svelte:head>
	<title>All Goals — Goalers</title>
</svelte:head>

<div class="placeholder-banner" role="status">
	Stage 1 shell — posts below are hardcoded. Cheers and flagging connect in later stages.
</div>

<header class="page-header">
	<h1>All Goals</h1>
	<p>Chronological evidence from everyone on Goalers.</p>
</header>

<div class="feed-list">
	{#each MOCK_FEED as post (post.id)}
		<FeedPost {post} />
	{/each}
</div>

<style>
	.feed-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 40rem;
	}
</style>
