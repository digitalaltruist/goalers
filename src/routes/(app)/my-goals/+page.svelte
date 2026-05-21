<script lang="ts">
	import { resolve } from '$app/paths';
	import GoalCard from '$lib/components/GoalCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const displayName = $derived(data.user.name);
</script>

<svelte:head>
	<title>My Goals — Goalers</title>
</svelte:head>

<header class="page-header goals-header">
	<div>
		<h1>Hey, {displayName}</h1>
		<p>
			Set goals here, post evidence with +, then head to <a href={resolve('/all-goals')}>All Goals</a> to
			cheer others and see your posts in the feed.
		</p>
	</div>
	<a class="btn button-dark-surface-cta" href={resolve('/goals/new')}>New goal</a>
</header>

<section class="goals-section" aria-labelledby="goals-heading">
	<h2 id="goals-heading" class="section-title">Your goals</h2>
	{#if data.goals.length === 0}
		<div class="empty-state card">
			<p>
				No goals yet. Create a commitment, post photo evidence, then get cheered on in the All Goals
				feed.
			</p>
			<a class="btn button-dark-surface-cta" href={resolve('/goals/new')}>Create a goal</a>
		</div>
	{:else}
		<div class="goals-grid">
			{#each data.goals as goal (goal.id)}
				<GoalCard {goal} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.goals-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: 1rem;
	}

	.goals-grid {
		display: grid;
		gap: 1rem;
	}

	.empty-state {
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		max-width: 28rem;
	}

	.empty-state p {
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	@media (min-width: 640px) {
		.goals-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.goals-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
