<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>New goal — Goalers</title>
</svelte:head>

<header class="page-header">
	<h1>Create a goal</h1>
	<p>Commit to something publicly and invite accountability.</p>
</header>

{#if form?.message}
	<p class="form-error" role="alert">{form.message}</p>
{/if}

<form class="create-form card" method="POST">
	<div class="form-field">
		<label for="title">Goal title</label>
		<input id="title" type="text" name="title" placeholder="Ship capstone MVP" required />
	</div>
	<div class="form-field">
		<label for="description">Description</label>
		<textarea id="description" name="description" rows="3" placeholder="What are you working toward?"></textarea>
	</div>
	<div class="form-field">
		<label for="frequency">I want to work towards my goal at least…</label>
		<select id="frequency" name="frequency" required>
			<option value="daily">Every day</option>
			<option value="weekly">Every week</option>
			<option value="biweekly">Every two weeks</option>
			<option value="monthly">Every month</option>
		</select>
		<span class="hint">Informational only — no automated validation in MVP.</span>
	</div>
	<div class="actions">
		<a class="btn btn-secondary" href={resolve('/my-goals')}>Cancel</a>
		<button type="submit" class="btn button-dark-surface-cta">Create goal</button>
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

	.form-error {
		color: var(--color-danger, #b91c1c);
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
</style>
