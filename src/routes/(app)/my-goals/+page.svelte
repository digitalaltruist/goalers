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
	<h1>Hey, {displayName}</h1>
	<p>
		Set goals here, post evidence with +, then head to <a href={resolve('/all-cheers')}>All Cheers</a> to
		cheer others or <a href={resolve('/my-cheers')}>My Cheers</a> to see cheers on your posts.
	</p>
</header>

<section class="goals-section" aria-labelledby="goals-heading">
	<h2 id="goals-heading" class="section-title">Your goals</h2>
	<div class="goals-grid">
		{#each data.goals as goal (goal.id)}
			<GoalCard {goal} />
		{/each}
		<div class="create-goal-phantom" aria-label="Add a new goal">
			<p class="create-goal-phantom-text">Ready to commit? Add a new goal.</p>
			<a class="btn btn-secondary btn-sm" href={resolve('/goals/new')}>Create goal</a>
		</div>
	</div>
</section>

<style>
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

	.create-goal-phantom {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.5rem;
		padding: 0.65rem 1rem;
		border-radius: var(--radius-md);
		border: 1px solid rgba(199, 255, 26, 0.2);
		background: color-mix(in srgb, var(--color-surface) 72%, transparent);
	}

	.create-goal-phantom-text {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.35;
		color: var(--color-text-muted);
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
