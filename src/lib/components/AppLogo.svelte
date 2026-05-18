<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		href?: '/' | '/my-goals';
	}

	let { href = '/' }: Props = $props();
</script>

<a class="logo" href={resolve(href)}>
	<span class="logo-mark" aria-hidden="true">G</span>
	<span class="logo-text">Goalers</span>
</a>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.125rem;
		color: var(--color-text);
		text-decoration: none;
		letter-spacing: -0.02em;
	}

	.logo:hover {
		text-decoration: none;
	}

	.logo-mark {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: #f8faf8;
		font-size: 1rem;
	}
</style>
