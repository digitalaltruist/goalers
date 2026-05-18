<script lang="ts">
	import { resolve } from '$app/paths';
	import GoalCard from '$lib/components/GoalCard.svelte';
	import { CURRENT_USER, MOCK_GOALS } from '$lib/data/mock';
</script>

<svelte:head>
	<title>My Goals — Goalers</title>
</svelte:head>

<div class="placeholder-banner" role="status">
	Stage 1 shell — goals below use hardcoded placeholder data. Real data connects in Stage 3.
</div>

<header class="page-header goals-header">
	<div>
		<h1>Hey, {CURRENT_USER.displayName}</h1>
		<p>Your active goals and recent accountability commitments.</p>
	</div>
	<a class="btn btn-primary" href={resolve('/goals/new')}>New goal</a>
</header>

<section class="goals-section" aria-labelledby="goals-heading">
	<h2 id="goals-heading" class="section-title">Your goals</h2>
	<div class="goals-grid">
		{#each MOCK_GOALS as goal (goal.id)}
			<GoalCard {goal} />
		{/each}
	</div>
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
