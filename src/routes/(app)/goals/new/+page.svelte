<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>New goal — Goalers</title>
</svelte:head>

<div class="placeholder-banner" role="status">
	Placeholder create-goal flow — form UI only. Database integration comes in Stage 3.
</div>

<header class="page-header">
	<h1>Create a goal</h1>
	<p>Commit to something publicly and invite accountability.</p>
</header>

<form class="create-form card" onsubmit={(e) => e.preventDefault()}>
	<div class="form-field">
		<label for="title">Goal title</label>
		<input id="title" type="text" name="title" placeholder="Ship capstone MVP" />
	</div>
	<div class="form-field">
		<label for="description">Description</label>
		<textarea id="description" name="description" rows="3" placeholder="What are you working toward?"></textarea>
	</div>
	<div class="form-field">
		<label for="frequency">Frequency target</label>
		<input id="frequency" type="text" name="frequency" placeholder="3x/week" />
		<span class="hint">Informational only — no automated validation in MVP.</span>
	</div>
	<div class="actions">
		<a class="btn btn-secondary" href={resolve('/my-goals')}>Cancel</a>
		<button type="submit" class="btn btn-primary" disabled title="Saves in Stage 3">Create goal</button>
	</div>
</form>

<style>
	.create-form {
		padding: 1.5rem;
		max-width: 32rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.hint {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: flex-end;
		padding-top: 0.5rem;
	}
</style>
