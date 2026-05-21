<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const hasGoals = $derived(data.goals.length > 0);

	let previewUrl = $state<string | null>(null);
	let selectedFileName = $state<string | null>(null);

	function onPhotoChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
		selectedFileName = file?.name ?? null;
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
			<div class="empty-state sheet-empty">
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
					<span class="field-label" id="photo-label">Photo proof</span>
					<div class="file-upload">
						<input
							id="photo"
							name="photo"
							type="file"
							class="file-input"
							accept="image/jpeg,image/png,image/webp"
							required
							aria-labelledby="photo-label"
							onchange={onPhotoChange}
						/>
						<label for="photo" class="file-upload-trigger">
							<span class="file-upload-title">
								{selectedFileName ? 'Change photo' : 'Choose a photo'}
							</span>
							<span class="file-upload-hint">
								{selectedFileName ?? 'JPEG, PNG, or WebP — max 5 MB'}
							</span>
						</label>
					</div>
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
		<footer class="sheet-footer">
			<button type="submit" form="evidence-form" class="btn btn-primary sheet-submit">Post evidence</button>
		</footer>
	{/if}
</div>

<style>
	.evidence-sheet {
		display: flex;
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		max-width: 480px;
		max-height: min(90dvh, 100%);
		margin: 0 auto;
		z-index: 15;
		background: var(--color-card-light);
		color: var(--color-text-dark);
		border-radius: 28px 28px 0 0;
		box-shadow: 0 -24px 60px rgba(0, 0, 0, 0.45);
		overflow: hidden;
		padding-inline: 1.25rem;
		font-family: var(--font-ui);
	}

	.sheet-header {
		flex-shrink: 0;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0 0.75rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.sheet-back {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-green);
		text-decoration: none;
		justify-self: start;
	}

	.sheet-back:hover {
		text-decoration: underline;
	}

	.sheet-title {
		font-family: var(--font-ui);
		font-size: 1.0625rem;
		font-weight: 700;
		text-align: center;
		letter-spacing: -0.01em;
		color: var(--color-text-dark);
	}

	.sheet-spacer {
		width: 3.5rem;
		justify-self: end;
	}

	.sheet-scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		padding: 1rem 0 0.5rem;
	}

	.sheet-subtitle {
		font-size: 0.875rem;
		color: var(--color-text-dark-muted);
		margin-bottom: 1rem;
		line-height: 1.45;
	}

	.sheet-banner {
		margin-bottom: 1rem;
	}

	.create-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		min-width: 0;
	}

	.create-form .form-field label,
	.field-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-dark);
	}

	.evidence-sheet input:not(.file-input),
	.evidence-sheet select,
	.evidence-sheet textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		background: #fff;
		color: var(--color-text-dark);
		border: 1px solid var(--color-border-light);
		border-radius: 14px;
		font-family: var(--font-ui);
		font-size: 1rem;
		line-height: 1.4;
		appearance: none;
	}

	.evidence-sheet select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234D5A54' d='M2.5 4.5 6 8l3.5-3.5'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		padding-right: 2.5rem;
	}

	.evidence-sheet input:not(.file-input):focus,
	.evidence-sheet select:focus,
	.evidence-sheet textarea:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}

	.evidence-sheet textarea {
		resize: vertical;
		min-height: 6rem;
	}

	.file-upload {
		position: relative;
		background: #fff;
		border: 1px dashed rgba(17, 26, 23, 0.28);
		border-radius: 16px;
		padding: 18px;
	}

	.file-input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
		z-index: 1;
	}

	.file-upload-trigger {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		pointer-events: none;
	}

	.file-upload-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-dark);
	}

	.file-upload-hint {
		font-size: 0.8125rem;
		color: var(--color-text-dark-muted);
		line-height: 1.4;
		word-break: break-word;
	}

	.photo-preview {
		margin-top: 0.75rem;
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		background: color-mix(in srgb, var(--color-text-dark) 4%, var(--color-card-light));
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
		padding: 0.75rem 0 max(1rem, env(safe-area-inset-bottom));
		border-top: 1px solid var(--color-border-light);
		background: var(--color-card-light);
	}

	.evidence-sheet .sheet-submit {
		width: 100%;
		background: #c7ff1a;
		color: #07100c;
		border: 2px solid #07100c;
		border-radius: 16px;
		font-weight: 800;
		box-shadow: 0 6px 0 #07100c;
		transition:
			background 0.15s,
			transform 0.1s,
			box-shadow 0.1s;
	}

	.evidence-sheet .sheet-submit:hover {
		background: #b7f000;
		color: #07100c;
		border-color: #07100c;
		box-shadow: 0 6px 0 #07100c;
	}

	.evidence-sheet .sheet-submit:active {
		transform: translateY(3px);
		box-shadow: 0 3px 0 #07100c;
	}

	.sheet-empty {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: #fff;
		border: 1px solid var(--color-border-light);
		border-radius: 14px;
	}

	.sheet-empty p {
		color: var(--color-text-dark-muted);
		line-height: 1.5;
		margin: 0;
	}

	.form-error {
		color: var(--color-orange);
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>
