<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<a
	class="btn button-dark-surface-cta evidence-fab"
	href={resolve('/evidence/new')}
	aria-label="Post evidence"
>
	<span class="fab-icon" aria-hidden="true">+</span>
</a>

<style>
	.evidence-fab {
		position: fixed;
		z-index: 25;
		right: 1rem;
		display: grid;
		place-items: center;
	}

	.fab-icon {
		font-size: 1.75rem;
		font-weight: 800;
		line-height: 1;
		margin-top: -2px;
	}

	@media (max-width: 767px) {
		.evidence-fab {
			/* 3.75rem clears nav; +0.375rem shadow depth +0.5rem gap */
			bottom: calc(3.75rem + 0.875rem + env(safe-area-inset-bottom, 0px));
		}
	}

	@media (min-width: 768px) {
		.evidence-fab {
			bottom: 1.5rem;
		}
	}
</style>
