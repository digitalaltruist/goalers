<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<a class="evidence-fab" href={resolve('/evidence/new')} aria-label="Post evidence">
	<span class="fab-icon" aria-hidden="true">+</span>
</a>

<style>
	.evidence-fab {
		position: fixed;
		z-index: 25;
		right: 1rem;
		width: 3.5rem;
		height: 3.5rem;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--color-primary);
		color: #07100c;
		box-shadow: var(--shadow-md);
		text-decoration: none;
		border: 2px solid color-mix(in srgb, #07100c 20%, transparent);
		transition:
			transform 0.15s,
			background 0.15s;
	}

	.evidence-fab:hover {
		background: var(--color-primary-hover);
		transform: scale(1.04);
		text-decoration: none;
	}

	.fab-icon {
		font-size: 1.75rem;
		font-weight: 300;
		line-height: 1;
		margin-top: -2px;
	}

	@media (max-width: 767px) {
		.evidence-fab {
			bottom: calc(3.75rem + env(safe-area-inset-bottom, 0px));
		}
	}

	@media (min-width: 768px) {
		.evidence-fab {
			bottom: 1.5rem;
		}
	}
</style>
