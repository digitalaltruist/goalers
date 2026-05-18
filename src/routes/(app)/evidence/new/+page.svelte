<script lang="ts">
	import { resolve } from '$app/paths';
	import { MOCK_GOALS, VISUAL_STAMPS } from '$lib/data/mock';
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
		<p class="sheet-subtitle">Share proof of progress toward one of your goals.</p>

		<p class="placeholder-banner sheet-banner" role="status">
			Placeholder — saves connect in Stage 3.
		</p>

		<form id="evidence-form" class="create-form" onsubmit={(e) => e.preventDefault()}>
			<div class="form-field">
				<label for="goal">Goal</label>
				<select id="goal" name="goal">
					{#each MOCK_GOALS as goal}
						<option value={goal.id}>{goal.title}</option>
					{/each}
				</select>
			</div>

			<fieldset class="stamp-fieldset">
				<legend>Visual stamp</legend>
				<div class="stamp-grid">
					{#each VISUAL_STAMPS as stamp}
						<label class="stamp-option">
							<input
								type="radio"
								name="visual_stamp"
								value={stamp.slug}
								checked={stamp.slug === 'study'}
							/>
							<span class="stamp-preview">{stamp.emoji}</span>
							<span class="stamp-label">{stamp.label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<div class="form-field">
				<label for="content">What did you do?</label>
				<textarea
					id="content"
					name="content"
					rows="4"
					placeholder="Describe your progress..."
				></textarea>
			</div>
		</form>
	</div>

	<footer class="sheet-footer sheet-actions">
		<a class="btn btn-secondary" href={resolve('/my-goals')}>Cancel</a>
		<button
			type="submit"
			form="evidence-form"
			class="btn btn-primary"
			disabled
			title="Saves in Stage 3"
		>
			Post evidence
		</button>
	</footer>
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

	.stamp-fieldset {
		border: none;
		padding: 0;
		margin: 0;
		min-width: 0;
	}

	.stamp-fieldset legend {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.stamp-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
		gap: 0.5rem;
	}

	.stamp-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		background: var(--color-surface);
		min-width: 0;
	}

	.stamp-option:has(input:checked) {
		border-color: var(--color-primary);
		background: var(--color-primary-soft);
	}

	.stamp-option input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.stamp-preview {
		font-size: 1.5rem;
	}

	.stamp-label {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-align: center;
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

		.sheet-banner {
			display: none;
		}

		.stamp-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
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
