<script lang="ts">
	import { resolve } from '$app/paths';
	import type { GoalSummary } from '$lib/types';

	interface Props {
		goal: GoalSummary;
	}

	let { goal }: Props = $props();
</script>

<article class="goal-card card">
	<div class="goal-card-header">
		<h3>{goal.title}</h3>
		<span class="badge badge-accent">{goal.frequencyTarget}</span>
	</div>
	<p class="description">{goal.description}</p>
	<footer>
		<span class="meta">{goal.evidenceCount} evidence posts</span>
		<a class="btn btn-ghost btn-sm" href={resolve('/evidence/new')}>Post evidence</a>
	</footer>
</article>

<style>
	.goal-card {
		padding: 1.25rem 1.25rem 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border-left: 3px solid var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.goal-card-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.goal-card h3 {
		font-size: 1.0625rem;
		font-weight: 700;
		flex: 1;
		min-width: 0;
		letter-spacing: -0.02em;
	}

	.description {
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-border);
		margin-top: 0.25rem;
	}

	.meta {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}
</style>
