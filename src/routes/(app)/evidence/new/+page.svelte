<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const hasGoals = $derived(data.goals.length > 0);

	let previewUrl = $state<string | null>(null);

	function onPhotoChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
		if (file) {
			previewUrl = URL.createObjectURL(file);
		}
	}
</script>

<svelte:head>
	<title>Post evidence — Goalers</title>
</svelte:head>

<div class="evidence-sheet">
	<header class="sheet-header">
		<a class="sheet-back" href={resolve('/my-goals')}>Cancel</a>
		<h1 class="sheet-title">Post evidence</h1>
		<span class="sheet-spacer" aria-hidden="true"></span>
	</header>

	<div class="sheet-scroll">
		<p class="sheet-subtitle">Share photo proof of progress toward one of your goals.</p>

		{#if !hasGoals}
			<div class="empty-state card">
				<p>Create a goal before you can post evidence.</p>
				<a class="btn btn-primary" href={resolve('/goals/new')}>Create a goal</a>
			</div>
		{:else}
			{#if form?.message}
				<p class="form-error sheet-banner" role="alert">{form.message}</p>
			{/if}

			<form
				id="evidence-form"
				class="create-form"
				method="POST"
				enctype="multipart/form-data"
			>
				<div class="form-field">
					<label for="goal">Goal</label>
					<select id="goal" name="goal" required>
						{#each data.goals as goal (goal.id)}
							<option value={goal.id}>{goal.title}</option>
						{/each}
					</select>
				</div>

				<div class="form-field photo-field">
					<label for="photo">Photo proof</label>
					<input
						id="photo"
						name="photo"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						required
						onchange={onPhotoChange}
					/>
					<span class="hint">JPEG, PNG, or WebP — max 5 MB</span>
					{#if previewUrl}
						<div class="photo-preview">
							<img src={previewUrl} alt="" />
						</div>
					{/if}
				</div>

				<div class="form-field">
					<label for="content">What did you do?</label>
					<textarea
						id="content"
						name="content"
						rows="4"
						placeholder="Describe your progress..."
						required
					></textarea>
				</div>
			</form>
		{/if}
	</div>

	{#if hasGoals}
		<footer class="sheet-footer sheet-actions">
			<a class="btn btn-secondary" href={resolve('/my-goals')}>Cancel</a>
			<button type="submit" form="evidence-form" class="btn btn-primary">Post evidence</button>
		</footer>
	{/if}
</div>

<style>
	.evidence-sheet {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		flex: 1;
		min-width: 0;
	}

	.sheet-header {
		flex-shrink: 0;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.sheet-back {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-primary);
		text-decoration: none;
		justify-self: start;
	}

	.sheet-back:hover {
		text-decoration: underline;
	}

	.sheet-title {
		font-size: 1rem;
		font-weight: 700;
		text-align: center;
		letter-spacing: -0.02em;
	}

	.sheet-spacer {
		width: 3.5rem;
		justify-self: end;
	}

	.sheet-scroll {
		flex: 1;
		min-height: 0;
		padding: 1rem 0 0;
	}

	.sheet-subtitle {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		margin-bottom: 1rem;
	}

	.sheet-banner {
		margin-bottom: 1rem;
	}

	.create-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		max-width: 32rem;
		min-width: 0;
	}

	.photo-field input[type='file'] {
		font-size: 0.875rem;
	}

	.hint {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.photo-preview {
		margin-top: 0.75rem;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-surface-muted);
		aspect-ratio: 4 / 3;
	}

	.photo-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.sheet-footer {
		flex-shrink: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: flex-end;
		padding: 0.75rem 0;
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.empty-state {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 28rem;
	}

	.empty-state p {
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.form-error {
		color: var(--color-danger, #b91c1c);
		font-size: 0.875rem;
		font-weight: 600;
	}

	@media (max-width: 767px) {
		.evidence-sheet {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			max-height: min(90dvh, 100%);
			z-index: 15;
			background: var(--color-surface);
			border-radius: var(--radius-lg) var(--radius-lg) 0 0;
			box-shadow: var(--shadow-sheet);
			overflow: hidden;
			padding-inline: 1rem;
			min-height: unset;
			flex: unset;
		}

		.sheet-scroll {
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			padding-bottom: 0.5rem;
		}

		.sheet-header {
			padding-inline: 0;
		}

		.sheet-footer {
			flex-direction: column;
			gap: 0.5rem;
			padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
		}

		.sheet-footer .btn {
			width: 100%;
		}
	}

	@media (min-width: 768px) {
		.evidence-sheet {
			position: static;
			max-width: 32rem;
			max-height: none;
			margin-inline: auto;
			width: 100%;
			z-index: auto;
			padding-inline: 0;
			overflow: visible;
			border-radius: 0;
			box-shadow: none;
		}

		.sheet-scroll {
			overflow: visible;
			padding: 1.5rem 0 0;
		}

		.sheet-footer {
			padding-bottom: 1.5rem;
		}
	}
</style>
