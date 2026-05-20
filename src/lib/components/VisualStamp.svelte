<script lang="ts">
	import { stampEmoji, type VisualStamp } from '$lib/stamps';

	interface Props {
		stamp: VisualStamp;
		size?: 'sm' | 'md' | 'lg';
	}

	let { stamp, size = 'md' }: Props = $props();
</script>

<span class="stamp stamp-{size}" title={stamp} aria-label={stamp}>
	{stampEmoji(stamp)}
</span>

<style>
	.stamp {
		display: inline-grid;
		place-items: center;
		border-radius: var(--radius-sm);
		background: var(--color-surface-muted);
		flex-shrink: 0;
	}

	.stamp-sm {
		width: 2rem;
		height: 2rem;
		font-size: 1rem;
	}

	.stamp-md {
		width: 2.75rem;
		height: 2.75rem;
		font-size: 1.375rem;
	}

	.stamp-lg {
		width: 3.5rem;
		height: 3.5rem;
		font-size: 1.75rem;
	}
</style>
